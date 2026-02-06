import React, { useState } from 'react';
import { PainterStyle, Language, AIFeatureType, AIState } from '../types';
import { TRANSLATIONS } from '../constants';
import { generateArtisticResponse } from '../services/geminiService';
import { Sparkles, Activity, FileText, Globe, EyeOff, Play, UploadCloud } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface AiFeaturesProps {
  style: PainterStyle;
  lang: Language;
}

const AiFeatures: React.FC<AiFeaturesProps> = ({ style: currentStyle, lang }) => {
  const t = TRANSLATIONS[lang];
  const [activeFeature, setActiveFeature] = useState<AIFeatureType>('dream-summarizer');
  const [inputText, setInputText] = useState('');
  const [aiState, setAiState] = useState<AIState>({ isLoading: false, result: null, data: null, error: null });

  const handleRunAi = async () => {
    if (!inputText) return;
    setAiState({ isLoading: true, result: null, data: null, error: null });
    
    try {
      const response = await generateArtisticResponse(activeFeature, inputText, currentStyle.name);
      setAiState({ 
        isLoading: false, 
        result: response.text, 
        data: response.data || null, 
        error: null 
      });
    } catch (e) {
      setAiState({ isLoading: false, result: null, data: null, error: 'Failed to generate.' });
    }
  };

  const features: { id: AIFeatureType; icon: React.ReactNode; label: string }[] = [
    { id: 'dream-summarizer', icon: <FileText size={18} />, label: t.feature1 },
    { id: 'sentiment-symphony', icon: <Activity size={18} />, label: t.feature2 },
    { id: 'predictive-sculpture', icon: <Sparkles size={18} />, label: t.feature3 },
    { id: 'polyglot-synthesis', icon: <Globe size={18} />, label: t.feature4 },
    { id: 'smart-redaction', icon: <EyeOff size={18} />, label: t.feature5 },
  ];

  return (
    <div className="space-y-6">
      {/* Feature Navigation */}
      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
        {features.map((f) => (
          <button
            key={f.id}
            onClick={() => { setActiveFeature(f.id); setAiState({ isLoading: false, result: null, data: null, error: null }); }}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all ${
              activeFeature === f.id 
                ? 'text-white shadow-lg scale-105' 
                : 'bg-white/5 hover:bg-white/10 text-gray-600 dark:text-gray-300'
            }`}
            style={{ 
              backgroundColor: activeFeature === f.id ? currentStyle.palette[2] : undefined 
            }}
          >
            {f.icon}
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
          <h3 className="text-xl font-serif font-bold text-gray-800 dark:text-white flex items-center gap-2">
             <UploadCloud size={24} style={{ color: currentStyle.palette[1] }}/>
             {t.upload} / Input
          </h3>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.promptPlaceholder}
            className="w-full h-48 p-4 rounded-xl bg-white/40 dark:bg-black/20 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 resize-none transition-all"
            style={{ 
                '--tw-ring-color': currentStyle.palette[1] 
            } as React.CSSProperties}
          />

          <div className="flex justify-end">
             <button
                onClick={handleRunAi}
                disabled={aiState.isLoading || !inputText}
                className="px-6 py-3 rounded-lg font-bold text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-xl transition-all"
                style={{ backgroundColor: currentStyle.palette[1] }}
             >
                {aiState.isLoading ? <Sparkles className="animate-spin" /> : <Play fill="currentColor" />}
                {t.runAi}
             </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="glass-panel p-6 rounded-2xl min-h-[300px] flex flex-col relative overflow-hidden">
            <h3 className="text-xl font-serif font-bold text-gray-800 dark:text-white mb-4">
                {t.result}
            </h3>

            {aiState.isLoading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-sm">
                    <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: currentStyle.palette[2], borderTopColor: 'transparent' }} />
                    <p className="mt-4 font-serif text-lg animate-pulse">{t.processing}</p>
                </div>
            )}

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {aiState.result ? (
                    <div className="prose dark:prose-invert max-w-none">
                         {/* Text Result */}
                        <div 
                          className="p-4 rounded-lg border-l-4 mb-4"
                          style={{ 
                            backgroundColor: `${currentStyle.palette[0]}33`,
                            borderColor: currentStyle.palette[3] 
                          }}
                        >
                           <p className="whitespace-pre-wrap font-serif text-lg leading-relaxed">
                             {aiState.result}
                           </p>
                        </div>

                        {/* Chart Result if available */}
                        {aiState.data && (
                           <div className="h-64 w-full mt-6 rounded-lg overflow-hidden bg-white/50 dark:bg-black/20 p-2">
                              <ResponsiveContainer width="100%" height="100%">
                                  {activeFeature === 'sentiment-symphony' ? (
                                    <AreaChart data={aiState.data}>
                                        <defs>
                                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={currentStyle.palette[1]} stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor={currentStyle.palette[1]} stopOpacity={0}/>
                                          </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                        <XAxis dataKey="name" tick={{fill: currentStyle.palette[4], fontSize: 10}} />
                                        <YAxis tick={{fill: currentStyle.palette[4], fontSize: 10}}/>
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: currentStyle.palette[0], borderColor: currentStyle.palette[2], color: currentStyle.palette[4] }}
                                        />
                                        <Area type="monotone" dataKey="value" stroke={currentStyle.palette[1]} fillOpacity={1} fill="url(#colorValue)" />
                                    </AreaChart>
                                  ) : (
                                    <LineChart data={aiState.data}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                        <XAxis dataKey="name" tick={{fill: currentStyle.palette[4], fontSize: 10}} />
                                        <YAxis tick={{fill: currentStyle.palette[4], fontSize: 10}} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: currentStyle.palette[0], borderColor: currentStyle.palette[2], color: currentStyle.palette[4] }}
                                        />
                                        <Line type="monotone" dataKey="value" stroke={currentStyle.palette[1]} strokeWidth={3} dot={{r: 4}} />
                                        <Line type="monotone" dataKey="prediction" stroke={currentStyle.palette[3]} strokeWidth={2} strokeDasharray="5 5" />
                                    </LineChart>
                                  )}
                              </ResponsiveContainer>
                           </div>
                        )}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-40">
                        <Sparkles size={48} className="mb-4" color={currentStyle.palette[3]} />
                        <p>Select a feature and run the AI Muse.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AiFeatures;
