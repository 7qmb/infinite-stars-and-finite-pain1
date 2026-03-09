import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Ship, Send, Moon, ArrowLeft } from 'lucide-react';
import { Star } from '../../App';
import { playBell } from '../../lib/audio';

export default function StarTalk({ 
  star, 
  playerName, 
  initialLog,
  onDepart,
  onBack
}: { 
  star: Star, 
  playerName: string, 
  initialLog: {role: string, text: string}[],
  onDepart: (log: {role: string, text: string}[]) => void,
  onBack: (log: {role: string, text: string}[]) => void
}) {
  const [log, setLog] = useState<{role: string, text: string}[]>(initialLog);
  const [input, setInput] = useState('');
  const [currentRole, setCurrentRole] = useState(playerName);
  const [showConfirm, setShowConfirm] = useState(false);
  const [roleRotations, setRoleRotations] = useState(0);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    setLog([...log, { role: currentRole, text: input.trim() }]);
    setInput('');
    playBell();
  };

  const toggleRole = () => {
    setCurrentRole(prev => prev === playerName ? star.name : playerName);
    setRoleRotations(prev => prev + 180);
  };

  return (
    <motion.div 
      className="absolute inset-0 z-20 flex flex-col pt-32 pb-6 px-6 md:px-12 lg:px-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
      transition={{ duration: 1.5 }}
    >
      {/* Header Area */}
      <div className="absolute top-0 left-0 w-full h-32 pointer-events-none z-30">
        {/* Top Middle Gradient & Title */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] opacity-20 blur-[60px]"
          style={{ background: `radial-gradient(circle at top, ${star.color}, transparent 60%)` }}
        />
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: star.color, boxShadow: `0 0 10px 2px ${star.glowColor}` }}
          />
          <span className="text-white/70 tracking-widest uppercase text-sm font-light">{star.name}</span>
        </div>

        {/* Top Left Back Arrow */}
        <button 
          onClick={() => onBack(log)}
          className="absolute top-6 left-6 p-3 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors pointer-events-auto"
          title="Return to Space"
        >
          <ArrowLeft size={24} strokeWidth={1.5} />
        </button>

        {/* Top Right Ship */}
        <button 
          onClick={() => setShowConfirm(true)}
          className="absolute top-6 right-6 p-3 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors pointer-events-auto"
          title="Depart"
        >
          <Ship size={24} strokeWidth={1.5} />
        </button>
      </div>

      {/* Chat Log */}
      <div className="flex-1 overflow-y-auto mb-8 pr-4 scrollbar-hide font-mono text-sm md:text-base">
        {log.map((entry, i) => (
          <motion.div 
            key={i} 
            className="mb-8"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="text-white/40 mb-2">{entry.role}:</div>
            <div className="text-white/90 pl-4 flex gap-3">
              <span className="text-white/30 mt-0.5">{'>'}</span>
              <span className="whitespace-pre-wrap leading-relaxed">{entry.text}</span>
            </div>
          </motion.div>
        ))}
        
        <div ref={logEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="flex items-end gap-4 max-w-4xl mx-auto w-full">
        <button 
          onClick={toggleRole}
          className="px-4 py-3 rounded-full bg-white/[0.02] hover:bg-white/[0.05] text-white/50 hover:text-white transition-colors flex-shrink-0 flex items-center gap-2 border border-white/[0.05]"
          title="Switch Role"
        >
          <motion.div animate={{ rotate: roleRotations }} transition={{ duration: 0.5, ease: "easeInOut" }}>
            <Moon size={16} strokeWidth={1.5} className="text-lime-100/80 drop-shadow-[0_0_8px_rgba(217,249,157,0.4)]" />
          </motion.div>
          <span className="text-xs uppercase tracking-wider hidden md:inline-block max-w-[60px] text-left truncate font-sans">
            {currentRole}
          </span>
        </button>
        
        <form onSubmit={handleSend} className="flex-1 flex items-start gap-3 bg-transparent border border-white/[0.04] rounded-xl p-4 focus-within:border-white/[0.08] focus-within:bg-white/[0.02] transition-colors">
          <span className="text-white/30 font-mono mt-0.5">{'>'}</span>
          <div className="flex-1 relative flex">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 bg-transparent resize-none outline-none text-white/90 font-mono text-sm leading-relaxed caret-white/70 z-10"
              rows={2}
              autoFocus
            />
            {input.length === 0 && (
               <div className="absolute inset-0 pointer-events-none flex items-start text-sm font-mono mt-0.5">
                 <motion.span 
                   animate={{ opacity: [1, 0] }}
                   transition={{ repeat: Infinity, duration: 0.8 }}
                   className="w-2 h-4 bg-white/50 inline-block"
                 />
                 <span className="text-white/10 ml-2">Speaking as {currentRole}...</span>
               </div>
            )}
          </div>
          <button 
            type="submit"
            disabled={!input.trim()}
            className="p-2 rounded-xl text-white/30 hover:text-white/70 transition-colors disabled:opacity-0 self-end"
          >
            <Send size={18} strokeWidth={1.5} />
          </button>
        </form>
      </div>

      {/* Confirm Depart Modal */}
      {showConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
          <motion.div 
            className="bg-zinc-900/80 border border-white/10 p-10 rounded-[2rem] flex flex-col items-center text-center max-w-sm shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
          >
            <h3 className="text-2xl font-light tracking-widest mb-8 text-white/90">Ready to depart?</h3>
            <div className="flex gap-4 w-full">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-full border border-white/20 text-white/50 hover:text-white hover:bg-white/10 transition-colors text-sm uppercase tracking-wider"
              >
                Stay
              </button>
              <button 
                onClick={() => onDepart(log)}
                className="flex-1 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors text-sm uppercase tracking-wider border border-white/10"
              >
                Depart
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
