
import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-16 items-start">
        <div className="text-right">
          <h2 className="text-4xl font-extrabold mb-6">دعنا نتحدث عن مشروعك</h2>
          <p className="text-slate-400 mb-10 leading-relaxed text-lg">
            سواء كان لديك فكرة واضحة أو مجرد بداية لمشروع، أنا هنا لمساعدتك في تحويلها إلى واقع رقمي مبهر.
          </p>
          
          <div className="space-y-8">
            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all">
                <Mail size={24} />
              </div>
              <div>
                <div className="text-sm text-slate-500 font-bold mb-1">البريد الإلكتروني</div>
                <div className="text-xl font-bold">almanswro553@gmail.com</div>
              </div>
            </div>
            
            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all">
                <Phone size={24} />
              </div>
              <div>
                <div className="text-sm text-slate-500 font-bold mb-1">الهاتف</div>
                <div className="text-xl font-bold" dir="ltr">+967 733 443 984</div>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all">
                <MapPin size={24} />
              </div>
              <div>
                <div className="text-sm text-slate-500 font-bold mb-1">الموقع</div>
                <div className="text-xl font-bold">صنعاء، اليمن</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 shadow-xl">
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-300">الاسم الكامل</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="محمد أحمد"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-300">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="name@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-300">الموضوع</label>
              <input 
                type="text" 
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="تطوير موقع إلكتروني"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-300">الرسالة</label>
              <textarea 
                rows={5}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm focus:outline-none focus:border-amber-500 transition-colors resize-none"
                placeholder="كيف يمكنني مساعدتك؟"
              ></textarea>
            </div>
            <button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-amber-600/20 transition-all flex items-center justify-center gap-2">
              إرسال الرسالة
              <Send size={18} className="rotate-180" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
