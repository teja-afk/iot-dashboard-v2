/**
 * Dover FuelIQ™ - MongoDB Schema Definitions & Aggregation Pipelines
 * Designed for High-Throughput Fuel Station Telemetry & Legal Metrology
 */

import { FuelType } from '../types/fuel-station';

// ==========================================
// 1. MONGODB COLLECTION INTERFACES
// ==========================================

export interface MongoStationDoc {
  _id: string; // ObjectId or stationId e.g. "DOV-4091"
  stationId: string; // Unique index
  stationName: string;
  company: 'IOCL' | 'BPCL' | 'HPCL' | 'DOVER_PRIVATE';
  licenseNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    geoCoordinates?: { type: 'Point'; coordinates: [number, number] }; // [lon, lat]
  };
  serviceEngineer: {
    engineerId: string;
    name: string;
    role: string;
    certification: string;
    contactNumber: string;
  };
  gatewayConfig: {
    fipGatewayVersion: string;
    loopChannels: number[];
    ipAddress: string;
    port: number;
    pollIntervalMs: number;
    status: 'ONLINE' | 'DEGRADED' | 'DISCONNECTED';
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface MongoTankDoc {
  _id: string; // ObjectId
  stationId: string; // Ref to stations.stationId, Indexed
  tankId: string; // e.g. "TK-01"
  tankNumber: number;
  fuelType: FuelType; // DIESEL, PETROL, PREMIUM_PETROL, EXTRA_PREMIUM
  capacityLiters: number;
  currentFuelLiters: number;
  waterLevelLiters: number;
  waterLevelMm: number; // Water-bottom interface
  fuelHeightMm: number;
  temperatureCelsius: number;
  density: number; // kg/m³ @ 15°C
  ullageLiters: number;
  atgProbe: {
    model: string; // e.g. "OPW SiteSentinel #VR-9102"
    serialNumber: string;
    status: 'ONLINE' | 'WARNING' | 'CALIBRATING' | 'OFFLINE';
    lastDipCheckTimestamp: Date;
  };
  connectedDispensers: string[]; // ["T2628482", "T2628483"]
  updatedAt: Date;
}

export interface MongoDispenserDoc {
  _id: string; // ObjectId
  stationId: string; // Ref to stations.stationId, Indexed
  dispenserId: string; // e.g. "T2628482", Unique compound index with stationId
  serialNumber: string;
  bayNumber: number; // 1, 2, 3, 4
  model: string; // "Dover Wayne Helix 5000 Quad MPD"
  pndfConfig: string; // "1111", "2422", "1214" (Product Nozzle Display Fip)
  ipAddress: string;
  fipLoopChannel: number;
  status: 'ACTIVE' | 'DISPENSING' | 'IDLE' | 'ALARM' | 'SUSPENDED';
  activeFlowRate?: number; // L/min (when dispensing)
  activeSaleAmount?: number; // ₹ (when dispensing)
  activeSaleVolume?: number; // Liters
  lastMaintenanceDate: Date;
  commissionedDate: Date;
  updatedAt: Date;
}

export interface MongoNozzleDoc {
  _id: string; // ObjectId
  stationId: string; // Indexed
  dispenserId: string; // Indexed
  nozzleNumber: number; // 1, 2, 3, 4
  productType: FuelType;
  connectedTankId: string;
  unitPrice: number; // ₹/L
  flowRateStandard: number; // e.g. 38.0 or 70.0 (High Flow)
  calibratedDensity: number; // kg/m³
  amountTotalizer: number; // Lifetime ₹ cumulative
  volumeTotalizer: number; // Lifetime L cumulative
  transactionCount: number;
  lastTransaction: {
    receiptNumber: string;
    volumeLiters: number;
    totalAmount: number;
    timestamp: Date;
  };
  status: 'IDLE' | 'DISPENSING' | 'LIFTED' | 'MAINTENANCE';
  updatedAt: Date;
}

export interface MongoTransactionDoc {
  _id: string; // ObjectId
  receiptNumber: string; // Unique index e.g. "REC-0610-884101"
  stationId: string; // Index 1
  dispenserId: string; // Index 2
  nozzleNumber: number;
  productType: FuelType;
  volumeLiters: number;
  unitPrice: number;
  totalAmount: number;
  density: number; // Measured density
  flowRate: number; // Measured flow rate
  timestamp: Date; // Indexed for time-series aggregation
  paymentMethod: 'UPI / QR' | 'FLEET CARD' | 'CASH' | 'CREDIT CARD' | 'FASTAG RFID';
  vehiclePlate?: string;
  presetType: 'VOLUME' | 'AMOUNT' | 'FULL_TANK';
  attendantName: string;
}

// ==========================================
// 2. MONGOOSE SCHEMA DEFINITIONS CODE EXAMPLE
// ==========================================

export const MONGOOSE_SCHEMAS_EXAMPLE = `
import mongoose, { Schema } from 'mongoose';

// 1. Transactions Collection Schema (Optimized for Telemetry Analytics)
const TransactionSchema = new Schema({
  receiptNumber: { type: String, required: true, unique: true },
  stationId: { type: String, required: true, index: true },
  dispenserId: { type: String, required: true, index: true },
  nozzleNumber: { type: Number, required: true },
  productType: { 
    type: String, 
    enum: ['DIESEL', 'PETROL', 'PREMIUM_PETROL', 'EXTRA_PREMIUM'],
    required: true,
    index: true 
  },
  volumeLiters: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  density: { type: Number, required: true },
  flowRate: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now, index: true },
  paymentMethod: { type: String, required: true },
  vehiclePlate: { type: String, sparse: true, index: true },
  presetType: { type: String, enum: ['VOLUME', 'AMOUNT', 'FULL_TANK'] },
  attendantName: { type: String, required: true }
}, { timestamps: true });

// Compound Indexes for fast dashboard range queries
TransactionSchema.index({ stationId: 1, timestamp: -1 });
TransactionSchema.index({ stationId: 1, dispenserId: 1, nozzleNumber: 1, timestamp: -1 });

// 2. Dispensers Collection Schema
const DispenserSchema = new Schema({
  stationId: { type: String, required: true, index: true },
  dispenserId: { type: String, required: true },
  bayNumber: { type: Number, required: true },
  model: { type: String, required: true },
  pndfConfig: { type: String, required: true }, // e.g. "1111", "2422"
  ipAddress: { type: String, required: true },
  fipLoopChannel: { type: Number, required: true },
  status: { type: String, enum: ['ACTIVE', 'DISPENSING', 'IDLE', 'ALARM', 'SUSPENDED'], default: 'IDLE' },
  lastMaintenanceDate: { type: Date }
}, { timestamps: true });

DispenserSchema.index({ stationId: 1, dispenserId: 1 }, { unique: true });
`;

// ==========================================
// 3. MONGODB AGGREGATION PIPELINES
// ==========================================

export const MONGODB_AGGREGATIONS = {
  // Aggregation 1: Monthly Sales Trend (Powering the Dot-Matrix Chart in Overview)
  monthlySalesTrend: `
db.transactions.aggregate([
  {
    $match: {
      stationId: "DOV-4091",
      timestamp: {
        $gte: new Date("2026-01-01T00:00:00Z"),
        $lte: new Date("2026-12-31T23:59:59Z")
      }
    }
  },
  {
    $group: {
      _id: { $month: "$timestamp" },
      totalVolumeLiters: { $sum: "$volumeLiters" },
      totalRevenueINR: { $sum: "$totalAmount" },
      dieselVolume: {
        $sum: { $cond: [{ $eq: ["$productType", "DIESEL"] }, "$volumeLiters", 0] }
      },
      petrolVolume: {
        $sum: { $cond: [{ $eq: ["$productType", "PETROL"] }, "$volumeLiters", 0] }
      },
      transactionCount: { $sum: 1 }
    }
  },
  { $sort: { "_id": 1 } }
]);
`,

  // Aggregation 2: Revenue & Volume Breakdown by Fuel Grade
  fuelGradeBreakdown: `
db.transactions.aggregate([
  {
    $match: {
      stationId: "DOV-4091",
      timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
    }
  },
  {
    $group: {
      _id: "$productType",
      totalRevenue: { $sum: "$totalAmount" },
      totalVolume: { $sum: "$volumeLiters" },
      avgUnitPrice: { $avg: "$unitPrice" },
      txCount: { $sum: 1 }
    }
  },
  {
    $project: {
      productType: "$_id",
      totalRevenue: 1,
      totalVolume: 1,
      avgUnitPrice: 1,
      txCount: 1,
      _id: 0
    }
  }
]);
`,

  // Aggregation 3: Live Nozzle Totalizers Verification (Legal Metrology reconciliation)
  reconcileNozzleTotalizers: `
db.transactions.aggregate([
  {
    $match: {
      stationId: "DOV-4091",
      dispenserId: "T2628482"
    }
  },
  {
    $group: {
      _id: "$nozzleNumber",
      calculatedVolume: { $sum: "$volumeLiters" },
      calculatedRevenue: { $sum: "$totalAmount" },
      lastRecordedDate: { $max: "$timestamp" },
      totalTransactions: { $sum: 1 }
    }
  },
  { $sort: { "_id": 1 } }
]);
`
};

// ==========================================
// 4. REAL-TIME CHANGE STREAMS (WEBSOCKET / SSE)
// ==========================================

export const MONGODB_CHANGE_STREAM_CODE = `
// Real-time Telemetry with MongoDB Change Streams & Server-Sent Events (SSE)
import { MongoClient } from 'mongodb';

export function setupRealtimeStationListener(ioOrSseClient, stationId) {
  const client = new MongoClient(process.env.MONGODB_URI);
  const db = client.db('dover_fueliq');
  
  // Watch transactions collection for real-time dispensing
  const changeStream = db.collection('transactions').watch([
    {
      $match: {
        'operationType': 'insert',
        'fullDocument.stationId': stationId
      }
    }
  ]);

  changeStream.on('change', (change) => {
    const newTx = change.fullDocument;
    
    // Broadcast live transaction to frontend dashboard
    ioOrSseClient.emit('transaction:new', {
      stationId: newTx.stationId,
      dispenserId: newTx.dispenserId,
      nozzleNumber: newTx.nozzleNumber,
      volumeLiters: newTx.volumeLiters,
      totalAmount: newTx.totalAmount,
      timestamp: newTx.timestamp
    });

    // Automatically atomically update nozzle & dispenser totalizers
    db.collection('nozzles').updateOne(
      { stationId: newTx.stationId, dispenserId: newTx.dispenserId, nozzleNumber: newTx.nozzleNumber },
      {
        $inc: {
          volumeTotalizer: newTx.volumeLiters,
          amountTotalizer: newTx.totalAmount,
          transactionCount: 1
        },
        $set: {
          'lastTransaction.receiptNumber': newTx.receiptNumber,
          'lastTransaction.volumeLiters': newTx.volumeLiters,
          'lastTransaction.totalAmount': newTx.totalAmount,
          'lastTransaction.timestamp': newTx.timestamp
        }
      }
    );
  });
}
`;
