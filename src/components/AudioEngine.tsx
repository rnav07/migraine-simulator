import { useEffect, useRef } from 'react';

export default function AudioEngine({ active }: { active: boolean }) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!active) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      return;
    }

    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;

      // Create oscillator for low frequency hum (around 45 Hz)
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(45, ctx.currentTime);

      // Create gain node for pulsing volume
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);

      // Connect nodes: Oscillator -> Gain -> Destination
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscillatorRef.current = osc;
      gainNodeRef.current = gain;

      // Set constant low frequency hum (lowered volume)
      gain.gain.setValueAtTime(0.04, ctx.currentTime);

      return () => {
        oscillatorRef.current = null;
        osc.stop();
        ctx.close();
      };
    } catch (e) {
      console.error("Web Audio API not supported or interaction required", e);
    }

  }, [active]);

  return null;
}
