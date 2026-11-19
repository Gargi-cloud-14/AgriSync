import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Sparkles, MoveDown } from 'lucide-react';

interface StorySlide {
  tag: string;
  headline: string;
  subtitle: string;
  highlight?: string;
  start: number;
  peak: number;
  end: number;
}

// Full 60 FPS resolution (600 frames across 10-second cinematic duration)
const TOTAL_FRAMES = 600;

const STORY_SLIDES: StorySlide[] = [
  {
    tag: 'THE HARVEST',
    headline: 'From field to custody.',
    subtitle: 'Where every journey begins with honest toil.',
    highlight: 'Direct Farmgate Loading',
    start: 0.0,
    peak: 0.18,
    end: 0.38,
  },
  {
    tag: 'IN TRANSIT',
    headline: 'Preserving freshness in motion.',
    subtitle: 'Connected cold-chain safeguarding the harvest on every mile.',
    highlight: 'Real-Time Climate Tracking',
    start: 0.40,
    peak: 0.58,
    end: 0.78,
  },
  {
    tag: 'DELIVERY & MANDI',
    headline: 'Delivered with confidence.',
    subtitle: 'Synchronizing farmers, cold-chain, and wholesale buyers.',
    highlight: 'Zero Loss • Fair Pay',
    start: 0.80,
    peak: 0.94,
    end: 1.0,
  },
];

