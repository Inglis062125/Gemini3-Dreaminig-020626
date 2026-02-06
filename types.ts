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
  | 'smart-redaction';

export interface ChartDataPoint {
  name: string;
  value: number;
  prediction?: number;
  sentiment?: number;
}
