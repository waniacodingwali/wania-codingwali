
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { VideoWorkspace } from './components/VideoWorkspace';
import { HistorySidebar } from './components/HistorySidebar';
import { AuthModal } from './components/AuthModal';
import { AppState, Subtitle, SubtitleStyle, HistoryItem, User } from './types';
import { generateSubtitles } from './services/geminiService';
import { AlertCircle, Loader2 } from 'lucide-react';

const DEFAULT_STYLE: SubtitleStyle = {
  fontFamily: "'Inter', sans-serif",
  fontSize: 28,
  textColor: '#ffffff',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  position: 'bottom',
  outline: true,
  animation: 'fade',
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    user: null,
    videoFile: null,
    videoUrl: null,
    subtitles: [],
    style: DEFAULT_STYLE,
    isProcessing: false,
    statusMessage: '',
    targetLanguage: 'Urdu',
    trimRange: [0, 0],
    history: JSON.parse(localStorage.getItem('subgen_history') || '[]'),
    enhancements: {
      noiseRemoval: true,
      qualityBoost: true
    }
  });

  const [error, setError] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('subgen_history', JSON.stringify(state.history));
  }, [state.history]);

  const handleUpload = async (file: File) => {
    const url = URL.createObjectURL(file);
    setState(prev => ({
      ...prev,
      videoFile: file,
      videoUrl: url,
      isProcessing: true,
      statusMessage: 'Scanning audio track...',
    }));
    setError(null);

    try {
      setState(prev => ({ ...prev, statusMessage: `AI is generating ${state.targetLanguage} subtitles...` }));
      const generatedSubtitles = await generateSubtitles(file, state.targetLanguage);
      
      setState(prev => {
        const newHistory: HistoryItem = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          date: new Date().toLocaleDateString(),
          subtitles: generatedSubtitles,
          style: prev.style,
          videoUrl: url
        };
        return {
          ...prev,
          subtitles: generatedSubtitles,
          isProcessing: false,
          history: [newHistory, ...prev.history].slice(0, 10),
          statusMessage: 'Ready!',
        };
      });
    } catch (err: any) {
      setError(err.message || 'Processing failed.');
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const handleLogin = (user: User) => {
    setState(prev => ({ ...prev, user }));
    setIsAuthOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-200 selection:bg-indigo-500/30">
      <Header user={state.user} onOpenAuth={() => setIsAuthOpen(true)} onLogout={() => setState(prev => ({...prev, user: null}))} />
      
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        <HistorySidebar 
          history={state.history} 
          onSelect={(item) => setState(prev => ({ ...prev, ...item }))} 
        />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-[1600px] mx-auto p-6 lg:p-10">
            {error && (
              <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-200 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-4">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {!state.videoUrl && !state.isProcessing ? (
              <UploadZone 
                onUpload={handleUpload} 
                targetLanguage={state.targetLanguage}
                onLanguageChange={(l) => setState(prev => ({...prev, targetLanguage: l}))}
              />
            ) : state.isProcessing ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white tracking-tight">Processing Media</h2>
                  <p className="text-slate-400 font-medium">{state.statusMessage}</p>
                </div>
              </div>
            ) : (
              <VideoWorkspace 
                state={state} 
                onUpdateSubtitles={(s) => setState(prev => ({ ...prev, subtitles: s }))}
                onUpdateStyle={(s) => setState(prev => ({ ...prev, style: s }))}
                onUpdateEnhancements={(e) => setState(prev => ({ ...prev, enhancements: e }))}
                onReset={() => setState(prev => ({...prev, videoUrl: null, videoFile: null, subtitles: []}))}
              />
            )}
          </div>
        </main>
      </div>

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLogin={handleLogin} 
      />
    </div>
  );
};

export default App;
