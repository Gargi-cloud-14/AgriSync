import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts';
import { Cpu, Thermometer, Droplets, Activity, Wifi, ShieldCheck, ArrowRight, HardDrive } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { useLocationContext } from '../../context/LocationContext';

export const IotMonitoringSection: React.FC = () => {
  const { currentData } = useLocationContext();
  const iot = currentData.iot;

  return (
    <section
      id="iot-monitoring"
      className="py-20 lg:py-28 bg-stone-950 text-white border-b border-stone-850 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3.5 font-mono">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            Module: IoT Telemetry & Chamber Climate • {currentData.stateName}
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Continuous Cold-Chain Verification
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-300 leading-relaxed font-normal">
            Low-cost open hardware installed inside rural storage chambers monitors environmental thresholds around the
            clock at {iot.facilityName}.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Recharts Telemetry Graph & Core Status */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              {/* Header with Live Status & Updated time */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-stone-800 gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <h3 className="text-lg font-bold font-heading text-white">
                      {iot.storageUnitId} Live Climate Telemetry
                    </h3>
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5 font-mono">
                    {iot.facilityName} ({iot.location})
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-700/60">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Status: {iot.storageStatus}
                  </span>
                  <span className="text-xs text-stone-400 font-mono">Updated: {iot.lastUpdated}</span>
                </div>
              </div>

              {/* Exact Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
                <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 text-center">
                  <span className="text-xs text-stone-400 block mb-1">Temperature</span>
                  <span className="text-2xl font-extrabold font-heading text-emerald-400 font-mono">
                    {iot.temperature}°C
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-0.5 font-mono">
                    Target: {iot.targetTempRange}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 text-center">
                  <span className="text-xs text-stone-400 block mb-1">Humidity</span>
                  <span className="text-2xl font-extrabold font-heading text-sky-400 font-mono">
                    {iot.humidity}%
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-0.5 font-mono">
                    Target: {iot.targetHumidityRange}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 text-center">
                  <span className="text-xs text-stone-400 block mb-1">CO₂ Level</span>
                  <span className="text-2xl font-extrabold font-heading text-amber-300 font-mono">
                    {iot.co2Ppm} ppm
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">Optimal Aeration</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 text-center">
                  <span className="text-xs text-stone-400 block mb-1">Gateway Signal</span>
                  <span className="text-2xl font-extrabold font-heading text-emerald-400 font-mono">
                    98%
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-0.5 font-mono">4G LTE + Solar</span>
                </div>
              </div>

              {/* Recharts Graph: 24h Temperature & Humidity History */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono">
                    Chamber Climate Trends (°C & % RH)
                  </span>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> Temp (°C)
                    </span>
                    <span className="flex items-center gap-1 text-sky-400 font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" /> Humidity (%)
                    </span>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={iot.telemetryHistory}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="humGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
                      <XAxis dataKey="time" stroke="#78716c" fontSize={11} tickLine={false} />
                      <YAxis stroke="#78716c" fontSize={11} domain={[10, 80]} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1c1917',
                          borderColor: '#44403c',
                          borderRadius: '0.75rem',
                          fontSize: '12px',
                          color: '#fff',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="humidity"
                        stroke="#38bdf8"
                        strokeWidth={2}
                        fill="url(#humGradient)"
                      />
                      <Area
                        type="monotone"
                        dataKey="temperature"
                        stroke="#10b981"
                        strokeWidth={2}
                        fill="url(#tempGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Hardware Node Details & Architecture Flow */}
          <div className="lg:col-span-4 space-y-6">
            {/* ESP32 Hardware Badge Card */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700/60 text-emerald-400 flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-heading text-white">
                    ESP32 + Chamber Telemetry Probe
                  </h4>
                  <p className="text-xs text-stone-400 font-mono">Edge Unit: {iot.storageUnitId}</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-stone-300 pb-4 border-b border-stone-800 font-mono">
                <div className="flex justify-between">
                  <span className="text-stone-400">Microcontroller:</span>
                  <span className="font-semibold text-white">ESP32-WROOM-32</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Sensirion Probe:</span>
                  <span className="font-semibold text-white">SHT31 / DHT22 (Calibrated)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Telemetry Rate:</span>
                  <span className="font-semibold text-white">Every 60 seconds</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Agro-Grid Facility:</span>
                  <span className="font-semibold text-emerald-400">{currentData.stateCode} Hub Terminal</span>
                </div>
              </div>

              {/* Exact Data Flow Architecture */}
              <div className="mt-4">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-300 block mb-2 font-mono">
                  Telemetry Flow Pipeline
                </span>
                <div className="space-y-1.5 font-mono text-[11px] bg-stone-950 text-stone-200 p-3.5 rounded-2xl border border-stone-850">
                  <div className="flex items-center justify-between text-emerald-400">
                    <span>ESP32 Sensor Unit</span>
                    <span className="text-[10px] bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">Edge</span>
                  </div>
                  <div className="text-center text-stone-500">↓</div>
                  <div className="flex items-center justify-between text-stone-300">
                    <span>Node/Express Backend</span>
                    <span className="text-[10px] bg-stone-900 px-1.5 py-0.5 rounded border border-stone-750">Server</span>
                  </div>
                  <div className="text-center text-stone-500">↓</div>
                  <div className="flex items-center justify-between text-sky-400">
                    <span>REST / WebSocket API</span>
                    <span className="text-[10px] bg-sky-950 px-1.5 py-0.5 rounded border border-sky-800">Gateway</span>
                  </div>
                  <div className="text-center text-stone-500">↓</div>
                  <div className="flex items-center justify-between text-amber-300">
                    <span>sensorService.ts</span>
                    <span className="text-[10px] bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800">Client Hook</span>
                  </div>
                  <div className="text-center text-stone-500">↓</div>
                  <div className="flex items-center justify-between text-white font-bold">
                    <span>React Dashboard</span>
                    <span className="text-[10px] bg-emerald-900 text-emerald-300 px-1.5 py-0.5 rounded">AgriSync UI</span>
                  </div>
                </div>

                <p className="text-[11px] text-stone-400 mt-2.5 leading-tight">
                  Security note: The browser client does NOT connect directly to the ESP32. Communication routes securely through the centralized backend service layer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IotMonitoringSection;
