/**
 * Dover FuelIQ™ - MongoDB API Adapter & Data Service
 * Connects frontend UI state with MongoDB REST / WebSocket backend
 */

import { StationData, DispenserData, NozzleTransaction } from '../types/fuel-station';
import { INITIAL_STATION_DATA } from '../data/mock-station-data';

export interface MongoApiConfig {
  baseUrl: string;
  useLiveMongo: boolean;
}

export const API_CONFIG: MongoApiConfig = {
  baseUrl: '/api',
  useLiveMongo: false, // Toggled to true when MongoDB URI & server proxy are configured
};

/**
 * Transforms MongoDB Station Document + Joined Collections into UI StationData format
 */
export function mapMongoDocToStationData(mongoStationDoc: any): StationData {
  return {
    stationId: mongoStationDoc.stationId || 'DOV-4091',
    stationName: mongoStationDoc.stationName || 'Dover Flagship Terminal',
    location: mongoStationDoc.address?.street || 'DLF Cyber City, Sector 24',
    city: mongoStationDoc.address?.city || 'Gurugram',
    state: mongoStationDoc.address?.state || 'Haryana',
    oilCompany: mongoStationDoc.company || 'IOCL',
    licenseNumber: mongoStationDoc.licenseNumber || 'DFS-IND-PESO-2024-88910',
    serviceEngineer: {
      id: mongoStationDoc.serviceEngineer?.engineerId || 'DFS-ENG-8821',
      name: mongoStationDoc.serviceEngineer?.name || 'Rajesh Kumar',
      role: mongoStationDoc.serviceEngineer?.role || 'Lead Service Engineer',
      contact: mongoStationDoc.serviceEngineer?.contactNumber || '+91 98104 55210',
      certification: mongoStationDoc.serviceEngineer?.certification || 'Dover Wayne Master',
      shift: 'General Maintenance (08:00 - 20:00 IST)',
    },
    fipGatewayStatus: mongoStationDoc.gatewayConfig?.status || 'ONLINE',
    atgConsoleStatus: 'ONLINE',
    lastSyncTimestamp: new Date().toISOString(),
    tanks: mongoStationDoc.tanks || INITIAL_STATION_DATA.tanks,
    dispensers: mongoStationDoc.dispensers || INITIAL_STATION_DATA.dispensers,
  };
}

/**
 * Fetch Station Telemetry from MongoDB Collection
 */
export async function fetchStationData(stationId: string): Promise<StationData> {
  if (API_CONFIG.useLiveMongo) {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/stations/${stationId}`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const data = await response.json();
      return mapMongoDocToStationData(data);
    } catch (err) {
      console.warn('[MongoDB Service] Falling back to synchronized local cache:', err);
    }
  }

  // Synchronized in-memory / local storage cache
  const cached = localStorage.getItem(`dover_station_${stationId}`);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // Fallback
    }
  }

  return INITIAL_STATION_DATA;
}

/**
 * Post Onboarding Dispenser Document into MongoDB Collection
 */
export async function saveDispenserToMongo(dispenser: DispenserData, stationId: string): Promise<boolean> {
  if (API_CONFIG.useLiveMongo) {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/dispensers/onboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stationId,
          ...dispenser,
          createdAt: new Date().toISOString(),
        }),
      });
      return response.ok;
    } catch (err) {
      console.error('[MongoDB Service] Failed to save to MongoDB:', err);
      return false;
    }
  }

  // Local sync
  return true;
}

/**
 * Query Transactions Collection with Pagination & Sorting
 */
export async function queryTransactionsFromMongo(params: {
  stationId: string;
  dispenserId?: string;
  nozzleNumber?: number;
  productType?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
}): Promise<{ transactions: NozzleTransaction[]; total: number }> {
  if (API_CONFIG.useLiveMongo) {
    try {
      const query = new URLSearchParams(params as any).toString();
      const res = await fetch(`${API_CONFIG.baseUrl}/transactions?${query}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('[MongoDB Service] Query transactions fallback:', err);
    }
  }

  return { transactions: [], total: 0 };
}
