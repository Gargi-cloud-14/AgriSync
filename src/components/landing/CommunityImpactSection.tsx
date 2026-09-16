import React from 'react';
import { demoCommunityCards } from '../../data/demoData';
import { Sprout, Truck, Building2, CheckCircle2, HeartHandshake } from 'lucide-react';

export const CommunityImpactSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sprout':
        return <Sprout className="w-5 h-5 text-emerald-400" />;
      case 'Truck':
        return <Truck className="w-5 h-5 text-sky-400" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-amber-400" />;
      case 'CheckCircle2':
      default:
        return <CheckCircle2 className="w-5 h-5 text-teal-400" />;
    }
  };

  return (
    <section id="community" className="py-20 lg:py-28 bg-stone-900 text-white border-b border-stone-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3.5">
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
            Empowering Rural Stakeholders
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Technology that strengthens agricultural communities.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-300 leading-relaxed">
            By building transparent coordination rather than extractive middlemen, AgriSync enhances local capacity utilization and preserves crop value for rural livelihoods.
          </p>
        </div>

        {/* 4 Community Impact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {demoCommunityCards.map((card, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-3xl bg-stone-850 border border-stone-750 hover:border-emerald-500/70 transition-all duration-200 group shadow-xl"
            >
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="w-12 h-12 rounded-2xl bg-stone-900 border border-stone-750 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {getIcon(card.iconName)}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                    {card.target}
                  </span>
                  <h3 className="text-xl font-bold font-heading text-white mb-2 group-hover:text-emerald-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-stone-300 leading-relaxed mb-4">
                    {card.description}
                  </p>
                  <div className="pt-3 border-t border-stone-750 flex items-center justify-between text-xs">
                    <span className="text-stone-400 font-medium">Impact Indicator:</span>
                    <span className="font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800">
                      {card.metrics}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Community Principles Pill Strip */}
        <div className="mt-14 p-6 rounded-3xl bg-stone-950 border border-stone-800 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-4 font-mono">
            Core Guiding Operational Principles
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm font-semibold text-stone-200">
            <span className="px-3.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center gap-1.5">
              <span>🌾</span> Resource Visibility
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center gap-1.5">
              <span>🤝</span> Transparent Coordination
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center gap-1.5">
              <span>📉</span> Reduced Avoidable Wastage
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center gap-1.5">
              <span>🚚</span> Better Vehicle Utilization
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center gap-1.5">
              <span>🔍</span> Open Provenance
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityImpactSection;
