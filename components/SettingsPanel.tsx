import React from 'react';
import { PainterStyle, Language, AppSettings } from '../types';
import { TRANSLATIONS } from '../constants';
import { X, Sliders, Zap, Bell, Volume2, Monitor, Save } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  style: PainterStyle;
  lang: Language;
  settings: AppSettings;
  onUpdateSettings: (s: AppSettings) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  isOpen, onClose, style: currentStyle, lang, settings, onUpdateSettings 
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div 
        className="relative w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up"
        style={{ 
          borderColor: currentStyle.palette[2],
          boxShadow: `0 25px 50px -12px ${currentStyle.palette[1]}66` 
        }}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center" style={{ backgroundColor: `${currentStyle.palette[1]}33` }}>
          <div className="flex items-center gap-3">
             <Sliders className="w-6 h-6 text-white" />
             <h2 className="text-2xl font-serif font-bold text-white">{t.settings}</h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
          
          {/* Section 1: Creativity */}
          <div className="space-y-4">
             <div className="flex justify-between items-center">
                <label className="text-lg font-medium text-gray-200 flex items-center gap-2">
                   <Zap size={18} /> {t.creativity}
                </label>
                <span className="text-sm font-mono text-white/60">{settings.creativityLevel}%</span>
             </div>
             <input 
               type="range" 
               min="0" 
               max="100" 
               value={settings.creativityLevel}
               onChange={(e) => onUpdateSettings({...settings, creativityLevel: parseInt(e.target.value)})}
               className="w-full h-2 rounded-lg appearance-none cursor-pointer"
               style={{ 
                 background: `linear-gradient(to right, ${currentStyle.palette[3]}, ${currentStyle.palette[1]})` 
               }}
             />
             <p className="text-sm text-gray-400">Controls the unpredictability and artistic flair of the AI Muse.</p>
          </div>

          <hr className="border-white/10" />

          {/* Section 2: Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Animation Toggle */}
             <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                   <Monitor className="text-gray-300" />
                   <span className="text-gray-200">{t.animations}</span>
                </div>
                <button 
                  onClick={() => onUpdateSettings({...settings, animationEnabled: !settings.animationEnabled})}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.animationEnabled ? 'bg-green-500' : 'bg-gray-600'}`}
                >
                   <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${settings.animationEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
             </div>

             {/* Sound Toggle */}
             <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                   <Volume2 className="text-gray-300" />
                   <span className="text-gray-200">{t.sound}</span>
                </div>
                <button 
                  onClick={() => onUpdateSettings({...settings, soundEnabled: !settings.soundEnabled})}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.soundEnabled ? 'bg-green-500' : 'bg-gray-600'}`}
                >
                   <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
             </div>
          </div>

          {/* Section 3: Data Density */}
          <div className="space-y-3">
             <label className="text-lg font-medium text-gray-200">Data Density</label>
             <div className="grid grid-cols-2 gap-4">
                <button
                   onClick={() => onUpdateSettings({...settings, dataDensity: 'low'})}
                   className={`p-3 rounded-lg border transition-all ${settings.dataDensity === 'low' ? 'bg-white/20 border-white text-white' : 'bg-transparent border-white/20 text-gray-400 hover:bg-white/5'}`}
                >
                   Relaxed
                </button>
                <button
                   onClick={() => onUpdateSettings({...settings, dataDensity: 'high'})}
                   className={`p-3 rounded-lg border transition-all ${settings.dataDensity === 'high' ? 'bg-white/20 border-white text-white' : 'bg-transparent border-white/20 text-gray-400 hover:bg-white/5'}`}
                >
                   Compact
                </button>
             </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex justify-end">
           <button 
             onClick={onClose}
             className="px-6 py-2 rounded-lg font-bold text-white flex items-center gap-2 hover:brightness-110 transition-all shadow-lg"
             style={{ backgroundColor: currentStyle.palette[1] }}
           >
              <Save size={18} />
              {t.save}
           </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsPanel;
