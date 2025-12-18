
import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio';
import ChatAgent from './components/ChatAgent';
import Contact from './components/Contact';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'portfolio', 'chat', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && scrollPosition >= element.offsetTop && scrollPosition < element.offsetTop + element.offsetHeight) {
          setActiveSection(section);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAdminLogin = () => {
    // كلمة مرور تجريبية (يجب تغييرها في الإنتاج)
    if (password === 'admin123') {
      setIsAdmin(true);
      setShowLogin(false);
      setPassword('');
    } else {
      alert('كلمة المرور غير صحيحة');
    }
  };

  if (isAdmin) {
    return <AdminDashboard onLogout={() => setIsAdmin(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-amber-500/30">
      <Navbar activeSection={activeSection} />
      
      <main>
        <section id="home">
          <Hero />
        </section>

        <section id="portfolio" className="py-24 bg-slate-800/50">
          <Portfolio />
        </section>

        <section id="chat" className="py-24 bg-slate-900">
          <ChatAgent />
        </section>

        <section id="contact" className="py-24 bg-slate-950">
          <Contact />
        </section>
      </main>

      <footer className="py-12 border-t border-slate-800 text-center relative">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-4">محمد العثماني</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">نحول أفكارك إلى واقع رقمي باستخدام أحدث تقنيات الذكاء الاصطناعي والتصميم العصري.</p>
          <div className="flex justify-center gap-6 mb-8">
             <button 
              onClick={() => setShowLogin(true)}
              className="text-slate-600 hover:text-amber-500 transition-colors flex items-center gap-1 text-xs"
            >
              <Lock size={12} />
              منطقة المسؤول
            </button>
          </div>
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} جميع الحقوق محفوظة لمحمد العثماني.</p>
        </div>
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-sm text-center shadow-2xl">
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mx-auto mb-6">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">دخول المسؤول</h3>
            <p className="text-slate-400 text-sm mb-6">يرجى إدخال كلمة المرور للوصول إلى لوحة التحكم.</p>
            <input 
              type="password" 
              placeholder="كلمة المرور"
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl mb-4 outline-none focus:border-amber-500 text-center"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
            />
            <div className="flex gap-2">
              <button 
                onClick={() => setShowLogin(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl font-bold transition-all"
              >
                إلغاء
              </button>
              <button 
                onClick={handleAdminLogin}
                className="flex-1 bg-amber-600 hover:bg-amber-500 py-3 rounded-xl font-bold transition-all"
              >
                دخول
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
