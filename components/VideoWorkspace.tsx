
import React, { useState, useRef, useEffect } from 'react';
import { AppState, Subtitle, SubtitleStyle } from '../types';
import { SubtitleEditor } from './SubtitleEditor';
import { StyleControls } from './StyleControls';
import { Play, Pause, Wand2, Scissors, Save, Loader2, RotateCcw, Share2, Sparkles } from 'lucide-react';
import { exportVideoWithSubtitles } from '../utils/videoExporter';

interface VideoWorkspaceProps {
  state: AppState;
  onUpdateSubtitles: (subs: Subtitle[]) => void;
  onUpdateStyle: (style: SubtitleStyle) => void;
  onUpdateEnhancements: (enhancements: any) => void;
  onReset: () => void;
}

export const VideoWorkspace: React.FC<VideoWorkspaceProps> = ({ 
  state, 
  onUpdateSubtitles, 
  onUpdateStyle,
  onUpdateEnhancements,
  onReset 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTab, setActiveTab] = useState<'edit' | 'style' | 'ai'>('edit');
  const [isExporting, setIsExporting] = useState(false);

  const currentSubtitle = state.subtitles.find(
    s => currentTime >= s.startTime && currentTime <= s.endTime
  );

  const getAnimationClass = (animation: string) => {
    switch (animation) {
      case 'typing': return '';
      case 'blur': return 'animate-blur';
      case 'bounce': return 'animate-bounce-sub';
      case 'swipe': return 'animate-swipe';
      case 'fade': return 'animate-reveal';
      case 'zoom-in': return 'animate-in zoom-in-95 duration-200';
      case 'slide-up': return 'animate-in slide-in-from-bottom-4 duration-200';
      default: return 'animate-in fade-in duration-150';
    }
  };

  const getTypingText = (sub: Subtitle) => {
    if (state.style.animation !== 'typing') return sub.text;
    const elapsed = currentTime - sub.startTime;
    const duration = sub.endTime - sub.startTime;
    const revealPercent = Math.min(1, elapsed / (duration * 0.6));
    const charCount = Math.floor(sub.text.length * revealPercent);
    return sub.text.substring(0, charCount);
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const update = () => setCurrentTime(v.currentTime);
    v.addEventListener('timeupdate', update);
    return () => v.removeEventListener('timeupdate', update);
  }, []);

  const handleExport = async () => {
    if (!videoRef.current || !state.videoFile) return;
    setIsExporting(true);
    try {
      await exportVideoWithSubtitles(videoRef.current, state.subtitles, state.style);
    } catch (e) {
      console.error(e);
      alert("Studio encountered an export error. Ensure you are using a modern browser.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="xl:col-span-8 space-y-6">
        <div className="relative bg-[#020617] rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] ring-1 ring-white/5 aspect-video group">
          <video
            ref={videoRef}
            src={state.videoUrl || ''}
            className={`w-full h-full object-contain transition-all duration-700 z-0
              ${state.enhancements.qualityBoost ? 'brightness-[1.04] contrast-[1.1] saturate-[1.08]' : ''}`}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          
          {currentSubtitle && (
            <div className={`absolute inset-0 z-10 pointer-events-none flex flex-col justify-center px-12 transition-all duration-300
              ${state.style.position === 'top' ? 'justify-start pt-[10%]' : state.style.position === 'middle' ? 'justify-center' : 'justify-end pb-[12%]'}`}>
              <div className="flex justify-center">
                <div 
                  key={currentSubtitle.id}
                  className={`p-4 rounded-2xl text-center backdrop-blur-md shadow-2xl transition-all
                    ${getAnimationClass(state.style.animation)}
                    ${state.style.fontFamily === "'Noto Nastaliq Urdu', serif" ? 'urdu-text' : ''}`}
                  style={{
                    fontFamily: state.style.fontFamily,
                    fontSize: `${state.fontSize || state.style.fontSize}px`,
                    color: state.style.textColor,
                    backgroundColor: state.style.backgroundColor,
                    textShadow: state.style.outline ? '0 4px 12px rgba(0,0,0,0.6)' : 'none'
                  }}
                >
                  {getTypingText(currentSubtitle)}
                  {state.style.animation === 'typing' && (currentTime - currentSubtitle.startTime < (currentSubtitle.endTime - currentSubtitle.startTime) * 0.6) && (
                    <span className="inline-block w-[2px] h-[1.1em] ml-0.5 bg-current animate-[typing-cursor_1s_infinite] align-middle opacity-50"></span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
             <div className="flex items-center gap-6">
                <button 
                  onClick={() => videoRef.current?.paused ? videoRef.current.play() : videoRef.current?.pause()} 
                  className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-lg transition-all active:scale-90 shadow-xl"
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                </button>
                <div className="flex-1 space-y-2">
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.8)]" style={{ width: `${(currentTime / (videoRef.current?.duration || 1)) * 100}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] font-black tracking-[0.2em] uppercase text-slate-400">
                    <span>{Math.floor(currentTime)}:00</span>
                    <span>{Math.floor(videoRef.current?.duration || 0)}:00</span>
                  </div>
                </div>
             </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 p-5 glass-panel rounded-[2rem] border border-slate-800/50 shadow-2xl">
          <div className="flex gap-2">
            <button 
              onClick={onReset}
              className="px-6 py-2.5 bg-slate-800/40 hover:bg-slate-700/60 text-slate-400 rounded-2xl text-[10px] font-black tracking-widest uppercase border border-slate-700/50 btn-hover-effect"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-2 inline" /> Reset Project
            </button>
          </div>
          <div className="flex gap-3">
             <button className="px-6 py-2.5 bg-slate-800/40 hover:bg-slate-700/60 text-slate-400 rounded-2xl text-[10px] font-black tracking-widest uppercase border border-slate-700/50 btn-hover-effect">
                <Share2 className="w-3.5 h-3.5 mr-2 inline" /> Share
             </button>
             <button 
              disabled={isExporting}
              onClick={handleExport}
              className="px-10 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase flex items-center gap-2 hover:shadow-[0_15px_35px_-10px_rgba(79,70,229,0.8)] disabled:opacity-50 transition-all btn-hover-effect"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isExporting ? 'Burning Subtitles...' : 'Export Studio Video'}
            </button>
          </div>
        </div>
      </div>

      <div className="xl:col-span-4 glass-panel rounded-[2.5rem] border border-white/5 flex flex-col h-[820px] shadow-3xl overflow-hidden ring-1 ring-slate-800/50">
        <div className="flex p-3 gap-2 bg-black/30">
          {(['edit', 'style', 'ai'] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all
                ${activeTab === t ? 'text-white bg-indigo-600 shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/40'}`}
            >
              {t === 'ai' ? <span className="flex items-center justify-center gap-2">Intelligence</span> : t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 key={activeTab}">
            {activeTab === 'edit' && <SubtitleEditor subtitles={state.subtitles} onUpdate={onUpdateSubtitles} currentTime={currentTime} onSeek={(t) => { if(videoRef.current) videoRef.current.currentTime = t }} />}
            {activeTab === 'style' && <StyleControls style={state.style} onUpdate={onUpdateStyle} />}
            {activeTab === 'ai' && (
              <div className="space-y-8">
                 <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5" /> Core Engine
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">AI Neural processing active. Enhancing audio and video clarity in real-time.</p>
                 </div>

                 <div className="space-y-3">
                   <Toggle label="Speech Clarity Boost" active={state.enhancements.noiseRemoval} onClick={() => onUpdateEnhancements({...state.enhancements, noiseRemoval: !state.enhancements.noiseRemoval})} />
                   <Toggle label="Visual Sharpness Engine" active={state.enhancements.qualityBoost} onClick={() => onUpdateEnhancements({...state.enhancements, qualityBoost: !state.enhancements.qualityBoost})} />
                 </div>

                 <div className="p-8 bg-indigo-600/5 rounded-[2rem] border border-indigo-500/10 space-y-4 shadow-inner">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 shadow-lg">
                        <Scissors className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-black text-slate-200 uppercase tracking-widest">Trim Control</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium italic">
                      Export durations can be limited by adjusting the markers on the timeline. Future versions will include visual trim handles.
                    </p>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Toggle = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center justify-between p-6 rounded-[1.8rem] border transition-all duration-300 group
      ${active ? 'bg-indigo-600/10 border-indigo-500/50 shadow-[0_0_40px_-10px_rgba(79,70,229,0.15)]' : 'bg-slate-800/20 border-slate-700/50 hover:border-slate-600'}`}
  >
    <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${active ? 'text-white' : 'text-slate-500 group-hover:text-slate-400'}`}>{label}</span>
    <div className={`w-12 h-6 rounded-full relative transition-all duration-300 ${active ? 'bg-indigo-500 shadow-lg shadow-indigo-600/50' : 'bg-slate-700'}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-md ${active ? 'left-7' : 'left-1'}`} />
    </div>
  </button>
);
