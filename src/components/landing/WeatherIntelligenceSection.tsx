import React from 'react';
import { CloudRain, Thermometer, Droplets, Wind, AlertTriangle, CloudSun, CalendarCheck, CheckCircle2 } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { useLocationContext } from '../../context/LocationContext';

/**
 * WeatherIntelligenceSection
 * Micro-Climate & Agro-Weather Intelligence
 * Dynamically tied to the active regional agro-grid (Madhya Pradesh by default or GPS detected location).
 */
export const WeatherIntelligenceSection: React.FC = () => {
  const { currentData } = useLocationContext();
  const weather = currentData.weather;

  return (
    <section
      id="weather"
      className="py-20 lg:py-28 bg-stone-900 text-white border-b border-stone-800 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3.5">
            <CloudSun className="w-3.5 h-3.5 text-emerald-400" />
            Module: Micro-Climate & Agro-Weather Intelligence • {currentData.stateName}
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Weather Uncertainty, Managed in Advance
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-300 leading-relaxed font-normal">
            Protecting unharvested crops and road-bound freight trailers across {weather.district} and {weather.state}{' '}
            by transforming meteorological forecasts into actionable harvest & dispatch advice.
          </p>
        </div>

        {/* Weather Dashboard Card */}
        <div className="max-w-4xl mx-auto">
          <Card
            variant="default"
            padding="lg"
            className="bg-gradient-to-br from-emerald-950/90 via-stone-900 to-stone-900 text-white shadow-2xl border-stone-800"
          >
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-800 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-bold font-heading text-emerald-400">
                    {weather.location}
                  </span>
                  <Badge
                    variant={weather.advisoryLevel === 'OPTIMAL' ? 'emerald' : 'amber'}
                    size="sm"
                    className="font-mono"
                  >
                    {weather.advisoryLevel === 'OPTIMAL' ? 'Optimal Grid Conditions' : 'Pre-Monsoon Caution'}
                  </Badge>
                </div>
                <p className="text-xs text-stone-400 mt-0.5 font-mono">
                  Station Condition: <strong className="text-stone-200">{weather.condition}</strong>
                </p>
              </div>

              <div className="text-xs text-stone-400 font-mono bg-stone-950/80 px-3 py-1.5 rounded-xl border border-stone-800">
                Region: <span className="text-emerald-300 font-bold">{currentData.stateName} ({currentData.stateCode})</span>
              </div>
            </div>

            {/* 4 Core Primary Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
              {/* Temperature */}
              <div className="p-4 rounded-2xl bg-stone-850/90 border border-stone-750 text-center">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/80 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                  <Thermometer className="w-4 h-4" />
                </div>
                <span className="text-xs text-stone-400 font-medium block">Temperature</span>
                <span className="text-3xl font-extrabold font-heading text-white tracking-tight">
                  {weather.temperature}°C
                </span>
              </div>

              {/* Humidity */}
              <div className="p-4 rounded-2xl bg-stone-850/90 border border-stone-750 text-center">
                <div className="w-8 h-8 rounded-lg bg-sky-950/80 text-sky-400 flex items-center justify-center mx-auto mb-2">
                  <Droplets className="w-4 h-4" />
                </div>
                <span className="text-xs text-stone-400 font-medium block">Humidity</span>
                <span className="text-3xl font-extrabold font-heading text-white tracking-tight">
                  {weather.humidity}%
                </span>
              </div>

              {/* Rain Probability */}
              <div className="p-4 rounded-2xl bg-stone-850/90 border border-stone-750 text-center">
                <div className="w-8 h-8 rounded-lg bg-indigo-950/80 text-indigo-400 flex items-center justify-center mx-auto mb-2">
                  <CloudRain className="w-4 h-4" />
                </div>
                <span className="text-xs text-stone-400 font-medium block">Rain Probability</span>
                <span className="text-3xl font-extrabold font-heading text-white tracking-tight">
                  {weather.rainProbability}%
                </span>
              </div>

              {/* Wind */}
              <div className="p-4 rounded-2xl bg-stone-850/90 border border-stone-750 text-center">
                <div className="w-8 h-8 rounded-lg bg-amber-950/80 text-amber-400 flex items-center justify-center mx-auto mb-2">
                  <Wind className="w-4 h-4" />
                </div>
                <span className="text-xs text-stone-400 font-medium block">Wind</span>
                <span className="text-3xl font-extrabold font-heading text-white tracking-tight">
                  {weather.wind} km/h
                </span>
              </div>
            </div>

            {/* Actionable Recommendation Box */}
            <div
              className={`p-5 rounded-2xl border flex items-start gap-4 ${
                weather.advisoryLevel === 'OPTIMAL'
                  ? 'bg-emerald-950/40 border-emerald-500/50'
                  : 'bg-amber-950/40 border-amber-500/50'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  weather.advisoryLevel === 'OPTIMAL'
                    ? 'bg-emerald-900/60 text-emerald-300'
                    : 'bg-amber-900/60 text-amber-300'
                }`}
              >
                {weather.advisoryLevel === 'OPTIMAL' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <div>
                <span
                  className={`text-xs font-bold uppercase tracking-wider block mb-1 font-mono ${
                    weather.advisoryLevel === 'OPTIMAL' ? 'text-emerald-300' : 'text-amber-300'
                  }`}
                >
                  Regional Logistics & Harvest Advisory
                </span>
                <p className="text-sm text-stone-200 leading-relaxed font-normal">
                  "{weather.recommendation}"
                </p>
              </div>
            </div>

            {/* Hourly Forecast Ribbon */}
            <div className="mt-8 pt-6 border-t border-stone-800">
              <div className="flex items-center justify-between mb-3 text-xs text-stone-400">
                <span className="font-semibold uppercase tracking-wider">Hourly Outlook (Next 12 Hours)</span>
                <span className="font-mono text-[11px] text-emerald-400">{weather.district} Meteorological Feed</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {weather.hourlyForecast.map((item) => (
                  <div
                    key={item.time}
                    className="p-2.5 rounded-xl bg-stone-850/80 border border-stone-750 text-center"
                  >
                    <span className="text-[10px] text-stone-400 font-mono block mb-1">{item.time}</span>
                    <span className="text-sm font-bold text-white block">{item.temp}°C</span>
                    <div className="flex items-center justify-center gap-1 mt-1 text-[10px] text-sky-400">
                      <Droplets className="w-2.5 h-2.5" />
                      <span>{item.rainProb}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WeatherIntelligenceSection;
