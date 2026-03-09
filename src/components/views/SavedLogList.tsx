import { motion } from 'motion/react';
import { Star } from '../../App';
import { ArrowLeft, Download } from 'lucide-react';

export default function SavedLogList({ 
  departedStars, 
  onClose,
  onSelectStar,
  onExport
}: { 
  departedStars: Star[], 
  onClose: () => void,
  onSelectStar: (star: Star) => void,
  onExport: () => void
}) {
  return (
    <motion.div 
      className="absolute inset-0 z-10 p-20 pt-32"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button 
        onClick={onClose}
        className="absolute top-6 left-6 p-3 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
      >
        <ArrowLeft size={24} strokeWidth={1.5} />
      </button>

      <button 
        onClick={onExport}
        className="absolute top-24 right-6 p-3 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
        title="Export Logs"
      >
        <Download size={24} strokeWidth={1.5} />
      </button>

      <div className="flex flex-wrap gap-16 content-start max-w-5xl mx-auto">
        {departedStars.map((star, i) => (
          <motion.div
            key={star.id}
            className="relative cursor-pointer flex flex-col items-center justify-center group w-24 h-24"
            onClick={() => onSelectStar(star)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" className="overflow-visible transition-transform duration-700 group-hover:scale-125">
              <path 
                d="M12 0 C12 10 10 12 0 12 C10 12 12 14 12 24 C12 14 14 12 24 12 C14 12 12 10 12 0 Z" 
                fill="#ffffff"
                style={{ filter: `drop-shadow(0 0 8px rgba(255,255,255,0.5)) drop-shadow(0 0 16px rgba(255,255,255,0.3))` }}
              />
            </svg>
            <span className="absolute -bottom-8 text-xs tracking-widest text-white/40 group-hover:text-white/80 transition-colors duration-300 uppercase font-light whitespace-nowrap">
              {star.name}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
