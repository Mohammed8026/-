
import React from 'react';
import { ArrowLeft, Sparkles, Code2, Rocket, Users, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Decor */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]"
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]"
      />

      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-right"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-amber-500 text-sm font-bold mb-6"
          >
            <Sparkles size={16} />
            <span>مستقبل تصميم المواقع هنا</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-8xl font-black leading-tight mb-6">
            محمد العثماني <br />
            <motion.span 
              initial={{ filter: 'blur(10px)', opacity: 0 }}
              animate={{ filter: 'blur(0px)', opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="bg-gradient-to-l from-amber-300 via-amber-500 to-amber-700 bg-clip-text text-transparent"
            >
              مصمم تجارب رقمية
            </motion.span>
          </h1>
          
          <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-lg font-medium">
            أقوم بتحويل أفكارك إلى مواقع إلكترونية عصرية وتفاعلية. اطلب موقعك الآن ودع الذكاء الاصطناعي يبني لك الأساس في ثوانٍ.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-12">
            <motion.a
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              href="#chat"
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-10 py-5 rounded-2xl text-lg font-black transition-all shadow-2xl shadow-amber-600/30"
            >
              اطلب موقعك الآن
              <ArrowLeft size={20} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#portfolio"
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-10 py-5 rounded-2xl text-lg font-bold transition-all border border-slate-700"
            >
              عرض الأعمال
            </motion.a>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-8 border-r-2 border-slate-800 pr-6">
            <div className="text-right">
              <div className="text-3xl font-black text-white">+50</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">مشروع مكتمل</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-white">+10</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">سنوات خبرة</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-white">100%</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">رضا العملاء</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative hidden md:block"
        >
          <div className="relative z-10 rounded-[3rem] overflow-hidden border-4 border-slate-800 shadow-3xl bg-slate-900 group">
            <img 
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1000" 
              alt="Professional Design" 
              className="w-full grayscale group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60"></div>
          </div>
          
          {/* Floating Cards with Motion */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-8 -right-8 glass border border-slate-700 p-6 rounded-[2rem] shadow-2xl z-20"
          >
            <div className="flex items-center gap-4">
              <div className="p-4 bg-amber-500 rounded-2xl text-white shadow-lg shadow-amber-500/30">
                <Code2 size={24} />
              </div>
              <div>
                <div className="text-sm font-black">كود نظيف</div>
                <div className="text-xs text-slate-400">تحسين محركات البحث SEO</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -top-10 -left-10 glass border border-slate-700 p-6 rounded-[2rem] shadow-2xl z-20"
          >
             <div className="flex items-center gap-4">
              <div className="p-4 bg-purple-600 rounded-2xl text-white shadow-lg shadow-purple-600/30">
                <Rocket size={24} />
              </div>
              <div>
                <div className="text-sm font-black">سرعة خارقة</div>
                <div className="text-xs text-slate-400">أداء بنسبة 100%</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
