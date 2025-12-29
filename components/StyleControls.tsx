
import React from 'react';
import { SubtitleStyle, SubtitleAnimation } from '../types';
import { Type, Palette, Layout, Sparkles, Keyboard, Zap, Ghost, Eye } from 'lucide-react';

interface StyleControlsProps {
  style: SubtitleStyle;
  onUpdate: (style: SubtitleStyle) => void;
}

const FONTS = [
  { name: 'Modern Sans', value: "'Inter', sans-serif" },
  { name: 'Urdu Nastaliq', value: "'Noto Nastaliq Urdu', serif" },
  { name: 'Classic Serif', value: "'Playfair Display', serif" },
  { name: 'Tech Mono', value: "'Fira Code', monospace" },
];

const ANIMATIONS: { label: string, value: SubtitleAnimation, icon: React.ReactNode }[] = [
  { label: 'Static', value: 'none', icon: <Sparkles className="w-3 h-3" /> },
  { label: 'Fade In', value: 'fade', icon: <Ghost className="w-3 h-3" /> },
  { label: 'Slide Up', value: 'slide-up', icon: <Zap className="w-3 h-3" /> },
  { label: 'Zoom Pop', value: 'zoom-in', icon: <Sparkles className="w-3 h-3" /> },
  { label: 'Typing', value: 'typing', icon: <Keyboard className="w-3 h-3" /> },
  { label: 'Bounce', value: 'bounce', icon: <Zap className="w-3 h-3 rotate-90" /> },
  { label: 'Blur Soft', value: 'blur', icon: <Ghost className="w-3 h-3 opacity-50" /> },
  { label: 'Swipe', value: 'swipe', icon: <Eye className="w-3 h-3" /> },
];

export const StyleControls: React.FC<StyleControlsProps> = ({ style, onUpdate }) => {
  const handleChange = (field: keyof SubtitleStyle, value: any) => {
    onUpdate({ ...style, [field]: value });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Animation Section */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400 flex items-center gap-2">
          Motion Engine
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {ANIMATIONS.map(anim => (
            <button
              key={anim.value}
              onClick={() => handleChange('animation', anim.value)}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all btn-hover-effect
                ${style.animation === anim.value 
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30' 
                  : 'bg-slate-800/40 border-slate-700/50 text-slate-500 hover:border-slate-600'}`}
            >
              {anim.icon}
              {anim.label}
            </button>
          ))}
        </div>
      </section>

      {/* Font Section */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400 flex items-center gap-2">
          Typography
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {FONTS.map(f => (
            <button
              key={f.value}
              onClick={() => handleChange('fontFamily', f.value)}
              className={`px-3 py-2.5 rounded-xl text-[11px] font-bold border transition-all text-center btn-hover-effect
                ${style.fontFamily === f.value 
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
                  : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600'}`}
              style={{ fontFamily: f.value }}
            >
              {f.name}
            </button>
          ))}
        </div>

        <div className="space-y-3 px-1">
          <div className="flex justify-between items-center mb-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Display Scale</label>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">{style.fontSize}px</span>
          </div>
          <input 
            type="range" min="14" max="72" value={style.fontSize}
            onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">Branding</h3>
        <div className="grid grid-cols-2 gap-4">
          <ColorPicker label="Text Fill" value={style.textColor} onChange={(v) => handleChange('textColor', v)} />
          <ColorPicker label="Plate Fill" value={style.backgroundColor} onChange={(v) => handleChange('backgroundColor', v)} />
        </div>
        <button 
          onClick={() => handleChange('outline', !style.outline)}
          className={`w-full py-2.5 rounded-xl text-[11px] font-bold border transition-all btn-hover-effect
            ${style.outline ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-slate-800/40 border-slate-700/50 text-slate-500'}`}
        >
          {style.outline ? 'Enable Shadow: ON' : 'Enable Shadow: OFF'}
        </button>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">Vertical Axis</h3>
        <div className="flex gap-2 p-1 bg-slate-900 rounded-2xl border border-slate-800/50">
          {(['top', 'middle', 'bottom'] as const).map(p => (
            <button
              key={p}
              onClick={() => handleChange('position', p)}
              className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase transition-all
                ${style.position === p ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

const ColorPicker = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
    <div className="flex items-center gap-3 p-2 bg-slate-900/40 rounded-xl border border-slate-800/50 group hover:border-slate-700 transition-colors">
      <input 
        type="color" 
        value={value.startsWith('rgba') ? '#000000' : value} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-7 h-7 rounded-lg bg-transparent border-none cursor-pointer overflow-hidden shadow-inner" 
      />
      <span className="text-[10px] font-mono text-slate-500 uppercase">{value.slice(0, 7)}</span>
    </div>
  </div>
);
