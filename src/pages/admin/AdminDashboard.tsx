import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { ShieldCheck, Users, Warehouse, Truck, Activity, Cpu, Database, Server } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { switchRoleDemo } = useAuth();

  return (
    <DashboardLayout
      title="Platform Administrator"
      subtitle="Ecosystem monitoring, IoT gateway diagnostics, and network synchronization audit."
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatCard
          title="Active Producers"
          value="2,540"
          subtext="+148 this month across Nashik & Pune"
          icon={<Users className="w-5 h-5 text-emerald-700" />}
        />
        <StatCard
          title="Storage Facilities"
          value="124 Hubs"
          subtext="96% reporting live IoT telemetry"
          icon={<Warehouse className="w-5 h-5 text-amber-700" />}
        />
        <StatCard
          title="Logistics Partners"
          value="342 Reefers"
          subtext="Cooperative fleet online"
          icon={<Truck className="w-5 h-5 text-sky-700" />}
        />
        <StatCard
          title="Audit Checkpoints"
          value="48,210"
          subtext="Cryptographically sealed blocks"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-700" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Card variant="default" padding="lg" className="bg-white border-stone-300">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h3 className="text-base font-bold font-heading text-stone-900">
                Ecosystem Health & Gateway Status
              </h3>
              <Badge variant="emerald">All Microservices Operational</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div className="flex items-center gap-2 text-stone-500 mb-1 text-xs font-bold uppercase">
                  <Server className="w-4 h-4 text-emerald-700" />
                  <span>REST API Gateway</span>
                </div>
                <span className="text-xl font-bold font-heading text-stone-900">99.98%</span>
                <span className="text-[11px] text-stone-500 block mt-0.5">Latency: 28ms</span>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div className="flex items-center gap-2 text-stone-500 mb-1 text-xs font-bold uppercase">
                  <Cpu className="w-4 h-4 text-sky-700" />
                  <span>IoT Broker (MQTT)</span>
                </div>
                <span className="text-xl font-bold font-heading text-stone-900">512 Nodes</span>
                <span className="text-[11px] text-stone-500 block mt-0.5">0 Packet Drops</span>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div className="flex items-center gap-2 text-stone-500 mb-1 text-xs font-bold uppercase">
                  <Database className="w-4 h-4 text-amber-700" />
                  <span>Provenance Ledger</span>
                </div>
                <span className="text-xl font-bold font-heading text-stone-900">Block #194,821</span>
                <span className="text-[11px] text-stone-500 block mt-0.5">Anchored Every 15 min</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card variant="default" padding="lg" className="bg-white border-stone-300">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 mb-2">
              Team Role-Switch Testing
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Inspect application views as any member of the agricultural supply chain:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => switchRoleDemo('FARMER')}
                className="w-full text-left p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-800 flex items-center justify-between"
              >
                <span>🌾 Farmer Portal</span>
                <span className="text-stone-400">→</span>
              </button>
              <button
                onClick={() => switchRoleDemo('STORAGE_PROVIDER')}
                className="w-full text-left p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-800 flex items-center justify-between"
              >
                <span>📦 Storage Provider</span>
                <span className="text-stone-400">→</span>
              </button>
              <button
                onClick={() => switchRoleDemo('TRANSPORTER')}
                className="w-full text-left p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-800 flex items-center justify-between"
              >
                <span>🚚 Transporter Logistics</span>
                <span className="text-stone-400">→</span>
              </button>
              <button
                onClick={() => switchRoleDemo('BUYER')}
                className="w-full text-left p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-800 flex items-center justify-between"
              >
                <span>🏪 Mandi Buyer</span>
                <span className="text-stone-400">→</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
