
export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  colorPalette?: string; // أزرق، ذهبي، أرجواني، أخضر
  tags?: string[];
}

export interface SiteOrder {
  id: string;
  customerName: string;
  requirements: string;
  status: 'قيد الانتظار' | 'تم التوليد' | 'مكتمل';
  date: string;
  price?: string;
  htmlContent?: string; // الكود الذي ولده الذكاء الاصطناعي
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'price' | 'payment' | 'preview' | 'agreement_summary';
  data?: any;
}

export enum AppStep {
  IDLE = 'IDLE',
  GATHERING_INFO = 'GATHERING_INFO',
  AGREEMENT = 'AGREEMENT',
  NOTIFYING_ADMIN = 'NOTIFYING_ADMIN',
  PAYMENT = 'PAYMENT',
  GENERATING = 'GENERATING',
  COMPLETE = 'COMPLETE'
}
