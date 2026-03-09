import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Star } from '../../App';

export default function SpaceView({ 
  stars, 
  onSelectStar,
  starLogs,
  hasDeparted,
  onOpenLogList
}: { 
  stars: Star[], 
  onSelectStar: (star: Star) => void,
  starLogs: Record<string, any[]>,
  hasDeparted: boolean,
  onOpenLogList: () => void
}) {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const starRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const starsWithLogs = stars.filter(s => starLogs[s.id] && starLogs[s.id].length > 0);

  useEffect(() => {
    let animationFrameId: number;
    
    const updateLines = () => {
      if (!svgRef.current) return;
      const lines = svgRef.current.children;
      starsWithLogs.forEach((star, i) => {
        if (i === starsWithLogs.length - 1) return;
        const nextStar = starsWithLogs[i + 1];
        const el1 = starRefs.current[star.id];
        const el2 = starRefs.current[nextStar.id];
        if (el1 && el2) {
          const rect1 = el1.getBoundingClientRect();
          const rect2 = el2.getBoundingClientRect();
          const line = lines[i] as SVGLineElement;
          if (line) {
            line.setAttribute('x1', (rect1.left + rect1.width / 2).toString());
            line.setAttribute('y1', (rect1.top + rect1.height / 2).toString());
            line.setAttribute('x2', (rect2.left + rect2.width / 2).toString());
            line.setAttribute('y2', (rect2.top + rect2.height / 2).toString());
          }
        }
      });
      animationFrameId = requestAnimationFrame(updateLines);
    };
    
    updateLines();
    return () => cancelAnimationFrame(animationFrameId);
  }, [starsWithLogs]);

  return (
    <motion.div 
      ref={containerRef}
      className="absolute inset-0 z-10 overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.5 }}
      transition={{ duration: 2 }}
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
    >
      {/* Mouse Hover Glow */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 60%)',
          left: mousePos.x - 300,
          top: mousePos.y - 300,
        }}
      />

      {/* Milkyway */}
      {hasDeparted && (
        <motion.div 
          className="absolute top-1/2 left-1/2 w-[800px] h-[300px] -translate-x-1/2 -translate-y-1/2 -rotate-12 cursor-pointer group z-0"
          onDoubleClick={onOpenLogList}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          whileHover={{ opacity: 0.6 }}
          transition={{ duration: 2 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.15)_0%,_rgba(168,85,247,0.1)_30%,_transparent_70%)] blur-xl pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.1)_0%,_transparent_60%)] blur-2xl mix-blend-screen pointer-events-none" />
          <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" viewBox="0 0 800 300">
            <path d="M100,200 Q300,50 500,150 T700,100" fill="none" stroke="url(#mw-grad)" strokeWidth="40" filter="blur(10px)" />
            <path d="M150,220 Q350,70 550,170 T750,120" fill="none" stroke="url(#mw-grad2)" strokeWidth="30" filter="blur(8px)" />
            <defs>
              <linearGradient id="mw-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(168,85,247,0)" />
                <stop offset="50%" stopColor="rgba(168,85,247,0.5)" />
                <stop offset="100%" stopColor="rgba(59,130,246,0)" />
              </linearGradient>
              <linearGradient id="mw-grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(59,130,246,0)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
                <stop offset="100%" stopColor="rgba(168,85,247,0)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <span className="text-white/50 tracking-widest text-sm uppercase font-light bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">Double click to view saved logs</span>
          </div>
        </motion.div>
      )}

      {/* Constellation Lines */}
      <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {starsWithLogs.map((star, i) => {
          if (i === starsWithLogs.length - 1) return null;
          const nextStar = starsWithLogs[i + 1];
          return (
            <line 
              key={`${star.id}-${nextStar.id}`}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1.5"
            />
          );
        })}
      </svg>

      {stars.map((star) => (
        <StarNode 
          key={star.id} 
          star={star} 
          containerRef={containerRef} 
          starRefs={starRefs} 
          onSelectStar={onSelectStar} 
        />
      ))}
    </motion.div>
  );
}

const StarNode = React.memo(function StarNode({ star, containerRef, starRefs, onSelectStar }: any) {
  const [isDragging, setIsDragging] = useState(false);
  // Memoize random durations so they don't change on every mouse move
  const randomYDuration = useRef(4 + Math.random() * 3);
  const randomOpacityDuration = useRef(3 + Math.random() * 2);

  return (
    <>
      <motion.div
        className="absolute cursor-pointer flex flex-col items-center justify-center group z-10"
        style={{ left: `${star.x}%`, top: `${star.y}%` }}
        drag
        dragConstraints={containerRef}
        dragElastic={0.05}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setTimeout(() => setIsDragging(false), 50)}
        onClick={() => {
          if (!isDragging) onSelectStar(star);
        }}
        whileHover={{ scale: 1.1 }}
        whileDrag={{ scale: 1.2 }}
      >
      <motion.div
        ref={(el) => { starRefs.current[star.id] = el; }}
        className="flex flex-col items-center justify-center"
        animate={{
          y: [0, -15, 0],
          opacity: star.isWhite ? 0.4 : [0.7, 1, 0.7],
        }}
        transition={{
          y: { repeat: Infinity, duration: randomYDuration.current, ease: "easeInOut" },
          opacity: { repeat: Infinity, duration: randomOpacityDuration.current, ease: "easeInOut" }
        }}
      >
        {/* New Star Shape */}
        <svg width="32" height="32" viewBox="0 0 24 24" className="overflow-visible transition-transform duration-700 group-hover:scale-125">
          <path 
            d="M12 0 C12 10 10 12 0 12 C10 12 12 14 12 24 C12 14 14 12 24 12 C14 12 12 10 12 0 Z" 
            fill={star.isWhite ? '#ffffff' : star.color}
            style={{ filter: `drop-shadow(0 0 8px ${star.isWhite ? 'rgba(255,255,255,0.5)' : star.glowColor}) drop-shadow(0 0 16px ${star.isWhite ? 'rgba(255,255,255,0.3)' : star.glowColor})` }}
          />
        </svg>
        <span className="mt-4 text-xs tracking-widest text-white/0 group-hover:text-white/60 transition-colors duration-700 uppercase font-light pointer-events-none select-none">
          {star.name}
        </span>
      </motion.div>
    </motion.div>
    </>
  );
});
