import { useState, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Volume2, VolumeX, Volume1, Sparkles } from 'lucide-react';
import StartScreen from './components/views/StartScreen';
import SpaceView from './components/views/SpaceView';
import StarTalk from './components/views/StarTalk';
import WhaleAnimation from './components/ui/WhaleAnimation';
import LetterView from './components/views/LetterView';
import Background from './components/ui/Background';
import SavedLogList from './components/views/SavedLogList';
import ViewSavedLog from './components/views/ViewSavedLog';
import MenuPopup from './components/ui/MenuPopup';
import PlasmaView from './components/views/PlasmaView';
import JournalView from './components/views/JournalView';
import { generateHealingQuote } from './lib/gemini';
import { startAmbientMusic, setMute } from './lib/audio';

import ReactPlayer from 'react-player';

export type Star = {
  id: string;
  name: string;
  color: string;
  glowColor: string;
  isWhite: boolean;
  x: number;
  y: number;
};

const INITIAL_STARS: Star[] = [
  { id: '1', name: 'Anger', color: '#ef4444', glowColor: 'rgba(239, 68, 68, 0.5)', isWhite: false, x: 25, y: 35 },
  { id: '2', name: 'Sorrow', color: '#3b82f6', glowColor: 'rgba(59, 130, 246, 0.5)', isWhite: false, x: 75, y: 45 },
  { id: '3', name: 'Clarity', color: '#10b981', glowColor: 'rgba(16, 185, 129, 0.5)', isWhite: false, x: 45, y: 75 },
  { id: '4', name: 'Nostalgia', color: '#f59e0b', glowColor: 'rgba(245, 158, 11, 0.5)', isWhite: false, x: 85, y: 85 },
  { id: '5', name: 'Joy', color: '#fcd34d', glowColor: 'rgba(252, 211, 77, 0.5)', isWhite: false, x: 15, y: 80 },
  { id: '6', name: 'Regret', color: '#a855f7', glowColor: 'rgba(168, 85, 247, 0.5)', isWhite: false, x: 55, y: 20 },
  {id : '7',name: 'Vent', color: '#992970', glowColor: 'rbga(196, 35, 97, 0.5)', isWhite: false, x: 40,y:50},
];

