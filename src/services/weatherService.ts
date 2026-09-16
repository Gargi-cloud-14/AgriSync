import { apiClient, fetchWithFallback } from './api';
import { demoWeather } from '../data/demoData';
import type { WeatherData } from '../types';

/**
 * Weather Service
 * DESIGNED FOR MEMBER 2: Weather API + Prediction integration.
 * Will connect to IMD (India Meteorological Department) or OpenWeather / Agro-climate APIs.
 */
export const weatherService = {
  async getWeatherByCoordinates(lat?: number, lng?: number): Promise<WeatherData> {
    return fetchWithFallback<WeatherData>(
      () => apiClient.get('/weather/current', { params: { lat, lng } }),
      demoWeather as unknown as WeatherData
    );
  },

  async getCurrentWeather(): Promise<WeatherData> {
    return this.getWeatherByCoordinates();
  },

  async getWeatherAdvisory(region: string): Promise<{
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    advisoryText: string;
    actionItems: string[];
  }> {
    return fetchWithFallback(
      () => apiClient.get('/weather/advisory', { params: { region } }),
      {
        riskLevel: 'MEDIUM',
        advisoryText: demoWeather.recommendation,
        actionItems: [
          'Cover flatbed trailers with waterproof tarpaulin sheets.',
          'Schedule perishable loads before the 17:00 IST rain window.',
          'Check tire tread on heavy gradient ghat passes (Kasara / Thal Ghat).',
        ],
      }
    );
  },
};

export default weatherService;
