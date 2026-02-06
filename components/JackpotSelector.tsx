import React, { useState, useEffect, useRef } from 'react';
import { PAINTER_STYLES, TRANSLATIONS } from '../constants';
import { PainterStyle, Language } from '../types';
import { Dices, Palette } from 'lucide-react';

interface JackpotProps {
  currentStyle: PainterStyle;
  onStyleChange: (style: PainterStyle) => void;
  lang: Language;
}

const JackpotSelector: React.FC<JackpotProps> = ({ currentStyle, onStyleChange, lang }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);
  const t = TRANSLATIONS[lang];
  const intervalRef = useRef<number | null>(null);

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    let speed = 50;
    let counter = 0;
    const maxSpins = 30 + Math.floor(Math.random() * 20); // Random duration

    const spin = () => {
      setDisplayIndex((prev) => (prev + 1) % PAINTER_STYLES.length);
      counter++;

      if (counter < maxSpins) {
        // Slow down at the end
        if (counter > maxSpins - 10) speed += 30;
        intervalRef.current = window.setTimeout(spin, speed);
      } else {
        // Stop
        const finalIndex = Math.floor(Math.random() * PAINTER_STYLES.length);
        setDisplayIndex(finalIndex);
        onStyleChange(PAINTER_STYLES[finalIndex]);
        setIsSpinning(false);
      }
    };

    spin();
  };

  const displayStyle = isSpinning ? PAINTER_STYLES[displayIndex] : currentStyle;

  return (
    <div className="glass-panel p-6 rounded-2xl shadow-xl border-t border-white/30 relative overflow-hidden group">
      {/* Background glow based on current style */}
      <div 
        className="absolute inset-0 opacity-20 transition-colors duration-500"
        style={{ background: `linear-gradient(135deg, ${displayStyle.palette[1]}, ${displayStyle.palette[3]})` }}
      />
      
      <div className="relative z-10 flex flex-col items-center gap-4">
        <h3 className="text-sm uppercase tracking-widest font-bold opacity-70">{t.style} selector</h3>
        
        {/* Slot Window */}
        <div className="w-full h-32 bg-white/10 rounded-lg border border-white/20 flex items-center justify-center relative overflow-hidden shadow-inner">
           <div className="text-center p-4 transition-all duration-100 transform">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-800 dark:text-white" style={{color: displayStyle.palette[1]}}>
                {displayStyle.name}
              </h2>
              <p className="text-sm md:text-base mt-2 opacity-80 font-sans">{displayStyle.description}</p>
           </div>
           
           {/* Decorative elements based on style */}
           <div 
            className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full opacity-50 blur-xl"
            style={{ backgroundColor: displayStyle.palette[2] }}
           />
           <div 
            className="absolute -left-4 -top-4 w-20 h-20 rounded-full opacity-50 blur-xl"
            style={{ backgroundColor: displayStyle.palette[3] }}
           />
        </div>

        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className="group relative px-8 py-3 rounded-full font-bold text-white shadow-lg transform active:scale-95 transition-all overflow-hidden"
          style={{ 
            backgroundColor: displayStyle.palette[1],
            boxShadow: `0 0 20px ${displayStyle.palette[1]}66`
          }}
        >
          <span className="relative z-10 flex items-center gap-2">
            {isSpinning ? <Dices className="animate-spin" /> : <Palette />}
            {t.spin}
          </span>
          <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors" />
        </button>
      </div>
    </div>
  );
};

export default JackpotSelector;
