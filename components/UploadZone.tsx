
import React from 'react';
import { Upload, Globe } from 'lucide-react';

interface UploadZoneProps {
  onUpload: (file: File) => void;
  targetLanguage: string;
  onLanguageChange: (lang: string) => void;
}

const LANGUAGES = ["Urdu", "English", "Hindi", "Arabic", "Spanish", "French", "Chinese"];

export const UploadZone: React.FC<UploadZoneProps> = ({ onUpload, targetLanguage, onLanguageChange }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-12 py-12">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black tracking-tighter text-white">SubGen <span className="text-indigo-500">AI</span></h2>
        <p className="text-slate-400 text-lg">Your all-in-one studio for AI-powered captions.</p>
      </div>

      <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 space-y-8 backdrop-blur-xl">
        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <Globe className="w-4 h-4" /> Target Subtitle Language
          </label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map(lang => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border
                  ${targetLanguage === lang ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div 
          onClick={() => document.getElementById('v-file')?.click()}
          className="border-2 border-dashed border-slate-700 rounded-2xl p-16 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-500/5 transition-all group"
        >
          <input type="file" id="v-file" hidden accept="video/mp4" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
          <Upload className="w-12 h-12 text-slate-600 mx-auto mb-4 group-hover:text-indigo-500 group-hover:scale-110 transition-all" />
          <p className="text-xl font-bold text-slate-300">Drop your video here</p>
          <p className="text-slate-500 mt-1">MP4 format supported</p>
        </div>
      </div>
    </div>
  );
};
