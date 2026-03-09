import { motion } from 'motion/react';
import { Star as StarIcon } from 'lucide-react';

export default function LetterView({ message, onClose }: { message: string, onClose: () => void }) {
  return (
    <motion.div 
      className="absolute inset-0 z-40 flex items-center justify-center p-6 md:p-12 bg-black/60 backdrop-blur-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2 }}
    >
      <motion.div 
        className="max-w-3xl w-full flex flex-col items-center text-center"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 2 }}
      >
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="mb-16 text-yellow-100 drop-shadow-[0_0_30px_rgba(254,240,138,0.8)]"
        >
          <StarIcon size={56} fill="currentColor" strokeWidth={0} />
        </motion.div>

        <p className="text-xl md:text-3xl font-serif leading-relaxed text-white/90 tracking-wide mb-20 italic">
          {message || "..."}
        </p>

        <motion.button
          onClick={onClose}
          className="px-10 py-4 rounded-full border border-white/20 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-500 tracking-widest text-sm uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
        >
          Return to Void
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
