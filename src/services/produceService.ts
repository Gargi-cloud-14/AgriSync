import { apiClient, fetchWithFallback } from './api';
import { demoProduceBatches } from '../data/demoData';
import type { ProduceBatch, ProduceStatus } from '../types';

/**
 * Produce Service
 * Centralized business logic for produce logging, batch tracking, and status transitions.
 */
export const produceService = {
  async getBatches(farmerId?: string): Promise<ProduceBatch[]> {
    return fetchWithFallback<ProduceBatch[]>(
      () => apiClient.get('/produce', { params: { farmerId } }),
      (farmerId
        ? demoProduceBatches.filter((b) => b.farmerName.toLowerCase().includes('patil'))
        : demoProduceBatches) as unknown as ProduceBatch[]
    );
  },

  async getBatchById(batchId: string): Promise<ProduceBatch | null> {
    return fetchWithFallback<ProduceBatch | null>(
      () => apiClient.get(`/produce/${batchId}`),
      (demoProduceBatches.find((b) => b.batchId === batchId) || demoProduceBatches[0]) as unknown as ProduceBatch
    );
  },

  async createBatch(payload: Partial<ProduceBatch>): Promise<ProduceBatch> {
    const newBatch: ProduceBatch = {
      id: 'batch-' + Date.now(),
      batchId: `AGRI-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      batchCode: `AGRI-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      farmerId: payload.farmerId || 'user-farmer-01',
      farmerName: payload.farmerName || 'Rameshwar Patil',
      farmLocation: payload.farmLocation || 'Nashik, Maharashtra',
      cropType: payload.cropType || payload.cropName || 'Wheat',
      cropName: payload.cropName || payload.cropType || 'Wheat',
      variety: payload.variety || 'Sharbati A1',
      quantityKg: payload.quantityKg || 1000,
      harvestDate: payload.harvestDate || new Date().toISOString().split('T')[0],
      storageTempMinC: payload.storageTempMinC ?? 18,
      storageTempMaxC: payload.storageTempMaxC ?? 22,
      status: 'HARVESTED' as ProduceStatus,
      currentLocation: payload.farmLocation || 'Nashik, Maharashtra',
      qrCodeData: `https://agrisync.org/verify/AGRI-${new Date().getFullYear()}-NEW`,
      qualityGrade: payload.qualityGrade || 'A',
      estimatedValueInr: payload.estimatedValueInr || 50000,
      targetPricePerKg: payload.targetPricePerKg || 45,
    };

    return fetchWithFallback<ProduceBatch>(
      () => apiClient.post('/produce', payload),
      newBatch
    );
  },

  async updateBatchStatus(batchId: string, status: ProduceStatus): Promise<ProduceBatch | null> {
    return fetchWithFallback<ProduceBatch | null>(
      () => apiClient.patch(`/produce/${batchId}/status`, { status }),
      {
        ...(demoProduceBatches[0] as unknown as ProduceBatch),
        status,
      }
    );
  },
};

export default produceService;
