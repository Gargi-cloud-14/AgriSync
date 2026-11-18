import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { bookingService, StorageBooking } from '../../services/bookingService';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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
  Fuel,
  ArrowRight,
  Warehouse,
  Search,
  Filter,
  Phone,
  ExternalLink,
  Printer,
  ChevronRight,
  Sparkles,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Custom Map Markers
const createMapIcon = (type: 'farm' | 'storage' | 'truck') => {
  const configs = {
    farm: { bg: '#059669', emoji: '🌾', label: 'Farm Origin' },
    storage: { bg: '#2563eb', emoji: '🏢', label: 'Cold Storage' },
    truck: { bg: '#0284c7', emoji: '🚚', label: 'Fleet In-Transit' },
  };
  const cfg = configs[type];
  return L.divIcon({
    className: 'custom-fleet-icon',
    html: `
      <div style="
        background: ${cfg.bg};
        color: white;
        width: 34px;
        height: 34px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25), 0 0 0 2px white;
        font-size: 16px;
      ">
        ${cfg.emoji}
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -20],
  });
};

// Component to smoothly animate and pan the map to the selected booking's route bounds
function TransporterMapFlyTo({ booking }: { booking: StorageBooking | null }) {
  const map = useMap();

  useEffect(() => {
    if (!booking) return;

    if (booking.routeCoordinates && booking.routeCoordinates.length > 0) {
      const bounds = L.latLngBounds(booking.routeCoordinates);
      map.flyToBounds(bounds, {
        padding: [35, 35],
        duration: 1.2,
        easeLinearity: 0.25,
        maxZoom: 14,
      });
    } else {
      const bounds = L.latLngBounds([
        [booking.originLat, booking.originLng],
        [booking.storageLat, booking.storageLng],
      ]);
      map.flyToBounds(bounds, {
        padding: [40, 40],
        duration: 1.2,
        easeLinearity: 0.25,
        maxZoom: 13,
      });
    }
  }, [map, booking]);

  return null;
}

export const TransporterDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<StorageBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<StorageBooking | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'IN_TRANSIT' | 'ARRIVED_AT_STORAGE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'active_freight' | 'fleet_telemetry'>('active_freight');

  const loadBookings = () => {
    const list = bookingService.getBookings();
    setBookings(list);
    if (list.length > 0 && !selectedBooking) {
      setSelectedBooking(list[0]);
    }
  };

  useEffect(() => {
    loadBookings();
    const handleBookingCreated = () => loadBookings();
    window.addEventListener('agrisync_booking_created', handleBookingCreated);
    return () => window.removeEventListener('agrisync_booking_created', handleBookingCreated);
  }, []);

  const handleMarkArrived = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    bookingService.updateStatus(id, 'ARRIVED_AT_STORAGE');
    loadBookings();
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking((prev) => (prev ? { ...prev, status: 'ARRIVED_AT_STORAGE' } : null));
    }
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.bookingCode.toLowerCase().includes(q) ||
      b.storageName.toLowerCase().includes(q) ||
      b.farmLocation.toLowerCase().includes(q) ||
      b.assignedVehicleNumber.toLowerCase().includes(q) ||
      b.cropName.toLowerCase().includes(q)
    );
  });

  // Calculate Real Telemetry Aggregates
  const activeTripsCount = bookings.filter((b) => b.status === 'IN_TRANSIT').length;
  const completedTripsCount = bookings.filter((b) => b.status === 'ARRIVED_AT_STORAGE').length;
  const totalKmRun = bookings.reduce((acc, b) => acc + (b.roadDistanceKm || 0), 0);
  const totalFreightRevenue = bookings.reduce((acc, b) => acc + (b.estimatedTotalFareInr || 0), 0);
  const totalFuelCost = bookings.reduce((acc, b) => acc + (b.estimatedFuelCostInr || 0), 0);

  // Fleet list mapped to live bookings
  const fleetVehicles = [
    {
      vehicleNumber: 'MH-15-EG-4821',
      model: 'Mahindra Bolero Maxi Truck',
      chassisType: 'Insulated Cold Van',
      capacityTons: 2.5,
      driverName: 'Sanjay Deshmukh',
      driverPhone: '+91 98601 77394',
      status: bookings.some((b) => b.assignedVehicleNumber === 'MH-15-EG-4821' && b.status === 'IN_TRANSIT')
        ? 'ON_ROAD'
        : 'READY',
      currentTrip: bookings.find((b) => b.assignedVehicleNumber === 'MH-15-EG-4821' && b.status === 'IN_TRANSIT'),
      batteryStatus: '98% / Solar Aux',
      reeferUnit: 'Carrier Transicold Neos 100',
    },
    {
      vehicleNumber: 'MH-15-AK-9042',
      model: 'Tata 407 LPT Chilled',
      chassisType: 'Medium Multi-Temp Box',
      capacityTons: 4.5,
      driverName: 'Raju Shinde',
      driverPhone: '+91 98221 44120',
      status: bookings.some((b) => b.assignedVehicleNumber === 'MH-15-AK-9042' && b.status === 'IN_TRANSIT')
        ? 'ON_ROAD'
        : 'READY',
      currentTrip: bookings.find((b) => b.assignedVehicleNumber === 'MH-15-AK-9042' && b.status === 'IN_TRANSIT'),
      batteryStatus: '100% / Alternator',
      reeferUnit: 'Thermo King V-300 MAX',
    },
    {
      vehicleNumber: 'MH-15-TR-2104',
      model: 'Ashok Leyland Dost+',
      chassisType: 'Agri Ventilated Express',
      capacityTons: 1.8,
      driverName: 'Dattatray Wagh',
      driverPhone: '+91 94230 88192',
      status: bookings.some((b) => b.assignedVehicleNumber === 'MH-15-TR-2104' && b.status === 'IN_TRANSIT')
        ? 'ON_ROAD'
        : 'READY',
      currentTrip: bookings.find((b) => b.assignedVehicleNumber === 'MH-15-TR-2104' && b.status === 'IN_TRANSIT'),
      batteryStatus: '94% / Standby',
      reeferUnit: 'Direct Airflow Tarpaulin Box',
    },
  ];

  return (
    <DashboardLayout
      title="Transporter Logistics Operations"
      subtitle="Live fleet dispatches, agricultural cold storage freight, and trip route telemetry."
      actionButton={
        <Link
          to="/farmer#transport"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-800 hover:bg-emerald-700 text-white shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Farm Dispatch</span>
        </Link>
      }
    >
      {/* Top Professional KPI Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Active Hauls */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Active Consignments</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900 tracking-tight">
            {activeTripsCount}
            <span className="text-xs font-normal text-stone-500 font-sans ml-1.5">on road</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
            <span className="font-semibold text-emerald-700">{completedTripsCount} delivered</span>
            <span>• {bookings.length} total dispatches</span>
          </div>
        </div>

        {/* Distance Logged */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">MAPPED ROAD MILEAGE</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Navigation className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900 tracking-tight">
            {Math.round(totalKmRun)}
            <span className="text-xs font-normal text-stone-500 font-sans ml-1">km</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Real-time OSRM calculated highway routing</div>
        </div>

        {/* Fuel Outlay */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">DIESEL FUEL OUTLAY</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Fuel className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900 tracking-tight">
            ₹{totalFuelCost.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Calculated at ₹92.5/L commercial tariff</div>
        </div>

        {/* Freight Revenue */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">FLEET FREIGHT BILLING</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-800 tracking-tight">
            ₹{totalFreightRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">100% verified farmer storage haulage</div>
        </div>
      </div>

      {/* Main Freight Workspace Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Shipment List & Filters (7 Columns) */}
        <div className="xl:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
            {/* Header & Controls */}
            <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-stone-900">Live Dispatched Shipments</span>
                <span className="text-xs font-mono font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full">
                  {filteredBookings.length}
                </span>
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    statusFilter === 'ALL'
                      ? 'bg-stone-900 text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  All ({bookings.length})
                </button>
                <button
                  onClick={() => setStatusFilter('IN_TRANSIT')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    statusFilter === 'IN_TRANSIT'
                      ? 'bg-sky-700 text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  In Transit ({activeTripsCount})
                </button>
                <button
                  onClick={() => setStatusFilter('ARRIVED_AT_STORAGE')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    statusFilter === 'ARRIVED_AT_STORAGE'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Delivered ({completedTripsCount})
                </button>
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="p-3 bg-stone-50/70 border-b border-stone-100">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Waybill #, Destination Cold Storage, Crop, or Vehicle..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            {/* Empty State */}
            {filteredBookings.length === 0 ? (
              <div className="text-center py-14 px-4">
                <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 mx-auto flex items-center justify-center text-xl mb-3">
                  📦
                </div>
                <h4 className="text-sm font-bold text-stone-800">No Dispatches Match Criteria</h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
                  {bookings.length === 0
                    ? 'Book a cold storage run from the Farmer Portal to see real driving paths and vehicle telemetry stream here live.'
                    : 'Try clearing your search query or switching the status filter.'}
                </p>
                {bookings.length === 0 && (
                  <Link
                    to="/farmer#transport"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-800 text-white hover:bg-emerald-700 transition-all shadow-2xs"
                  >
                    <span>Go to Farmer Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            ) : (
              /* Consignment Cards List */
              <div className="divide-y divide-stone-100 max-h-[680px] overflow-y-auto">
                {filteredBookings.map((b) => {
                  const isSelected = selectedBooking?.id === b.id;
                  const isDelivered = b.status === 'ARRIVED_AT_STORAGE';

                  return (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBooking(b)}
                      className={`p-4 transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'bg-sky-50/70 border-l-4 border-l-sky-600'
                          : 'hover:bg-stone-50/80 border-l-4 border-l-transparent'
                      }`}
                    >
                      {/* Top Row: Waybill & Status */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-sky-900 bg-sky-100/70 px-2 py-0.5 rounded border border-sky-200">
                            {b.bookingCode}
                          </span>
                          <span className="text-[11px] text-stone-400">
                            {new Date(b.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                              isDelivered
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-sky-100 text-sky-800'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isDelivered ? 'bg-emerald-600' : 'bg-sky-600 animate-pulse'
                              }`}
                            />
                            {isDelivered ? 'Delivered' : 'In Transit'}
                          </span>

                          {!isDelivered && (
                            <button
                              onClick={(e) => handleMarkArrived(b.id, e)}
                              className="text-[10px] font-semibold bg-emerald-700 hover:bg-emerald-600 text-white px-2.5 py-1 rounded-lg transition-colors shadow-2xs"
                              title="Mark consignment arrived at cold storage"
                            >
                              Confirm Arrival
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Route Path Indicator */}
                      <div className="my-2.5">
                        <div className="flex items-start gap-2">
                          <div className="flex flex-col items-center mt-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                            <div className="w-0.5 h-6 bg-stone-300 my-0.5" />
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                          </div>
                          <div className="flex-1 space-y-1 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-stone-700 truncate max-w-[240px]">
                                {b.farmLocation}
                              </span>
                              <span className="text-[10px] text-stone-400 font-mono">Origin</span>
                            </div>
                            <div className="flex justify-between items-center pt-0.5">
                              <span className="font-bold text-stone-900 truncate max-w-[240px]">
                                {b.storageName}
                              </span>
                              <span className="text-[10px] font-semibold text-blue-700 font-mono">Destination</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Shipment Metadata Pill Grid */}
                      <div className="grid grid-cols-4 gap-2 text-xs pt-2 mt-2 border-t border-stone-200/60">
                        <div>
                          <span className="text-[10px] text-stone-400 uppercase font-medium block">Cargo</span>
                          <span className="font-semibold text-stone-800 truncate block">{b.cropName}</span>
                          <span className="text-[10px] text-stone-500 font-mono">{b.quantityTons} Tons</span>
                        </div>

                        <div>
                          <span className="text-[10px] text-stone-400 uppercase font-medium block">Vehicle</span>
                          <span className="font-mono font-bold text-stone-800 text-[11px] block">{b.assignedVehicleNumber}</span>
                          <span className="text-[10px] text-stone-500 truncate block">{b.assignedDriverName}</span>
                        </div>

                        <div>
                          <span className="text-[10px] text-stone-400 uppercase font-medium block">Road Distance</span>
                          <span className="font-mono font-bold text-stone-800 block">{b.roadDistanceKm} km</span>
                          <span className="text-[10px] text-stone-500 font-mono">ETA: {b.eta}</span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-stone-400 uppercase font-medium block">Freight Billing</span>
                          <span className="font-mono font-bold text-emerald-800 text-sm block">₹{b.estimatedTotalFareInr}</span>
                          <span className="text-[10px] text-amber-700 font-semibold font-mono">Fuel: ₹{b.estimatedFuelCostInr}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Route Map & Selected Waybill Manifest (5 Columns) */}
        <div className="xl:col-span-5 space-y-4">
          {selectedBooking ? (
            <>
              {/* Interactive Transit Map for the selected consignment */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
                <div className="p-3.5 bg-stone-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold tracking-wider uppercase text-stone-200">
                      Live Transit Map: {selectedBooking.bookingCode}
                    </span>
                  </div>
                  <span className="text-[11px] text-sky-400 font-mono font-semibold">
                    {selectedBooking.roadDistanceKm} km • ~{selectedBooking.estimatedTravelTimeMin}m
                  </span>
                </div>

                {/* Map View */}
                <div className="h-64 w-full relative z-10">
                  <MapContainer
                    center={[
                      (selectedBooking.originLat + selectedBooking.storageLat) / 2,
                      (selectedBooking.originLng + selectedBooking.storageLng) / 2,
                    ]}
                    zoom={10}
                    scrollWheelZoom={false}
                    className="h-full w-full"
                    style={{ background: '#f8fafc' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Smooth FlyTo Animation Controller on Selection Change */}
                    <TransporterMapFlyTo booking={selectedBooking} />

                    {/* Farm Gate Origin */}
                    <Marker
                      position={[selectedBooking.originLat, selectedBooking.originLng]}
                      icon={createMapIcon('farm')}
                    >
                      <Popup>
                        <div className="text-xs p-1">
                          <strong className="block text-emerald-800">🌾 Farm Gate Origin</strong>
                          <span className="text-stone-700">{selectedBooking.farmLocation}</span>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Cold Storage Destination */}
                    <Marker
                      position={[selectedBooking.storageLat, selectedBooking.storageLng]}
                      icon={createMapIcon('storage')}
                    >
                      <Popup>
                        <div className="text-xs p-1">
                          <strong className="block text-blue-800">🏢 Target Cold Room</strong>
                          <span className="text-stone-700">{selectedBooking.storageName}</span>
                          <div className="text-[10px] text-stone-500 mt-1">Temp: {selectedBooking.storageTempC}°C</div>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Route Polyline */}
                    {selectedBooking.routeCoordinates && selectedBooking.routeCoordinates.length > 0 && (
                      <Polyline
                        positions={selectedBooking.routeCoordinates}
                        pathOptions={{
                          color: '#2563eb',
                          weight: 4,
                          opacity: 0.85,
                        }}
                      />
                    )}
                  </MapContainer>
                </div>

                {/* Route Summary Strip */}
                <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                  <span className="truncate max-w-[220px]">
                    Corridor: <strong>{selectedBooking.routeSummary}</strong>
                  </span>
                  <span className="font-mono text-emerald-800 font-semibold">
                    Reefer: {selectedBooking.liveCargoTempC}°C
                  </span>
                </div>
              </div>

              {/* Waybill Consignment Card */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      Digital E-Waybill
                    </span>
                    <h4 className="text-base font-bold text-stone-900 font-heading mt-1">
                      {selectedBooking.bookingCode}
                    </h4>
                  </div>
                  <button
                    onClick={() =>
                      alert(
                        `E-Waybill #${selectedBooking.bookingCode}\nFarmer: ${selectedBooking.farmerName}\nOrigin: ${selectedBooking.farmLocation}\nDestination: ${selectedBooking.storageName}\nCrop: ${selectedBooking.cropName} (${selectedBooking.quantityTons} T)\nDriver: ${selectedBooking.assignedDriverName} (${selectedBooking.assignedDriverPhone})\nFare: ₹${selectedBooking.estimatedTotalFareInr}`
                      )
                    }
                    className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 transition-colors"
                    title="Print Consignment Note"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>

                {/* Logistics Key-Values */}
                <div className="space-y-2.5 text-xs text-stone-700">
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">Produce Shipper:</span>
                    <strong className="text-stone-900">{selectedBooking.farmerName}</strong>
                  </div>

                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">Destination Storage:</span>
                    <strong className="text-stone-900 text-right max-w-[210px] truncate">
                      {selectedBooking.storageName}
                    </strong>
                  </div>

                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">Cold Hub Manager:</span>
                    <span className="text-stone-800 font-medium">
                      {selectedBooking.operatorName} ({selectedBooking.storagePhone})
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">Vehicle Assigned:</span>
                    <span className="font-mono font-bold text-stone-900">
                      {selectedBooking.assignedVehicleNumber} ({selectedBooking.assignedVehicleModel})
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">Driver Contact:</span>
                    <span className="text-stone-800 font-medium">
                      {selectedBooking.assignedDriverName} ({selectedBooking.assignedDriverPhone})
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">Chamber Temp Requirement:</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {selectedBooking.storageTempC}°C
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">Total Fuel Expense:</span>
                    <span className="font-mono font-bold text-amber-700">
                      ₹{selectedBooking.estimatedFuelCostInr}
                    </span>
                  </div>

                  <div className="flex justify-between pt-1">
                    <span className="text-stone-900 font-bold">Total Freight Contract:</span>
                    <span className="font-mono font-extrabold text-emerald-800 text-base">
                      ₹{selectedBooking.estimatedTotalFareInr}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500 text-xs">
              Select any consignment from the list to view its route manifest, telemetry, and waybill details.
            </div>
          )}
        </div>
      </div>

      {/* Fleet Vehicles Status Section */}
      <div className="mt-8 pt-6 border-t border-stone-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold font-heading text-stone-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-700" />
              <span>Transporter Fleet & Active Reefer Status</span>
            </h3>
            <p className="text-xs text-stone-500">
              Cooperative vehicle availability and real-time cargo temperature monitoring
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {fleetVehicles.filter((v) => v.status === 'READY').length} Ready for Immediate Loading
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fleetVehicles.map((v) => (
            <div
              key={v.vehicleNumber}
              className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs hover:shadow-xs transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono font-bold text-xs text-stone-900 block leading-tight">
                      {v.vehicleNumber}
                    </span>
                    <span className="text-[10px] text-stone-400">{v.model}</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    v.status === 'ON_ROAD'
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {v.status === 'ON_ROAD' ? 'On Trip' : 'Available'}
                </span>
              </div>

              <div className="text-xs text-stone-600 space-y-1.5 pt-2 border-t border-stone-100">
                <div className="flex justify-between">
                  <span className="text-stone-400">Driver:</span>
                  <span className="font-medium text-stone-800">{v.driverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Phone:</span>
                  <span className="font-mono text-stone-700">{v.driverPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Reefer Box:</span>
                  <span className="text-stone-800 truncate max-w-[170px]">{v.reeferUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Battery & Aux:</span>
                  <span className="text-emerald-700 font-medium">{v.batteryStatus}</span>
                </div>
              </div>

              {v.currentTrip && (
                <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-100 text-xs text-sky-950 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-sky-700 uppercase">Assigned Consignment</span>
                    <span className="text-[10px] font-mono font-bold text-sky-800">
                      {v.currentTrip.bookingCode}
                    </span>
                  </div>
                  <div className="font-semibold text-stone-900 truncate">
                    {v.currentTrip.storageName}
                  </div>
                  <div className="text-[10px] text-sky-700 flex justify-between">
                    <span>{v.currentTrip.roadDistanceKm} km road leg</span>
                    <span className="font-semibold">₹{v.currentTrip.estimatedTotalFareInr}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TransporterDashboard;
