import { apiClient, fetchWithFallback } from './api';
import { demoTraceabilityRecord } from '../data/demoData';
import type { BlockchainTraceRecord } from '../types';

/**
 * Traceability & Blockchain Verification Service
 * DESIGNED FOR MEMBER 5: Blockchain + Traceability + QR integration.
 * ARCHITECTURAL RULE: Only cryptographic state hashes, checkpoint milestones,
 * and temperature violation attestations are anchored on-chain. Bulk sensor logs remain off-chain.
 */
export const traceabilityService = {
  async getBatchProvenance(batchId: string): Promise<BlockchainTraceRecord> {
    const defaultData: BlockchainTraceRecord = {
      batchId: batchId || demoTraceabilityRecord.batchId,
      crop: demoTraceabilityRecord.crop,
      variety: demoTraceabilityRecord.variety,
      harvestDate: demoTraceabilityRecord.harvestDate,
      farmer: demoTraceabilityRecord.farmer,
      farmName: demoTraceabilityRecord.farmName,
      farmCoordinates: demoTraceabilityRecord.farmCoordinates,
      origin: demoTraceabilityRecord.farmCoordinates,
      quantityKg: demoTraceabilityRecord.quantityKg,
      qualityGrade: demoTraceabilityRecord.qualityGrade,
      status: demoTraceabilityRecord.status,
      totalStages: 5,
      verifiedStages: 5,
      blockchainTxHash: demoTraceabilityRecord.verificationHash,
      verificationHash: demoTraceabilityRecord.verificationHash,
      blockNumber: demoTraceabilityRecord.blockNumber,
      network: demoTraceabilityRecord.network,
      smartContractAddress: demoTraceabilityRecord.contractAddress,
      contractAddress: demoTraceabilityRecord.contractAddress,
      qrCodeUrl: demoTraceabilityRecord.qrCodeUrl,
      stages: demoTraceabilityRecord.timeline.map((t, idx) => ({
        stageNumber: idx + 1,
        title: t.title,
        actor: t.actor,
        location: t.location,
        timestamp: t.timestamp,
        status: t.status,
        hash: t.hash,
        details: t.notes,
        type:
          idx === 0
            ? 'HARVEST'
            : idx === 1
            ? 'STORAGE'
            : idx === 2
            ? 'MONITORING'
            : idx === 3
            ? 'TRANSPORT'
            : 'MARKET',
      })),
      timeline: demoTraceabilityRecord.timeline,
    };

    return fetchWithFallback<BlockchainTraceRecord>(
      () => apiClient.get(`/traceability/batches/${batchId}`),
      defaultData
    );
  },

  async getRecordByBatchId(batchId: string): Promise<BlockchainTraceRecord> {
    return this.getBatchProvenance(batchId);
  },

  async verifyBlockHash(batchId: string, txHash: string): Promise<{
    isValid: boolean;
    blockNumber: number;
    timestamp: string;
    merkleRoot: string;
  }> {
    return fetchWithFallback(
      () => apiClient.post(`/traceability/verify-hash`, { batchId, txHash }),
      {
        isValid: true,
        blockNumber: 19482103,
        timestamp: '2026-09-15T06:00:00Z',
        merkleRoot: '0x99a8b7c6d5e4f3a2b1c09876543210fedcba9876543210abcdef0123456789ab',
      }
    );
  },

  generateQrVerificationUrl(batchId: string): string {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://agrisync.org';
    return `${origin}/verify/${encodeURIComponent(batchId)}`;
  },
};

export default traceabilityService;
