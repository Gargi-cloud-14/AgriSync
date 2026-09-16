import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { produceService } from '../../services/produceService';
import type { ProduceBatch } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StatCard } from '../../components/common/StatCard';
import { Link } from 'react-router-dom';
import {
  Store,
  QrCode,
  ShieldCheck,
  Search,
  ShoppingCart,
  CheckCircle2,
  ExternalLink,
  History,
  FileCheck,
} from 'lucide-react';

export const BuyerDashboard: React.FC = () => {
  const [batches, setBatches] = useState<ProduceBatch[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<ProduceBatch | null>(null);

  useEffect(() => {
    async function loadBatches() {
      const list = await produceService.getBatches();
      setBatches(list);
    }
    loadBatches();
  }, []);

  const filteredBatches = batches.filter(
    (b) =>
      b.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.batchCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mockPurchasedHistory = [
    {
      id: 'po-901',
      batchCode: 'AGRI-2026-00418',
      crop: 'Bhagwa Pomegranate',
      farmer: 'Babanrao Shinde',
      quantityKg: 3500,
      totalPaid: '₹2,62,500',
      deliveredOn: '14 Sep 2026',
      verified: true,
    },
    {
      id: 'po-902',
      batchCode: 'AGRI-2026-00392',
      crop: 'Nashik Red Onion',
      farmer: 'Pravin Jadhav',
      quantityKg: 10000,
      totalPaid: '₹1,90,000',
      deliveredOn: '10 Sep 2026',
      verified: true,
    },
  ];

  return (
    <DashboardLayout
      title="Buyer & Mandi Trader Portal"
      subtitle="Direct procurement from farmer clusters with verified cold-chain provenance."
    >
      {/* 4 Core Requirements: Available Produce, Batch Details, QR Verification, Supply History */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatCard
          title="Available Farm Batches"
          value={`${batches.length} Lots`}
          subtext="Ready for wholesale procurement"
          icon={<Store className="w-5 h-5 text-teal-700" />}
        />
        <StatCard
          title="Cold-Chain Certified"
          value="100% Provenance"
          subtext="Cryptographic checkpoint logged"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-700" />}
        />
        <StatCard
          title="Past Procurement"
          value="13.5 Tons"
          subtext="Fulfilled this calendar month"
          icon={<History className="w-5 h-5 text-amber-700" />}
        />
        <StatCard
          title="Quality Standard"
          value="Export Grade A"
          subtext="APMC & GlobalGAP verified"
          icon={<CheckCircle2 className="w-5 h-5 text-sky-700" />}
        />
      </div>

      {/* Main Marketplace & Batch Details */}
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search crop, variety, or batch ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
            />
          </div>
          <span className="text-xs text-stone-500 font-medium">
            Showing {filteredBatches.length} verified agricultural consignments
          </span>
        </div>

        {/* Available Produce Lots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredBatches.map((batch) => (
            <Card
              key={batch.id}
              variant="default"
              padding="lg"
              className="bg-white border-stone-200 hover:border-emerald-600 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    {batch.batchCode}
                  </span>
                  <StatusBadge status={batch.status} />
                </div>

                <h3 className="text-lg font-bold font-heading text-stone-900 mb-0.5">
                  {batch.cropName}
                </h3>
                <p className="text-xs text-stone-500 mb-4">{batch.variety} • {batch.farmLocation}</p>

                <div className="space-y-1.5 text-xs text-stone-600 mb-6 bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Producer:</span>
                    <span className="font-semibold text-stone-800">{batch.farmerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Quantity Available:</span>
                    <span className="font-bold text-stone-900">{batch.quantityKg} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Quality Grade:</span>
                    <span className="font-bold text-emerald-800">{batch.qualityGrade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Offer Price:</span>
                    <span className="font-bold text-stone-900">₹{batch.targetPricePerKg} / kg</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-100">
                {/* QR Verification Link */}
                <Link
                  to={`/verify/${batch.batchCode}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl border border-emerald-300 text-emerald-800 hover:bg-emerald-50 transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Verify Batch Audit Certificate</span>
                </Link>

                <Button
                  variant="primary"
                  size="sm"
                  className="w-full text-xs font-semibold"
                  onClick={() => alert(`Purchase Contract initiated for ${batch.batchCode} with farmer ${batch.farmerName}. Safe escrow terms generated.`)}
                >
                  Procure Batch
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Supply History Table */}
        <Card variant="default" padding="lg" className="bg-white border-stone-300 shadow-sm mt-8">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-stone-600" />
              <div>
                <h3 className="text-base font-bold font-heading text-stone-900">
                  Past Procurement & Settlement History
                </h3>
                <p className="text-xs text-stone-500">
                  Previous transactions verified with digital receipts
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-500 bg-stone-50">
                  <th className="py-3 px-4">PO Number</th>
                  <th className="py-3 px-4">Batch ID</th>
                  <th className="py-3 px-4">Crop Purchased</th>
                  <th className="py-3 px-4">Farmer</th>
                  <th className="py-3 px-4">Total Weight</th>
                  <th className="py-3 px-4">Settlement</th>
                  <th className="py-3 px-4">Delivered</th>
                  <th className="py-3 px-4 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                {mockPurchasedHistory.map((row) => (
                  <tr key={row.id} className="hover:bg-stone-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-stone-700">{row.id}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-900">{row.batchCode}</td>
                    <td className="py-3 px-4 font-semibold text-stone-900">{row.crop}</td>
                    <td className="py-3 px-4 text-stone-600">{row.farmer}</td>
                    <td className="py-3 px-4 font-bold text-stone-900">{row.quantityKg} kg</td>
                    <td className="py-3 px-4 font-bold text-emerald-800">{row.totalPaid}</td>
                    <td className="py-3 px-4 text-stone-500">{row.deliveredOn}</td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/verify/${row.batchCode}`}
                        className="text-xs font-semibold text-emerald-800 hover:underline"
                      >
                        Proof ✓
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BuyerDashboard;
