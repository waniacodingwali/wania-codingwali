
import React from 'react';
import { Subtitle } from '../types';
import { Trash2, Plus, Clock } from 'lucide-react';

interface SubtitleEditorProps {
  subtitles: Subtitle[];
  onUpdate: (subs: Subtitle[]) => void;
  currentTime: number;
  onSeek: (time: number) => void;
}

export const SubtitleEditor: React.FC<SubtitleEditorProps> = ({ 
  subtitles, 
  onUpdate, 
  currentTime, 
  onSeek 
}) => {
  const handleTextChange = (id: string, text: string) => {
    onUpdate(subtitles.map(s => s.id === id ? { ...s, text } : s));
  };

  const handleTimeChange = (id: string, field: 'startTime' | 'endTime', value: string) => {
    const numValue = parseFloat(value) || 0;
    onUpdate(subtitles.map(s => s.id === id ? { ...s, [field]: numValue } : s));
  };

  const removeSubtitle = (id: string) => {
    onUpdate(subtitles.filter(s => s.id !== id));
  };

  const addSubtitle = () => {
    const newSub: Subtitle = {
      id: Math.random().toString(36).substr(2, 9),
      startTime: currentTime,
      endTime: currentTime + 2,
      text: 'نیا سب ٹائٹل یہاں درج کریں'
    };
    onUpdate([...subtitles, newSub].sort((a, b) => a.startTime - b.startTime));
  };

  return (
    <div className="space-y-4">
      <button 
        onClick={addSubtitle}
        className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-indigo-400 hover:text-indigo-600 flex items-center justify-center gap-2 transition-all font-medium"
      >
        <Plus className="w-5 h-5" /> Add New Subtitle
      </button>

      <div className="space-y-4">
        {subtitles.map((sub, index) => {
          const isActive = currentTime >= sub.startTime && currentTime <= sub.endTime;
          return (
            <div 
              key={sub.id} 
              className={`p-4 rounded-xl border transition-all duration-300 relative group
                ${isActive ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-500/10' : 'bg-white border-slate-100 hover:border-slate-200'}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">#{index + 1}</span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                    <Clock className="w-3 h-3" />
                    <input 
                      type="number" 
                      step="0.1"
                      value={sub.startTime}
                      onChange={(e) => handleTimeChange(sub.id, 'startTime', e.target.value)}
                      className="bg-transparent w-14 focus:outline-none focus:text-indigo-600"
                    />
                    <span>→</span>
                    <input 
                      type="number" 
                      step="0.1"
                      value={sub.endTime}
                      onChange={(e) => handleTimeChange(sub.id, 'endTime', e.target.value)}
                      className="bg-transparent w-14 focus:outline-none focus:text-indigo-600"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onSeek(sub.startTime)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600"
                    title="Seek to start"
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => removeSubtitle(sub.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <textarea
                value={sub.text}
                onChange={(e) => handleTextChange(sub.id, e.target.value)}
                className="w-full bg-slate-50/50 urdu-text text-xl p-3 border border-transparent rounded-lg focus:border-indigo-300 focus:bg-white focus:outline-none resize-none transition-all leading-relaxed"
                rows={2}
                placeholder="سب ٹائٹل درج کریں..."
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
