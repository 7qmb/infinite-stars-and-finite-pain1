import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { generateHealingQuote } from '../../lib/gemini';

export default function JournalView({ onClose, playerName }: { onClose: () => void, playerName: string }) {
  const [entry, setEntry] = useState('');
  const [advice, setAdvice] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGetAdvice = async () => {
    if (!entry.trim()) return;
    setIsGenerating(true);
    try {
      const quote = await generateHealingQuote([{ role: 'user', text: entry }]);
      setAdvice(quote);
    } catch (error) {
      setAdvice("Sometimes, the stars are quiet. Take a deep breath and try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 bg-black/80 backdrop-blur-md"
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

      <div className="w-full max-w-2xl flex flex-col gap-8 h-full py-20">
        <h2 className="text-3xl font-light tracking-widest text-white/80 uppercase text-center">
          {playerName}'s Journal
        </h2>

        <div className="flex-1 flex flex-col gap-4">
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="Write your thoughts here... The void listens without judgment."
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 text-white/90 placeholder:text-white/30 focus:outline-none focus:border-white/30 resize-none font-light leading-relaxed"
          />
          
          <button
            onClick={handleGetAdvice}
            disabled={!entry.trim() || isGenerating}
            className="self-end px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:hover:bg-white/10"
          >
            <Sparkles size={18} />
            {isGenerating ? 'Seeking Guidance...' : 'Get Mental Health Advice'}
          </button>
        </div>

        {advice && (
          <motion.div 
            className="bg-white/5 border border-white/10 rounded-2xl p-6 text-white/80 font-light leading-relaxed italic"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            "{advice}"
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
