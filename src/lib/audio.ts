let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let ambientOscillators: any[] = [];

export const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

export const setMute = (mute: boolean) => {
  if (masterGain) {
    masterGain.gain.value = mute ? 0 : 1;
  }
};

export const startAmbientMusic = () => {
  initAudio();
  if (!audioCtx || !masterGain) return;
  
  // Prevent multiple ambient tracks
  if (ambientOscillators.length > 0) return;

  const frequencies = [110, 164.81, 220, 277.18, 329.63]; // A major chord drone
  
  frequencies.forEach((freq, i) => {
    const osc = audioCtx!.createOscillator();
    const gain = audioCtx!.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    const lfo = audioCtx!.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.05 + i * 0.01;
    
    const lfoGain = audioCtx!.createGain();
    lfoGain.gain.value = 0.015; 
    
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    
    gain.gain.value = 0.015;
    
    osc.connect(gain);
    gain.connect(masterGain!);
    
    osc.start();
    lfo.start();
    
    ambientOscillators.push(osc, lfo);
  });
};

export const playBell = () => {
  initAudio();
  if (!audioCtx || !masterGain) return;

  const ctx = audioCtx;
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(880, ctx.currentTime); 
  
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(1318.51, ctx.currentTime); // E6
  
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(masterGain);

  osc1.start();
  osc2.start();
  osc1.stop(ctx.currentTime + 2);
  osc2.stop(ctx.currentTime + 2);
};
