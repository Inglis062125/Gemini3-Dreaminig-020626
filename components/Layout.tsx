import React from 'react';
import { PainterStyle, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { LayoutDashboard, Settings, Layers, Menu, Moon, Sun, Globe } from 'lucide-react';
import JackpotSelector from './JackpotSelector';

interface LayoutProps {
  children: React.ReactNode;
  currentStyle: PainterStyle;
  onStyleChange: (style: PainterStyle) => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, currentStyle, onStyleChange, lang, onLangChange, theme, onThemeChange 
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <div 
      className={`min-h-screen transition-colors duration-700 flex flex-col md:flex-row font-sans ${theme}`}
      style={{ 
        backgroundColor: theme === 'dark' ? '#0f172a' : currentStyle.palette[0],
        color: theme === 'dark' ? '#f8fafc' : currentStyle.palette[4]
      }}
    >
      {/* Sidebar / Navigation */}
      <aside className="w-full md:w-64 glass-panel border-r border-white/10 flex flex-col z-20">
        <div className="p-6 flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-full shadow-lg"
            style={{ background: `linear-gradient(45deg, ${currentStyle.palette[1]}, ${currentStyle.palette[3]})` }}
          />
          <h1 className="font-serif font-bold text-lg leading-tight tracking-tight">
            {t.title}
          </h1>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <NavItem icon={<LayoutDashboard size={20} />} label={t.dashboard} active color={currentStyle.palette[1]} />
          <NavItem icon={<Layers size={20} />} label={t.features} color={currentStyle.palette[1]} />
          <NavItem icon={<Settings size={20} />} label={t.settings} color={currentStyle.palette[1]} />
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-4">
           {/* Theme Toggle */}
           <div className="flex items-center justify-between glass-panel p-2 rounded-lg">
              <button 
                onClick={() => onThemeChange('light')}
                className={`p-2 rounded-md transition-all ${theme === 'light' ? 'bg-white shadow text-black' : 'text-gray-400 hover:text-white'}`}
              >
                <Sun size={18} />
              </button>
              <button 
                onClick={() => onThemeChange('dark')}
                className={`p-2 rounded-md transition-all ${theme === 'dark' ? 'bg-gray-700 shadow text-white' : 'text-gray-500 hover:text-black'}`}
              >
                <Moon size={18} />
              </button>
           </div>
           
           {/* Lang Toggle */}
           <button 
             onClick={() => onLangChange(lang === 'en' ? 'zh-TW' : 'en')}
             className="w-full flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
           >
             <Globe size={18} />
             <span className="text-sm font-bold">{lang === 'en' ? 'EN' : '繁體'}</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Abstract Background Art */}
        <div className="absolute inset-0 pointer-events-none opacity-30 md:opacity-50 transition-all duration-1000">
           {/* Dynamic SVGs based on style vibe would go here, using CSS gradients for now */}
           <div 
             className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full filter blur-[100px] mix-blend-multiply animate-pulse-fast"
             style={{ backgroundColor: currentStyle.palette[2], animationDuration: '8s' }}
           />
           <div 
             className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full filter blur-[120px] mix-blend-multiply animate-pulse-fast"
             style={{ backgroundColor: currentStyle.palette[3], animationDuration: '12s' }}
           />
        </div>

        {/* Content Container */}
        <div className="relative z-10 p-4 md:p-8 overflow-y-auto h-screen custom-scrollbar">
          
          {/* Header Area */}
          <header className="flex justify-between items-start mb-8">
            <div>
               <h2 className="text-3xl md:text-5xl font-serif font-bold mb-2">
                 {t.welcome}
               </h2>
               <p className="opacity-70 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                 System Stable · {new Date().toLocaleDateString()}
               </p>
            </div>
          </header>

          {/* Jackpot */}
          <section className="mb-12">
            <JackpotSelector 
              currentStyle={currentStyle} 
              onStyleChange={onStyleChange} 
              lang={lang}
            />
          </section>

          {/* Dashboard Children */}
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, color }: { icon: React.ReactNode, label: string, active?: boolean, color: string }) => (
  <button 
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${active ? 'bg-white/20 shadow-lg' : 'hover:bg-white/10'}`}
  >
    <span className={`transition-colors ${active ? 'text-white' : 'text-current opacity-70 group-hover:opacity-100'}`} style={{ color: active ? color : undefined }}>
      {icon}
    </span>
    <span className={`font-medium ${active ? 'opacity-100 font-bold' : 'opacity-70 group-hover:opacity-100'}`}>
      {label}
    </span>
  </button>
);

export default Layout;
