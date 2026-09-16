import React from 'react';
import { demoProblems } from '../../data/demoData';
import { Warehouse, Truck, CloudRain, FileCheck2, AlertTriangle, TrendingDown, ArrowDownRight } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Warehouse':
        return <Warehouse className="w-5 h-5 text-amber-400" />;
      case 'Truck':
        return <Truck className="w-5 h-5 text-sky-400" />;
      case 'CloudRain':
        return <CloudRain className="w-5 h-5 text-indigo-400" />;
      case 'FileCheck2':
      default:
        return <FileCheck2 className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <section id="problem" className="py-20 lg:py-28 bg-stone-950 text-white border-b border-stone-850 relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-950/20 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-950/20 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-600/50 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            The Post-Harvest Cold-Chain Deficit
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Agriculture doesn't end at harvest.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-300 leading-relaxed">
            In rural farming communities, up to a third of perishable produce loses market value before reaching consumers due to fragmented coordination and zero climate visibility.
          </p>

          {/* National Agricultural Impact Ticker */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
            <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 text-center">
              <div className="text-xl font-bold font-mono text-amber-400">₹44,000+ Cr</div>
              <div className="text-[11px] text-stone-400 font-medium mt-0.5">Annual Perishable Food Waste</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 text-center">
              <div className="text-xl font-bold font-mono text-rose-400">30–35%</div>
              <div className="text-[11px] text-stone-400 font-medium mt-0.5">Produce Lost Before Mandi</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 text-center">
              <div className="text-xl font-bold font-mono text-sky-400">84% Deficit</div>
              <div className="text-[11px] text-stone-400 font-medium mt-0.5">In Packhouse Reefer Fleets</div>
            </div>
          </div>
        </div>

        {/* 4 Problem Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {demoProblems.map((item, index) => (
            <div
              key={item.id}
              className="p-6 sm:p-7 rounded-3xl bg-stone-900 border border-stone-800 hover:border-stone-700 transition-all duration-200 group relative overflow-hidden shadow-xl"
            >
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="w-12 h-12 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {getIcon(item.iconName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold font-mono text-stone-500">
                      CHALLENGE 0{index + 1}
                    </span>
                    <span className="text-xs font-bold font-mono text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-800/80">
                      {item.stat}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold font-heading text-white mb-2 group-hover:text-amber-200 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-stone-300 leading-relaxed mb-4">
                    {item.description}
                  </p>
                  <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400 font-medium">
                    <span>{item.statLabel}</span>
                    <ArrowDownRight className="w-3.5 h-3.5 text-stone-500" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
