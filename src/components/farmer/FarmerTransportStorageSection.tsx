import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Warehouse,
  Truck,
  Fuel,
  Clock,
  Navigation,
  Sparkles,
  Phone,
  Thermometer,
  Layers,
  Search,
  CheckCircle2,
  ChevronRight,
  Info,
  IndianRupee,
  ShieldCheck,
  Compass,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  StorageLocation,
  RouteDetail,
  getTopNearestStorages,
  fetchDrivingRoute,
  searchRealWorldPlaces,
  reverseGeocodeLocation,
} from '../../services/storageMapService';
import { bookingService } from '../../services/bookingService';
import { useNavigate } from 'react-router-dom';

// Fix Leaflet marker icons with clean SVG DivIcons
const createFarmIcon = () =>
  L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div style="
        background: #15803d;
        color: white;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 14px rgba(0,0,0,0.4), 0 0 0 3px white;
        font-size: 18px;
        position: relative;
      ">
        🌾
        <div style="
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid #15803d;
        "></div>
      </div>
    `,
    iconSize: [38, 44],
    iconAnchor: [19, 44],
    popupAnchor: [0, -42],
  });

const createStorageIcon = (isSelected: boolean, rankIndex: number) =>
  L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div style="
        background: ${isSelected ? '#2563eb' : '#047857'};
        color: white;
        width: ${isSelected ? '44px' : '36px'};
        height: ${isSelected ? '44px' : '36px'};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: ${isSelected ? '0 0 0 4px #93c5fd, 0 6px 20px rgba(37,99,235,0.6)' : '0 4px 12px rgba(0,0,0,0.3), 0 0 0 2px white'};
        font-size: ${isSelected ? '20px' : '16px'};
        font-weight: bold;
        transition: all 0.3s ease;
        position: relative;
      ">
        #${rankIndex + 1}
        <div style="
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid ${isSelected ? '#2563eb' : '#047857'};
        "></div>
      </div>
    `,
    iconSize: isSelected ? [44, 50] : [36, 42],
    iconAnchor: isSelected ? [22, 50] : [18, 42],
    popupAnchor: [0, -42],
  });

