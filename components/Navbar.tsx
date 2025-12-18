
import React from 'react';

interface NavbarProps {
  activeSection: string;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const navItems = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'portfolio', label: 'أعمالي' },
    { id: 'chat', label: 'روبوت التصميم' },
    { id: 'contact', label: 'تواصل معي' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-800/50">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="text-2xl font-extrabold tracking-tighter">
          <span className="text-amber-500">M.</span>ALOTHMANY
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`text-sm font-medium transition-all duration-300 hover:text-amber-500 ${
                activeSection === item.id ? 'text-amber-500' : 'text-slate-300'
              }`}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#chat"
            className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105 shadow-lg shadow-amber-600/20"
          >
            ابدأ مشروعك
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
