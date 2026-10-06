export type FuelType = 'DIESEL' | 'PETROL' | 'PREMIUM_PETROL' | 'EXTRA_PREMIUM';

export interface FuelProductInfo {
  id: FuelType;
  name: string;
  code: string;
  liquidColor: string; // Indian fuel visual appearance
  liquidGradient: string;
  accentColor: string; // UI pill/border accent
  badgeColor: string;
  handleColor: string; // Indian dispenser nozzle handle color
  densityStandard: string; // e.g. "820 - 845 kg/m³"
  defaultDensity: number; // kg/m³
  defaultRate: number; // ₹ per liter
  octaneOrCetane: string;
}

export interface TankData {
  id: string; // e.g., "TK-01"
  tankNumber: number;
  fuelType: FuelType;
  capacityLiters: number;
  currentFuelLiters: number;
  waterLevelLiters: number;
  waterLevelMm: number; // water bottom level
  temperatureCelsius: number;
  density: number; // kg/m³
  ullageLiters: number; // empty capacity left
  atgProbeStatus: 'ONLINE' | 'WARNING' | 'CALIBRATING' | 'OFFLINE';
  lastDeliveryDate: string; // dd-mm-yyyy
  lastDeliveryLiters: number;
  connectedDispensers: string[]; // dispenser IDs
  tankHeightMm: number;
  fuelHeightMm: number;
}

export interface NozzleTransaction {
  id: string;
  receiptNumber: string;
  nozzleNumber: number;
  dispenserId: string;
  productType: FuelType;
  volumeLiters: number;
  unitPrice: number; // ₹/L
  totalAmount: number; // ₹
  density: number; // kg/m³
  rate: number; // flow rate L/min
  dateTime: string; // dd-mm-yyyy HH:MM:SS
  rawDate: string; // ISO for sorting
  paymentMethod: 'UPI / QR' | 'FLEET CARD' | 'CASH' | 'CREDIT CARD' | 'FASTAG RFID';
  vehiclePlate?: string;
  presetType: 'VOLUME' | 'AMOUNT' | 'FULL_TANK';
  attendantName: string;
}

export interface NozzleData {
  id: string; // e.g., "NZ-101"
  nozzleNumber: number; // 1, 2, 3, 4
  productType: FuelType;
  connectedTankId: string;
  unitPrice: number; // ₹/L
  flowRate: number; // L/min (Rate)
  density: number; // kg/m³
  amountTotalizer: number; // ₹ (cumulative lifetime or shift)
  volumeTotalizer: number; // Litres (cumulative)
  transactionCount: number;
  lastTransactionDateTime: string; // dd-mm-yyyy HH:MM:SS
  lastTransactionVolume: number;
  lastTransactionAmount: number;
  status: 'IDLE' | 'DISPENSING' | 'LIFTED' | 'MAINTENANCE' | 'OFFLINE';
  recentTransactions: NozzleTransaction[];
}

export interface DispenserData {
  id: string; // e.g. "T2628482"
  serialNumber: string;
  bayNumber: number; // Bay 1, Bay 2, etc.
  model: string; // "Wayne Helix 5000" or "Tokheim Quantium 510"
  pndfConfig: string; // e.g. "1111", "2422", "1214" (Product Nozzle Display Fip Number)
  ipAddress: string;
  fipLoopChannel: number;
  status: 'ACTIVE' | 'DISPENSING' | 'IDLE' | 'ALARM' | 'SUSPENDED';
  nozzles: NozzleData[];
  lastMaintenanceDate: string;
  commissionedDate: string;
}

export interface StationData {
  stationId: string;
  stationName: string;
  location: string;
  city: string;
  state: string;
  oilCompany: 'IOCL' | 'BPCL' | 'HPCL' | 'DOVER_PRIVATE';
  licenseNumber: string;
  serviceEngineer: {
    id: string;
    name: string;
    role: string;
    contact: string;
    certification: string;
    shift: string;
  };
  tanks: TankData[];
  dispensers: DispenserData[];
  fipGatewayStatus: 'ONLINE' | 'DEGRADED' | 'DISCONNECTED';
  atgConsoleStatus: 'ONLINE' | 'ALARM' | 'STANDBY';
  lastSyncTimestamp: string;
}

export interface DispenserOnboardingPayload {
  stationId: string;
  stationName: string;
  tankId: string;
  bayNumber: number;
  dispenserSerial: string;
  dispenserModel: string;
  pndfConfig: string;
  ipAddress: string;
  nozzleConfigurations: {
    nozzleNumber: number;
    productType: FuelType;
    unitPrice: number;
  }[];
  commissioningEngineer: string;
  notes?: string;
}
