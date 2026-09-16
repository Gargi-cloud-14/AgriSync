import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { storageService } from '../../services/storageService';
import { sensorService } from '../../services/sensorService';
import type { StorageFacility, SensorReading } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatCard } from '../../components/common/StatCard';
import {
  Warehouse,
  Thermometer,
  Droplets,
  AlertTriangle,
  ShieldCheck,
  Plus,
  ArrowDownLeft,
  Cpu,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const StorageDashboard: React.FC = () => {
  const [facilities, setFacilities] = useState<StorageFacility[]>([]);
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const [facList, sensorList] = await Promise.all([
          storageService.getFacilities(),
          sensorService.getReadings(),
        ]);
        setFacilities(facList);
        setReadings(sensorList);
      } finally {
        setLoading(false);
      }
    }
    loadStorageData();
  }, []);

  const activeFac = facilities[0] || {
    name: 'Sahyadri Agro Cold Hub',
    totalCapacityTons: 500,
    availableCapacityTons: 142,
    currentTempC: 2.4,
    currentHumidityPct: 88,
  };

  const occupiedTons = activeFac.totalCapacityTons - activeFac.availableCapacityTons;
  const occupancyPct = Math.round((occupiedTons / activeFac.totalCapacityTons) * 100);

  const mockIncoming = [
    {
      id: 'inc-01',
      farmer: 'Rameshwar Patil',
      crop: 'Sonaka Table Grapes',
      quantity: '4.5 Tons',
      eta: 'Today, 4:30 PM',
      vehicle: 'MH-15-EG-4821',
      status: 'SCHEDULED',
    },
    {
      id: 'inc-02',
      farmer: 'Babanrao Shinde',
      crop: 'Red Onion (Lasalgaon)',
      quantity: '12.0 Tons',
      eta: 'Tomorrow, 9:00 AM',
      vehicle: 'MH-15-AB-1092',
      status: 'CONFIRMED',
    },
  ];

  return (
    <DashboardLayout
      title="Storage Provider Portal"
      subtitle="Chamber climate management, IoT telemetry monitoring, and intake logistics."
      actionButton={
        <Button
          variant="primary"
          size="md"
          className="shadow-sm"
          onClick={() => alert('New chamber configuration wizard')}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Storage Chamber
        </Button>
      }
    >
      {/* 5 Core Requirements: Capacity, Temperature, Humidity, Incoming Produce, Alerts */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {/* 1. Capacity */}
        <StatCard
          title="Facility Capacity"
          value={`${activeFac.availableCapacityTons} T Vacant`}
          subtext={`${occupancyPct}% Occupied (${occupiedTons} / ${activeFac.totalCapacityTons} T)`}
          icon={<Warehouse className="w-5 h-5" />}
        />

        {/* 2. Temperature */}
        <StatCard
          title="Cold Chamber Temp"
          value={`${activeFac.currentTempC}°C`}
          subtext="Target: 2.0°C - 3.5°C (Compliant)"
          icon={<Thermometer className="w-5 h-5 text-emerald-600" />}
        />

        {/* 3. Humidity */}
        <StatCard
          title="Chamber Humidity"
          value={`${activeFac.currentHumidityPct}%`}
          subtext="RH Optimal for Table Grapes"
          icon={<Droplets className="w-5 h-5 text-sky-600" />}
        />

        {/* 4. Sensor & Alert Status */}
        <StatCard
          title="Telemetry Status"
          value="All Normal"
          subtext="4 ESP32 Chamber Nodes Online"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
        />
      </div>

      {/* IoT Live Sensor Chart + Active Chamber Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-8">
          <Card variant="default" padding="lg" className="bg-white border-stone-300 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h3 className="text-base font-bold font-heading text-stone-900">
                  {activeFac.name} — Chamber Telemetry
                </h3>
                <p className="text-xs text-stone-500">
                  Hourly temperature & humidity time-series recorded by Sensirion probes
                </p>
              </div>
              <Badge variant="emerald" icon={<Cpu className="w-3 h-3" />}>
                ESP32 Linked
              </Badge>
            </div>

            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={readings} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="timestamp" tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <YAxis domain={[0, 40]} tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1c1917',
                      color: '#fff',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="temperature"
                    stroke="#059669"
                    strokeWidth={2}
                    fill="#10b981"
                    fillOpacity={0.15}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Alerts & Critical Thresholds */}
        <div className="lg:col-span-4 space-y-4">
          <Card variant="default" padding="lg" className="bg-white border-stone-300 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Active System Alerts
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                0 Critical
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Chamber B2 Cooling Cycle Verified</span>
                  <span className="text-stone-600 text-[11px]">
                    Compressor auto-modulated at 2.4°C. Stable.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Air Filter Maintenance Due</span>
                  <span className="text-stone-600 text-[11px]">
                    Pre-cooling intake ventilation filter scheduled for wash in 4 days.
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Incoming Produce Intake Schedule */}
      <Card variant="default" padding="lg" className="bg-white border-stone-300 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <ArrowDownLeft className="w-5 h-5 text-emerald-800" />
            <div>
              <h3 className="text-base font-bold font-heading text-stone-900">
                Incoming Produce Intake
              </h3>
              <p className="text-xs text-stone-500">
                Expected farmer shipments arriving for pre-cooling staging
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-500 bg-stone-50">
                <th className="py-3 px-4">Farmer / Producer</th>
                <th className="py-3 px-4">Crop Type</th>
                <th className="py-3 px-4">Intake Volume</th>
                <th className="py-3 px-4">Assigned Reefer Truck</th>
                <th className="py-3 px-4">ETA</th>
                <th className="py-3 px-4">Intake Status</th>
                <th className="py-3 px-4 text-right">Gate Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
              {mockIncoming.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/70">
                  <td className="py-3 px-4 font-bold text-stone-900">{item.farmer}</td>
                  <td className="py-3 px-4">{item.crop}</td>
                  <td className="py-3 px-4 font-semibold text-emerald-800">{item.quantity}</td>
                  <td className="py-3 px-4 font-mono text-stone-600">{item.vehicle}</td>
                  <td className="py-3 px-4 text-stone-600">{item.eta}</td>
                  <td className="py-3 px-4">
                    <Badge variant="emerald" size="sm">{item.status}</Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => alert(`Gate Pass generated for vehicle ${item.vehicle}`)}
                    >
                      Issue Gate Pass
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default StorageDashboard;
