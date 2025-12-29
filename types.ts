
export interface Subtitle {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
}

export type SubtitleAnimation = 'none' | 'fade' | 'slide-up' | 'zoom-in' | 'typing' | 'bounce' | 'blur' | 'swipe';

export interface SubtitleStyle {
  fontFamily: string;
  fontSize: number;
  textColor: string;
  backgroundColor: string;
  position: 'bottom' | 'top' | 'middle';
  outline: boolean;
  animation: SubtitleAnimation;
}

export interface HistoryItem {
  id: string;
  name: string;
  date: string;
  subtitles: Subtitle[];
  style: SubtitleStyle;
  videoUrl: string;
}

export interface User {
  email: string;
  name: string;
}

export interface AppState {
  user: User | null;
  videoFile: File | null;
  videoUrl: string | null;
  subtitles: Subtitle[];
  style: SubtitleStyle;
  isProcessing: boolean;
  statusMessage: string;
  targetLanguage: string;
  trimRange: [number, number];
  history: HistoryItem[];
  enhancements: {
    noiseRemoval: boolean;
    qualityBoost: boolean;
  };
}
