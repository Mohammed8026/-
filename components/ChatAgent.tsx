
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, CreditCard, Sparkles, CheckCircle, Download, Bell, ClipboardCheck, Image as ImageIcon, Volume2, Camera, Globe, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage, AppStep, SiteOrder } from '../types';
import { chatWithGemini, generateWebsiteCode, analyzeWebsiteImage, generateDesignAsset, speakResponse, decode, decodeAudioData } from '../geminiService';
import { db } from '../dbService';

const ChatAgent: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'مرحباً بك! أنا مساعد محمد العثماني الذكي. سأقوم بتسجيل طلبك في قاعدة البيانات ليراجعه محمد شخصياً.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<AppStep>(AppStep.IDLE);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [generatedHtml, setGeneratedHtml] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (customPrompt?: string) => {
    const userMessage = customPrompt || input;
    if (!userMessage.trim() || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, parts: m.content }));
      const result = await chatWithGemini(userMessage, history);
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: result.text,
        data: { sources: result.sources }
      }]);

      if ((result.text.includes('$') || result.text.includes('دولار')) && step === AppStep.IDLE) {
        setStep(AppStep.AGREEMENT);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'حدث خطأ غير متوقع.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAgreementAndSaveToDB = async () => {
    setStep(AppStep.NOTIFYING_ADMIN);
    const requirements = messages.filter(m => m.role === 'user').map(m => m.content).join(' | ');
    const newOrder = await db.saveOrder({
      customerName: "عميل جديد عبر الروبوت",
      requirements: requirements,
      price: messages.find(m => m.content.includes('$'))?.content.match(/\$\d+/)?.[0] || "سيحدد لاحقاً"
    });
    setCurrentOrderId(newOrder.id);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setStep(AppStep.PAYMENT);
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: '✅ تم حفظ متطلباتك في النظام. المشرف (محمد العثماني) تلقى إشعاراً بطلبك. يرجى الدفع للبدء.' 
    }]);
  };

  const handlePaymentAndGenerate = async () => {
    setStep(AppStep.GENERATING);
    const requirements = messages.filter(m => m.role === 'user').map(m => m.content).join(' ');
    try {
      const code = await generateWebsiteCode(requirements);
      setGeneratedHtml(code);
      
      if (currentOrderId) {
        await db.updateOrderContent(currentOrderId, code);
      }
      
      setStep(AppStep.COMPLETE);
    } catch (error) {
      setStep(AppStep.IDLE);
    }
  };

  return (
    <div className="container mx-auto px-6 max-w-5xl">
       <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row gap-8"
        >
          {/* الجانب الأيمن: أدوات الـ AI */}
          <div className="md:w-1/4 space-y-4">
             <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl sticky top-24">
                <h3 className="text-amber-500 font-bold mb-4 flex items-center gap-2">
                   <Sparkles size={18} /> مختبر الذكاء الاصطناعي
                </h3>
                <div className="grid gap-3">
                   <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => fileInputRef.current?.click()} 
                    className="flex items-center gap-3 p-3 bg-slate-900 hover:bg-slate-700 rounded-xl text-xs font-bold border border-slate-700 transition-all text-right"
                   >
                      <Camera size={18} className="text-amber-500" /> تحليل UI/UX
                   </motion.button>
                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {}} />
                   
                   <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSend("ما هي أحدث تقنيات تصميم الويب؟")} 
                    className="flex items-center gap-3 p-3 bg-slate-900 hover:bg-slate-700 rounded-xl text-xs font-bold border border-slate-700 transition-all text-right"
                   >
                      <Globe size={18} className="text-blue-500" /> اتجاهات السوق
                   </motion.button>
                </div>
             </div>
          </div>

          {/* الجانب الأيسر: واجهة المحادثة */}
          <div className="flex-1 flex flex-col bg-slate-800 rounded-[2.5rem] border border-slate-700 shadow-2xl overflow-hidden min-h-[700px]">
             <div className="p-6 border-b border-slate-700 bg-slate-800/80 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center text-white ring-4 ring-amber-600/20">
                        <Bot size={28} />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-800 rounded-full"></div>
                   </div>
                   <div>
                     <div className="font-black text-lg">مساعد العثماني الذكي</div>
                     <div className="text-[10px] text-green-500 font-bold flex items-center gap-1 uppercase tracking-widest">
                       <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> متصل بالخادم
                     </div>
                   </div>
                </div>
             </div>

             <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      className={`flex flex-col ${msg.role === 'user' ? 'items-start' : 'items-end'}`}
                    >
                        <div className={`p-5 rounded-2xl text-sm max-w-[85%] relative group shadow-lg ${
                          msg.role === 'user' 
                          ? 'bg-slate-700 text-white rounded-tr-none' 
                          : 'bg-slate-900 border border-slate-700 text-slate-200 rounded-tl-none'
                        }`}>
                          {msg.content}
                          {msg.data?.sources && msg.data.sources.length > 0 && (
                              <div className="mt-4 pt-3 border-t border-slate-800">
                                <div className="flex flex-wrap gap-2">
                                    {msg.data.sources.map((chunk: any, idx: number) => chunk.web && (
                                      <a key={idx} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded text-[10px] text-amber-500 hover:bg-slate-700 transition-colors">
                                          <ExternalLink size={10} /> {chunk.web.title || 'مصدر'}
                                      </a>
                                    ))}
                                </div>
                              </div>
                          )}
                        </div>
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-end"
                    >
                      <div className="bg-slate-900 border border-slate-700 p-4 rounded-2xl rounded-tl-none flex gap-1">
                        <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-amber-500 rounded-full"></motion.span>
                        <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-amber-500 rounded-full"></motion.span>
                        <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-amber-500 rounded-full"></motion.span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {step === AppStep.AGREEMENT && (
                   <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-8 bg-amber-600/10 border border-amber-600/30 rounded-3xl text-center space-y-4"
                   >
                      <ClipboardCheck size={40} className="mx-auto text-amber-500" />
                      <h4 className="font-bold">تأكيد تفاصيل الطلب</h4>
                      <p className="text-xs text-slate-400">سيتم حفظ هذه المتطلبات في لوحة تحكم محمد العثماني فور تأكيدك.</p>
                      <button onClick={confirmAgreementAndSaveToDB} className="w-full bg-amber-600 hover:bg-amber-500 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-amber-600/20 active:scale-95">حفظ الطلب والاتفاق</button>
                   </motion.div>
                )}

                {step === AppStep.PAYMENT && (
                   <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-8 bg-green-500/10 border border-green-500/30 rounded-3xl text-center space-y-4"
                   >
                      <CreditCard size={40} className="mx-auto text-green-500" />
                      <h4 className="font-bold">بوابة الدفع الآمنة</h4>
                      <p className="text-xs text-slate-400">تم تسجيل معرف الطلب: {currentOrderId}</p>
                      <button onClick={handlePaymentAndGenerate} className="w-full bg-green-600 hover:bg-green-500 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-green-600/20 active:scale-95">دفع الآن وبدء التوليد</button>
                   </motion.div>
                )}

                {step === AppStep.GENERATING && (
                   <div className="flex flex-col items-center justify-center py-20 gap-4 text-amber-500">
                      <motion.div 
                        animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Loader2 size={48} />
                      </motion.div>
                      <div className="text-center">
                        <p className="font-black text-xl mb-1">جاري بناء موقعك بالذكاء الاصطناعي...</p>
                        <p className="text-xs text-slate-500">نقوم بتحويل أفكارك إلى تجربة رقمية فريدة</p>
                      </div>
                   </div>
                )}

                {step === AppStep.COMPLETE && (
                   <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="p-8 bg-slate-900 rounded-3xl border border-green-500/30 text-center space-y-6"
                   >
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mx-auto">
                        <CheckCircle size={32} />
                      </div>
                      <div>
                        <h4 className="font-black text-2xl text-green-500">تم التوليد بنجاح!</h4>
                        <p className="text-sm text-slate-400 mt-2 font-medium">طلبك محفوظ في قاعدة البيانات ومتاح للمراجعة.</p>
                      </div>
                      <button onClick={() => {
                         const win = window.open('', '_blank');
                         win?.document.write(generatedHtml);
                         win?.document.close();
                      }} className="w-full bg-amber-600 hover:bg-amber-500 py-5 rounded-2xl font-black text-xl transition-all shadow-2xl shadow-amber-600/30">فتح المعاينة الحية</button>
                   </motion.div>
                )}
             </div>

             <div className="p-6 bg-slate-900/50 border-t border-slate-700 flex gap-3">
                <input 
                  type="text" 
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl p-5 text-sm outline-none focus:ring-2 ring-amber-500/20 transition-all placeholder:text-slate-500" 
                  value={input} 
                  onChange={e => setInput(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && handleSend()} 
                  placeholder="أخبرني عن مشروعك القادم..." 
                />
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend()} 
                  disabled={isLoading} 
                  className="p-5 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 rounded-2xl text-white transition-all shadow-xl shadow-amber-600/20"
                >
                  {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} className="rotate-180" />}
                </motion.button>
             </div>
          </div>
       </motion.div>
    </div>
  );
};

export default ChatAgent;
