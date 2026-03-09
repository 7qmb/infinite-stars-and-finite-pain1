import { useState, useRef } from 'react';
import { motion } from 'motion/react';

export default function StartScreen({ onBegin, onImport }: { onBegin: (name: string) => void, onImport: (data: any) => void }) {
  const [name, setName] = useState('');
  const [step, setStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        onImport(data);
      } catch (err) {
        alert("Invalid log file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <motion.div 
      className="absolute inset-0 z-10 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 1.5 }}
    >
      <motion.h1 
        className="text-5xl md:text-7xl font-light tracking-widest text-white/90 mb-12 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 2 }}
      >
        SPACE SAILER
      </motion.h1>

      {step === 0 ? (
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <button
            onClick={() => setStep(1)}
            className="px-8 py-3 rounded-full border border-white/20 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-500 tracking-widest text-sm uppercase"
          >
            SAIL THE SPACE
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-8 py-3 rounded-full text-white/40 hover:text-white/70 transition-all duration-500 tracking-widest text-xs uppercase"
          >
            JOIN A BOAT
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".json" 
            onChange={handleFileChange} 
          />
        </motion.div>
      ) : (
        <motion.form
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) onBegin(name.trim());
          }}
          className="flex flex-col items-center gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="what's your name?"
            className="bg-transparent border-b border-white/30 px-4 py-2 text-center text-2xl text-white focus:outline-none focus:border-white/70 transition-colors placeholder:text-white/20 font-light tracking-wider"
            autoFocus
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="px-8 py-3 rounded-full border border-white/20 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-500 tracking-widest text-sm uppercase disabled:opacity-30 disabled:hover:bg-transparent"
          >
            Enter Void
          </button>
        </motion.form>
      )}
    </motion.div>
  );
}
