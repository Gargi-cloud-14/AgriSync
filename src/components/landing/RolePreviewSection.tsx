import React from 'react';
import { Link } from 'react-router-dom';
import { Wheat, Warehouse, Truck, Store, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { AGRI_IMAGES } from '../../assets/images';

export const RolePreviewSection: React.FC = () => {
  const rolesData = [
    {
      role: 'FARMER',
      title: 'Farmer Portal',
      subtitle: 'किसान कार्यक्षेत्र',
      description: 'Log harvest batches, search nearby cold storage, and schedule freight pick-ups.',
      link: '/farmer',
      icon: <Wheat className="w-5 h-5 text-emerald-400" />,
      image: AGRI_IMAGES.farmerHarvest,
      badgeText: 'Producers & FPOs',
      badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
      modules: [
        'Add Produce & Log Varieties',
        'Find Storage Facilities',
        'Find Transport & Reefer Trucks',
        'Track Delivery & Fair Payments',
      ],
    },
    {
      role: 'STORAGE_PROVIDER',
      title: 'Storage Provider',
      subtitle: 'कोल्ड स्टोरेज हब',
      description: 'Publish real-time chamber capacity and monitor warehouse climate with IoT sensors.',
      link: '/storage',
      icon: <Warehouse className="w-5 h-5 text-amber-400" />,
      image: AGRI_IMAGES.coldStorage,
      badgeText: 'Warehouse Hubs',
      badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-700/60',
      modules: [
        'Chamber Capacity & Occupancy',
        'Temperature Telemetry Logs',
        'Humidity & Moisture Controls',
        'Incoming Produce & Critical Alerts',
      ],
    },
    {
      role: 'TRANSPORTER',
      title: 'Transporter Logistics',
      subtitle: 'रीफर परिवहन',
      description: 'Receive freight requests, optimize multi-stop delivery routes, and track vehicle status.',
      link: '/transporter',
      icon: <Truck className="w-5 h-5 text-sky-400" />,
      image: AGRI_IMAGES.reeferTruck,
      badgeText: 'Reefer Fleets',
      badgeColor: 'bg-sky-950/80 text-sky-300 border-sky-700/60',
      modules: [
        'Delivery Requests from Cooperatives',
        'Multi-Stop Route Optimization',
        'Vehicle Status & Reefer Telemetry',
        'Active Deliveries & E-Bills',
      ],
    },
    {
      role: 'BUYER',
      title: 'Buyer & Mandi Trader',
      subtitle: 'थोक मंडी व्यापारी',
      description: 'Source quality-verified produce directly from farmer clusters with cryptographic proof.',
      link: '/buyer',
      icon: <Store className="w-5 h-5 text-teal-400" />,
      image: AGRI_IMAGES.mandiInspection,
      badgeText: 'Mandi & APMC',
      badgeColor: 'bg-teal-950/80 text-teal-300 border-teal-700/60',
      modules: [
        'Available Produce Marketplace',
        'Batch Details & Grade Ratings',
        'QR Verification & Hash Inspection',
        'Supply History & Fair Settlement',
      ],
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-stone-900 text-white border-b border-stone-800 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-emerald-950/30 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-950/20 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/90 border border-emerald-700/60 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Role-Based Access Foundation
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Specialized Workspaces for Every Partner
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-300 leading-relaxed">
            Each supply-chain actor operates within a purpose-built command console designed to eliminate friction in their daily operations.
          </p>
        </div>

        {/* 4 Role Dashboard Cards with Authentic Photography */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {rolesData.map((item) => (
            <div
              key={item.role}
              className="bg-stone-850 border border-stone-750 hover:border-emerald-500/70 rounded-3xl overflow-hidden transition-all duration-200 group flex flex-col justify-between shadow-xl hover:-translate-y-1.5"
            >
              {/* Photo Header */}
              <div className="relative h-44 w-full overflow-hidden bg-stone-900">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-850 via-stone-850/40 to-transparent" />
                
                {/* Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-md shadow-xs ${item.badgeColor}`}>
                    {item.badgeText}
                  </span>
                </div>

                {/* Icon in top right */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-stone-950/80 backdrop-blur-md border border-stone-700 flex items-center justify-center">
                  {item.icon}
                </div>

                <div className="absolute bottom-2.5 left-4 right-4">
                  <span className="text-[11px] font-mono text-emerald-400 block font-medium">
                    {item.subtitle}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold font-heading text-white mb-1.5 group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-400 mb-5 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="space-y-2 mb-6 pt-3 border-t border-stone-750">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 block mb-2">
                      Key Modules Included
                    </span>
                    {item.modules.map((mod, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-stone-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{mod}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Link */}
                <div className="pt-4 border-t border-stone-750 mt-auto">
                  <Link to={item.link} className="block w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-between text-xs font-semibold bg-stone-800 border-stone-700 hover:bg-emerald-600 hover:border-emerald-500 text-stone-200 hover:text-white transition-colors py-2.5"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Open {item.title.split(' ')[0]} Console
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RolePreviewSection;
