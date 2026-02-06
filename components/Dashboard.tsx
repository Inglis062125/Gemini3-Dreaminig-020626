import React from 'react';
import { PainterStyle, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FileText, Clock, Activity } from 'lucide-react';

interface DashboardProps {
  style: PainterStyle;
  lang: Language;
}

const mockData = [
  { name: 'Mon', docs: 45 },
  { name: 'Tue', docs: 52 },
  { name: 'Wed', docs: 38 },
  { name: 'Thu', docs: 65 },
  { name: 'Fri', docs: 48 },
  { name: 'Sat', docs: 20 },
  { name: 'Sun', docs: 15 },
];

const Dashboard: React.FC<DashboardProps> = ({ style: currentStyle, lang }) => {
  const t = TRANSLATIONS[lang];

  const StatCard = ({ icon, label, value, sub }: any) => (
    <div className="glass-panel p-6 rounded-2xl hover:scale-105 transition-transform duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-white/10">
          {React.cloneElement(icon, { color: currentStyle.palette[1] })}
        </div>
        <span className="text-xs font-bold uppercase tracking-wider opacity-60 bg-white/10 px-2 py-1 rounded">
          {sub}
        </span>
      </div>
      <h3 className="text-3xl font-serif font-bold mb-1">{value}</h3>
      <p className="text-sm opacity-70">{label}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <StatCard 
        icon={<FileText />} 
        label={t.activeDocs} 
        value="892" 
        sub="+12%" 
      />
      <StatCard 
        icon={<Clock />} 
        label={t.procTime} 
        value="1.2s" 
        sub="-5%" 
      />
      <StatCard 
        icon={<Activity />} 
        label={t.sysHealth} 
        value="99.9%" 
        sub="Healthy" 
      />

      {/* Mini Chart */}
      <div className="glass-panel p-6 rounded-2xl col-span-1 md:col-span-3 lg:col-span-3">
         <h3 className="font-serif font-bold text-xl mb-6">Weekly Throughput</h3>
         <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: currentStyle.palette[4], opacity: 0.7 }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.1)'}}
                  contentStyle={{ 
                    backgroundColor: currentStyle.palette[0], 
                    border: `1px solid ${currentStyle.palette[2]}`,
                    borderRadius: '8px',
                    color: currentStyle.palette[4]
                  }}
                />
                <Bar dataKey="docs" radius={[4, 4, 0, 0]}>
                  {mockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={currentStyle.palette[index % 3 + 1]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