// Component to dynamically fit map bounds when origin or destination changes
function MapRecenter({
  origin,
  selectedStorage,
  routeCoordinates,
}: {
  origin: { lat: number; lng: number };
  selectedStorage: StorageLocation | null;
  routeCoordinates?: [number, number][];
}) {
  const map = useMap();

  useEffect(() => {
    if (routeCoordinates && routeCoordinates.length > 0) {
      const bounds = L.latLngBounds(routeCoordinates);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else if (selectedStorage) {
      const bounds = L.latLngBounds([
        [origin.lat, origin.lng],
        [selectedStorage.lat, selectedStorage.lng],
      ]);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
    } else {
      map.setView([origin.lat, origin.lng], 11);
    }
  }, [map, origin, selectedStorage, routeCoordinates]);

  return null;
}

export interface FarmerTransportStorageSectionProps {
  initialOrigin?: {
    lat: number;
    lng: number;
    name: string;
  };
}

export const FarmerTransportStorageSection: React.FC<FarmerTransportStorageSectionProps> = ({
  initialOrigin = {
    lat: 20.011,
    lng: 73.79,
    name: 'Dindori Vineyard Farm Gate, Nashik (MH)',
  },
}) => {
  // Current Farm Location State
  const [currentOrigin, setCurrentOrigin] = useState(initialOrigin);
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  // Search Places state (OSM Nominatim API)
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ name: string; displayName: string; lat: number; lng: number }>>([]);

  // Popular Quick Location presets for instant farmer testing across states
  const quickLocations = [
    { name: 'Nashik (MH)', lat: 20.011, lng: 73.79 },
    { name: 'Pune / Baramati (MH)', lat: 18.5204, lng: 73.8567 },
    { name: 'Indore / Malwa (MP)', lat: 22.7196, lng: 75.8577 },
    { name: 'Khanna / Ludhiana (PB)', lat: 30.7071, lng: 76.2167 },
    { name: 'Sanand / Ahmedabad (GJ)', lat: 22.9868, lng: 72.3814 },
    { name: 'Agra / Yamuna Belt (UP)', lat: 27.1767, lng: 78.0081 },
  ];

  // Dynamic state: ONLY the top closest storages to the current farm location
  const topNearestStorages = useMemo(() => {
    return getTopNearestStorages(currentOrigin.lat, currentOrigin.lng, currentOrigin.name, 6);
  }, [currentOrigin]);

  // Selected Storage & Route State (defaults to the #1 closest storage)
  const [selectedStorage, setSelectedStorage] = useState<StorageLocation>(topNearestStorages[0]);
  const [routeDetail, setRouteDetail] = useState<RouteDetail | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [showDirectionsSteps, setShowDirectionsSteps] = useState(false);
  const [bookingSuccessModal, setBookingSuccessModal] = useState<any | null>(null);
  const navigate = useNavigate();

  // Whenever the farm origin changes, auto-select the #1 closest storage
  useEffect(() => {
    if (topNearestStorages.length > 0) {
      setSelectedStorage(topNearestStorages[0]);
    }
  }, [topNearestStorages]);

  // When selectedStorage or currentOrigin changes, compute real-world road route via OSRM Driving API
  useEffect(() => {
    if (!selectedStorage) return;

    let isMounted = true;
    setIsLoadingRoute(true);

    fetchDrivingRoute(currentOrigin.lat, currentOrigin.lng, selectedStorage.lat, selectedStorage.lng)
      .then((detail) => {
        if (isMounted) {
          setRouteDetail(detail);
          setIsLoadingRoute(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Route calculation error:', err);
          setIsLoadingRoute(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedStorage, currentOrigin]);

  // Handle live browser GPS detection
  const handleUseCurrentGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const placeName = await reverseGeocodeLocation(lat, lng);
        setCurrentOrigin({
          lat,
          lng,
          name: placeName || `GPS (${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E)`,
        });
        setIsDetectingGps(false);
      },
      (err) => {
        console.warn('GPS location request denied or unavailable:', err);
        alert('Could not retrieve GPS location. Keeping current origin point.');
        setIsDetectingGps(false);
      },
      { timeout: 8000 }
    );
  };

  // Handle Search for Real World Places API (OSM Nominatim)
  const handleSearchPlaces = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const places = await searchRealWorldPlaces(searchQuery, currentOrigin.lat, currentOrigin.lng);
      setSearchResults(places);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchedPlace = (place: { name: string; displayName: string; lat: number; lng: number }) => {
    setCurrentOrigin({
      lat: place.lat,
      lng: place.lng,
      name: place.name || place.displayName.split(',')[0],
    });
    setSearchResults([]);
    setSearchQuery('');
  };

  return (
    <div id="transport" className="space-y-6 pt-4 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-900 via-stone-900 to-sky-950 text-white shadow-md border border-emerald-800/40">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider border border-emerald-500/30">
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Smart Transport & Proximity Storage Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
            Top Nearest Cold Storages & Interactive Route Logistics
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl">
            Displays strictly the <strong>closest cold storage facilities</strong> relative to your farm production location. When your farm location changes anywhere across the country, the list dynamically recalculates to display only the nearest options with live road routes, fuel cost, and travel times.
          </p>
        </div>

        {/* GPS and Location Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleUseCurrentGps}
            disabled={isDetectingGps}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
          >
            <Compass className={`w-4 h-4 ${isDetectingGps ? 'animate-spin' : ''}`} />
            <span>{isDetectingGps ? 'Locating...' : 'Use My Current GPS'}</span>
          </button>
        </div>
      </div>

      {/* Origin Selector & Real-World Places Search Bar */}
      <Card variant="default" padding="md" className="bg-white border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Active Farm Origin */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Farm Production Location (Origin)
              </div>
              <div className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <span>{currentOrigin.name}</span>
                <span className="text-xs font-mono font-normal text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                  {currentOrigin.lat.toFixed(4)}, {currentOrigin.lng.toFixed(4)}
                </span>
              </div>
            </div>
          </div>

          {/* Real World Place Search via OpenStreetMap Nominatim */}
          <form onSubmit={handleSearchPlaces} className="flex items-center gap-2 flex-1 max-w-md relative">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any place in India (e.g. Pune, Indore, Ludhiana)..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50 focus:bg-white transition-all text-stone-800"
              />
            </div>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              disabled={isSearching}
              className="text-xs shrink-0"
            >
              {isSearching ? 'Searching...' : 'Change Farm'}
            </Button>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-stone-200 z-50 overflow-hidden divide-y divide-stone-100 max-h-56 overflow-y-auto">
                {searchResults.map((res, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSearchedPlace(res)}
                    className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-emerald-50 transition-colors flex items-start gap-2"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-stone-900">{res.name}</div>
                      <div className="text-[11px] text-stone-500 truncate max-w-sm">{res.displayName}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Quick Location Switcher Buttons */}
        <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-semibold text-stone-500">Quick Test Locations:</span>
          {quickLocations.map((loc) => {
            const isActive = Math.abs(currentOrigin.lat - loc.lat) < 0.05 && Math.abs(currentOrigin.lng - loc.lng) < 0.05;
            return (
              <button
                key={loc.name}
                type="button"
                onClick={() =>
                  setCurrentOrigin({
                    lat: loc.lat,
                    lng: loc.lng,
                    name: `${loc.name} Agricultural Belt`,
                  })
                }
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {loc.name}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Main Grid: ONLY Closest Storages (Left) & Interactive Map + Route Info (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Top Nearest Storages Only (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card variant="default" padding="md" className="bg-white border-stone-200 shadow-xs">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-sm font-bold font-heading text-stone-900 flex items-center gap-1.5">
                  <Warehouse className="w-4 h-4 text-emerald-700" />
                  <span>Top Nearest Storages ({topNearestStorages.length})</span>
                </span>
                <p className="text-[11px] text-stone-500">
                  Strictly ranked by shortest proximity to your current farm
                </p>
              </div>

              <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                Closest First
              </span>
            </div>

            {/* Storage Cards List */}
            <div className="space-y-3 mt-3 max-h-[640px] overflow-y-auto pr-1">
              {topNearestStorages.map((storage, idx) => {
                const isSelected = selectedStorage.id === storage.id;
                return (
                  <div
                    key={storage.id}
                    onClick={() => setSelectedStorage(storage)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-left relative ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-md ring-2 ring-blue-500/20'
                        : 'border-stone-200 bg-stone-50/70 hover:bg-white hover:border-emerald-300 hover:shadow-xs'
                    }`}
                  >
                    {/* Header with Rank Badge */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[11px] font-mono font-black px-1.5 py-0.5 rounded ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-emerald-800 text-white'
                          }`}>
                            #{idx + 1}
                          </span>
                          <span className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">
                            {storage.name}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                          <span className="truncate">{storage.address}, {storage.city}</span>
                        </div>
                      </div>

                      {/* Distance Badge */}
                      <div className="text-right shrink-0">
                        <span className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded-lg inline-block ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}>
                          {storage.distanceKm} km
                        </span>
                        <div className="text-[10px] text-stone-400 mt-0.5">★ {storage.rating} / 5.0</div>
                      </div>
                    </div>

                    {/* Storage Details Grid */}
                    <div className="grid grid-cols-3 gap-2 py-2 my-2 border-y border-stone-200/60 text-xs">
                      <div className="bg-white/80 p-1.5 rounded-lg border border-stone-200/50">
                        <div className="text-[10px] text-stone-500 uppercase font-semibold">Available</div>
                        <div className="font-bold text-stone-900">{storage.availableTons} Tons</div>
                        <div className="text-[10px] text-stone-400">of {storage.capacityTons}T</div>
                      </div>

                      <div className="bg-white/80 p-1.5 rounded-lg border border-stone-200/50">
                        <div className="text-[10px] text-stone-500 uppercase font-semibold">Live Temp</div>
                        <div className="font-bold text-emerald-700 flex items-center gap-0.5 font-mono">
                          <Thermometer className="w-3 h-3 text-emerald-600" />
                          {storage.currentTempC}°C
                        </div>
                        <div className="text-[10px] text-stone-400">{storage.currentHumidityPct}% RH</div>
                      </div>

                      <div className="bg-white/80 p-1.5 rounded-lg border border-stone-200/50">
                        <div className="text-[10px] text-stone-500 uppercase font-semibold">Tariff</div>
                        <div className="font-bold text-stone-900">₹{storage.pricePerTonDayInr}</div>
                        <div className="text-[10px] text-stone-400">/ton/day</div>
                      </div>
                    </div>

                    {/* Specialties / Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      <span className="text-[10px] bg-stone-200/70 text-stone-700 px-2 py-0.5 rounded font-medium">
                        {storage.chamberType}
                      </span>
                      {storage.specialties.slice(0, 2).map((tag, i) => (
                        <span key={i} className="text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200/50">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Selection Footer */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-[11px] text-stone-500 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-stone-400" />
                        {storage.phone}
                      </span>
                      <span className={`font-semibold flex items-center gap-1 ${
                        isSelected ? 'text-blue-700' : 'text-stone-600 hover:text-emerald-700'
                      }`}>
                        {isSelected ? 'Route Displayed' : 'Select & Route'}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column: Interactive Map, Route Details, Fuel & Turn-by-Turn Navigation (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Real Leaflet Map Container */}
          <Card variant="default" padding="none" className="bg-stone-900 border-stone-700 shadow-xl overflow-hidden rounded-3xl">
            {/* Top Map Bar */}
            <div className="px-5 py-3.5 bg-stone-950 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3 text-white">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-stone-200 font-mono">
                  Live Agricultural Transit Map (OpenStreetMap & OSRM)
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {isLoadingRoute ? (
                  <span className="text-amber-300 flex items-center gap-1 font-mono text-[11px]">
                    <Clock className="w-3 h-3 animate-spin" />
                    Calculating driving path...
                  </span>
                ) : (
                  <span className="text-emerald-400 font-mono font-bold text-[11px] bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700">
                    Route Active: {routeDetail?.distanceKm} km
                  </span>
                )}
              </div>
            </div>

            {/* Map Canvas */}
            <div className="relative h-[380px] sm:h-[440px] w-full z-10">
              <MapContainer
                center={[currentOrigin.lat, currentOrigin.lng]}
                zoom={11}
                scrollWheelZoom={true}
                className="h-full w-full"
                style={{ background: '#1e293b' }}
              >
                {/* Standard OpenStreetMap TileLayer */}
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Recenter controller */}
                <MapRecenter
                  origin={currentOrigin}
                  selectedStorage={selectedStorage}
                  routeCoordinates={routeDetail?.coordinates}
                />

                {/* Farm Production Marker */}
                <Marker position={[currentOrigin.lat, currentOrigin.lng]} icon={createFarmIcon()}>
                  <Popup>
                    <div className="text-xs p-1">
                      <strong className="block text-emerald-900 font-bold mb-1">🌾 Farm Production Origin</strong>
                      <p className="text-stone-700 mb-1">{currentOrigin.name}</p>
                      <span className="text-[10px] text-stone-500 font-mono">
                        {currentOrigin.lat.toFixed(4)}, {currentOrigin.lng.toFixed(4)}
                      </span>
                    </div>
                  </Popup>
                </Marker>

                {/* ONLY Top Nearest Storages Markers (numbered #1..#6) */}
                {topNearestStorages.map((storage, idx) => {
                  const isSelected = selectedStorage.id === storage.id;
                  return (
                    <Marker
                      key={storage.id}
                      position={[storage.lat, storage.lng]}
                      icon={createStorageIcon(isSelected, idx)}
                      eventHandlers={{
                        click: () => setSelectedStorage(storage),
                      }}
                    >
                      <Popup>
                        <div className="text-xs p-1 max-w-[200px]">
                          <strong className="block text-stone-900 font-bold mb-0.5">
                            #{idx + 1} {storage.name}
                          </strong>
                          <p className="text-stone-600 text-[11px] mb-1">{storage.address}</p>
                          <div className="flex justify-between text-[11px] border-t pt-1 border-stone-200">
                            <span>Distance:</span>
                            <strong className="text-emerald-800">{storage.distanceKm} km</strong>
                          </div>
                          <div className="flex justify-between text-[11px]">
                            <span>Temp:</span>
                            <strong className="text-emerald-800">{storage.currentTempC}°C</strong>
                          </div>
                          <div className="flex justify-between text-[11px]">
                            <span>Available:</span>
                            <strong>{storage.availableTons} Tons</strong>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}

                {/* Road Route Polyline */}
                {routeDetail && routeDetail.coordinates.length > 0 && (
                  <Polyline
                    positions={routeDetail.coordinates}
                    pathOptions={{
                      color: '#2563eb',
                      weight: 5,
                      opacity: 0.85,
                    }}
                  />
                )}
              </MapContainer>

              {/* Map Floating Legend */}
              <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-stone-200 text-xs text-stone-800 flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-700 inline-block border border-white" />
                  <span className="text-[11px] font-medium">Farm Origin</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-blue-600 inline-block border border-white" />
                  <span className="text-[11px] font-medium">Selected Storage</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-6 h-1 bg-blue-600 inline-block rounded" />
                  <span className="text-[11px] font-medium">Driving Route</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Logistics Route Metrics: Time, Fuel Cost, Route Name, Road Freight */}
          {routeDetail && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Distance */}
              <Card variant="default" padding="sm" className="bg-white border-stone-200 shadow-xs">
                <div className="flex items-center gap-2 text-stone-500 text-[11px] uppercase font-bold">
                  <Navigation className="w-3.5 h-3.5 text-blue-600" />
                  <span>Road Distance</span>
                </div>
                <div className="mt-1 text-lg font-bold font-mono text-stone-900">
                  {routeDetail.distanceKm} km
                </div>
                <div className="text-[10px] text-stone-400">Via {routeDetail.summary}</div>
              </Card>

              {/* Estimated Time */}
              <Card variant="default" padding="sm" className="bg-white border-stone-200 shadow-xs">
                <div className="flex items-center gap-2 text-stone-500 text-[11px] uppercase font-bold">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Estimated Time</span>
                </div>
                <div className="mt-1 text-lg font-bold font-mono text-emerald-800">
                  {routeDetail.durationMin} mins
                </div>
                <div className="text-[10px] text-stone-400">Freight road transit</div>
              </Card>

              {/* Fuel Required & Cost */}
              <Card variant="default" padding="sm" className="bg-white border-stone-200 shadow-xs">
                <div className="flex items-center gap-2 text-stone-500 text-[11px] uppercase font-bold">
                  <Fuel className="w-3.5 h-3.5 text-amber-600" />
                  <span>Fuel Cost</span>
                </div>
                <div className="mt-1 text-lg font-bold font-mono text-amber-700">
                  ₹{routeDetail.fuelCalculation.totalFuelCostInr}
                </div>
                <div className="text-[10px] text-stone-500">
                  {routeDetail.fuelCalculation.fuelRequiredLiters}L @ ₹{routeDetail.fuelCalculation.fuelPricePerLiterInr}/L
                </div>
              </Card>

              {/* Total Estimated Logistics Outlay */}
              <Card variant="default" padding="sm" className="bg-white border-stone-200 shadow-xs">
                <div className="flex items-center gap-2 text-stone-500 text-[11px] uppercase font-bold">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Est. Trip Fare</span>
                </div>
                <div className="mt-1 text-lg font-bold font-mono text-stone-900">
                  ₹{routeDetail.fuelCalculation.totalEstLogisticsCostInr}
                </div>
                <div className="text-[10px] text-stone-400">Fuel + driver & truck fare</div>
              </Card>
            </div>
          )}

          {/* Selected Storage Full Details Panel & Turn-by-Turn Path Accordion */}
          <Card variant="default" padding="md" className="bg-white border-stone-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Destination Selected
                </span>
                <h3 className="text-base font-bold font-heading text-stone-900 mt-1">
                  {selectedStorage.name}
                </h3>
                <p className="text-xs text-stone-500">{selectedStorage.address}, {selectedStorage.city}, {selectedStorage.state}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowDirectionsSteps(!showDirectionsSteps)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 flex items-center gap-1.5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-blue-600" />
                  <span>{showDirectionsSteps ? 'Hide Path Steps' : 'View Path Steps'}</span>
                </button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    if (!routeDetail) return;
                    const booking = bookingService.createBooking({
                      farmerName: 'Rameshwar Patil',
                      cropName: 'Table Grapes (Sonaka Export)',
                      variety: 'Export Grade A+',
                      quantityTons: 2.5,
                      farmLocation: {
                        name: currentOrigin.name,
                        lat: currentOrigin.lat,
                        lng: currentOrigin.lng,
                      },
                      storage: selectedStorage,
                      route: routeDetail,
                    });
                    setBookingSuccessModal(booking);
                  }}
                  className="text-xs shadow-xs"
                >
                  Book Storage & Freight
                </Button>
              </div>
            </div>

            {/* Turn-by-Turn Path Directions (Like Google Maps) */}
            {showDirectionsSteps && routeDetail && routeDetail.steps.length > 0 && (
              <div className="mt-4 pt-3 border-t border-stone-100">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-blue-600" />
                  <span>Turn-by-Turn Route Instructions</span>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {routeDetail.steps.map((st, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs p-2 rounded-lg bg-stone-50 border border-stone-100">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-stone-800">{st.instruction}</p>
                        <span className="text-[10px] text-stone-400">
                          {st.distanceM > 1000 ? `${(st.distanceM / 1000).toFixed(1)} km` : `${st.distanceM} m`} • ~{Math.round(st.durationSec / 60)} min
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* In-depth Storage Specification */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-stone-100 text-xs">
              <div>
                <span className="text-stone-400 text-[10px] uppercase font-semibold block">Facility Code</span>
                <strong className="text-stone-800 font-mono">{selectedStorage.facilityCode}</strong>
              </div>
              <div>
                <span className="text-stone-400 text-[10px] uppercase font-semibold block">Operator In-Charge</span>
                <strong className="text-stone-800">{selectedStorage.operatorName}</strong>
              </div>
              <div>
                <span className="text-stone-400 text-[10px] uppercase font-semibold block">Target Temp Range</span>
                <strong className="text-emerald-700">{selectedStorage.targetTempRange}</strong>
              </div>
              <div>
                <span className="text-stone-400 text-[10px] uppercase font-semibold block">Direct Dispatch Phone</span>
                <strong className="text-stone-800 font-mono">{selectedStorage.phone}</strong>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {bookingSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-emerald-500 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl shrink-0">
                ✅
              </div>
              <div>
                <span className="text-[10px] font-bold font-mono text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {bookingSuccessModal.bookingCode}
                </span>
                <h3 className="text-lg font-bold font-heading text-stone-900 mt-1">
                  Storage & Freight Booked Successfully!
                </h3>
              </div>
            </div>

            <div className="my-4 space-y-3 text-xs text-stone-700">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-stone-500">Destination Storage:</span>
                  <strong className="text-stone-900">{bookingSuccessModal.storageName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Facility Location:</span>
                  <span className="text-stone-700">{bookingSuccessModal.storageAddress}, {bookingSuccessModal.storageCity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Facility Manager:</span>
                  <span className="font-semibold">{bookingSuccessModal.operatorName} ({bookingSuccessModal.storagePhone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Chamber Temp:</span>
                  <strong className="text-emerald-700">{bookingSuccessModal.storageTempC}°C</strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 space-y-1.5 text-sky-950">
                <div className="font-bold flex items-center gap-1.5 text-sky-900">
                  <Truck className="w-4 h-4 text-sky-700" />
                  <span>Transporter Dispatch Assigned</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sky-700">Vehicle:</span>
                  <strong className="font-mono">{bookingSuccessModal.assignedVehicleNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-sky-700">Driver:</span>
                  <span>{bookingSuccessModal.assignedDriverName} ({bookingSuccessModal.assignedDriverPhone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sky-700">Road Distance & ETA:</span>
                  <strong>{bookingSuccessModal.roadDistanceKm} km (~{bookingSuccessModal.estimatedTravelTimeMin} mins)</strong>
                </div>
                <div className="flex justify-between border-t border-sky-200/80 pt-1">
                  <span className="text-sky-700">Est. Fuel & Logistics Outlay:</span>
                  <strong className="text-emerald-800">₹{bookingSuccessModal.estimatedTotalFareInr} (Fuel: ₹{bookingSuccessModal.estimatedFuelCostInr})</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBookingSuccessModal(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/transporter')}
                leftIcon={<Truck className="w-4 h-4" />}
              >
                View on Transporter Portal →
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
