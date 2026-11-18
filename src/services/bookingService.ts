import { StorageLocation, RouteDetail } from './storageMapService';

export interface StorageBooking {
  id: string;
  bookingCode: string;
  timestamp: string;
  // Farmer & Origin Information
  farmerName: string;
  farmLocation: string;
  originLat: number;
  originLng: number;
  cropName: string;
  variety: string;
  quantityTons: number;
  // Destination Storage Facility Details
  storageId: string;
  storageName: string;
  facilityCode: string;
  storageAddress: string;
  storageCity: string;
  storageState: string;
  storageLat: number;
  storageLng: number;
  storageTempC: number;
  storagePhone: string;
  operatorName: string;
  ratePerTonDayInr: number;
  // Real Route & Logistics Information
  roadDistanceKm: number;
  estimatedTravelTimeMin: number;
  estimatedFuelCostInr: number;
  estimatedTotalFareInr: number;
  routeSummary: string;
  turnStepsCount: number;
  routeCoordinates: [number, number][];
  // Assigned Transporter & Vehicle Details
  assignedVehicleNumber: string;
  assignedVehicleModel: string;
  assignedDriverName: string;
  assignedDriverPhone: string;
  status: 'PENDING_PICKUP' | 'DISPATCHED' | 'IN_TRANSIT' | 'ARRIVED_AT_STORAGE';
  refrigerated: boolean;
  liveCargoTempC: number;
  eta: string;
}

const STORAGE_BOOKINGS_KEY = 'agrisync_storage_transport_bookings';

export const bookingService = {
  // Get all real bookings from persistent localStorage
  getBookings(): StorageBooking[] {
    try {
      const data = localStorage.getItem(STORAGE_BOOKINGS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse storage bookings from localStorage', e);
    }
    return [];
  },

  // Save new storage booking and trigger instant dispatch event
  createBooking(params: {
    farmerName?: string;
    cropName?: string;
    variety?: string;
    quantityTons?: number;
    farmLocation: {
      name: string;
      lat: number;
      lng: number;
    };
    storage: StorageLocation;
    route: RouteDetail;
  }): StorageBooking {
    const existing = this.getBookings();

    const timestamp = new Date().toISOString();
    const shortCode = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `AGRI-BK-${new Date().getFullYear()}-${shortCode}`;

    const drivers = [
      { name: 'Sanjay Deshmukh', phone: '+91 98601 77394', vehicle: 'MH-15-EG-4821', model: 'Mahindra Bolero Maxi Truck (Insulated Reefer)' },
      { name: 'Raju Shinde', phone: '+91 98221 44120', vehicle: 'MH-15-AK-9042', model: 'Tata 407 LPT Chilled Van' },
      { name: 'Dattatray Wagh', phone: '+91 94230 88192', vehicle: 'MH-15-TR-2104', model: 'Ashok Leyland Dost+ Agri Express' },
      { name: 'Harpreet Singh', phone: '+91 98140 33219', vehicle: 'PB-10-DF-7721', model: 'Eicher Pro 2049 Reefer' },
    ];
    const driver = drivers[existing.length % drivers.length];

    const newBooking: StorageBooking = {
      id: `booking-${Date.now()}`,
      bookingCode,
      timestamp,
      farmerName: params.farmerName || 'Rameshwar Patil',
      farmLocation: params.farmLocation.name,
      originLat: params.farmLocation.lat,
      originLng: params.farmLocation.lng,
      cropName: params.cropName || 'Fresh Harvest Produce',
      variety: params.variety || 'Standard Grade A',
      quantityTons: params.quantityTons || 2.4,
      storageId: params.storage.id,
      storageName: params.storage.name,
      facilityCode: params.storage.facilityCode,
      storageAddress: params.storage.address,
      storageCity: params.storage.city,
      storageState: params.storage.state,
      storageLat: params.storage.lat,
      storageLng: params.storage.lng,
      storageTempC: params.storage.currentTempC,
      storagePhone: params.storage.phone,
      operatorName: params.storage.operatorName,
      ratePerTonDayInr: params.storage.pricePerTonDayInr,
      roadDistanceKm: params.route.distanceKm,
      estimatedTravelTimeMin: params.route.durationMin,
      estimatedFuelCostInr: params.route.fuelCalculation.totalFuelCostInr,
      estimatedTotalFareInr: params.route.fuelCalculation.totalEstLogisticsCostInr,
      routeSummary: params.route.summary,
      turnStepsCount: params.route.steps.length,
      routeCoordinates: params.route.coordinates,
      assignedVehicleNumber: driver.vehicle,
      assignedVehicleModel: driver.model,
      assignedDriverName: driver.name,
      assignedDriverPhone: driver.phone,
      status: 'IN_TRANSIT',
      refrigerated: true,
      liveCargoTempC: params.storage.currentTempC + 0.4,
      eta: `${params.route.durationMin} mins`,
    };

    const updated = [newBooking, ...existing];
    try {
      localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('agrisync_booking_created'));
    } catch (e) {
      console.error('Failed to save booking to localStorage', e);
    }

    return newBooking;
  },

  // Update status (e.g. ARRIVED_AT_STORAGE)
  updateStatus(id: string, status: StorageBooking['status']) {
    const list = this.getBookings();
    const updated = list.map((b) => (b.id === id ? { ...b, status } : b));
    localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('agrisync_booking_created'));
  },

  // Clear demo bookings if user desires a clean slate
  clearBookings() {
    localStorage.removeItem(STORAGE_BOOKINGS_KEY);
    window.dispatchEvent(new Event('agrisync_booking_created'));
  },
};
