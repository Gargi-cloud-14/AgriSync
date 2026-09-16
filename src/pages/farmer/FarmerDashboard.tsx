import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { produceService } from '../../services/produceService';
import { storageService } from '../../services/storageService';
import { weatherService } from '../../services/weatherService';
import type { ProduceBatch, StorageFacility, WeatherData } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StatCard } from '../../components/common/StatCard';
import {
  Wheat,
  Plus,
  Warehouse,
  Truck,
  QrCode,
  Calendar,
  IndianRupee,
  CloudSun,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FarmerDashboard: React.FC = () => {
  const [batches, setBatches] = useState<ProduceBatch[]>([]);
  const [facilities, setFacilities] = useState<StorageFacility[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for "Add Produce"
  const [newCrop, setNewCrop] = useState('');
  const [newVariety, setNewVariety] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newGrade, setNewGrade] = useState('Grade A+');
  const [newTargetPrice, setNewTargetPrice] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [batchList, facList, weatherData] = await Promise.all([
          produceService.getBatches(),
          storageService.getFacilities(),
          weatherService.getCurrentWeather(),
        ]);
        setBatches(batchList);
        setFacilities(facList);
        setWeather(weatherData);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCrop || !newQuantity) return;

    try {
      const created = await produceService.createBatch({
        farmerId: 'f-patil-01',
        farmerName: 'Rameshwar Patil',
        farmLocation: 'Dindori, Nashik, MH',
        cropName: newCrop,
        variety: newVariety || 'Standard',
        quantityKg: Number(newQuantity),
        qualityGrade: newGrade,
        targetPricePerKg: Number(newTargetPrice) || 45,
        harvestDate: new Date().toISOString().split('T')[0],
        status: 'HARVESTED',
      });
      setBatches((prev) => [created, ...prev]);
      setIsModalOpen(false);
      setNewCrop('');
      setNewVariety('');
      setNewQuantity('');
      setNewTargetPrice('');
    } catch (err) {
      console.error('Failed to log batch', err);
    }
  };

  const totalKg = batches.reduce((acc, b) => acc + (b.quantityKg || 0), 0);
  const totalValue = batches.reduce(
    (acc, b) => acc + (b.quantityKg || 0) * (b.targetPricePerKg || 40),
    0
  );

  return (
    <DashboardLayout
      title="Farmer Portal"
      subtitle="Register produce batches, discover pre-cooling storage, and arrange smart freight."
      actionButton={
        <Button
          variant="primary"
          size="md"
          className="shadow-sm"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Harvest Produce
        </Button>
      }
    >
      {/* Weather Alert Strip if available */}
      {weather && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-900 text-white border border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <CloudSun className="w-6 h-6 text-amber-300 shrink-0" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Local Agro-Weather ({weather.location})
              </span>
              <p className="text-xs text-stone-200 mt-0.5">
                {weather.recommendation}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs shrink-0 font-mono">
            <span className="bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-700">
              {weather.temperature}°C • {weather.humidity}% Humidity
            </span>
          </div>
        </div>
      )}

      {/* Primary KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatCard
          title="Total Produce Logged"
          value={`${(totalKg / 1000).toFixed(1)} Tons`}
          subtext={`${batches.length} active registered batches`}
          icon={<Wheat className="w-5 h-5" />}
        />
        <StatCard
          title="Est. Harvest Value"
          value={`₹${totalValue.toLocaleString('en-IN')}`}
          subtext="Projected farm-gate revenue"
          icon={<IndianRupee className="w-5 h-5" />}
        />
        <StatCard
          title="Storage Booked"
          value={`${batches.filter((b) => b.status === 'STORED').length} Batches`}
          subtext="In pre-cooling cold rooms"
          icon={<Warehouse className="w-5 h-5" />}
        />
        <StatCard
          title="In Transit to Mandi"
          value={`${batches.filter((b) => b.status === 'IN_TRANSIT').length} Shipments`}
          subtext="Tracked reefer freight"
          icon={<Truck className="w-5 h-5" />}
        />
      </div>

      {/* Main Section: Active Produce Batches */}
      <div className="space-y-6">
        <Card variant="default" padding="lg" className="bg-white border-stone-300 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
            <div>
              <h3 className="text-lg font-bold font-heading text-stone-900">
                Registered Produce Batches
              </h3>
              <p className="text-xs text-stone-500">
                Batches logged with cryptographic IDs and real-time lifecycle tracking
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-500">
                {batches.length} Recorded
              </span>
            </div>
          </div>

          {/* Batches Table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-500 bg-stone-50">
                  <th className="py-3 px-4">Batch ID</th>
                  <th className="py-3 px-4">Crop & Variety</th>
                  <th className="py-3 px-4">Harvest Date</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Quality Grade</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                {batches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-900">
                      {batch.batchCode}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-stone-900 block">{batch.cropName}</span>
                      <span className="text-[11px] text-stone-500">{batch.variety}</span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">
                      {batch.harvestDate}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-stone-900">
                      {batch.quantityKg} kg
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="emerald" size="sm">
                        {batch.qualityGrade}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={batch.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          to={`/verify/${batch.batchCode}`}
                          className="p-1.5 rounded-lg text-stone-600 hover:text-emerald-800 hover:bg-stone-100 border border-stone-200"
                          title="View Traceability Certificate"
                        >
                          <QrCode className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Available Cold Storage Facilities Near Nashik */}
        <Card variant="default" padding="lg" className="bg-white border-stone-300 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h3 className="text-lg font-bold font-heading text-stone-900">
                Nearby Cold Storage Facilities
              </h3>
              <p className="text-xs text-stone-500">
                Verified chambers ready to intake perishables within 25 km
              </p>
            </div>
            <Link
              to="/storage"
              className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
            >
              <span>Explore Storage Network</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {facilities.map((fac) => (
              <div
                key={fac.id}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-stone-900">{fac.name}</span>
                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {fac.currentTempC}°C
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mb-3">{fac.location}</p>
                  <div className="text-xs text-stone-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Available Capacity:</span>
                      <strong className="text-stone-800">{fac.availableCapacityTons} Tons</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Rate per Day:</span>
                      <strong className="text-emerald-800">₹{fac.ratePerTonPerDay} / ton</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => alert(`Space booking inquiry initiated for ${fac.name}. Direct coordination enabled.`)}
                  >
                    Book Space
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Modal: Add Harvest Produce */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-stone-300">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Wheat className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold font-heading text-stone-900">
                  Register Harvest Produce Batch
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Crop Name
                </label>
                <input
                  type="text"
                  required
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value)}
                  placeholder="e.g. Table Grapes, Pomegranate, Onion"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Variety
                  </label>
                  <input
                    type="text"
                    value={newVariety}
                    onChange={(e) => setNewVariety(e.target.value)}
                    placeholder="e.g. Sonaka, Bhagwa"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Quantity (kg)
                  </label>
                  <input
                    type="number"
                    required
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    placeholder="e.g. 2400"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Quality Grade
                  </label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                  >
                    <option value="Export Grade A+">Export Grade A+</option>
                    <option value="Grade A">Grade A</option>
                    <option value="Grade B">Grade B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Target Price (₹/kg)
                  </label>
                  <input
                    type="number"
                    value={newTargetPrice}
                    onChange={(e) => setNewTargetPrice(e.target.value)}
                    placeholder="e.g. 55"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Register Batch
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default FarmerDashboard;
