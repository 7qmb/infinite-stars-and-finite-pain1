import { motion } from 'motion/react';
import { Star } from '../../App';
import { ArrowLeft } from 'lucide-react';

export default function ViewSavedLog({ 
  star, 
  log, 
  letter, 
  onClose 
}: { 
  star: Star, 
  log: {role: string, text: string}[], 
  letter: string, 
  onClose: () => void 
}) {
  return (
    <motion.div 
      className="absolute inset-0 z-20 flex flex-col p-6 md:p-12 lg:p-20 bg-black/40 backdrop-blur-md"
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

      <div className="max-w-3xl mx-auto w-full h-full flex flex-col gap-8 overflow-y-auto scrollbar-hide pt-12 pb-12">
        <div className="text-center mb-8">
          <svg width="48" height="48" viewBox="0 0 24 24" className="mx-auto mb-6 overflow-visible">
            <path 
              d="M12 0 C12 10 10 12 0 12 C10 12 12 14 12 24 C12 14 14 12 24 12 C14 12 12 10 12 0 Z" 
              fill="#ffffff"
              style={{ filter: `drop-shadow(0 0 12px rgba(255,255,255,0.5))` }}
            />
          </svg>
          <h2 className="text-2xl font-light tracking-widest text-white/90 uppercase">{star.name}</h2>
        </div>

        <div className="space-y-6 font-mono text-sm">
          {log.map((entry, i) => (
            <div key={i} className="mb-6">
              <div className="text-white/40 mb-2">{entry.role}:</div>
              <div className="text-white/90 pl-4 flex gap-3">
                <span className="text-white/30 mt-0.5">{'>'}</span>
                <span className="whitespace-pre-wrap leading-relaxed">{entry.text}</span>
              </div>
            </div>
          ))}
        </div>

        {letter && (
          <div className="mt-12 p-8 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-white/40 uppercase tracking-widest text-xs mb-6">Letter from the Void</h3>
            <p className="text-white/90 leading-relaxed font-serif italic text-lg">{letter}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
