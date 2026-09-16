import React from 'react';
import { demoMetrics } from '../../data/demoData';
import { Info } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  return (
    <section className="bg-stone-900 border-b border-stone-800 py-12 text-stone-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-400 font-heading">
            BUILT FOR STRONGER AGRICULTURAL COMMUNITIES
          </h2>
          <div className="inline-flex items-center gap-1.5 text-xs text-stone-400 mt-2 bg-stone-800/90 px-3.5 py-1 rounded-full border border-stone-700/80">
            <Info className="w-3.5 h-3.5 text-stone-400" />
            <span>Project demonstration metrics</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {demoMetrics.map((metric) => (
            <div
              key={metric.label}
              className="p-6 rounded-2xl bg-stone-850/70 border border-stone-750 hover:border-emerald-500/50 transition-all text-center group shadow-md"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight group-hover:scale-105 transition-transform">
                {metric.value}
              </div>
              <div className="text-sm font-bold text-emerald-400 mt-2">
                {metric.label}
              </div>
              <div className="text-xs text-stone-400 mt-1.5 line-clamp-2 leading-relaxed">
                {metric.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
