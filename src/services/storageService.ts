import { apiClient, fetchWithFallback } from './api';
import { demoStorageFacilities, demoIotMonitoring } from '../data/demoData';
import type { StorageFacility } from '../types';

/**
 * Storage Facility Service
 * Handles warehouse capacity discovery, chamber climate telemetries, and bookings.
 */
export const storageService = {
  async getFacilities(filters?: { district?: string; state?: string }): Promise<StorageFacility[]> {
    return fetchWithFallback<StorageFacility[]>(
      () => apiClient.get('/storage/facilities', { params: filters }),
      demoStorageFacilities as unknown as StorageFacility[]
    );
  },

  async getFacilityById(id: string): Promise<StorageFacility | null> {
    return fetchWithFallback<StorageFacility | null>(
      () => apiClient.get(`/storage/facilities/${id}`),
      (demoStorageFacilities.find((f) => f.id === id) || demoStorageFacilities[0]) as unknown as StorageFacility
    );
  },

  async bookSpace(booking: {
    facilityId: string;
    batchId: string;
    tons: number;
    days: number;
  }): Promise<{ success: boolean; bookingId: string; totalEstCostInr: number }> {
    return fetchWithFallback(
      () => apiClient.post('/storage/bookings', booking),
      {
        success: true,
        bookingId: `BK-STR-${Date.now().toString().slice(-6)}`,
        totalEstCostInr: booking.tons * booking.days * 45,
      }
    );
  },

  async getTelemetry(facilityId: string) {
    return fetchWithFallback(
      () => apiClient.get(`/storage/facilities/${facilityId}/telemetry`),
      demoIotMonitoring
    );
  },
};

export default storageService;
