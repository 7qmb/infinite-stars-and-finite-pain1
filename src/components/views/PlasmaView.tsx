import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import ReactPlayer from 'react-player';

type Song = {
  id: string;
  title: string;
  url: string;
};

// Mock backend data
const SONGS: Song[] = [
  { id: '1', title: 'Orange Hues', url: 'https://youtu.be/tk9VD3jUoDY?si=FK13vB_XUYHvkzUf' },
  { id: '2', title: 'just a cat', url: 'https://youtu.be/yNXjlXhehpA?si=LKVB_V6SeNGm0hTn' },
  { id: '3', title: 'out of place', url: 'https://youtu.be/9ytiyD_QA2s?si=SfJpVJE0BlxOlLpu' },
  { id: '4', title: 'Dial, him', url: 'https://youtu.be/1ZYbU82GVz4' },
  { id: '5', title: 'Kiss me', url: 'https://youtu.be/K2tbQ_g2VbQ?si=cJGvB0inv2lXIpQi' },
  { id: '6', title: 'Wind', url: 'https://youtu.be/8kQiNKuPRRI?si=Yqahx8GymShuXdXc'},
  { id: '7', title: 'Pure Imagination', url: 'https://youtu.be/s0sYF_EFv_s?si=g7eS7OORSmY1L1DM'},
  { id: '8', title: 'Moon, tell me if I could', url: 'https://youtu.be/Qy9LTRu89FA?si=JPKilDa3C8Gryzt3'},
  { id: '9', title: 'gentle, blocky world', url: 'https://youtu.be/cqbomS1STFY?si=kfr5Sd6369SzhsTU'},
];

