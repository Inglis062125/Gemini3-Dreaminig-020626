import React from 'react';
import { PainterStyle, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { 
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, 
  PieChart, Pie, RadialBarChart, RadialBar, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area, Legend
} from 'recharts';
import { FileText, Clock, Activity, TrendingUp, Users, Globe, Zap } from 'lucide-react';

interface DashboardProps {
  style: PainterStyle;
  lang: Language;
}

const mockWeeklyData = [
  { name: 'Mon', docs: 45, rev: 2400, cost: 1398 },
  { name: 'Tue', docs: 52, rev: 1398, cost: 2400 },
  { name: 'Wed', docs: 38, rev: 9800, cost: 2000 },
  { name: 'Thu', docs: 65, rev: 3908, cost: 2780 },
  { name: 'Fri', docs: 48, rev: 4800, cost: 1890 },
  { name: 'Sat', docs: 20, rev: 3800, cost: 2390 },
  { name: 'Sun', docs: 15, rev: 4300, cost: 3490 },
];

const sentimentData = [
  { name: 'Positive', value: 65 },
  { name: 'Neutral', value: 25 },
  { name: 'Negative', value: 10 },
];

const efficiencyData = [
  { name: 'CPU', x: 1, fill: '#8884d8', value: 78 },
  { name: 'RAM', x: 2, fill: '#83a6ed', value: 45 },
  { name: 'Network', x: 3, fill: '#8dd1e1', value: 92 },
];

const radarData = [
  { subject: 'USA', A: 120, fullMark: 150 },
  { subject: 'China', A: 98, fullMark: 150 },
  { subject: 'EU', A: 86, fullMark: 150 },
  { subject: 'APAC', A: 99, fullMark: 150 },
  { subject: 'LATAM', A: 85, fullMark: 150 },
  { subject: 'MEA', A: 65, fullMark: 150 },
];

const Dashboard: React.FC<DashboardProps> = ({ style: currentStyle, lang }) => {
  const t = TRANSLATIONS[lang];

  const StatCard = ({ icon, label, value, sub }: any) => (
    <div className="glass-panel p-6 rounded-2xl hover:scale-105 transition-transform duration-300 flex flex-col justify-between h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-white/10 text-white shadow-inner">
          {React.cloneElement(icon, { color: currentStyle.palette[1], size: 24 })}
        </div>
        <span className="text-xs font-bold uppercase tracking-wider opacity-60 bg-white/10 px-2 py-1 rounded">
          {sub}
        </span>
      </div>
      <div>
        <h3 className="text-3xl font-serif font-bold mb-1">{value}</h3>
        <p className="text-sm opacity-70">{label}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 mb-12 animate-fade-in-up">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<FileText />} label={t.activeDocs} value="892" sub="+12%" />
        <StatCard icon={<Clock />} label={t.procTime} value="1.2s" sub="-5%" />
        <StatCard icon={<Activity />} label={t.sysHealth} value="99.9%" sub="Healthy" />
        <StatCard icon={<Users />} label="Total Users" value="1.4k" sub="+8%" />
      </div>

      {/* Main Grid for Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto">
        
        {/* 1. Processing Velocity (Area Chart) */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 min-h-[300px]">
           <h3 className="font-serif font-bold text-xl mb-4 flex items-center gap-2">
             <TrendingUp size={20} className="opacity-70" /> {t.velocity}
           </h3>
           <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockWeeklyData}>
                  <defs>
                    <linearGradient id="colorDocs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={currentStyle.palette[1]} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={currentStyle.palette[1]} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                     contentStyle={{ backgroundColor: currentStyle.palette[0], borderColor: currentStyle.palette[2], color: currentStyle.palette[4] }}
                  />
                  <Area type="monotone" dataKey="docs" stroke={currentStyle.palette[1]} fillOpacity={1} fill="url(#colorDocs)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* 2. Sentiment Distribution (Pie Chart) */}
        <div className="glass-panel p-6 rounded-2xl min-h-[300px]">
           <h3 className="font-serif font-bold text-xl mb-4 flex items-center gap-2">
             <Activity size={20} className="opacity-70" /> {t.sentimentDist}
           </h3>
           <div className="h-64 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={currentStyle.palette[index + 1]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: currentStyle.palette[0], color: currentStyle.palette[4] }} />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <span className="text-2xl font-bold opacity-80">90%</span>
              </div>
           </div>
        </div>

        {/* 3. System Efficiency (Radial Bar) */}
        <div className="glass-panel p-6 rounded-2xl min-h-[300px]">
           <h3 className="font-serif font-bold text-xl mb-4 flex items-center gap-2">
             <Zap size={20} className="opacity-70" /> {t.efficiency}
           </h3>
           <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={20} data={efficiencyData}>
                  <RadialBar
                    label={{ position: 'insideStart', fill: '#fff' }}
                    background
                    dataKey="value"
                  >
                    {efficiencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={currentStyle.palette[index + 1]} />
                    ))}
                  </RadialBar>
                  <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{right: 0}} />
                  <Tooltip contentStyle={{ backgroundColor: currentStyle.palette[0], color: currentStyle.palette[4] }} />
                </RadialBarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* 4. Global Reach (Radar Chart) */}
        <div className="glass-panel p-6 rounded-2xl min-h-[300px]">
           <h3 className="font-serif font-bold text-xl mb-4 flex items-center gap-2">
             <Globe size={20} className="opacity-70" /> {t.globalReach}
           </h3>
           <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.2)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: currentStyle.palette[4], fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                  <Radar
                    name="Usage"
                    dataKey="A"
                    stroke={currentStyle.palette[2]}
                    fill={currentStyle.palette[2]}
                    fillOpacity={0.6}
                  />
                  <Tooltip contentStyle={{ backgroundColor: currentStyle.palette[0], color: currentStyle.palette[4] }} />
                </RadarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* 5. Revenue/Cost (Stacked Bar) */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-1 min-h-[300px]">
           <h3 className="font-serif font-bold text-xl mb-4 flex items-center gap-2">
             <FileText size={20} className="opacity-70" /> {t.finance}
           </h3>
           <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockWeeklyData}>
                  <XAxis dataKey="name" tick={{ fill: currentStyle.palette[4], fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: currentStyle.palette[0], color: currentStyle.palette[4] }} />
                  <Legend />
                  <Bar dataKey="rev" stackId="a" fill={currentStyle.palette[3]} />
                  <Bar dataKey="cost" stackId="a" fill={currentStyle.palette[1]} />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
