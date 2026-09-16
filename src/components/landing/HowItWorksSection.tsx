import React from 'react';
import { demoTimelineSteps } from '../../data/demoData';
import { Badge } from '../common/Badge';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-stone-900 text-white relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-900/20 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-3.5 py-1 rounded-full">
            Supply-Chain Workflow
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            How AgriSync Works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-300 leading-relaxed">
            From the moment harvest leaves the soil to the instant it reaches wholesale mandis, every movement is coordinated and verifiable as one continuous journey.
          </p>
        </div>

        {/* DESKTOP TIMELINE: Horizontal Continuous Connected Journey */}
        <div className="hidden lg:block relative">
          {/* Continuous Connecting Line running through all 5 steps */}
          <div className="absolute top-28 left-12 right-12 h-1 bg-gradient-to-r from-emerald-600 via-sky-500 to-amber-500 rounded-full z-0 opacity-70" />

          <div className="grid grid-cols-5 gap-4 relative z-10">
            {demoTimelineSteps.map((step, idx) => (
              <div
                key={step.step}
                className="flex flex-col items-center text-center p-6 rounded-3xl bg-stone-850/90 border border-stone-750 hover:border-emerald-500/70 transition-all backdrop-blur-sm group hover:-translate-y-1.5 shadow-xl min-h-[360px]"
              >
                {/* Step Circle with Step Number */}
                <div className="w-16 h-16 rounded-2xl bg-stone-900 border-2 border-emerald-500/80 flex items-center justify-center text-emerald-300 font-extrabold font-heading text-xl mb-4 shadow-lg group-hover:bg-emerald-950 group-hover:scale-105 transition-all">
                  {step.step}
                </div>

                <Badge
                  variant="emerald"
                  size="sm"
                  className="mb-3 bg-emerald-950/90 border-emerald-700 text-emerald-300 text-[10px]"
                >
                  {step.actor}
                </Badge>

                <h3 className="text-base font-bold font-heading text-white mb-2 leading-snug">
                  {step.title}
                </h3>

                <p className="text-xs text-stone-400 leading-relaxed mb-4">
                  {step.description}
                </p>

                <div className="mt-auto pt-3 border-t border-stone-800 w-full text-[11px] font-mono text-emerald-400">
                  {step.tag}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MOBILE & TABLET TIMELINE: Vertical Continuous Connected Timeline */}
        <div className="lg:hidden relative pl-6 sm:pl-8">
          {/* Continuous Vertical Connecting Spine Line */}
          <div className="absolute top-4 bottom-4 left-6 sm:left-8 w-1 bg-gradient-to-b from-emerald-500 via-sky-500 to-amber-500 -translate-x-1/2 rounded-full" />

          <div className="space-y-8 relative">
            {demoTimelineSteps.map((step) => (
              <div key={step.step} className="relative flex items-start gap-4 sm:gap-6 group">
                {/* Timeline Step Node Circle */}
                <div className="w-12 h-12 rounded-xl bg-stone-900 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center font-extrabold font-heading text-base shrink-0 shadow-lg -ml-6 sm:-ml-6 z-10">
                  {step.step}
                </div>

                {/* Card Content */}
                <div className="flex-1 p-5 sm:p-6 rounded-2xl bg-stone-850 border border-stone-750 shadow-md">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                      {step.actor}
                    </span>
                    <span className="text-[10px] font-mono text-stone-400 px-2 py-0.5 rounded bg-stone-900 border border-stone-800">
                      {step.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-heading text-white mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
