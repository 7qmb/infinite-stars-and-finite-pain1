import { motion } from 'motion/react';

const generateEllipseKeyframes = (rx: number, ry: number, steps: number = 60) => {
  const x = [];
  const y = [];
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    x.push(Math.cos(angle) * rx);
    y.push(Math.sin(angle) * ry);
  }
  return { x, y };
};

const SOLAR_SYSTEMS = [
  {
    id: 'left-big',
    x: '15%',
    y: '40%',
    scale: 1.2,
    rotation: 15,
    planets: [
      { rx: 80, ry: 25, duration: 15, size: 4, offset: 0 },
      { rx: 140, ry: 45, duration: 25, size: 6, offset: 10 },
      { rx: 220, ry: 70, duration: 40, size: 5, offset: 20 },
      { rx: 300, ry: 95, duration: 60, size: 8, offset: 5 },
    ]
  },
  {
    id: 'middle-far',
    x: '50%',
    y: '20%',
    scale: 0.4,
    rotation: -10,
    planets: [
      { rx: 60, ry: 20, duration: 10, size: 3, offset: 0 },
      { rx: 100, ry: 35, duration: 18, size: 4, offset: 5 },
      { rx: 160, ry: 55, duration: 30, size: 3, offset: 15 },
    ]
  },
  {
    id: 'right-medium',
    x: '85%',
    y: '60%',
    scale: 0.8,
    rotation: -25,
    planets: [
      { rx: 70, ry: 25, duration: 12, size: 4, offset: 0 },
      { rx: 120, ry: 40, duration: 22, size: 5, offset: 8 },
      { rx: 180, ry: 60, duration: 35, size: 6, offset: 12 },
      { rx: 250, ry: 85, duration: 50, size: 4, offset: 25 },
    ]
  }
];

export default function Background({ screen, currentView }: { screen: string, currentView?: string }) {
  const isPlasma = screen === 'plasma-init' || currentView === 'plasma';

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-black">
      {/* Base void with faint violet/blue glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,_rgba(139,92,246,0.15),_transparent_50%)]"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,_rgba(59,130,246,0.15),_transparent_50%)]"></div>

      {/* Space Particles & Galaxies */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: isPlasma ? 0 : (screen === 'space' ? 1 : 0.15) }}
        transition={{ duration: 2 }}
      >
        {/* 3 Distinct Solar Systems */}
        {SOLAR_SYSTEMS.map((system) => (
          <div 
            key={system.id} 
            className="absolute"
            style={{
              left: system.x,
              top: system.y,
              transform: `translate(-50%, -50%) scale(${system.scale}) rotate(${system.rotation}deg)`,
            }}
          >
            {/* Central Star */}
            <div className="absolute w-4 h-4 bg-white/80 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)]" style={{ transform: 'translate(-50%, -50%)' }} />
            
            {system.planets.map((planet, i) => {
              const { x, y } = generateEllipseKeyframes(planet.rx, planet.ry);
              
              // Apply offset to starting position by shifting the arrays
              const offsetIndex = Math.floor((planet.offset / planet.duration) * x.length) % x.length;
              const shiftedX = [...x.slice(offsetIndex), ...x.slice(0, offsetIndex)];
              const shiftedY = [...y.slice(offsetIndex), ...y.slice(0, offsetIndex)];

              return (
                <div key={`planet-${system.id}-${i}`}>
                  {/* Orbit ring */}
                  <div 
                    className="absolute border border-white/[0.08] rounded-full"
                    style={{
                      width: planet.rx * 2,
                      height: planet.ry * 2,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                  {/* Planet */}
                  <motion.div
                    className="absolute bg-white/60 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                    style={{ 
                      width: planet.size, 
                      height: planet.size,
                      transform: 'translate(-50%, -50%)' 
                    }}
                    animate={{ x: shiftedX, y: shiftedY }}
                    transition={{
                      duration: planet.duration,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </div>
              );
            })}
          </div>
        ))}

        {/* Random Particles */}
        {[...Array(60)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20 - Math.random() * 40, 0],
              x: [0, 10 - Math.random() * 20, 0],
              opacity: [0.1, 0.6, 0.1],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
          />
        ))}
      </motion.div>

      {/* Liquid white stripes for talk mode */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: screen === 'talk' ? 0.03 : 0 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 flex flex-col justify-around"
      >
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="w-[200%] h-12 bg-white blur-2xl rounded-full"
            animate={{
              x: ['-50%', '0%'],
              y: [Math.sin(i) * 30, Math.cos(i) * 30],
            }}
            transition={{
              x: { repeat: Infinity, duration: 25 + i * 3, ease: "linear" },
              y: { repeat: Infinity, duration: 15 + i * 2, ease: "easeInOut", repeatType: "mirror" }
            }}
            style={{
              transformOrigin: 'center',
              rotate: -20 + (i % 4) * 10
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
