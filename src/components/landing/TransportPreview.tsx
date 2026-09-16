import React, { useState } from 'react';
import { Truck, MapPin, Navigation, Clock, IndianRupee, Layers, CheckCircle2, Code2, AlertCircle, Fuel, Gauge, ShieldCheck, Thermometer } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { AGRI_IMAGES } from '../../assets/images';

export interface TransportPreviewProps {
  batchId?: string;
  crop?: string;
  origin?: string;
  midpoint?: string;
  destination?: string;
  distanceKm?: number;
  estimatedTravelTimeMin?: number;
  estimatedCostInr?: number;
  routeOptimized?: boolean;
  vehicleNumber?: string;
  vehicleType?: string;
  driverName?: string;
  cargoTempC?: number;
  waypoints?: Array<{
    name: string;
    status: string;
    time: string;
  }>;
}

/**
 * TransportPreview
 * Dedicated modular component for agricultural logistics and route visualization.
 * Modularized specifically so Member 1 (Transport & Maps API) can seamlessly replace
 * the visual map placeholder with Google Maps Platform / Mapbox GL DirectionsRenderer
 * without modifying surrounding page layouts or dashboard wrappers.
 */
export const TransportPreview: React.FC<TransportPreviewProps> = ({
  batchId = 'AGRI-2026-00421',
  crop = 'Sonaka Grapes (Export Grade A+)',
  origin = 'Dindori Vineyard Cluster, Nashik',
  midpoint = 'Sahyadri Cold Hub, Unit 4B',
  destination = 'Vashi APMC Mandi, Navi Mumbai',
  distanceKm = 18.4,
  estimatedTravelTimeMin = 34,
  estimatedCostInr = 720,
  routeOptimized = true,
  vehicleNumber = 'MH-15-EG-4821',
  vehicleType = 'Mahindra Bolero Maxi Truck (Insulated)',
  driverName = 'Sanjay Deshmukh',
  cargoTempC = 3.2,
  waypoints = [],
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'developer'>('map');

  return (
    <div className="w-full space-y-6">
      {/* Top Map Card Visualizer */}
      <Card variant="default" padding="none" className="overflow-hidden border border-stone-700/80 shadow-xl bg-stone-900 text-white rounded-3xl">
        {/* Toolbar Header */}
        <div className="px-5 py-4 bg-stone-950/80 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            <span className="text-xs font-bold uppercase tracking-wider text-stone-200 font-mono">
              Transit Route Simulation: NH-60 Corridor
            </span>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-900 border border-stone-800">
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'map'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Route Visualization
            </button>
            <button
              onClick={() => setViewMode('developer')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'developer'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Member 1 Dev Hook</span>
            </button>
          </div>
        </div>

        {/* View Mode 1: Simulated Agricultural Freight Map */}
        {viewMode === 'map' ? (
          <div className="relative h-96 bg-stone-950 p-6 flex flex-col justify-between overflow-hidden">
            {/* Topographic Road Grid Background */}
            <div
              className="absolute inset-0 opacity-[0.14] pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)',
                backgroundSize: '36px 36px',
              }}
            />

            {/* SVG Highway Route Connecting Farm -> Storage -> Market */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              preserveAspectRatio="none"
              viewBox="0 0 520 320"
            >
              <defs>
                <linearGradient id="routeGradientLine" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="45%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>

              {/* Highway Corridor Line */}
              <path
                d="M 70,80 Q 200,50 260,160 T 450,250"
                fill="none"
                stroke="url(#routeGradientLine)"
                strokeWidth="5"
                strokeDasharray="8 5"
                className="animate-pulse"
              />
            </svg>

            {/* Station 1: Farm (Top Left) */}
            <div className="relative z-10 flex items-center gap-3 bg-stone-900/90 border border-emerald-500/70 px-3.5 py-2.5 rounded-2xl backdrop-blur-md max-w-xs shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-500/50 flex items-center justify-center text-base font-bold shadow-inner">
                🌾
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase text-emerald-400 block tracking-wider">
                  Farm Gate (Origin)
                </span>
                <span className="text-xs font-semibold text-white truncate block">
                  {origin}
                </span>
              </div>
            </div>

            {/* Station 2: Storage Chamber (Center) */}
            <div className="relative z-10 self-center flex items-center gap-3 bg-stone-900/90 border border-sky-500/70 px-3.5 py-2.5 rounded-2xl backdrop-blur-md max-w-xs shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-sky-950 text-sky-300 border border-sky-500/50 flex items-center justify-center text-base font-bold shadow-inner">
                📦
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase text-sky-400 block tracking-wider">
                  Cold Storage Waypoint
                </span>
                <span className="text-xs font-semibold text-white truncate block">
                  {midpoint}
                </span>
              </div>
            </div>

            {/* Station 3: Terminal Market (Bottom Right) */}
            <div className="relative z-10 self-end flex items-center gap-3 bg-stone-900/90 border border-amber-500/70 px-3.5 py-2.5 rounded-2xl backdrop-blur-md max-w-xs shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-amber-950 text-amber-300 border border-amber-500/50 flex items-center justify-center text-base font-bold shadow-inner">
                🏪
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase text-amber-400 block tracking-wider">
                  Wholesale Mandi (Destination)
                </span>
                <span className="text-xs font-semibold text-white truncate block">
                  {destination}
                </span>
              </div>
            </div>

            {/* Active Moving Vehicle Indicator */}
            <div className="absolute top-[49%] left-[48%] -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-2 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-2xl border border-white">
              <Truck className="w-4 h-4 animate-bounce" />
              <span>{vehicleNumber} • {cargoTempC}°C</span>
            </div>
          </div>
        ) : (
          /* View Mode 2: Developer Handoff Hook for Member 1 */
          <div className="p-6 font-mono text-xs text-stone-300 bg-stone-950 h-96 overflow-y-auto space-y-4">
            <div className="p-3.5 bg-stone-900 rounded-xl border border-stone-800 text-emerald-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>MEMBER 1 ARCHITECTURAL INTEGRATION SPECIFICATION</span>
            </div>

            <p className="text-stone-400 text-xs leading-relaxed">
              When ready to integrate real Google Maps Platform or Mapbox GL, instantiate the map container inside this component using the hook stub below:
            </p>

            <pre className="text-stone-300 bg-stone-900 p-4 rounded-xl border border-stone-800 overflow-x-auto whitespace-pre-wrap leading-relaxed text-[11px]">
{`// src/services/transportService.ts
import { Loader } from '@googlemaps/js-api-loader';

export async function renderFreightRoute(
  mapElement: HTMLElement,
  originStr: string,
  destinationStr: string,
  waypointsList: string[]
) {
  // 1. Initialize Google Maps JS API Loader
  const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    version: 'weekly',
  });

  const { Map } = await loader.importLibrary('maps');
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();

  const map = new Map(mapElement, {
    center: { lat: 20.011, lng: 73.79 },
    zoom: 11,
  });

  directionsRenderer.setMap(map);

  const result = await directionsService.route({
    origin: originStr,
    destination: destinationStr,
    waypoints: waypointsList.map((wp) => ({ location: wp, stopover: true })),
    travelMode: google.maps.TravelMode.DRIVING,
  });

  directionsRenderer.setDirections(result);
}`}
            </pre>
          </div>
        )}

        {/* Bottom Metadata Ribbon */}
        <div className="px-5 py-3 bg-stone-950 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Multi-leg route: Farm Gate → Cold Storage → Mandi</span>
          </div>
          <span className="text-[11px] font-mono text-stone-500">
            UI demonstration dataset • Vehicle: {vehicleType}
          </span>
        </div>
      </Card>

      {/* Reefer Fleet Vehicle & Route Telematics Spotlight */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Real Reefer Logistics Vehicle Image Card */}
        <div className="md:col-span-5 rounded-3xl overflow-hidden bg-stone-900 border border-stone-800 flex flex-col justify-between shadow-xl">
          <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-950">
            <img
              src={AGRI_IMAGES.reeferTruck}
              alt="Refrigerated logistics reefer truck transporting fresh produce"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-stone-950/60" />
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-stone-950/80 text-sky-300 border border-sky-700/60 backdrop-blur-md">
                Active Cold Freight
              </span>
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-1.5 rounded-xl bg-stone-950/90 backdrop-blur-md border border-stone-800 text-xs">
              <div className="flex items-center gap-2">
                <Thermometer className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono text-white font-bold">{cargoTempC}°C</span>
                <span className="text-[10px] text-stone-400">Setpoint OK</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">Live GPS Active</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 text-xs space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-stone-800">
              <span className="text-stone-400">Assigned Reefer:</span>
              <span className="font-mono text-white font-bold">{vehicleNumber}</span>
            </div>
            <div className="flex items-center justify-between pb-2.5 border-b border-stone-800">
              <span className="text-stone-400">Logistics Pilot:</span>
              <span className="text-white font-medium">{driverName}</span>
            </div>
            <div className="flex items-center justify-between text-stone-400">
              <span>Vehicle Class:</span>
              <span className="text-stone-300 truncate max-w-[170px]">{vehicleType}</span>
            </div>
          </div>
        </div>

        {/* Metrics & Waypoints Card */}
        <div className="md:col-span-7 bg-stone-900 border border-stone-800 shadow-xl rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-stone-800 gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-300 font-mono">
                Route Optimization Metrics
              </span>
              {routeOptimized && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Route Optimized ✓
                </span>
              )}
            </div>

            {/* 3 Core Primary Demonstration Values Specified in Prompt */}
            <div className="grid grid-cols-3 gap-3 text-center my-4">
              <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800">
                <div className="flex items-center justify-center text-emerald-400 mb-1">
                  <Navigation className="w-4 h-4" />
                </div>
                <span className="text-[11px] text-stone-400 font-medium block">Distance</span>
                <span className="text-xl sm:text-2xl font-extrabold font-heading text-white tracking-tight">
                  {distanceKm} km
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800">
                <div className="flex items-center justify-center text-sky-400 mb-1">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-[11px] text-stone-400 font-medium block">Travel Time</span>
                <span className="text-xl sm:text-2xl font-extrabold font-heading text-white tracking-tight">
                  {estimatedTravelTimeMin} min
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800">
                <div className="flex items-center justify-center text-amber-400 mb-1">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <span className="text-[11px] text-stone-400 font-medium block">Est. Cost</span>
                <span className="text-xl sm:text-2xl font-extrabold font-heading text-white tracking-tight">
                  ₹{estimatedCostInr}
                </span>
              </div>
            </div>

            {/* Waypoint Milestones */}
            {waypoints.length > 0 && (
              <div className="mt-4 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block font-mono">
                  Trip Milestones & Status
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {waypoints.map((wp, idx) => (
                    <div
                      key={wp.name}
                      className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-stone-950 border border-stone-800"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-900 border border-emerald-700/60 text-emerald-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-stone-200 truncate">{wp.name}</span>
                      </div>
                      <span className="font-mono text-stone-400 text-[10px]">{wp.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cargo Telemetry Summary */}
          <div className="mt-4 pt-3 border-t border-stone-800 flex flex-wrap items-center justify-between text-xs text-stone-400 gap-2 font-mono">
            <span>Cargo: {crop}</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Zero Cold-Chain Breaches
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportPreview;
