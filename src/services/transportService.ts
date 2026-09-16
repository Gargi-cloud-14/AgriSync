import { apiClient, fetchWithFallback } from './api';
import { demoSmartTransport } from '../data/demoData';
import type { TransportShipment, TransportVehicle } from '../types';

/**
 * Transport Service
 * DESIGNED FOR MEMBER 1: Transport + Maps API integration.
 * In production, this service will communicate with Google Maps Directions API,
 * Distance Matrix, and vehicle telemetry backends.
 */
export const transportService = {
  async getShipments(): Promise<TransportShipment[]> {
    return fetchWithFallback<TransportShipment[]>(
      () => apiClient.get('/transport/shipments'),
      [
        {
          id: 'shp-01',
          batchId: 'AGRI-2026-00421',
          trackingNumber: 'TRK-2026-8812',
          produceName: 'Sonaka Table Grapes',
          quantityTons: 4.2,
          transporterName: 'Deshmukh Agro Freight',
          driverName: 'Sanjay Deshmukh',
          driverPhone: '+91 98601 77394',
          vehicleNumber: 'MH-15-EG-4821',
          origin: 'Dindori Farm Cluster, Nashik',
          destination: 'Vashi APMC Mandi, Navi Mumbai',
          distanceKm: 18.4,
          estimatedTravelTimeMin: 34,
          eta: '34 min',
          estimatedCostInr: 720,
          status: 'IN_TRANSIT',
          routeOptimized: true,
          temperatureControlled: true,
          currentTempC: 3.2,
        },
        {
          id: 'shp-02',
          batchId: 'AGRI-2026-00423',
          trackingNumber: 'TRK-2026-8815',
          produceName: 'Organic Jaggery & Cane',
          quantityTons: 3.8,
          transporterName: 'Cauvery Freight Lines',
          driverName: 'Manjunath Gowda',
          driverPhone: '+91 94480 32190',
          vehicleNumber: 'KA-11-B-3910',
          origin: 'Mandya Cluster, Karnataka',
          destination: 'Yeshwanthpur Mandi, Bengaluru',
          distanceKm: 98.2,
          estimatedTravelTimeMin: 145,
          eta: '2 hrs 15 min',
          estimatedCostInr: 3400,
          status: 'IN_TRANSIT',
          routeOptimized: true,
          temperatureControlled: false,
        },
      ]
    );
  },

  async getVehicles(): Promise<TransportVehicle[]> {
    return fetchWithFallback<TransportVehicle[]>(
      () => apiClient.get('/transport/vehicles'),
      [
        {
          id: 'veh-01',
          vehicleNumber: 'MH-15-EG-4821',
          model: 'Mahindra Bolero Maxi Truck',
          type: 'Mini Reefer (Insulated)',
          capacityTons: 2.5,
          driverName: 'Sanjay Deshmukh',
          currentLocation: 'NH-60 Corridor (Nashik)',
          status: 'IN_TRANSIT',
          ratePerKm: 28,
          isRefrigerated: true,
        },
        {
          id: 'veh-02',
          vehicleNumber: 'MH-15-AK-9042',
          model: 'Tata 407 LPT Reefer',
          type: 'Medium Cold Van',
          capacityTons: 4.5,
          driverName: 'Raju Shinde',
          currentLocation: 'MIDC Agro Hub, Nashik',
          status: 'AVAILABLE',
          ratePerKm: 34,
          isRefrigerated: true,
        },
        {
          id: 'veh-03',
          vehicleNumber: 'MH-15-TR-2104',
          model: 'Ashok Leyland Dost+',
          type: 'Covered Tarpaulin',
          capacityTons: 1.8,
          driverName: 'Dattatray Wagh',
          currentLocation: 'Lasalgaon Mandi Yard',
          status: 'AVAILABLE',
          ratePerKm: 22,
          isRefrigerated: false,
        },
      ]
    );
  },

  async getShipmentDetails(batchId: string): Promise<typeof demoSmartTransport> {
    return fetchWithFallback(
      () => apiClient.get(`/transport/shipments/${batchId}`),
      demoSmartTransport
    );
  },

  async requestFreight(params: {
    batchId: string;
    origin: string;
    destination: string;
    vehicleType: string;
    targetTemp?: number;
  }): Promise<{ success: boolean; shipmentId: string; estimatedCost: number; estimatedMinutes: number }> {
    return fetchWithFallback(
      () => apiClient.post('/transport/requests', params),
      {
        success: true,
        shipmentId: `SHP-${Date.now().toString().slice(-6)}`,
        estimatedCost: 720,
        estimatedMinutes: 34,
      }
    );
  },

  /**
   * Stub for Member 1 to calculate route using Google Maps Distance Matrix API
   */
  async calculateOptimizedRoute(origin: string, destination: string) {
    return fetchWithFallback(
      () => apiClient.post('/transport/route-optimize', { origin, destination }),
      {
        distanceKm: 18.4,
        durationMin: 34,
        costInr: 720,
        trafficStatus: 'NORMAL',
        waypoints: demoSmartTransport.waypoints,
      }
    );
  },
};

export default transportService;
