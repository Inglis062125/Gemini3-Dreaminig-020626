export type Language = 'en' | 'zh-TW';

export interface PainterStyle {
  id: string;
  name: string;
  palette: string[]; // [Background, Primary, Secondary, Accent, Text]
  vibe: string;
  description: string;
}

export interface AIState {
  isLoading: boolean;
  result: string | null;
  data: any | null; // For charts
  error: string | null;
}

export type AIFeatureType = 
  | 'dream-summarizer' 
  | 'sentiment-symphony' 
  | 'predictive-sculpture' 
  | 'polyglot-synthesis' 
  | 'smart-redaction'
  | 'muse-whisper'      // New: Creative Ideation
  | 'strategic-oracle'  // New: SWOT Analysis
  | 'tone-alchemist'    // New: Style Rewrite
  | 'ethical-mirror'    // New: Bias Check
  | 'time-capsule';     // New: Historical Context

export interface ChartDataPoint {
  name: string;
  value: number;
  prediction?: number;
  sentiment?: number;
  fullMark?: number; // For Radar
  fill?: string;
}

export interface AppSettings {
  creativityLevel: number; // 0-100
  animationEnabled: boolean;
  soundEnabled: boolean;
  dataDensity: 'low' | 'high';
}