export default function PlasmaView({ volume, isInitial, onSelectSong, onPreviewSong }: { volume: number, isInitial?: boolean, onSelectSong?: (songUrl: string) => void, onPreviewSong?: (songUrl: string) => void }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (onPreviewSong) {
      onPreviewSong(SONGS[selectedIndex].url);
    }
  }, [selectedIndex, onPreviewSong]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        setSelectedIndex((prev) => (prev + 1) % SONGS.length);
      } else if (e.key === 'ArrowUp') {
        setSelectedIndex((prev) => (prev - 1 + SONGS.length) % SONGS.length);
      } else if (e.key === 'Enter') {
        if (onSelectSong) onSelectSong(SONGS[selectedIndex].url);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, onSelectSong]);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0) {
      setSelectedIndex((prev) => (prev + 1) % SONGS.length);
    } else if (e.deltaY < 0) {
      setSelectedIndex((prev) => (prev - 1 + SONGS.length) % SONGS.length);
    }
  };

  const handleClick = (song: Song) => {
    if (onSelectSong) {
      onSelectSong(song.url);
    }
  };

  return (
    <motion.div 
      className="absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      {isInitial && (
        <motion.div 
          className="absolute top-20 z-30 text-center px-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1.5 }}
        >
          <h2 className="text-xl md:text-2xl font-light tracking-widest text-white/70 uppercase">
            what kind of music should accompany you in the journey?
          </h2>
        </motion.div>
      )}

      {/* Geometrical Glowing Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <g filter="url(#glow)" stroke="rgba(255,255,255,0.4)" fill="none" strokeWidth="2">
            {/* Topographical lines with fluid animation */}
            <path d="M-100,100 Q200,300 500,50 T1200,200">
              <animate attributeName="d" values="M-100,100 Q200,300 500,50 T1200,200; M-100,120 Q250,280 550,70 T1200,220; M-100,100 Q200,300 500,50 T1200,200" dur="8s" repeatCount="indefinite" />
            </path>
            <path d="M-100,150 Q200,350 500,100 T1200,250">
              <animate attributeName="d" values="M-100,150 Q200,350 500,100 T1200,250; M-100,170 Q250,330 550,120 T1200,270; M-100,150 Q200,350 500,100 T1200,250" dur="9s" repeatCount="indefinite" />
            </path>
            <path d="M-100,200 Q200,400 500,150 T1200,300">
              <animate attributeName="d" values="M-100,200 Q200,400 500,150 T1200,300; M-100,220 Q250,380 550,170 T1200,320; M-100,200 Q200,400 500,150 T1200,300" dur="10s" repeatCount="indefinite" />
            </path>
            <path d="M-100,250 Q200,450 500,200 T1200,350">
              <animate attributeName="d" values="M-100,250 Q200,450 500,200 T1200,350; M-100,270 Q250,430 550,220 T1200,370; M-100,250 Q200,450 500,200 T1200,350" dur="11s" repeatCount="indefinite" />
            </path>
            
            <path d="M-100,600 Q300,800 600,500 T1200,700">
              <animate attributeName="d" values="M-100,600 Q300,800 600,500 T1200,700; M-100,620 Q350,780 650,520 T1200,720; M-100,600 Q300,800 600,500 T1200,700" dur="12s" repeatCount="indefinite" />
            </path>
            <path d="M-100,650 Q300,850 600,550 T1200,750">
              <animate attributeName="d" values="M-100,650 Q300,850 600,550 T1200,750; M-100,670 Q350,830 650,570 T1200,770; M-100,650 Q300,850 600,550 T1200,750" dur="10s" repeatCount="indefinite" />
            </path>
            <path d="M-100,700 Q300,900 600,600 T1200,800">
              <animate attributeName="d" values="M-100,700 Q300,900 600,600 T1200,800; M-100,720 Q350,880 650,620 T1200,820; M-100,700 Q300,900 600,600 T1200,800" dur="11s" repeatCount="indefinite" />
            </path>
            
            {/* Concentric circles and dots */}
            <circle cx="75%" cy="25%" r="150" strokeDasharray="10 20" style={{ transformOrigin: '75% 25%', animation: 'spin 20s linear infinite' }} />
            <circle cx="75%" cy="25%" r="180" strokeDasharray="2 10" strokeWidth="4" style={{ transformOrigin: '75% 25%', animation: 'spin 25s linear infinite reverse' }} />
            <circle cx="75%" cy="25%" r="220" />
            <circle cx="75%" cy="25%" r="260" strokeDasharray="15 30" style={{ transformOrigin: '75% 25%', animation: 'spin 30s linear infinite' }} />
            
            <circle cx="20%" cy="80%" r="120" />
            <circle cx="20%" cy="80%" r="160" strokeDasharray="4 12" style={{ transformOrigin: '20% 80%', animation: 'spin 15s linear infinite reverse' }} />
            <circle cx="20%" cy="80%" r="200" strokeDasharray="1 15" strokeWidth="3" style={{ transformOrigin: '20% 80%', animation: 'spin 20s linear infinite' }} />
            
            <circle cx="50%" cy="50%" r="400" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <circle cx="50%" cy="50%" r="500" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5 20" style={{ transformOrigin: '50% 50%', animation: 'spin 40s linear infinite' }} />
          </g>
        </svg>
      </div>

      {/* Song List */}
      <div 
        className="relative z-20 h-[60vh] w-full max-w-md flex flex-col items-center justify-center mask-image-linear-gradient"
        onWheel={handleWheel}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {SONGS.map((song, index) => {
            let offset = index - selectedIndex;
            if (offset > SONGS.length / 2) offset -= SONGS.length;
            if (offset < -SONGS.length / 2) offset += SONGS.length;
            
            const isSelected = offset === 0;
            const isVisible = Math.abs(offset) <= 2;

            if (!isVisible) return null;

            return (
              <motion.div 
                key={song.id}
                className="absolute cursor-pointer py-4 px-8 group w-full text-center"
                onClick={() => isSelected ? handleClick(song) : setSelectedIndex(index)}
                animate={{ 
                  opacity: isSelected ? 1 : 1 - Math.abs(offset) * 0.4, 
                  y: offset * 70,
                  scale: isSelected ? 1.1 : 1 - Math.abs(offset) * 0.1,
                  zIndex: isSelected ? 10 : 5 - Math.abs(offset)
                }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  className={`text-2xl md:text-4xl font-light tracking-widest transition-all duration-500 ${
                    isSelected ? 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'text-white/30'
                  }`}
                >
                  {isSelected && <span className="absolute left-10 text-white/80">{'>'}</span>}
                  {song.title}
                  {isSelected && <span className="absolute right-10 text-white/80">{'<'}</span>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      <style>{`
        .mask-image-linear-gradient {
          mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
}
