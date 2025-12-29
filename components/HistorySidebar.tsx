
import React from 'react';
import { HistoryItem } from '../types';
import { Clock, PlayCircle } from 'lucide-react';

interface HistorySidebarProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onSelect }) => {
  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col hidden xl:flex">
      <div className="p-4 border-b border-slate-800 flex items-center gap-2 text-slate-400">
        <Clock className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-widest">Recent Projects</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {history.length === 0 ? (
          <p className="text-sm text-slate-600 text-center py-8">No history yet</p>
        ) : (
          history.map(item => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl text-left hover:border-indigo-500 transition-all group"
            >
              <div className="flex items-center gap-3 mb-1">
                <PlayCircle className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-semibold truncate text-slate-200">{item.name}</p>
              </div>
              <p className="text-[10px] text-slate-500">{item.date} • {item.subtitles.length} lines</p>
            </button>
          ))
        )}
      </div>
    </aside>
  );
};