export const ScrollAnimationIntro: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Store preloaded HTMLImageElements in memory
  const imagesRef = useRef<HTMLImageElement[]>([]);
  // Floating position for buttery physics interpolation
  const currentFloatFrameRef = useRef<number>(0);
  const targetFloatFrameRef = useRef<number>(0);
  const lastRenderedIntFrameRef = useRef<number>(-1);
  const rafIdRef = useRef<number | null>(null);

  const [scrollFraction, setScrollFraction] = useState<number>(0);

  // Draw a specific frame to the canvas maintaining aspect ratio (cover mode)
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const clampedIndex = Math.max(0, Math.min(frameIndex, TOTAL_FRAMES - 1));
    let img = imagesRef.current[clampedIndex];

    // Fallback to nearest loaded image if current frame is still fetching
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < 20; offset++) {
        const prev = imagesRef.current[clampedIndex - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = imagesRef.current[clampedIndex + offset];
        if (next && next.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasW = canvas.width;
    const canvasH = canvas.height;
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;

    // "cover" math
    const scale = Math.max(canvasW / imgW, canvasH / imgH);
    const renderW = imgW * scale;
    const renderH = imgH * scale;
    const offsetX = (canvasW - renderW) / 2;
    const offsetY = (canvasH - renderH) / 2;

    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
    lastRenderedIntFrameRef.current = clampedIndex;
  }, []);

  // Progressive high-priority preloader for 600 frames (60 FPS)
  useEffect(() => {
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    const loadIndex = (i: number) => {
      if (images[i]) return;
      const img = new Image();
      const numStr = i.toString().padStart(3, '0');
      img.src = `/frames/frame_${numStr}.webp`;
      img.onload = () => {
        if (Math.round(currentFloatFrameRef.current) === i) {
          drawFrame(i);
        }
      };
      images[i] = img;
    };

    // Load initial frame immediately
    loadIndex(0);

    // Wave 1: load key intervals (every 6th frame) for instant timeline responsiveness
    for (let i = 0; i < TOTAL_FRAMES; i += 6) {
      loadIndex(i);
    }

    // Wave 2: populate all remaining frames smoothly in background
    const timer = setTimeout(() => {
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        loadIndex(i);
      }
    }, 40);

    imagesRef.current = images;

    return () => clearTimeout(timer);
  }, [drawFrame]);

  // Adjust canvas buffer to window dimensions with DPR support
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      const f = lastRenderedIntFrameRef.current >= 0 ? lastRenderedIntFrameRef.current : 0;
      drawFrame(f);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [drawFrame]);

  // High-performance 60fps physics dampening / LERP loop
  useEffect(() => {
    let active = true;

    const renderLoop = () => {
      const target = targetFloatFrameRef.current;
      const current = currentFloatFrameRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.01) {
        // LERP factor 0.18 ensures ultra-smooth tracking across 600 frames
        const next = current + diff * 0.18;
        currentFloatFrameRef.current = next;

        const intFrame = Math.round(next);
        if (intFrame !== lastRenderedIntFrameRef.current) {
          drawFrame(intFrame);
        }
      }

      if (active) {
        rafIdRef.current = requestAnimationFrame(renderLoop);
      }
    };

    rafIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      active = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [drawFrame]);

  // Scroll listener: maps scroll progress to full 60 FPS range
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalScrollableDistance = container.offsetHeight - window.innerHeight;

      if (totalScrollableDistance <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / totalScrollableDistance, 0), 1);

      setScrollFraction(progress);

      // Map progress smoothly across all 600 frames
      const targetFrame = progress * (TOTAL_FRAMES - 1);
      targetFloatFrameRef.current = targetFrame;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Continuous opacity & subtle transform calculation for text
  const getSlideStyle = (slide: StorySlide) => {
    const p = scrollFraction;
    if (p < slide.start || p > slide.end) {
      return { opacity: 0, transform: 'translateY(16px) scale(0.97)', pointerEvents: 'none' as const };
    }

    let opacity = 0;
    if (p < slide.peak) {
      opacity = (p - slide.start) / (slide.peak - slide.start);
    } else {
      opacity = 1 - (p - slide.peak) / (slide.end - slide.peak);
    }

    opacity = Math.max(0, Math.min(1, opacity));
    const translateY = (1 - opacity) * 12;

    return {
      opacity,
      transform: `translateY(${translateY}px) scale(${0.97 + opacity * 0.03})`,
      pointerEvents: opacity > 0.4 ? ('auto' as const) : ('none' as const),
    };
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-stone-950 text-white"
      style={{ height: '350vh' }}
    >
      {/* Sticky Fullscreen Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between select-none">
        {/* Canvas Render Layer */}
        <div className="absolute inset-0 z-0 bg-stone-950">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.06]"
          />

          {/* Cinematic Vignettes and Ambient Lighting */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/25 to-stone-950/55 pointer-events-none" />
          <div
            className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-50"
            style={{
              background: 'radial-gradient(circle at center, transparent 35%, rgba(12, 10, 9, 0.85) 90%)',
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#10b981 1.5px, transparent 1.5px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Top Floating Header */}
        <div className="relative z-20 w-full pt-6 px-6 sm:px-12 flex items-center justify-between pointer-events-auto">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-md border border-stone-700/60 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-stone-300 font-semibold">
              AgriSync Visual Narrative
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 bg-stone-900/60 backdrop-blur-md border border-stone-800/80 px-4 py-1.5 rounded-full text-xs font-mono text-stone-400">
            <span>Scroll to playback</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70" />
            <span className="text-emerald-400 font-bold">{Math.round(scrollFraction * 100)}%</span>
          </div>
        </div>

        {/* Center Text Slides */}
        <div className="relative z-20 w-full max-w-5xl mx-auto px-6 sm:px-12 flex flex-col items-center text-center my-auto">
          {STORY_SLIDES.map((slide) => {
            const style = getSlideStyle(slide);
            return (
              <div
                key={slide.tag}
                style={style}
                className="absolute flex flex-col items-center transition-transform duration-100 ease-out will-change-transform"
              >
                {/* Micro Tag */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-400 text-[11px] font-mono tracking-widest uppercase font-semibold mb-3 shadow-lg backdrop-blur-sm">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  {slide.tag}
                </div>

                {/* Big Clean Headline */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-heading text-white drop-shadow-2xl max-w-3xl leading-[1.1]">
                  {slide.headline}
                </h1>

                {/* Light subtitle */}
                <p className="mt-3 text-base sm:text-xl text-stone-300 font-light max-w-xl leading-relaxed drop-shadow-md">
                  {slide.subtitle}
                </p>

                {slide.highlight && (
                  <div className="mt-3 inline-block text-xs font-mono text-emerald-300/90 tracking-wider uppercase bg-stone-900/60 px-3 py-1 rounded-md border border-stone-800 backdrop-blur-sm">
                    ✦ {slide.highlight}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Floating Bar */}
        <div className="relative z-20 w-full pb-8 px-6 sm:px-12 flex flex-col items-center">
          {/* Smooth animated progress line */}
          <div className="w-full max-w-md h-[2px] bg-stone-800/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-75 ease-out"
              style={{ width: `${Math.min(scrollFraction * 100, 100)}%` }}
            />
          </div>

          {/* Minimal scroll hint when at top */}
          <div
            className={`mt-4 flex items-center gap-2 text-xs font-mono tracking-wider text-stone-400 transition-opacity duration-500 ${
              scrollFraction < 0.05 ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span>SCROLL TO MOVE VIDEO</span>
            <MoveDown className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollAnimationIntro;
