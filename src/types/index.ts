/**
 * AgriSync - TypeScript Definitions
 * Centralized types for agricultural supply-chain actors, produce, storage, logistics, and telemetry.
 */

export type UserRole = 'FARMER' | 'STORAGE_PROVIDER' | 'TRANSPORTER' | 'BUYER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  location: string;
  organization?: string;
  avatar?: string;
  verifiedStatus?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type ProduceStatus = 
  | 'HARVESTED' 
  | 'STORAGE_PENDING' 
  | 'IN_STORAGE' 
  | 'STORED'
  | 'IN_TRANSIT' 
  | 'DELIVERED_TO_BUYER' 
  | 'QUALITY_VERIFIED';

export interface ProduceBatch {
  id: string;
  batchId?: string;
  batchCode?: string;
  farmerId?: string;
  farmerName: string;
  farmLocation: string;
  cropType?: string;
  cropName?: string;
  variety: string;
  quantityKg: number;
  harvestDate: string;
  storageTempMinC?: number;
  storageTempMaxC?: number;
  storageTempReq?: string;
  status: ProduceStatus;
  currentLocation?: string;
  qrCodeData?: string;
  assignedStorageId?: string;
  assignedTransporterId?: string;
  buyerId?: string;
  qualityGrade: 'Export Grade A+' | 'Grade A+' | 'Grade A' | 'Grade B' | 'A+' | 'A' | 'B' | 'Standard' | string;
  estimatedValueInr?: number;
  targetPricePerKg?: number;
}

export interface StorageFacility {
  id: string;
  name: string;
  facilityCode?: string;
  operatorName?: string;
  location?: string;
  district?: string;
  state?: string;
  capacityTons?: number;
  totalCapacityTons?: number;
  availableTons?: number;
  availableCapacityTons?: number;
  currentTempC: number;
  currentHumidityPct: number;
  targetTempC?: number;
  targetHumidityPct?: number;
  pricePerTonDayInr?: number;
  ratePerTonPerDay?: number;
  hasIotMonitoring?: boolean;
  activeAlertsCount?: number;
  status?: 'OPERATIONAL' | 'MAINTENANCE' | 'NEAR_CAPACITY' | string;
}

export interface TransportRouteStep {
  label?: string;
  name?: string;
  location?: string;
  completed?: boolean;
  time?: string;
  status?: string;
}

export interface TransportShipment {
  id: string;
  batchId: string;
  trackingNumber?: string;
  produceName?: string;
  quantityTons?: number;
  transporterName?: string;
  driverName?: string;
  driverPhone?: string;
  vehicleNumber: string;
  origin: string;
  destination: string;
  distanceKm: number;
  estimatedTravelTimeMin?: number;
  eta?: string;
  estimatedCostInr: number;
  status: 'REQUESTED' | 'DISPATCHED' | 'IN_TRANSIT' | 'DELIVERED';
  routeOptimized?: boolean;
  temperatureControlled?: boolean;
  currentTempC?: number;
  steps?: TransportRouteStep[];
}

export type Shipment = TransportShipment;

export interface TransportVehicle {
  id: string;
  vehicleNumber: string;
  model: string;
  type: string;
  capacityTons: number;
  driverName: string;
  driverPhone?: string;
  currentLocation: string;
  status: 'AVAILABLE' | 'IN_TRANSIT' | 'MAINTENANCE';
  ratePerKm: number;
  isRefrigerated: boolean;
}

export interface WeatherData {
  location: string;
  district?: string;
  state?: string;
  temperature: number;
  humidity: number;
  rainProbability: number;
  wind: number;
  condition?: string;
  forecastSummary?: string;
  recommendation: string;
  advisoryLevel?: string;
  hourlyForecast: Array<{
    time: string;
    temp: number;
    rainProb: number;
    humidity?: number;
  }>;
}

export type WeatherIntelligence = WeatherData;

export interface SensorReading {
  timestamp: string;
  temperature: number;
  humidity: number;
  co2Ppm?: number;
  storageUnitId?: string;
  deviceId?: string;
  batteryStatusPct?: number;
  isAnomaly?: boolean;
}

export type SensorTelemetry = SensorReading;

export interface TraceabilityStage {
  stage?: string;
  stageNumber?: number;
  title: string;
  actor: string;
  location: string;
  timestamp: string;
  status: 'COMPLETED' | 'ACTIVE' | 'UPCOMING' | 'VERIFIED' | string;
  hash: string;
  notes?: string;
  details?: string;
  type?: 'HARVEST' | 'STORAGE' | 'MONITORING' | 'TRANSPORT' | 'MARKET' | string;
}

export interface TraceabilityRecord {
  batchId: string;
  crop: string;
  variety: string;
  harvestDate: string;
  farmer: string;
  farmName?: string;
  farmCoordinates?: string;
  origin?: string;
  quantityKg: number;
  qualityGrade: string;
  status: 'VERIFIED' | 'PENDING' | 'FLAGGED' | string;
  totalStages?: number;
  verifiedStages?: number;
  blockchainTxHash?: string;
  verificationHash?: string;
  blockNumber?: string;
  network?: string;
  smartContractAddress?: string;
  contractAddress?: string;
  qrCodeUrl?: string;
  stages: TraceabilityStage[];
  timeline?: TraceabilityStage[];
}

export type BlockchainTraceRecord = TraceabilityRecord;

export interface CommunityMetric {
  title: string;
  value: string;
  label: string;
  description: string;
  iconName: string;
}
