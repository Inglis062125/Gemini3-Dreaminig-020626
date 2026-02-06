import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AiFeatures from './components/AiFeatures';
import { PainterStyle, Language } from './types';
import { PAINTER_STYLES } from './constants';

const App: React.FC = () => {
  // State initialization
  const [currentStyle, setCurrentStyle] = useState<PainterStyle>(PAINTER_STYLES[0]);
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Load saved preferences if any (Optional enhancement)
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Layout
      currentStyle={currentStyle}
      onStyleChange={setCurrentStyle}
      lang={lang}
      onLangChange={setLang}
      theme={theme}
      onThemeChange={setTheme}
    >
      <div className="space-y-12 animate-fade-in-up">
        <Dashboard style={currentStyle} lang={lang} />
        
        <div id="ai-studio" className="border-t border-white/10 pt-12">
           <AiFeatures style={currentStyle} lang={lang} />
        </div>
      </div>
    </Layout>
  );
};

export default App;
