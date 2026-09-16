import React, { useEffect, useState, useRef } from 'react';

interface StardustSpark {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  opacity: number;
}

interface ClickShockwave {
  id: number;
  x: number;
  y: number;
  size: number;
}

const COSMIC_COLORS = [
  '#34d399', // Emerald starlight
  '#38bdf8', // Nebula cyan
  '#a855f7', // Cosmic violet
  '#fbbf24', // Solar gold
  '#f43f5e', // Nova pink
  '#ffffff', // Pure starlight
];

export const GalaxyCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const [isClicking, setIsClicking] = useState(false);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [sparks, setSparks] = useState<StardustSpark[]>([]);
  const [shockwaves, setShockwaves] = useState<ClickShockwave[]>([]);
  const sparkIdCounter = useRef(0);
  const shockwaveIdCounter = useRef(0);
  const isTouchDevice = useRef(false);

  useEffect(() => {
    // Check if device is touch only
    if (typeof window !== 'undefined') {
      isTouchDevice.current = 'ontouchstart' in window && navigator.maxTouchPoints > 0;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      const { clientX, clientY } = e;
      setPosition({ x: clientX, y: clientY });

      // Append small stardust trail
      setTrail((prev) => {
        const next = [{ x: clientX, y: clientY, id: Date.now() + Math.random() }, ...prev.slice(0, 5)];
        return next;
      });

      // Check if hovering clickable element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable =
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'TEXTAREA' ||
          target.getAttribute('role') === 'button' ||
          target.classList.contains('cursor-pointer') ||
          target.closest('button, a, [role="button"], input, select, .cursor-pointer') !== null;
        setIsHoveringClickable(!!isClickable);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      const { clientX, clientY } = e;

      // 1. Create expanding supernova shockwave
      const newShockwave: ClickShockwave = {
        id: ++shockwaveIdCounter.current,
        x: clientX,
        y: clientY,
        size: 1,
      };
      setShockwaves((prev) => [...prev.slice(-3), newShockwave]);

      // 2. Create galaxy starburst spark explosion
      const sparkCount = 14;
      const newSparks: StardustSpark[] = [];
      for (let i = 0; i < sparkCount; i++) {
        const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.5;
        const speed = Math.random() * 4 + 2;
        newSparks.push({
          id: ++sparkIdCounter.current,
          x: clientX,
          y: clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 4 + 2,
          color: COSMIC_COLORS[Math.floor(Math.random() * COSMIC_COLORS.length)],
          rotation: Math.random() * 360,
          opacity: 1,
        });
      }
      setSparks((prev) => [...prev.slice(-24), ...newSparks]);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Animation frame loop for sparks and shockwaves
  useEffect(() => {
    if (sparks.length === 0 && shockwaves.length === 0) return;

    let animId: number;
    const updatePhysics = () => {
      // Update sparks
      setSparks((prev) =>
        prev
          .map((s) => ({
            ...s,
            x: s.x + s.vx,
            y: s.y + s.vy,
            vy: s.vy + 0.08, // mild cosmic gravity
            opacity: s.opacity - 0.025,
            rotation: s.rotation + 4,
          }))
          .filter((s) => s.opacity > 0)
      );

      // Update shockwaves
      setShockwaves((prev) =>
        prev
          .map((sw) => ({
            ...sw,
            size: sw.size + 4,
          }))
          .filter((sw) => sw.size < 60)
      );

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, [sparks.length, shockwaves.length]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* 1. Click Supernova Shockwaves */}
      {shockwaves.map((sw) => (
        <div
          key={sw.id}
          className="absolute rounded-full -translate-x-1/2 -translate-y-1/2 transition-all"
          style={{
            left: `${sw.x}px`,
            top: `${sw.y}px`,
            width: `${sw.size * 2}px`,
            height: `${sw.size * 2}px`,
            border: `2px solid rgba(52, 211, 153, ${Math.max(0, 1 - sw.size / 55)})`,
            boxShadow: `0 0 20px rgba(56, 189, 248, ${Math.max(0, 0.8 - sw.size / 55)}), 0 0 40px rgba(168, 85, 247, ${Math.max(0, 0.5 - sw.size / 55)})`,
            background: `radial-gradient(circle, rgba(52, 211, 153, 0.25) 0%, rgba(56, 189, 248, 0.1) 45%, transparent 70%)`,
          }}
        />
      ))}

      {/* 2. Spark Starburst Particles */}
      {sparks.map((spark) => (
        <div
          key={spark.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: `${spark.x}px`,
            top: `${spark.y}px`,
            width: `${spark.size}px`,
            height: `${spark.size}px`,
            backgroundColor: spark.color,
            opacity: spark.opacity,
            transform: `translate(-50%, -50%) rotate(${spark.rotation}deg)`,
            boxShadow: `0 0 10px ${spark.color}, 0 0 16px ${spark.color}`,
          }}
        />
      ))}

      {/* 3. Mouse Galaxy Core & Aura (Desktop only when visible) */}
      {!isTouchDevice.current && isVisible && (
        <>
          {/* Subtle Stardust Trail */}
          {trail.map((point, index) => (
            <div
              key={point.id}
              className="absolute rounded-full -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${point.x}px`,
                top: `${point.y}px`,
                width: `${Math.max(2, 6 - index)}px`,
                height: `${Math.max(2, 6 - index)}px`,
                background: index % 2 === 0 ? '#34d399' : '#38bdf8',
                opacity: Math.max(0, 0.45 - index * 0.08),
                boxShadow: `0 0 ${8 - index}px #34d399`,
              }}
            />
          ))}

          {/* Outer Nebula Glow Aura */}
          <div
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150 ease-out ${
              isHoveringClickable ? 'w-14 h-14' : 'w-10 h-10'
            }`}
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              background: isHoveringClickable
                ? 'radial-gradient(circle, rgba(52, 211, 153, 0.45) 0%, rgba(56, 189, 248, 0.3) 50%, rgba(168, 85, 247, 0.15) 75%, transparent 100%)'
                : 'radial-gradient(circle, rgba(52, 211, 153, 0.35) 0%, rgba(56, 189, 248, 0.2) 60%, transparent 100%)',
              filter: 'blur(3px)',
            }}
          />

          {/* Celestial Orbit Ring (shown prominently when hovering clickable) */}
          <div
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed transition-all duration-200 ${
              isHoveringClickable
                ? 'w-10 h-10 border-emerald-400/80 animate-galaxy-spin scale-110 shadow-[0_0_12px_rgba(52,211,153,0.7)]'
                : 'w-7 h-7 border-sky-400/40 opacity-50'
            }`}
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
            }}
          />

          {/* Shiny Star Core */}
          <div
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-75 ${
              isClicking
                ? 'w-2.5 h-2.5 bg-amber-300 shadow-[0_0_20px_#f59e0b,0_0_30px_#10b981]'
                : isHoveringClickable
                ? 'w-3 h-3 bg-white shadow-[0_0_16px_#34d399,0_0_24px_#38bdf8]'
                : 'w-2 h-2 bg-emerald-400 shadow-[0_0_10px_#10b981]'
            }`}
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
            }}
          >
            {/* Tiny 4-point star glint when hovering */}
            {isHoveringClickable && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="w-5 h-[1px] bg-white/80 shadow-[0_0_6px_#ffffff]" />
                <span className="h-5 w-[1px] bg-white/80 absolute shadow-[0_0_6px_#ffffff]" />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default GalaxyCursor;
