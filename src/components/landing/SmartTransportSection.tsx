import React from 'react';
import { Truck, MapPin } from 'lucide-react';
import { TransportPreview } from './TransportPreview';
import { useLocationContext } from '../../context/LocationContext';

/**
 * SmartTransportSection
 * Agricultural logistics coordination showcase.
 * Dynamically updates based on the user's active region (Madhya Pradesh by default or GPS).
 */
export const SmartTransportSection: React.FC = () => {
  const { currentData } = useLocationContext();
  const transport = currentData.transport;

  return (
    <section
      id="smart-transport"
      className="py-20 lg:py-28 bg-stone-950 text-white border-b border-stone-850 relative overflow-hidden"
    >
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-sky-950/20 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-emerald-950/20 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-950/80 border border-sky-600/50 text-sky-300 text-xs font-semibold uppercase tracking-wider mb-3.5">
            <Truck className="w-3.5 h-3.5 text-sky-400" />
            Module: Smart Transport & Route Logistics • {currentData.stateName} Grid
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Coordinated Freight. Less Spoilage on the Road.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-300 leading-relaxed font-normal">
            Eliminating idle farm-gate waits across {currentData.stateName} by synchronizing local reefer mini-trucks,
            cold chambers, and wholesale mandis.
          </p>
        </div>

        {/* Dedicated TransportPreview Component */}
        <div className="max-w-5xl mx-auto">
          <TransportPreview
            batchId={transport.batchId}
            crop={transport.crop}
            origin={transport.origin}
            midpoint={transport.midpoint}
            destination={transport.destination}
            distanceKm={transport.distanceKm}
            estimatedTravelTimeMin={transport.estimatedTravelTimeMin}
            estimatedCostInr={transport.estimatedCostInr}
            routeOptimized={transport.routeOptimized}
            vehicleNumber={transport.vehicleNumber}
            vehicleType={transport.vehicleType}
            driverName={transport.driverName}
            cargoTempC={transport.cargoTempC}
            waypoints={transport.waypoints}
          />
        </div>
      </div>
    </section>
  );
};

export default SmartTransportSection;
