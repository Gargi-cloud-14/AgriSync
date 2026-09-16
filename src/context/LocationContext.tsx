import React, { createContext, useContext, useState, useEffect } from 'react';

export interface RegionalData {
  stateCode: 'MP' | 'MH' | 'PB' | 'GJ' | 'UP';
  stateName: string;
  stateHindi: string;
  agroZone: string;
  coordinates: {
    lat: number;
    lng: number;
    label: string;
  };
  mandiTicker: Array<{
    commodity: string;
    mandi: string;
    price: string;
    change: string;
    isUp: boolean;
  }>;
  transport: {
    batchId: string;
    crop: string;
    origin: string;
    midpoint: string;
    destination: string;
    distanceKm: number;
    estimatedTravelTimeMin: number;
    estimatedCostInr: number;
    routeOptimized: boolean;
    vehicleNumber: string;
    vehicleType: string;
    driverName: string;
    currentSpeedKmh: number;
    cargoTempC: number;
    waypoints: Array<{ name: string; status: string; time: string }>;
  };
  weather: {
    location: string;
    district: string;
    state: string;
    temperature: number;
    humidity: number;
    rainProbability: number;
    wind: number;
    condition: string;
    forecastSummary: string;
    recommendation: string;
    advisoryLevel: 'OPTIMAL' | 'CAUTION' | 'ALERT';
    hourlyForecast: Array<{ time: string; temp: number; rainProb: number; humidity: number }>;
  };
  iot: {
    storageUnitId: string;
    facilityName: string;
    location: string;
    temperature: number;
    humidity: number;
    co2Ppm: number;
    storageStatus: string;
    lastUpdated: string;
    targetTempRange: string;
    targetHumidityRange: string;
    telemetryHistory: Array<{ time: string; temperature: number; humidity: number }>;
  };
  traceability: {
    batchId: string;
    crop: string;
    variety: string;
    harvestDate: string;
    farmer: string;
    farmName: string;
    farmCoordinates: string;
    quantityKg: number;
    qualityGrade: string;
    verificationHash: string;
  };
}

