import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { transportService } from '../../services/transportService';
import type { Shipment, TransportVehicle } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StatCard } from '../../components/common/StatCard';
import {
  Truck,
  Navigation,
  Clock,
  IndianRupee,
  MapPin,
  CheckCircle2,
  FileText,
  Thermometer,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const TransporterDashboard: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [vehicles, setVehicles] = useState<TransportVehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [shipmentList, vehicleList] = await Promise.all([
          transportService.getShipments(),
          transportService.getVehicles(),
        ]);
        setShipments(shipmentList);
        setVehicles(vehicleList);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activeShipments = shipments.filter((s) => s.status === 'IN_TRANSIT');

  return (
    <DashboardLayout
      title="Transporter Logistics Portal"
      subtitle="Fleet operations, cooperative delivery dispatches, and cold-chain route coordination."
      actionButton={
        <Button
          variant="primary"
          size="md"
          className="shadow-sm"
          onClick={() => alert('New trip dispatch created')}
          leftIcon={<Truck className="w-4 h-4" />}
        >
          Dispatch New Trip
        </Button>
      }
    >
      {/* 4 Core Requirements: Delivery Requests, Routes, Vehicle Status, Active Deliveries */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatCard
          title="Active Deliveries"
          value={`${activeShipments.length} on Road`}
          subtext="With live GPS & reefer tracking"
          icon={<Truck className="w-5 h-5 text-sky-600" />}
        />
        <StatCard
          title="Fleet Readiness"
          value={`${vehicles.filter((v) => v.status === 'AVAILABLE').length} Available`}
          subtext={`${vehicles.length} total registered vehicles`}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          title="Average Reefer Temp"
          value="3.2°C"
          subtext="Within compliant chilled limits"
          icon={<Thermometer className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          title="Today's Logistics Revenue"
          value="₹14,800"
          subtext="Across 4 completed farm runs"
          icon={<IndianRupee className="w-5 h-5 text-amber-600" />}
        />
      </div>

      {/* Active Deliveries List */}
      <div className="space-y-6">
        <Card variant="default" padding="lg" className="bg-white border-stone-300 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h3 className="text-base font-bold font-heading text-stone-900">
                Active Freight Shipments
              </h3>
              <p className="text-xs text-stone-500">
                Farm-to-storage and storage-to-mandi transit consignments
              </p>
            </div>
            <Badge variant="sky">Live GPS Active</Badge>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-500 bg-stone-50">
                  <th className="py-3 px-4">Tracking ID</th>
                  <th className="py-3 px-4">Route Leg</th>
                  <th className="py-3 px-4">Vehicle & Driver</th>
                  <th className="py-3 px-4">Cargo Temp</th>
                  <th className="py-3 px-4">Distance / ETA</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">E-Waybill</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                {shipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-stone-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-sky-900">
                      {shipment.trackingNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-stone-900">
                        <span>{shipment.origin}</span>
                        <span className="text-stone-400">→</span>
                        <span>{shipment.destination}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-stone-800 block">{shipment.vehicleNumber}</span>
                      <span className="text-[11px] text-stone-500">{shipment.driverName}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {shipment.currentTempC !== undefined ? `${shipment.currentTempC}°C` : 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-stone-800 font-medium block">{shipment.distanceKm} km</span>
                      <span className="text-[11px] text-stone-500 font-mono">ETA: {shipment.eta}</span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={shipment.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => alert(`Consignment Note & E-Waybill for ${shipment.trackingNumber} printed`)}
                        className="inline-flex items-center gap-1 text-xs text-emerald-800 font-semibold hover:underline"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Waybill</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Vehicle Fleet Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vehicles.map((v) => (
            <Card key={v.id} variant="default" padding="md" className="bg-white border-stone-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-sky-700" />
                  <span className="text-xs font-bold text-stone-900">{v.vehicleNumber}</span>
                </div>
                <Badge variant={v.status === 'AVAILABLE' ? 'emerald' : 'sky'} size="sm">
                  {v.status}
                </Badge>
              </div>

              <div className="text-xs text-stone-600 space-y-1 mb-3">
                <div className="flex justify-between">
                  <span className="text-stone-500">Model / Type:</span>
                  <span className="font-semibold text-stone-800">{v.model} ({v.type})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Payload Capacity:</span>
                  <span className="font-semibold text-stone-800">{v.capacityTons} Tons</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Driver:</span>
                  <span className="text-stone-800">{v.driverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Reefer Unit:</span>
                  <span className="text-emerald-700 font-semibold">
                    {v.isRefrigerated ? 'Active Insulated' : 'Standard'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500">Base: {v.currentLocation}</span>
                <span className="font-bold text-stone-800">₹{v.ratePerKm}/km</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TransporterDashboard;
