import { apiClient, fetchWithFallback } from './api';
import { demoIotMonitoring } from '../data/demoData';
import type { SensorReading } from '../types';

/**
 * Sensor & IoT Monitoring Service
 * ARCHITECTURE NOTICE:
 * Hardware (ESP32 + DHT22/SHT31) -> MQTT/HTTP Broker -> Express Backend -> sensorService -> React Dashboard.
 * The browser client never polls the microcontroller directly.
 */
export const sensorService = {
  async getChamberTelemetry(storageUnitId: string) {
    return fetchWithFallback(
      () => apiClient.get(`/sensors/chambers/${storageUnitId}/telemetry`),
      demoIotMonitoring
    );
  },

  async getRecentReadings(storageUnitId: string, hours = 24) {
    return fetchWithFallback(
      () => apiClient.get(`/sensors/chambers/${storageUnitId}/history`, { params: { hours } }),
      demoIotMonitoring.telemetryHistory
    );
  },

  async getReadings(storageUnitId: string = 'CHAMBER-B4'): Promise<SensorReading[]> {
    const history = await this.getRecentReadings(storageUnitId);
    return (history as Array<{ time: string; temperature: number; humidity: number }>).map((item) => ({
      timestamp: item.time,
      temperature: item.temperature,
      humidity: item.humidity,
    }));
  },

  async registerSensorDevice(deviceInfo: {
    deviceId: string;
    chamberId: string;
    model: string;
    sensorType: string;
  }) {
    return fetchWithFallback(
      () => apiClient.post('/sensors/devices/register', deviceInfo),
      { success: true, registeredAt: new Date().toISOString() }
    );
  },
};

export default sensorService;