export const REGIONS_DATA: Record<string, RegionalData> = {
  MP: {
    stateCode: 'MP',
    stateName: 'Madhya Pradesh',
    stateHindi: 'मध्य प्रदेश',
    agroZone: 'Malwa-Nimar Agro Zone (Indore, Ujjain, Dewas, Sehore)',
    coordinates: {
      lat: 22.7196,
      lng: 75.8577,
      label: 'Indore-Malwa Agro Hub, MP',
    },
    mandiTicker: [
      { commodity: 'Sharbati Gold Wheat', mandi: 'Indore Choithram Mandi', price: '₹3,480/qtl', change: '+3.4%', isUp: true },
      { commodity: 'Yellow Soybeans (JS-9560)', mandi: 'Ujjain Krishi Mandi', price: '₹4,650/qtl', change: '+2.1%', isUp: true },
      { commodity: 'Mandsaur White Garlic', mandi: 'Mandsaur APMC', price: '₹16,200/qtl', change: '+5.6%', isUp: true },
      { commodity: 'Malwa Red Onions', mandi: 'Shajapur Mandi', price: '₹2,450/qtl', change: '+1.2%', isUp: true },
      { commodity: 'Desi Chana / Chickpea', mandi: 'Sehore Mandi', price: '₹5,850/qtl', change: '+0.8%', isUp: true },
      { commodity: 'Cold Storage Avg', mandi: 'Malwa Cold Grid', price: '₹1.65/kg/mo', change: '78% Free', isUp: true },
      { commodity: 'Reefer Freight', mandi: 'NH-52 Malwa Corridor', price: '₹38/km', change: 'Synced', isUp: true },
    ],
    transport: {
      batchId: 'AGRI-MP-2026-08942',
      crop: 'Sharbati Gold Wheat (Sehore Special Grade A+)',
      origin: 'Dewas Farmers Co-op (FPO), Malwa Plateau, MP',
      midpoint: 'Malwa Agro Cold Chain Hub, Unit 2B, Dewas Road',
      destination: 'Indore Choithram APMC Mandi, MP',
      distanceKm: 38.6,
      estimatedTravelTimeMin: 52,
      estimatedCostInr: 1480,
      routeOptimized: true,
      vehicleNumber: 'MP-09-GF-6392',
      vehicleType: 'Tata 407 Reefer Cold Van (Chilled)',
      driverName: 'Vikram Singh Chouhan',
      currentSpeedKmh: 48,
      cargoTempC: 4.5,
      waypoints: [
        { name: 'Dewas FPO Farm Gate Pickup', status: 'COMPLETED', time: '06:45 AM' },
        { name: 'Malwa Cold Storage Bay #2', status: 'COMPLETED', time: '07:30 AM' },
        { name: 'AB Road Bypass (NH-52)', status: 'IN_TRANSIT', time: 'En Route' },
        { name: 'Choithram APMC Terminal Gate #4', status: 'PENDING', time: 'Est. 09:15 AM' },
      ],
    },
    weather: {
      location: 'Indore - Malwa Agro-Climatic Zone',
      district: 'Indore',
      state: 'Madhya Pradesh',
      temperature: 29,
      humidity: 54,
      rainProbability: 12,
      wind: 11,
      condition: 'Clear Sky with Warm Malwa Breeze',
      forecastSummary: 'Optimal dry conditions across Indore-Dewas-Ujjain belt. Very low 12% precipitation probability.',
      recommendation:
        'Weather conditions across western MP are optimal for unhindered highway transit and moisture-sensitive wheat / garlic packhouse intake.',
      advisoryLevel: 'OPTIMAL',
      hourlyForecast: [
        { time: '10:00', temp: 27, rainProb: 5, humidity: 60 },
        { time: '12:00', temp: 30, rainProb: 8, humidity: 52 },
        { time: '14:00', temp: 32, rainProb: 12, humidity: 48 },
        { time: '16:00', temp: 31, rainProb: 14, humidity: 50 },
        { time: '18:00', temp: 28, rainProb: 10, humidity: 58 },
        { time: '20:00', temp: 26, rainProb: 8, humidity: 64 },
      ],
    },
    iot: {
      storageUnitId: 'CHAMBER-MP-B2',
      facilityName: 'Malwa Agro Cold Chain & Logistics Terminal',
      location: 'AB Road, Dewas / Indore, Madhya Pradesh',
      temperature: 23.8,
      humidity: 58,
      co2Ppm: 460,
      storageStatus: 'NORMAL',
      lastUpdated: '8 seconds ago',
      targetTempRange: '22°C - 25°C',
      targetHumidityRange: '55% - 62%',
      telemetryHistory: [
        { time: '00:00', temperature: 23.4, humidity: 59 },
        { time: '02:00', temperature: 23.5, humidity: 60 },
        { time: '04:00', temperature: 23.3, humidity: 59 },
        { time: '06:00', temperature: 23.6, humidity: 58 },
        { time: '08:00', temperature: 23.8, humidity: 57 },
        { time: '10:00', temperature: 24.1, humidity: 56 },
        { time: '12:00', temperature: 24.2, humidity: 55 },
        { time: '14:00', temperature: 24.0, humidity: 56 },
        { time: '16:00', temperature: 23.9, humidity: 57 },
        { time: '18:00', temperature: 23.7, humidity: 58 },
        { time: '20:00', temperature: 23.8, humidity: 58 },
      ],
    },
    traceability: {
      batchId: 'AGRI-MP-2026-08942',
      crop: 'Sharbati Gold Wheat (Sehore Special)',
      variety: 'Triticum Durum (Malwa Sharbati)',
      harvestDate: '15 Sep 2026, 07:15 AM IST',
      farmer: 'Shivpal Singh Patidar',
      farmName: 'Patidar Organic Agro Farms',
      farmCoordinates: '22.9124° N, 76.0421° E (Dewas-Sehore Cluster, MP)',
      quantityKg: 6500,
      qualityGrade: 'Export Grade A+',
      verificationHash: '0x7c3f81e2b4d9a60e3f1897c5520ba01d84e40291f09c8e104e76d203a6bc9431',
    },
  },

  MH: {
    stateCode: 'MH',
    stateName: 'Maharashtra',
    stateHindi: 'महाराष्ट्र',
    agroZone: 'Nashik-Pune-Sahyadri Horticultural Grid',
    coordinates: {
      lat: 20.011,
      lng: 73.79,
      label: 'Nashik Agro-Cluster, MH',
    },
    mandiTicker: [
      { commodity: 'Sonaka Grapes', mandi: 'Nashik APMC', price: '₹84/kg', change: '+4.2%', isUp: true },
      { commodity: 'Red Onions', mandi: 'Lasalgaon Mandi', price: '₹26/kg', change: '+1.8%', isUp: true },
      { commodity: 'Export Tomatoes', mandi: 'Pimpalgaon', price: '₹31/kg', change: '-0.6%', isUp: false },
      { commodity: 'Pomegranates', mandi: 'Solapur Hub', price: '₹142/kg', change: '+2.5%', isUp: true },
      { commodity: 'Cold Storage Avg', mandi: 'Sahyadri Grid', price: '₹1.80/kg/mo', change: '84% Free', isUp: true },
      { commodity: 'Reefer Freight', mandi: 'NH-60 Corridor', price: '₹42/km', change: 'Synced', isUp: true },
    ],
    transport: {
      batchId: 'AGRI-2026-00421',
      crop: 'Sonaka Grapes (Export Grade A+)',
      origin: 'Dindori Vineyard Cluster, Nashik',
      midpoint: 'Sahyadri Cold Hub, Unit 4B',
      destination: 'Vashi APMC Mandi, Navi Mumbai',
      distanceKm: 18.4,
      estimatedTravelTimeMin: 34,
      estimatedCostInr: 720,
      routeOptimized: true,
      vehicleNumber: 'MH-15-EG-4821',
      vehicleType: 'Mahindra Bolero Maxi Truck (Insulated)',
      driverName: 'Sanjay Deshmukh',
      currentSpeedKmh: 42,
      cargoTempC: 3.2,
      waypoints: [
        { name: 'Dindori Farm Pickup', status: 'COMPLETED', time: '07:15 AM' },
        { name: 'AgriSync Intake Hub', status: 'COMPLETED', time: '08:05 AM' },
        { name: 'Mumbai-Agra Highway (NH 60)', status: 'IN_TRANSIT', time: 'En Route' },
        { name: 'Vashi Terminal Gate #3', status: 'PENDING', time: 'Est. 10:45 AM' },
      ],
    },
    weather: {
      location: 'Nashik - Dindori Agro-Climatic Zone',
      district: 'Nashik',
      state: 'Maharashtra',
      temperature: 28,
      humidity: 67,
      rainProbability: 32,
      wind: 14,
      condition: 'Partly Cloudy with Evening Thunder Showers',
      forecastSummary: 'Scattered pre-monsoon cloud cover with 32% precipitation probability after 17:00 IST.',
      recommendation:
        'Rain probability is increasing this evening. Consider scheduling transportation earlier to reduce delivery risk and protect uncovered produce trailers.',
      advisoryLevel: 'CAUTION',
      hourlyForecast: [
        { time: '10:00', temp: 26, rainProb: 10, humidity: 72 },
        { time: '12:00', temp: 28, rainProb: 15, humidity: 67 },
        { time: '14:00', temp: 30, rainProb: 22, humidity: 62 },
        { time: '16:00', temp: 29, rainProb: 32, humidity: 68 },
        { time: '18:00', temp: 27, rainProb: 55, humidity: 82 },
        { time: '20:00', temp: 25, rainProb: 65, humidity: 88 },
      ],
    },
    iot: {
      storageUnitId: 'CHAMBER-B4',
      facilityName: 'Sahyadri Agro Cold Chain & Logistics Hub',
      location: 'Dindori Road, Nashik, Maharashtra',
      temperature: 24.6,
      humidity: 61,
      co2Ppm: 480,
      storageStatus: 'NORMAL',
      lastUpdated: '12 seconds ago',
      targetTempRange: '22°C - 25°C',
      targetHumidityRange: '60% - 65%',
      telemetryHistory: [
        { time: '00:00', temperature: 24.1, humidity: 62 },
        { time: '02:00', temperature: 24.2, humidity: 63 },
        { time: '04:00', temperature: 24.0, humidity: 62 },
        { time: '06:00', temperature: 24.3, humidity: 61 },
        { time: '08:00', temperature: 24.5, humidity: 60 },
        { time: '10:00', temperature: 24.8, humidity: 60 },
        { time: '12:00', temperature: 24.9, humidity: 59 },
        { time: '14:00', temperature: 24.7, humidity: 60 },
        { time: '16:00', temperature: 24.6, humidity: 61 },
        { time: '18:00', temperature: 24.5, humidity: 62 },
        { time: '20:00', temperature: 24.6, humidity: 61 },
      ],
    },
    traceability: {
      batchId: 'AGRI-2026-00421',
      crop: 'Sonaka Export Table Grapes',
      variety: 'Seedless Vitis Vinifera',
      harvestDate: '14 Sep 2026, 06:45 AM IST',
      farmer: 'Rameshwar Patil',
      farmName: 'Patil Organic Agro Farms',
      farmCoordinates: '20.1983° N, 73.8112° E (Dindori Cluster)',
      quantityKg: 4200,
      qualityGrade: 'Export Grade A+',
      verificationHash: '0x8f4c2e19d7b3a04e5f1298c7720ba01d84e40291f09c8e104e76d203a6bc9431',
    },
  },

  PB: {
    stateCode: 'PB',
    stateName: 'Punjab',
    stateHindi: 'पंजाब',
    agroZone: 'Malwa-Doaba Grain & Basmati Grid (Ludhiana, Khanna, Amritsar)',
    coordinates: {
      lat: 30.901,
      lng: 75.8573,
      label: 'Ludhiana Agro Hub, Punjab',
    },
    mandiTicker: [
      { commodity: '1121 Basmati Rice', mandi: 'Amritsar Grain Mandi', price: '₹4,850/qtl', change: '+2.8%', isUp: true },
      { commodity: 'PBW-502 Wheat', mandi: 'Khanna Grain Market', price: '₹2,620/qtl', change: '+1.1%', isUp: true },
      { commodity: 'Kinnow Mandarin', mandi: 'Abohar Mandi', price: '₹42/kg', change: '+3.5%', isUp: true },
      { commodity: 'Cold Storage Silos', mandi: 'Ludhiana Grid', price: '₹1.50/kg/mo', change: '91% Free', isUp: true },
      { commodity: 'Reefer Freight', mandi: 'GT Road (NH-44)', price: '₹40/km', change: 'Synced', isUp: true },
    ],
    transport: {
      batchId: 'AGRI-PB-2026-04192',
      crop: '1121 Royal Basmati Paddy',
      origin: 'Jagraon Organic Farmer Syndicate, Ludhiana',
      midpoint: 'Markfed Automated Cold Silo Terminal',
      destination: 'Khanna Asia Grain Terminal, Punjab',
      distanceKm: 42.1,
      estimatedTravelTimeMin: 55,
      estimatedCostInr: 1650,
      routeOptimized: true,
      vehicleNumber: 'PB-10-CZ-5120',
      vehicleType: 'Ashok Leyland Ecomet Reefer Container',
      driverName: 'Harpreet Singh Gill',
      currentSpeedKmh: 50,
      cargoTempC: 18.5,
      waypoints: [
        { name: 'Jagraon Farm Gate Depot', status: 'COMPLETED', time: '06:00 AM' },
        { name: 'Markfed Silo Intake Weighbridge', status: 'COMPLETED', time: '07:10 AM' },
        { name: 'GT Road NH-44 Express Belt', status: 'IN_TRANSIT', time: 'En Route' },
        { name: 'Khanna APMC Mandi Shed #9', status: 'PENDING', time: 'Est. 09:00 AM' },
      ],
    },
    weather: {
      location: 'Ludhiana - Central Punjab Agro Zone',
      district: 'Ludhiana',
      state: 'Punjab',
      temperature: 31,
      humidity: 48,
      rainProbability: 5,
      wind: 9,
      condition: 'Sunny & Dry Harvest Climate',
      forecastSummary: 'Stable continental weather with no rain forecast for next 72 hours.',
      recommendation: 'Excellent conditions for grain transit and silo drying aeration.',
      advisoryLevel: 'OPTIMAL',
      hourlyForecast: [
        { time: '10:00', temp: 28, rainProb: 0, humidity: 55 },
        { time: '12:00', temp: 31, rainProb: 0, humidity: 48 },
        { time: '14:00', temp: 33, rainProb: 2, humidity: 44 },
        { time: '16:00', temp: 32, rainProb: 5, humidity: 46 },
        { time: '18:00', temp: 29, rainProb: 5, humidity: 52 },
        { time: '20:00', temp: 27, rainProb: 2, humidity: 58 },
      ],
    },
    iot: {
      storageUnitId: 'SILO-PB-07',
      facilityName: 'Punjab State Warehousing Automated Silo Hub',
      location: 'GT Road, Ludhiana, Punjab',
      temperature: 20.2,
      humidity: 52,
      co2Ppm: 410,
      storageStatus: 'OPTIMAL',
      lastUpdated: '15 seconds ago',
      targetTempRange: '18°C - 22°C',
      targetHumidityRange: '50% - 55%',
      telemetryHistory: [
        { time: '00:00', temperature: 19.8, humidity: 53 },
        { time: '04:00', temperature: 19.9, humidity: 53 },
        { time: '08:00', temperature: 20.1, humidity: 52 },
        { time: '12:00', temperature: 20.4, humidity: 51 },
        { time: '16:00', temperature: 20.3, humidity: 52 },
        { time: '20:00', temperature: 20.1, humidity: 53 },
      ],
    },
    traceability: {
      batchId: 'AGRI-PB-2026-04192',
      crop: '1121 Royal Basmati Paddy',
      variety: 'Pusa Basmati 1121 (GI Tagged)',
      harvestDate: '15 Sep 2026, 05:30 AM IST',
      farmer: 'Gurdev Singh Sandhu',
      farmName: 'Sandhu Precision Agriculture Farm',
      farmCoordinates: '30.8214° N, 75.7412° E (Jagraon Cluster, Punjab)',
      quantityKg: 8500,
      qualityGrade: 'Export Grade Super A',
      verificationHash: '0x4e8d2c91b3a7f05e192847c6620ba01d84e40291f09c8e104e76d203a6bc1121',
    },
  },

  GJ: {
    stateCode: 'GJ',
    stateName: 'Gujarat',
    stateHindi: 'गुजरात',
    agroZone: 'Saurashtra & North Gujarat Spice Grid (Rajkot, Unjha, Surat)',
    coordinates: {
      lat: 22.3039,
      lng: 70.8022,
      label: 'Rajkot Agro-Belt, Gujarat',
    },
    mandiTicker: [
      { commodity: 'Unjha Cumin (Jeera)', mandi: 'Unjha APMC Mandi', price: '₹28,500/qtl', change: '+4.5%', isUp: true },
      { commodity: 'Saurashtra Groundnut', mandi: 'Rajkot Marketing Yard', price: '₹6,450/qtl', change: '+1.9%', isUp: true },
      { commodity: 'Kesar Mangoes', mandi: 'Talala Gir Hub', price: '₹185/kg', change: '+2.2%', isUp: true },
      { commodity: 'Cold Storage Avg', mandi: 'Gujarat Agro Grid', price: '₹1.75/kg/mo', change: '80% Free', isUp: true },
      { commodity: 'Reefer Freight', mandi: 'NH-48 Coastal Highway', price: '₹39/km', change: 'Synced', isUp: true },
    ],
    transport: {
      batchId: 'AGRI-GJ-2026-03319',
      crop: 'Unjha Export Grade Cumin (Jeera)',
      origin: 'Mehsana Spice Co-op FPO, Gujarat',
      midpoint: 'Unjha Precision Cold Dehydration Terminal',
      destination: 'Kandla Port Export Logistics Yard, Gujarat',
      distanceKm: 88.4,
      estimatedTravelTimeMin: 110,
      estimatedCostInr: 3450,
      routeOptimized: true,
      vehicleNumber: 'GJ-02-EE-7144',
      vehicleType: 'Tata Ultra Reefer Container Truck',
      driverName: 'Bhavesh Patel',
      currentSpeedKmh: 54,
      cargoTempC: 16.0,
      waypoints: [
        { name: 'Mehsana Farm Collection Center', status: 'COMPLETED', time: '05:30 AM' },
        { name: 'Unjha Quality Testing Hub', status: 'COMPLETED', time: '06:45 AM' },
        { name: 'NH-27 Highway Corridor', status: 'IN_TRANSIT', time: 'En Route' },
        { name: 'Kandla Terminal Dock #2', status: 'PENDING', time: 'Est. 11:30 AM' },
      ],
    },
    weather: {
      location: 'Unjha - North Gujarat Spice Belt',
      district: 'Mehsana',
      state: 'Gujarat',
      temperature: 33,
      humidity: 50,
      rainProbability: 8,
      wind: 13,
      condition: 'Clear, Warm & Dry Spice Season',
      forecastSummary: 'Optimal dry conditions across northern Gujarat spice and groundnut corridors.',
      recommendation: 'Low humidity is ideal for spice transport and grain warehouse packing.',
      advisoryLevel: 'OPTIMAL',
      hourlyForecast: [
        { time: '10:00', temp: 30, rainProb: 0, humidity: 55 },
        { time: '12:00', temp: 33, rainProb: 5, humidity: 48 },
        { time: '14:00', temp: 35, rainProb: 8, humidity: 44 },
        { time: '16:00', temp: 34, rainProb: 8, humidity: 46 },
        { time: '18:00', temp: 31, rainProb: 5, humidity: 52 },
        { time: '20:00', temp: 29, rainProb: 2, humidity: 56 },
      ],
    },
    iot: {
      storageUnitId: 'CHAMBER-GJ-05',
      facilityName: 'Gujarat Agro Industries Cold Hub',
      location: 'Highway 41, Unjha, Gujarat',
      temperature: 16.5,
      humidity: 45,
      co2Ppm: 420,
      storageStatus: 'NORMAL',
      lastUpdated: '10 seconds ago',
      targetTempRange: '15°C - 18°C',
      targetHumidityRange: '40% - 50%',
      telemetryHistory: [
        { time: '00:00', temperature: 16.2, humidity: 46 },
        { time: '04:00', temperature: 16.3, humidity: 45 },
        { time: '08:00', temperature: 16.5, humidity: 45 },
        { time: '12:00', temperature: 16.8, humidity: 44 },
        { time: '16:00', temperature: 16.6, humidity: 45 },
        { time: '20:00', temperature: 16.4, humidity: 46 },
      ],
    },
    traceability: {
      batchId: 'AGRI-GJ-2026-03319',
      crop: 'Unjha Export Grade Cumin',
      variety: 'Gujarat Cumin-4 (GC-4)',
      harvestDate: '15 Sep 2026, 06:15 AM IST',
      farmer: 'Mansukhbhai Patel',
      farmName: 'Shree Umiya Agro Farms',
      farmCoordinates: '23.8012° N, 72.3921° E (Unjha Cluster, Gujarat)',
      quantityKg: 3800,
      qualityGrade: 'Export Machine Clean 99.5%',
      verificationHash: '0x9b1a7e44c2d0f81e3a6597c8820ba01d84e40291f09c8e104e76d203a6bc3319',
    },
  },

  UP: {
    stateCode: 'UP',
    stateName: 'Uttar Pradesh',
    stateHindi: 'उत्तर प्रदेश',
    agroZone: 'Gangetic Plains Agro Belt (Varanasi, Lucknow, Bareilly)',
    coordinates: {
      lat: 25.3176,
      lng: 82.9739,
      label: 'Varanasi Agro Hub, UP',
    },
    mandiTicker: [
      { commodity: 'Langra Mangoes & Veg', mandi: 'Varanasi APMC', price: '₹48/kg', change: '+2.4%', isUp: true },
      { commodity: 'Chipsona Potato', mandi: 'Agra-Aligarh Mandi', price: '₹1,650/qtl', change: '+1.5%', isUp: true },
      { commodity: 'Basmati Paddy', mandi: 'Bareilly Mandi', price: '₹4,200/qtl', change: '+0.9%', isUp: true },
      { commodity: 'Cold Storage Avg', mandi: 'Purvanchal Grid', price: '₹1.60/kg/mo', change: '82% Free', isUp: true },
      { commodity: 'Reefer Freight', mandi: 'Purvanchal Expressway', price: '₹37/km', change: 'Synced', isUp: true },
    ],
    transport: {
      batchId: 'AGRI-UP-2026-09204',
      crop: 'Purvanchal Fresh Vegetables & Green Peas',
      origin: 'Mirzapur Farmers Co-operative FPO, UP',
      midpoint: 'Varanasi International Airport Cargo Terminal Cold Bay',
      destination: 'Lal Bahadur Shastri Cargo Terminal / Mandi, Varanasi',
      distanceKm: 28.2,
      estimatedTravelTimeMin: 40,
      estimatedCostInr: 980,
      routeOptimized: true,
      vehicleNumber: 'UP-65-BT-4210',
      vehicleType: 'Mahindra Bolero Maxi Truck (Cold-Pack)',
      driverName: 'Ramprasad Yadav',
      currentSpeedKmh: 45,
      cargoTempC: 4.8,
      waypoints: [
        { name: 'Mirzapur Agro Collection Center', status: 'COMPLETED', time: '06:15 AM' },
        { name: 'Varanasi Cold Storage Unit #1', status: 'COMPLETED', time: '07:10 AM' },
        { name: 'GT Road Ring Road Corridor', status: 'IN_TRANSIT', time: 'En Route' },
        { name: 'Lal Bahadur Shastri Mandi Intake', status: 'PENDING', time: 'Est. 08:30 AM' },
      ],
    },
    weather: {
      location: 'Varanasi - Eastern UP Agro-Zone',
      district: 'Varanasi',
      state: 'Uttar Pradesh',
      temperature: 30,
      humidity: 62,
      rainProbability: 20,
      wind: 10,
      condition: 'Partly Sunny with Mild Humidity',
      forecastSummary: 'Passing clouds over Gangetic plains with low rain risk.',
      recommendation: 'Good road transit conditions along Purvanchal and GT road corridors.',
      advisoryLevel: 'OPTIMAL',
      hourlyForecast: [
        { time: '10:00', temp: 28, rainProb: 10, humidity: 68 },
        { time: '12:00', temp: 31, rainProb: 15, humidity: 60 },
        { time: '14:00', temp: 33, rainProb: 20, humidity: 56 },
        { time: '16:00', temp: 32, rainProb: 20, humidity: 58 },
        { time: '18:00', temp: 29, rainProb: 15, humidity: 65 },
        { time: '20:00', temp: 27, rainProb: 10, humidity: 72 },
      ],
    },
    iot: {
      storageUnitId: 'CHAMBER-UP-03',
      facilityName: 'Purvanchal Agro Cold Logistics Center',
      location: 'Airport Road, Varanasi, Uttar Pradesh',
      temperature: 24.2,
      humidity: 62,
      co2Ppm: 450,
      storageStatus: 'NORMAL',
      lastUpdated: '14 seconds ago',
      targetTempRange: '22°C - 25°C',
      targetHumidityRange: '60% - 65%',
      telemetryHistory: [
        { time: '00:00', temperature: 23.9, humidity: 64 },
        { time: '04:00', temperature: 24.0, humidity: 63 },
        { time: '08:00', temperature: 24.2, humidity: 62 },
        { time: '12:00', temperature: 24.5, humidity: 60 },
        { time: '16:00', temperature: 24.3, humidity: 61 },
        { time: '20:00', temperature: 24.1, humidity: 63 },
      ],
    },
    traceability: {
      batchId: 'AGRI-UP-2026-09204',
      crop: 'Purvanchal Farm Fresh Peas & Veg',
      variety: 'GS-10 Organic Table Peas',
      harvestDate: '15 Sep 2026, 06:00 AM IST',
      farmer: 'Dinesh Chandra Maurya',
      farmName: 'Maurya Vegetable Syndicate',
      farmCoordinates: '25.2140° N, 82.8941° E (Mirzapur-Varanasi Belt)',
      quantityKg: 3200,
      qualityGrade: 'Grade A Export Pack',
      verificationHash: '0x3c7a91f4d2e8b05e194827c9920ba01d84e40291f09c8e104e76d203a6bc9204',
    },
  },
};

