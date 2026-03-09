import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

type MenuPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (view: 'space' | 'nebula' | 'plasma') => void;
  onOpenJournal: () => void;
  currentView: 'space' | 'nebula' | 'plasma';
};

export default function MenuPopup({ isOpen, onClose, onSelect, onOpenJournal, currentView }: MenuPopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-20 left-6 z-50 w-64 bg-black/80 border border-white/10 rounded-2xl p-4 flex flex-col gap-2 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="text-white/40 text-xs uppercase tracking-widest mb-2 px-2">Navigation</div>
            
            {(['space', 'nebula', 'plasma'] as const).map((view) => (
              <button
                key={view}
                onClick={() => {
                  onSelect(view);
                  onClose();
                }}
                className={`text-left px-4 py-3 rounded-xl transition-all duration-300 uppercase tracking-widest text-sm ${
                  currentView === view 
                    ? 'bg-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                THE {view}
              </button>
            ))}
            
            <div className="h-px w-full bg-white/10 my-2" />
            
            <button
              onClick={() => {
                onOpenJournal();
                onClose();
              }}
              className="text-left px-4 py-3 rounded-xl transition-all duration-300 uppercase tracking-widest text-sm text-white/60 hover:bg-white/10 hover:text-white flex items-center gap-2"
            >
              <Sparkles size={16} />
              JOURNAL
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