export default function App() {
  const [screen, setScreen] = useState<'start' | 'space' | 'talk' | 'departing' | 'letter' | 'log-list' | 'view-log' | 'journal' | 'plasma-init'>('start');
  const [currentView, setCurrentView] = useState<'space' | 'nebula' | 'plasma'>('space');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);
  const [volume, setVolume] = useState(0.3); // 0 to 1
  const [playerName, setPlayerName] = useState('');
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [previewSong, setPreviewSong] = useState<string | null>(null);
  const [stars, setStars] = useState<Star[]>(INITIAL_STARS);
  const [selectedStar, setSelectedStar] = useState<Star | null>(null);
  const [starLogs, setStarLogs] = useState<Record<string, { role: string; text: string }[]>>({});
  const [starLetters, setStarLetters] = useState<Record<string, string>>({});
  const [aiMessage, setAiMessage] = useState('');
  const [hasDeparted, setHasDeparted] = useState(false);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setMute(newVolume === 0);
  }, []);

  const handleImport = useCallback((data: any) => {
    if (data && data.stars) {
      setPlayerName(data.playerName || 'Traveler');
      setStars(data.stars);
      if (data.starLogs) setStarLogs(data.starLogs);
      if (data.starLetters) setStarLetters(data.starLetters);
      if (data.hasDeparted) setHasDeparted(data.hasDeparted);
      setScreen('space');
    } else {
      alert("Invalid log format.");
    }
  }, []);

  const handleExport = useCallback(() => {
    const data = {
      playerName,
      stars,
      starLogs,
      starLetters,
      hasDeparted
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'space-sailer-logs.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [playerName, stars, starLogs, starLetters, hasDeparted]);

  const handleBegin = useCallback((name: string) => {
    setPlayerName(name);
    setScreen('plasma-init');
  }, []);

  const handleSelectStar = useCallback((star: Star) => {
    if (star.isWhite) return; // Already healed
    setSelectedStar(star);
    setScreen('talk');
  }, []);

  const handleBackToSpace = useCallback((log: { role: string; text: string }[]) => {
    if (selectedStar) {
      setStarLogs(prev => ({ ...prev, [selectedStar.id]: log }));
    }
    setSelectedStar(null);
    setScreen('space');
  }, [selectedStar]);

  const handleDepart = useCallback(async (log: { role: string; text: string }[]) => {
    if (selectedStar) {
      setStarLogs(prev => ({ ...prev, [selectedStar.id]: log }));
    }
    setScreen('departing');
    
    // Generate AI quote in background
    const quote = await generateHealingQuote(log);
    setAiMessage(quote);
    if (selectedStar) {
      setStarLetters(prev => ({ ...prev, [selectedStar.id]: quote }));
    }

    // Update star to white
    if (selectedStar) {
      setStars(prev => prev.map(s => s.id === selectedStar.id ? { ...s, isWhite: true, color: '#ffffff', glowColor: 'rgba(255,255,255,0.3)' } : s));
    }

    setHasDeparted(true);

    // After whale animation (e.g., 6 seconds), show letter
    setTimeout(() => {
      setScreen('letter');
    }, 6000);
  }, [selectedStar]);

  const handleCloseLetter = useCallback(() => {
    setSelectedStar(null);
    setScreen('space');
  }, []);

  const isLogMode = screen === 'view-log' || screen === 'log-list' || screen === 'talk';

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white font-sans selection:bg-white/20">
      <Background screen={screen} currentView={currentView} />
      
      {screen !== 'start' && (
        <>
          {!isLogMode && (
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="absolute top-6 left-6 z-50 p-3 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-all duration-500 shadow-[0_0_15px_rgba(255,255,255,0.2)] bg-white/5"
              title="Menu"
            >
              <img src="/space.png" alt="Menu" className="w-6 h-6 object-contain" onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }} />
              <Sparkles size={24} strokeWidth={1.5} className="hidden" />
            </button>
          )}
          
          <div className="absolute right-6 top-6 z-50 flex flex-col items-center">
            <button 
              onClick={() => setIsVolumeOpen(!isVolumeOpen)}
              className="p-3 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-all duration-500 bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              title="Volume"
            >
              {volume === 0 ? <VolumeX size={24} strokeWidth={1.5} /> : volume < 0.5 ? <Volume1 size={24} strokeWidth={1.5} /> : <Volume2 size={24} strokeWidth={1.5} />}
            </button>
            <AnimatePresence>
              {isVolumeOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 10, height: 120 }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="bg-black/60 backdrop-blur-md rounded-full py-4 px-2 flex flex-col items-center shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/10 overflow-hidden mt-2"
                >
                  <div className="h-24 w-8 flex items-center justify-center">
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.01" 
                      value={volume} 
                      onChange={handleVolumeChange}
                      className="w-20 h-1 appearance-none bg-white/20 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full cursor-pointer -rotate-90 origin-center"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      <MenuPopup 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onSelect={(view) => {
          setCurrentView(view);
          setPreviewSong(null); // Clear preview when navigating away
        }} 
        onOpenJournal={() => {
          setScreen('journal');
          setPreviewSong(null);
        }}
        currentView={currentView} 
      />

      {(currentSong || previewSong) && (
        <div className="hidden">
          <ReactPlayer 
            src={previewSong || currentSong || undefined} 
            playing={true} 
            volume={volume}
            muted={volume === 0}
            loop={true}
            width="0"
            height="0"
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        {screen === 'start' && (
          <StartScreen key="start" onBegin={handleBegin} onImport={handleImport} />
        )}
        {screen === 'plasma-init' && (
          <PlasmaView 
            key="plasma-init" 
            volume={volume} 
            isInitial={true} 
            onPreviewSong={(url) => setPreviewSong(url)}
            onSelectSong={(url) => {
              setCurrentSong(url);
              setPreviewSong(null);
              setScreen('space');
            }} 
          />
        )}
        {screen === 'space' && currentView === 'space' && (
          <SpaceView 
            key="space" 
            stars={stars} 
            onSelectStar={handleSelectStar} 
            starLogs={starLogs}
            hasDeparted={hasDeparted}
            onOpenLogList={() => setScreen('log-list')}
          />
        )}
        {screen === 'space' && currentView === 'plasma' && (
          <PlasmaView 
            key="plasma" 
            volume={volume} 
            onPreviewSong={(url) => setPreviewSong(url)}
            onSelectSong={(url) => {
              setCurrentSong(url);
              setPreviewSong(null);
              setCurrentView('space');
            }}
          />
        )}
        {screen === 'space' && currentView === 'nebula' && (
          <motion.div 
            key="nebula"
            className="absolute inset-0 z-10 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-white/50 tracking-widest uppercase font-light">The Nebula (Coming Soon)</div>
          </motion.div>
        )}
        {screen === 'talk' && selectedStar && (
          <StarTalk 
            key="talk" 
            star={selectedStar} 
            playerName={playerName} 
            initialLog={starLogs[selectedStar.id] || []}
            onDepart={handleDepart} 
            onBack={handleBackToSpace}
          />
        )}
        {screen === 'departing' && (
          <WhaleAnimation key="departing" />
        )}
        {screen === 'letter' && (
          <LetterView key="letter" message={aiMessage} onClose={handleCloseLetter} />
        )}
        {screen === 'log-list' && (
          <SavedLogList 
            key="log-list"
            departedStars={stars.filter(s => s.isWhite)} 
            onClose={() => setScreen('space')}
            onSelectStar={(star) => {
              setSelectedStar(star);
              setScreen('view-log');
            }}
            onExport={handleExport}
          />
        )}
        {screen === 'view-log' && selectedStar && (
          <ViewSavedLog 
            key="view-log"
            star={selectedStar}
            log={starLogs[selectedStar.id] || []}
            letter={starLetters[selectedStar.id] || ''}
            onClose={() => setScreen('log-list')}
          />
        )}
        {screen === 'journal' && (
          <JournalView
            key="journal"
            playerName={playerName}
            onClose={() => setScreen('space')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
