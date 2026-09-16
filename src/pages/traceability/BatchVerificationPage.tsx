import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { traceabilityService } from '../../services/traceabilityService';
import type { TraceabilityRecord } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import {
  ShieldCheck,
  QrCode,
  CheckCircle2,
  Calendar,
  MapPin,
  Thermometer,
  Truck,
  Warehouse,
  Wheat,
  Store,
  ArrowLeft,
  Search,
  ExternalLink,
  Printer,
  Copy,
  Check,
} from 'lucide-react';

export const BatchVerificationPage: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const activeBatchId = batchId || 'AGRI-2026-00421';

  const [record, setRecord] = useState<TraceabilityRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchRecord() {
      setLoading(true);
      try {
        const data = await traceabilityService.getRecordByBatchId(activeBatchId);
        setRecord(data);
      } finally {
        setLoading(false);
      }
    }
    fetchRecord();
  }, [activeBatchId]);

  const copyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStageIcon = (type: string) => {
    switch (type) {
      case 'HARVEST':
        return <Wheat className="w-5 h-5 text-emerald-700" />;
      case 'STORAGE':
        return <Warehouse className="w-5 h-5 text-amber-700" />;
      case 'MONITORING':
        return <Thermometer className="w-5 h-5 text-emerald-700" />;
      case 'TRANSPORT':
        return <Truck className="w-5 h-5 text-sky-700" />;
      case 'MARKET':
      default:
        return <Store className="w-5 h-5 text-teal-700" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 text-stone-900">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Breadcrumb & Navigation */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-emerald-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to AgriSync Platform</span>
          </Link>

          {/* Quick Search for Batch */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Lookup Batch Code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-3 pr-8 py-1.5 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>
            {searchQuery && (
              <Link to={`/verify/${searchQuery}`}>
                <Button variant="primary" size="sm" className="text-xs py-1.5 px-2.5">
                  Verify
                </Button>
              </Link>
            )}
          </div>
        </div>

        {record ? (
          <div className="space-y-6">
            {/* Primary Provenance Certificate Header */}
            <Card
              variant="default"
              padding="lg"
              className="bg-white border-stone-300 shadow-md relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-stone-200 gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold mb-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Cryptographically Anchored Produce Batch</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-stone-900 tracking-tight">
                    Batch: <span className="font-mono text-emerald-800">{record.batchId}</span>
                  </h1>
                  <p className="text-xs text-stone-500 mt-1">
                    Produced by <strong>{record.farmer}</strong> • Farm Origin: {record.origin}
                  </p>
                </div>

                <div className="flex flex-col sm:items-end gap-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-stone-500">Audit Status:</span>
                    <Badge variant="emerald" size="md" className="font-bold text-xs py-1 px-3">
                      <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />
                      VERIFIED ✓
                    </Badge>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1 text-xs text-stone-600 hover:text-emerald-800 font-medium"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Batch Certificate</span>
                  </button>
                </div>
              </div>

              {/* Crop Metadata Key Values */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
                <div>
                  <span className="text-stone-500 block">Produce Variety</span>
                  <span className="font-bold text-stone-900 text-sm">{record.crop}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Batch Weight</span>
                  <span className="font-bold text-stone-900 text-sm">{record.quantityKg} kg</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Quality Grade</span>
                  <span className="font-bold text-emerald-800 text-sm">{record.qualityGrade}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Harvest Date</span>
                  <span className="font-bold text-stone-900 text-sm">{record.harvestDate}</span>
                </div>
              </div>

              {/* Immutable Blockchain Hash Inspector */}
              <div className="p-3.5 rounded-xl bg-stone-900 text-stone-200 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="truncate">
                  <span className="text-stone-400 block sm:inline mr-2">Blockchain Attestation Hash:</span>
                  <span className="text-emerald-400 font-bold">{record.blockchainTxHash}</span>
                </div>
                <button
                  onClick={() => copyHash(record.blockchainTxHash)}
                  className="inline-flex items-center gap-1 text-xs text-stone-300 hover:text-white shrink-0 bg-stone-800 px-2.5 py-1 rounded border border-stone-700"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy Hash'}</span>
                </button>
              </div>
            </Card>

            {/* Complete 5-Stage Chronological Audit Trail */}
            <Card variant="default" padding="lg" className="bg-white border-stone-300 shadow-md">
              <h2 className="text-base font-bold font-heading text-stone-900 mb-1">
                Chronological Supply-Chain Audit Trail
              </h2>
              <p className="text-xs text-stone-500 mb-6">
                Verified tamper-evident stage transitions and sensor attestation logs
              </p>

              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-200">
                {record.stages.map((stage) => (
                  <div key={stage.stageNumber} className="relative group">
                    {/* Timeline Node Pip */}
                    <div className="absolute -left-6 sm:-left-8 top-1 w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold ring-4 ring-white shadow-xs">
                      {stage.stageNumber}
                    </div>

                    {/* Stage Card Content */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-emerald-600 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center">
                            {getStageIcon(stage.type)}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold font-heading text-stone-900">
                              {stage.title}
                            </h3>
                            <span className="text-[11px] text-stone-500">{stage.actor}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="emerald" size="sm">
                            {stage.status}
                          </Badge>
                          <span className="font-mono text-stone-500 text-[11px]">
                            {stage.timestamp}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-600 my-2 leading-relaxed">
                        {stage.details}
                      </p>

                      <div className="pt-2.5 mt-2.5 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          {stage.location}
                        </span>
                        <span className="font-mono bg-white px-2 py-0.5 rounded border border-stone-200 text-stone-700">
                          Checkpoint Hash: {stage.hash}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Blockchain Architecture Principle Note */}
            <div className="p-4 rounded-2xl bg-stone-900 text-stone-300 text-xs flex items-start gap-3 border border-stone-800">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block mb-0.5">
                  AgriSync Decentralized Architecture Standard
                </span>
                <p className="text-stone-400 leading-relaxed">
                  Notice: AgriSync stores primary relational media and high-frequency time-series off-chain in distributed cold stores. Only high-consequence state transitions, quality grades, and critical sensor compliance hashes are anchored to the blockchain for verifiable provenance.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8">
            <p className="text-sm text-stone-600 mb-4">
              No verification record found for batch: <strong className="font-mono">{activeBatchId}</strong>
            </p>
            <Link to="/verify/AGRI-2026-00421">
              <Button variant="primary" size="sm">
                Load Sample Batch (AGRI-2026-00421)
              </Button>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BatchVerificationPage;
