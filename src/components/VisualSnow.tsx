import { useEffect, useRef } from 'react';

export default function VisualSnow({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const renderNoise = () => {
      const idata = ctx.createImageData(w, h);
      const buffer32 = new Uint32Array(idata.data.buffer);
      const len = buffer32.length;
      
      for (let i = 0; i < len; i++) {
        const rand = Math.random();
        if (rand < 0.15) {
          // White static (approx 25% opacity)
          buffer32[i] = 0x40ffffff; 
        } else if (rand < 0.25) {
          // Black static (approx 25% opacity)
          buffer32[i] = 0x40000000; 
        }
      }
      ctx.putImageData(idata, 0, 0);
    };

    const loop = () => {
      renderNoise();
      // Throttle the frame rate slightly so it's not overwhelmingly fast
      setTimeout(() => {
        animationFrameId = requestAnimationFrame(loop);
      }, 50); 
    };

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    loop();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 8999,
        opacity: 0.9,
      }}
    />
  );
}
