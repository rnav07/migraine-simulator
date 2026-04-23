import { useEffect, useState } from 'react';

interface Floater {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  blur: number;
  speedX: number;
  speedY: number;
}

export default function Floaters({ active }: { active: boolean }) {
  const [floaters, setFloaters] = useState<Floater[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!active) return;

    // Initialize floaters
    const initialFloaters: Floater[] = Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 50 + 20,
      opacity: Math.random() * 0.15 + 0.05,
      blur: Math.random() * 10 + 2,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5 + 0.2, // bias downwards slightly
    }));

    setFloaters(initialFloaters);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationId: number;
    const animate = () => {
      setFloaters(prev => prev.map(f => {
        let newX = f.x + f.speedX;
        let newY = f.y + f.speedY;

        // Mouse avoidance/following logic
        const dx = mousePos.x - newX;
        const dy = mousePos.y - newY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 200) {
          // Slowly drift towards mouse movement direction, like real floaters do when you move your eyes
          newX -= dx * 0.005;
          newY -= dy * 0.005;
        }

        // Wrap around screen
        if (newX > window.innerWidth + 100) newX = -100;
        if (newX < -100) newX = window.innerWidth + 100;
        if (newY > window.innerHeight + 100) newY = -100;
        if (newY < -100) newY = window.innerHeight + 100;

        return { ...f, x: newX, y: newY };
      }));
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [active, mousePos]);

  if (!active) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 8998, overflow: 'hidden' }}>
      {floaters.map(f => {
        const type = f.id % 3;
        return (
          <div
            key={f.id}
            style={{
              position: 'absolute',
              left: f.x,
              top: f.y,
              transform: `translate(-50%, -50%) rotate(${f.id * 45}deg)`,
              opacity: Math.min(f.opacity * 2.5, 0.8), // boost opacity since strokes are thin, max 0.8
              filter: `blur(${f.blur / 2.5}px)`, // less blur to show detail of the shapes
              transition: 'opacity 0.5s ease',
              color: 'rgba(0,0,0,0.9)' // dark grey/black color for stroke
            }}
          >
            <svg width="60" height="130" viewBox="0 0 60 130" style={{ overflow: 'visible' }}>
              {type === 0 && <path d="M30,0 Q50,30 20,60 T30,120" stroke="currentColor" fill="none" strokeWidth="4" strokeLinecap="round" />}
              {type === 1 && <path d="M10,10 Q-10,40 30,70 T20,110" stroke="currentColor" fill="none" strokeWidth="3" strokeLinecap="round" />}
              {type === 2 && (
                <g stroke="currentColor" fill="none" strokeWidth="2.5">
                  <circle cx="30" cy="30" r="14" />
                  <circle cx="30" cy="30" r="5" />
                  <circle cx="20" cy="65" r="10" />
                  <circle cx="20" cy="65" r="3" />
                  <circle cx="45" cy="90" r="12" />
                </g>
              )}
            </svg>
          </div>
        );
      })}
    </div>
  );
}
