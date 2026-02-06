import React, { useState } from 'react';
import { PainterStyle, Language, AIFeatureType, AIState } from '../types';
import { TRANSLATIONS } from '../constants';
import { generateArtisticResponse } from '../services/geminiService';
import { 
  Sparkles, Activity, FileText, Globe, EyeOff, Play, UploadCloud, 
  Lightbulb, ShieldAlert, Zap, Mic2, Hourglass 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  RadialBarChart, RadialBar, Legend
} from 'recharts';

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

  const features: { id: AIFeatureType; icon: React.ReactNode; label: string; group: string }[] = [
    // Group 1: Analysis
    { id: 'dream-summarizer', icon: <FileText size={18} />, label: t.feature1, group: 'Core' },
    { id: 'sentiment-symphony', icon: <Activity size={18} />, label: t.feature2, group: 'Core' },
    { id: 'smart-redaction', icon: <EyeOff size={18} />, label: t.feature5, group: 'Core' },
    { id: 'predictive-sculpture', icon: <Sparkles size={18} />, label: t.feature3, group: 'Advanced' },
    { id: 'polyglot-synthesis', icon: <Globe size={18} />, label: t.feature4, group: 'Advanced' },
    // Group 2: WOW Features
    { id: 'muse-whisper', icon: <Lightbulb size={18} />, label: t.feature6, group: 'Creative' },
    { id: 'strategic-oracle', icon: <Zap size={18} />, label: t.feature7, group: 'Strategy' },
    { id: 'tone-alchemist', icon: <Mic2 size={18} />, label: t.feature8, group: 'Creative' },
    { id: 'ethical-mirror', icon: <ShieldAlert size={18} />, label: t.feature9, group: 'Strategy' },
    { id: 'time-capsule', icon: <Hourglass size={18} />, label: t.feature10, group: 'Creative' },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      <h2 className="text-3xl font-serif font-bold text-gray-800 dark:text-white flex items-center gap-3">
        <Sparkles className="text-yellow-400" />
        AI Studio
      </h2>

      {/* Feature Navigation - Categorized */}
      <div className="flex flex-wrap gap-3">
        {features.map((f) => (
          <button
            key={f.id}
            onClick={() => { setActiveFeature(f.id); setAiState({ isLoading: false, result: null, data: null, error: null }); }}
            className={`px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium transition-all duration-300 border ${
              activeFeature === f.id 
                ? 'text-white shadow-lg scale-105 border-transparent' 
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-600 dark:text-gray-300 hover:border-white/30'
            }`}
            style={{ 
              backgroundColor: activeFeature === f.id ? currentStyle.palette[2] : undefined,
              borderColor: activeFeature === f.id ? currentStyle.palette[3] : undefined
            }}
          >
            {f.icon}
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 min-h-[400px]">
          <h3 className="text-xl font-serif font-bold text-gray-800 dark:text-white flex items-center gap-2">
             <UploadCloud size={24} style={{ color: currentStyle.palette[1] }}/>
             Input Context
          </h3>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.promptPlaceholder}
            className="flex-1 w-full p-6 rounded-xl bg-white/40 dark:bg-black/20 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 resize-none transition-all font-sans text-lg"
            style={{ 
                '--tw-ring-color': currentStyle.palette[1] 
            } as React.CSSProperties}
          />

          <div className="flex justify-end">
             <button
                onClick={handleRunAi}
                disabled={aiState.isLoading || !inputText}
                className="px-8 py-4 rounded-xl font-bold text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
                style={{ backgroundColor: currentStyle.palette[1] }}
             >
                {aiState.isLoading ? <Sparkles className="animate-spin" /> : <Play fill="currentColor" />}
                {t.runAi}
             </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="glass-panel p-6 rounded-2xl min-h-[400px] flex flex-col relative overflow-hidden">
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
                          className="p-6 rounded-xl border-l-4 mb-6 shadow-sm"
                          style={{ 
                            backgroundColor: `${currentStyle.palette[0]}55`,
                            borderColor: currentStyle.palette[3] 
                          }}
                        >
                           <p className="whitespace-pre-wrap font-serif text-lg leading-relaxed">
                             {aiState.result}
                           </p>
                        </div>

                        {/* Visualizations based on Feature Type */}
                        {aiState.data && (
                           <div className="h-80 w-full mt-8 rounded-xl overflow-hidden bg-white/50 dark:bg-black/20 p-4 border border-white/10">
                              <ResponsiveContainer width="100%" height="100%">
                                  {/* Strategic Oracle (Radar) */}
                                  {activeFeature === 'strategic-oracle' ? (
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={aiState.data}>
                                      <PolarGrid />
                                      <PolarAngleAxis dataKey="name" tick={{fill: currentStyle.palette[4]}} />
                                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                      <Radar name="Strategy" dataKey="value" stroke={currentStyle.palette[1]} fill={currentStyle.palette[1]} fillOpacity={0.6} />
                                      <Tooltip />
                                    </RadarChart>
                                  ) : 
                                  /* Ethical Mirror (Radial Bar - Gauge style) */
                                  activeFeature === 'ethical-mirror' ? (
                                     <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={20} data={aiState.data}>
                                       <RadialBar label={{ position: 'insideStart', fill: '#fff' }} background dataKey="value" cornerRadius={10} />
                                       <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{right: 0}}/>
                                       <Tooltip />
                                     </RadialBarChart>
                                  ) :
                                  /* Sentiment (Area) */
                                  activeFeature === 'sentiment-symphony' ? (
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
                                        <Tooltip contentStyle={{ backgroundColor: currentStyle.palette[0], borderColor: currentStyle.palette[2], color: currentStyle.palette[4] }} />
                                        <Area type="monotone" dataKey="value" stroke={currentStyle.palette[1]} fillOpacity={1} fill="url(#colorValue)" />
                                    </AreaChart>
                                  ) : 
                                  /* Default Line Chart */
                                  (
                                    <LineChart data={aiState.data}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                        <XAxis dataKey="name" tick={{fill: currentStyle.palette[4], fontSize: 10}} />
                                        <YAxis tick={{fill: currentStyle.palette[4], fontSize: 10}} />
                                        <Tooltip contentStyle={{ backgroundColor: currentStyle.palette[0], borderColor: currentStyle.palette[2], color: currentStyle.palette[4] }} />
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
                        <Sparkles size={64} className="mb-6 animate-pulse" color={currentStyle.palette[3]} />
                        <p className="text-xl">Select a muse and inspire the canvas.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AiFeatures;
