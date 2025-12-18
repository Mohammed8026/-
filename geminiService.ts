
import { GoogleGenAI, Type, Modality } from "@google/genai";

// Guideline: Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Mandatory helper functions for audio decoding as per Gemini API guidelines
export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// 1. المحادثة مع دعم البحث المباشر عن اتجاهات التصميم
export const chatWithGemini = async (prompt: string, history: { role: string; parts: string }[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({ role: h.role === 'assistant' ? 'model' : 'user', parts: [{ text: h.parts }] })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: "أنت مساعد ذكي للمصمم محمد العثماني. استخدم البحث في جوجل إذا سألك العميل عن أحدث اتجاهات التصميم أو تقنيات الويب الحالية.",
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: response.text,
      // Mandatory: Extract grounding sources when using googleSearch
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return { text: "عذراً، حدث خطأ في معالجة طلبك.", sources: [] };
  }
};

// 2. تحليل صورة موقع (AI Vision)
export const analyzeWebsiteImage = async (base64Image: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
            { text: "قم بتحليل تصميم هذا الموقع من حيث تجربة المستخدم (UX) وواجهة المستخدم (UI). قدم 3 نصائح احترافية للتحسين باللغة العربية." }
          ]
        }
      ]
    });
    return response.text;
  } catch (error) {
    console.error("Vision Analysis Error:", error);
    return "فشل تحليل الصورة.";
  }
};

// 3. توليد صور مخصصة للموقع (AI Image Gen)
export const generateDesignAsset = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `High-quality professional website asset, modern UI style: ${prompt}` }]
      },
      config: {
        imageConfig: { aspectRatio: "16:9" }
      }
    });
    
    // Mandatory: Iterate through all parts to find the image part
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    return null;
  }
};

// 4. تحويل النص إلى صوت (TTS)
export const speakResponse = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};

export const generateWebsiteCode = async (requirements: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `بناءً على المتطلبات التالية، قم بإنشاء ملف HTML كامل (Single Page) يتضمن CSS داخلي (Tailwind CDN) ليكون موقعاً احترافياً: ${requirements}. يجب أن يكون الموقع باللغة العربية واتجاه RTL.`,
      config: {
        systemInstruction: "أنت مصمم مواقع محترف. كودك نظيف، متجاوب، وجذاب بصرياً.",
        maxOutputTokens: 3000,
        // Guideline: Set both maxOutputTokens and thinkingConfig.thinkingBudget at the same time
        thinkingConfig: { thinkingBudget: 1000 }
      },
    });
    return response.text;
  } catch (error) {
    console.error("Code Gen Error:", error);
    throw error;
  }
};
