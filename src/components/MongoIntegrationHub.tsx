import React, { useState } from 'react';
import { 
  Database, 
  Code2, 
  Layers, 
  Workflow, 
  CheckCircle2, 
  Copy, 
  Check, 
  Server, 
  Zap, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  MONGOOSE_SCHEMAS_EXAMPLE, 
  MONGODB_AGGREGATIONS, 
  MONGODB_CHANGE_STREAM_CODE 
} from '../db/mongodb-schemas';

export const MongoIntegrationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'collections' | 'aggregations' | 'changestreams' | 'architecture'>('collections');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const collections = [
    {
      name: 'stations',
      description: 'Station root metadata, PESO license, loop controller gateway IP, and service engineer assignment.',
      documentExample: {
        _id: 'ObjectId("6702c1a84f3e...")',
        stationId: 'DOV-4091',
        stationName: 'Dover Flagship Cyber Terminal - Express Retail Hub',
        company: 'IOCL',
        licenseNumber: 'DFS-IND-PESO-2024-88910',
        gatewayConfig: {
          fipGatewayVersion: 'v4.81',
          loopChannels: [1, 2, 3, 4],
          ipAddress: '192.168.10.1',
          status: 'ONLINE',
        },
      },
    },
    {
      name: 'tanks',
      description: 'Underground cylindrical storage tanks (UST), fuel capacity, liquid height, and water-bottom millimeters.',
      documentExample: {
        _id: 'ObjectId("6702c1b29a1d...")',
        stationId: 'DOV-4091',
        tankId: 'TK-01',
        tankNumber: 1,
        fuelType: 'DIESEL',
        capacityLiters: 30000,
        currentFuelLiters: 22450,
        waterLevelLiters: 18.5,
        waterLevelMm: 6.2,
        density: 832.4,
        atgProbeStatus: 'ONLINE',
      },
    },
    {
      name: 'dispensers',
      description: 'Multi-Product Dispensers (MPD), bay locations, hardware serials, and PNDF protocol mappings.',
      documentExample: {
        _id: 'ObjectId("6702c1c1102e...")',
        stationId: 'DOV-4091',
        dispenserId: 'T2628482',
        bayNumber: 1,
        model: 'Dover Wayne Helix 5000 Quad MPD',
        pndfConfig: '1111',
        ipAddress: '192.168.10.11',
        fipLoopChannel: 1,
        status: 'DISPENSING',
      },
    },
    {
      name: 'nozzles',
      description: 'Fueling nozzles, product grade color codes, unit prices, electronic amount and volume totalizers.',
      documentExample: {
        _id: 'ObjectId("6702c1d8990c...")',
        dispenserId: 'T2628482',
        nozzleNumber: 1,
        productType: 'DIESEL',
        unitPrice: 89.62,
        flowRate: 38.4,
        density: 832.4,
        amountTotalizer: 28419200.50,
        volumeTotalizer: 317107.80,
        transactionCount: 8412,
        lastTransactionDateTime: '06-10-2026 08:54:12',
      },
    },
    {
      name: 'transactions',
      description: 'Time-series ledger of individual fueling sales, receipt numbers, flow rates, vehicle plates, and presets.',
      documentExample: {
        _id: 'ObjectId("6702c1ef4a89...")',
        receiptNumber: 'REC-0610-884101',
        stationId: 'DOV-4091',
        dispenserId: 'T2628482',
        nozzleNumber: 1,
        productType: 'DIESEL',
        volumeLiters: 42.50,
        unitPrice: 89.62,
        totalAmount: 3808.85,
        density: 832.4,
        rate: 38.4,
        timestamp: '2026-10-06T08:54:12.000Z',
        paymentMethod: 'FLEET CARD',
        vehiclePlate: 'HR-26-DM-4109',
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-semibold font-mono">
              MongoDB Tech Stack Guide
            </span>
            <span className="text-gray-400 text-xs font-mono">
              Database: dover_fueliq
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            How to Accommodate MongoDB Collections in Dover FuelIQ
          </h2>
          <p className="text-xs text-gray-500 mt-1 max-w-3xl">
            This architectural guide explains how to connect Dover IoT telemetry streams directly with a MongoDB cluster (Mongoose / MongoDB Node.js Driver), including collections, aggregation pipelines, and real-time Change Streams.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-mono text-gray-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Adapter: Ready for Next.js / Express</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('collections')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'collections'
              ? 'bg-white text-gray-900 shadow-xs'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>1. Collections & BSON Schemas</span>
        </button>

        <button
          onClick={() => setActiveTab('aggregations')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'aggregations'
              ? 'bg-white text-gray-900 shadow-xs'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>2. Aggregation Pipelines</span>
        </button>

        <button
          onClick={() => setActiveTab('changestreams')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'changestreams'
              ? 'bg-white text-gray-900 shadow-xs'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>3. Real-Time Change Streams</span>
        </button>

        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'architecture'
              ? 'bg-white text-gray-900 shadow-xs'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Workflow className="w-3.5 h-3.5" />
          <span>4. Next.js / Express Integration</span>
        </button>
      </div>

      {/* Tab 1: Collections */}
      {activeTab === 'collections' && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              5 Core MongoDB Collections for Fuel Stations
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Normalized document layout designed for horizontal scaling across thousands of retail outlets with sub-millisecond query indexing.
            </p>

            <div className="space-y-6">
              {collections.map((col) => (
                <div key={col.name} className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-gray-900 text-white px-2 py-0.5 rounded">
                        db.{col.name}
                      </span>
                      <span className="text-xs text-gray-600 font-medium">
                        {col.description}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(JSON.stringify(col.documentExample, null, 2), col.name)}
                      className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-900 font-medium cursor-pointer"
                    >
                      {copiedKey === col.name ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === col.name ? 'Copied JSON' : 'Copy Sample Document'}</span>
                    </button>
                  </div>

                  <div className="p-4 bg-gray-950 text-gray-200 font-mono text-xs overflow-x-auto">
                    <pre>{JSON.stringify(col.documentExample, null, 2)}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Aggregations */}
      {activeTab === 'aggregations' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                MongoDB Aggregation Pipelines for Dashboard Analytics
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                These aggregation queries run on the MongoDB cluster to power the interactive charts without transferring raw rows to the frontend.
              </p>
            </div>

            {/* Pipeline 1 */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b border-gray-200">
                <div>
                  <div className="font-bold text-xs text-gray-900">
                    Pipeline 1: Monthly Sales Trend (Powers Overview Dot-Matrix Chart)
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Groups millions of transactions into 12 monthly volume and revenue buckets.
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(MONGODB_AGGREGATIONS.monthlySalesTrend, 'pipe1')}
                  className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 font-medium cursor-pointer"
                >
                  {copiedKey === 'pipe1' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Pipeline</span>
                </button>
              </div>
              <pre className="p-4 bg-gray-950 text-gray-300 font-mono text-xs overflow-x-auto">
                {MONGODB_AGGREGATIONS.monthlySalesTrend}
              </pre>
            </div>

            {/* Pipeline 2 */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b border-gray-200">
                <div>
                  <div className="font-bold text-xs text-gray-900">
                    Pipeline 2: Fuel Grade Revenue Breakdown
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Aggregates comparative product consumption (Diesel, Petrol, Premium XP95, Extra Premium).
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(MONGODB_AGGREGATIONS.fuelGradeBreakdown, 'pipe2')}
                  className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 font-medium cursor-pointer"
                >
                  {copiedKey === 'pipe2' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Pipeline</span>
                </button>
              </div>
              <pre className="p-4 bg-gray-950 text-gray-300 font-mono text-xs overflow-x-auto">
                {MONGODB_AGGREGATIONS.fuelGradeBreakdown}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Change Streams */}
      {activeTab === 'changestreams' && (
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Real-Time Push Architecture: MongoDB Change Streams
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              How hardware pulses from Dover Wayne Helix & Tokheim dispensers trigger live dashboard updates via MongoDB Change Streams and WebSockets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <span className="font-bold text-gray-900 block mb-1">Step 1: IoT Gateway Ingestion</span>
              <p className="text-gray-500 text-[11px] leading-relaxed">
                The station FIP gateway receives pulse counts and writes an insert document directly to <code className="text-gray-900">db.transactions</code> in MongoDB.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <span className="font-bold text-gray-900 block mb-1">Step 2: Change Stream Trigger</span>
              <p className="text-gray-500 text-[11px] leading-relaxed">
                MongoDB's replica set oplog emits a real-time event through <code className="text-gray-900">transactions.watch()</code> matching the station ID.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <span className="font-bold text-gray-900 block mb-1">Step 3: Instant UI State Update</span>
              <p className="text-gray-500 text-[11px] leading-relaxed">
                The Next.js / Express backend broadcasts the event to the React client via Server-Sent Events (SSE), updating the active nozzle totalizer and tank level without re-polling!
              </p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl overflow-hidden mt-4">
            <div className="bg-gray-50 px-4 py-2.5 flex items-center justify-between border-b border-gray-200">
              <span className="font-mono text-xs font-bold text-gray-800">
                server/services/mongo-change-stream.ts
              </span>
              <button
                onClick={() => handleCopy(MONGODB_CHANGE_STREAM_CODE, 'stream')}
                className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                {copiedKey === 'stream' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Backend Code</span>
              </button>
            </div>
            <pre className="p-4 bg-gray-950 text-gray-300 font-mono text-xs overflow-x-auto">
              {MONGODB_CHANGE_STREAM_CODE}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 4: Next.js / Express Integration */}
      {activeTab === 'architecture' && (
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Next.js & Express API Routes Integration
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Code pattern showing how Next.js API Routes (`app/api/stations/[id]/route.ts`) fetch from MongoDB and supply the dashboard.
            </p>
          </div>

          <div className="p-4 bg-gray-950 text-gray-300 font-mono text-xs rounded-xl overflow-x-auto">
            <pre>{`// app/api/stations/[id]/route.ts (Next.js App Router)
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const client = await clientPromise;
  const db = client.db('dover_fueliq');

  const stationId = params.id;

  // 1. Fetch Station Metadata
  const station = await db.collection('stations').findOne({ stationId });
  if (!station) {
    return NextResponse.json({ error: 'Station not found' }, { status: 404 });
  }

  // 2. Fetch Active Tanks & Dispensers
  const tanks = await db.collection('tanks').find({ stationId }).toArray();
  const dispensers = await db.collection('dispensers').find({ stationId }).toArray();

  // 3. Attach Nozzles to each Dispenser
  for (const disp of dispensers) {
    disp.nozzles = await db.collection('nozzles')
      .find({ stationId, dispenserId: disp.dispenserId })
      .toArray();
      
    // Fetch last 5 transactions for each nozzle
    for (const noz of disp.nozzles) {
      noz.recentTransactions = await db.collection('transactions')
        .find({ stationId, dispenserId: disp.dispenserId, nozzleNumber: noz.nozzleNumber })
        .sort({ timestamp: -1 })
        .limit(5)
        .toArray();
    }
  }

  // 4. Return unified JSON to React Dashboard
  return NextResponse.json({
    ...station,
    tanks,
    dispensers
  });
}`}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
