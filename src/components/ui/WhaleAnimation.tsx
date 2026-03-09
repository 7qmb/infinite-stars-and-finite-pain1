import { motion } from 'motion/react';

export default function WhaleAnimation() {
  return (
    <motion.div 
      className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* The star being consumed/turning white */}
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-white blur-[100px]"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.5, 0], opacity: [0, 0.6, 0] }}
        transition={{ duration: 5, ease: "easeInOut" }}
      />
      
      {/* Whale swimming across */}
      <motion.div
        className="absolute left-0"
        initial={{ x: '-100vw', y: 100, rotate: 10 }}
        animate={{ x: '100vw', y: -100, rotate: -5 }}
        transition={{ duration: 7, ease: "easeInOut" }}
      >
        <svg width="600" height="300" viewBox="0 0 600 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-30 drop-shadow-[0_0_40px_rgba(255,255,255,0.4)]">
          {/* Stylized Whale Path */}
          <path d="M50 150 C 150 50, 300 50, 450 100 C 520 120, 570 110, 580 100 C 570 140, 520 160, 450 170 C 300 200, 150 190, 50 150 Z" fill="url(#whale-grad)" />
          <path d="M50 150 C 30 130, 10 100, 0 70 C 10 110, 20 160, 50 150 Z" fill="url(#whale-grad)" />
          <path d="M50 150 C 30 170, 10 200, 0 230 C 10 190, 20 140, 50 150 Z" fill="url(#whale-grad)" />
          <circle cx="420" cy="125" r="4" fill="#ffffff" opacity="0.9" />
          <defs>
            <linearGradient id="whale-grad" x1="0" y1="0" x2="600" y2="300" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="1" stopColor="#8b5cf6" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </motion.div>
  );
}