interface LocationContextType {
  activeState: 'MP' | 'MH' | 'PB' | 'GJ' | 'UP';
  currentData: RegionalData;
  isGpsActive: boolean;
  gpsStatusMessage: string | null;
  detectedCoords: { lat: number; lng: number } | null;
  setState: (stateCode: 'MP' | 'MH' | 'PB' | 'GJ' | 'UP') => void;
  detectLocationViaGps: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default region is explicitly Madhya Pradesh (MP) as requested!
  const [activeState, setActiveState] = useState<'MP' | 'MH' | 'PB' | 'GJ' | 'UP'>('MP');
  const [isGpsActive, setIsGpsActive] = useState<boolean>(false);
  const [gpsStatusMessage, setGpsStatusMessage] = useState<string | null>(
    'Default Agro-Grid: Madhya Pradesh (Active)'
  );
  const [detectedCoords, setDetectedCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Initialize from localStorage if saved, else MP
  useEffect(() => {
    try {
      const saved = localStorage.getItem('agrisync_active_state');
      if (saved && REGIONS_DATA[saved]) {
        setActiveState(saved as any);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSetState = (stateCode: 'MP' | 'MH' | 'PB' | 'GJ' | 'UP') => {
    setActiveState(stateCode);
    setIsGpsActive(false);
    setGpsStatusMessage(`Manual Selection: ${REGIONS_DATA[stateCode].stateName}`);
    try {
      localStorage.setItem('agrisync_active_state', stateCode);
    } catch {
      // ignore
    }
  };

  const detectLocationViaGps = async (): Promise<void> => {
    setGpsStatusMessage('Acquiring satellite GPS coordinates...');

    if (!navigator.geolocation) {
      setGpsStatusMessage('Geolocation not supported by this browser. Defaulting to Madhya Pradesh.');
      return;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setDetectedCoords({ lat, lng });
          setIsGpsActive(true);

          // Find closest supported agro region
          // Madhya Pradesh center approx: 22.7°N, 77.0°E
          // Maharashtra: 19.5°N, 75.0°E
          // Punjab: 30.9°N, 75.8°E
          // Gujarat: 22.5°N, 71.5°E
          // Uttar Pradesh: 26.5°N, 81.0°E
          let matchedState: 'MP' | 'MH' | 'PB' | 'GJ' | 'UP' = 'MP';

          // Lat/Lng bounding boxes for Indian regional zones:
          if (lat >= 21.0 && lat <= 26.8 && lng >= 74.0 && lng <= 82.5) {
            matchedState = 'MP'; // Madhya Pradesh
          } else if (lat >= 15.6 && lat <= 22.0 && lng >= 72.6 && lng <= 80.9) {
            matchedState = 'MH'; // Maharashtra
          } else if (lat >= 29.5 && lat <= 32.5 && lng >= 73.8 && lng <= 76.9) {
            matchedState = 'PB'; // Punjab
          } else if (lat >= 20.0 && lat <= 24.7 && lng >= 68.0 && lng <= 74.5) {
            matchedState = 'GJ'; // Gujarat
          } else if (lat >= 23.8 && lat <= 30.4 && lng >= 77.0 && lng <= 84.6) {
            matchedState = 'UP'; // Uttar Pradesh
          } else {
            // Default fallback if outside or international IP
            matchedState = 'MP';
          }

          setActiveState(matchedState);
          setGpsStatusMessage(
            `GPS Detected: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E • Synced to ${REGIONS_DATA[matchedState].stateName}`
          );
          try {
            localStorage.setItem('agrisync_active_state', matchedState);
          } catch {
            // ignore
          }
          resolve();
        },
        (error) => {
          console.warn('Geolocation access error:', error.message);
          setGpsStatusMessage(
            `GPS access restricted or unavailable (${error.message}). Kept active in Madhya Pradesh.`
          );
          setIsGpsActive(false);
          resolve();
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  };

  return (
    <LocationContext.Provider
      value={{
        activeState,
        currentData: REGIONS_DATA[activeState] || REGIONS_DATA.MP,
        isGpsActive,
        gpsStatusMessage,
        detectedCoords,
        setState: handleSetState,
        detectLocationViaGps,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};
