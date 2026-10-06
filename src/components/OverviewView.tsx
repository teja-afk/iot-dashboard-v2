import React, { useState } from 'react';
import { 
  Info, 
  MoreHorizontal, 
  Search, 
  Plus, 
  ArrowUpRight, 
  Calendar, 
  Sparkles, 
  Download, 
  Activity,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { StationData, NozzleTransaction } from '../types/fuel-station';
import { FUEL_PRODUCTS } from '../data/mock-station-data';

interface OverviewViewProps {
  stationData: StationData;
  onNavigateToTab: (tabId: any) => void;
  onOpenOnboardModal: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  stationData,
  onNavigateToTab,
  onOpenOnboardModal,
}) => {
  const [salesTrendRange, setSalesTrendRange] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Monthly');
  const [hoveredMonth, setHoveredMonth] = useState<string | null>('JUN');
  const [transactionSearch, setTransactionSearch] = useState<string>('');

  // Compute station totals
  const totalFuelLiters = stationData.tanks.reduce((sum, t) => sum + t.currentFuelLiters, 0);
  const totalCapacityLiters = stationData.tanks.reduce((sum, t) => sum + t.capacityLiters, 0);
  const tankFillPct = Math.round((totalFuelLiters / totalCapacityLiters) * 100);

  let totalVolumeDispensedL = 0;
  let totalAmountDispensedRs = 0;
  stationData.dispensers.forEach((disp) => {
    disp.nozzles.forEach((noz) => {
      totalVolumeDispensedL += noz.volumeTotalizer;
      totalAmountDispensedRs += noz.amountTotalizer;
    });
  });

  // Recent transactions list
  const allTransactions: NozzleTransaction[] = [];
  stationData.dispensers.forEach((disp) => {
    disp.nozzles.forEach((noz) => {
      allTransactions.push(...noz.recentTransactions);
    });
  });
  allTransactions.sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());
  const recentTransactions = allTransactions.slice(0, 5);

  // Months data for dot-matrix segmented bar chart (matching reference image)
  const monthlyData = [
    { month: 'JAN', blocks: 2, totalL: '12k', diesel: '8k', petrol: '4k' },
    { month: 'FEB', blocks: 4, totalL: '24k', diesel: '16k', petrol: '8k' },
    { month: 'MAR', blocks: 3, totalL: '18k', diesel: '12k', petrol: '6k' },
    { month: 'APR', blocks: 5, totalL: '32k', diesel: '20k', petrol: '12k' },
    { month: 'MAY', blocks: 3, totalL: '20k', diesel: '14k', petrol: '6k' },
    { month: 'JUN', blocks: 6, totalL: '38k', diesel: '24k', petrol: '14k' }, // Highlighted in reference
    { month: 'JUL', blocks: 2, totalL: '14k', diesel: '9k', petrol: '5k' },
    { month: 'AUG', blocks: 5, totalL: '31k', diesel: '20k', petrol: '11k' },
    { month: 'SEP', blocks: 3, totalL: '19k', diesel: '12k', petrol: '7k' },
    { month: 'OCT', blocks: 6, totalL: '42k', diesel: '26k', petrol: '16k' },
    { month: 'NOV', blocks: 3, totalL: '22k', diesel: '14k', petrol: '8k' },
    { month: 'DEC', blocks: 4, totalL: '28k', diesel: '18k', petrol: '10k' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome Heading (Welcome back, Salung style) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Welcome back, {stationData.serviceEngineer.name.split(',')[0]}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time telemetry and automation overview for {stationData.stationName}
          </p>
        </div>
      </div>

      {/* Row of 4 Stat Cards (Exact match to reference image cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              TOTAL REVENUE
            </span>
            <Info className="w-3.5 h-3.5 text-gray-300" />
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <div className="text-2xl font-bold text-gray-900 font-mono tracking-tight">
              ₹28,41,200
            </div>

            {/* Mini vertical sparkline bars (as in image) */}
            <div className="flex items-end gap-1 h-6">
              <span className="w-1 h-2 bg-gray-200 rounded-xs"></span>
              <span className="w-1 h-3.5 bg-gray-300 rounded-xs"></span>
              <span className="w-1 h-5 bg-gray-900 rounded-xs"></span>
              <span className="w-1 h-4 bg-gray-400 rounded-xs"></span>
              <span className="w-1 h-3 bg-gray-300 rounded-xs"></span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-gray-900 font-semibold">+0.94%</span>
            <span>last shift</span>
          </div>
        </div>

        {/* Card 2: Total Orders / Liters Dispensed */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              TOTAL DISPENSED
            </span>
            <Info className="w-3.5 h-3.5 text-gray-300" />
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <div className="text-2xl font-bold text-gray-900 font-mono tracking-tight">
              31,450 <span className="text-xs font-sans text-gray-500 font-normal">Liters</span>
            </div>

            {/* Mini vertical sparkline bars */}
            <div className="flex items-end gap-1 h-6">
              <span className="w-1 h-3 bg-gray-300 rounded-xs"></span>
              <span className="w-1 h-2 bg-gray-200 rounded-xs"></span>
              <span className="w-1 h-6 bg-gray-900 rounded-xs"></span>
              <span className="w-1 h-4 bg-gray-400 rounded-xs"></span>
              <span className="w-1 h-2 bg-gray-200 rounded-xs"></span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-gray-900 font-semibold">+1,240</span>
            <span>transactions</span>
          </div>
        </div>

        {/* Card 3: Live Fuel Stock */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              LIVE FUEL STOCK
            </span>
            <Info className="w-3.5 h-3.5 text-gray-300" />
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <div className="text-2xl font-bold text-gray-900 font-mono tracking-tight">
              {totalFuelLiters.toLocaleString()} <span className="text-xs font-sans text-gray-500 font-normal">L</span>
            </div>

            {/* Mini vertical sparkline bars */}
            <div className="flex items-end gap-1 h-6">
              <span className="w-1 h-4 bg-gray-300 rounded-xs"></span>
              <span className="w-1 h-5 bg-gray-900 rounded-xs"></span>
              <span className="w-1 h-3 bg-gray-300 rounded-xs"></span>
              <span className="w-1 h-4 bg-gray-400 rounded-xs"></span>
              <span className="w-1 h-2 bg-gray-200 rounded-xs"></span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span className="text-gray-900 font-semibold">{tankFillPct}%</span>
            <span>total capacity</span>
          </div>
        </div>

        {/* Card 4: Active Flow Rate / Health */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              FLOW RATE & ATG
            </span>
            <Info className="w-3.5 h-3.5 text-gray-300" />
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <div className="text-2xl font-bold text-gray-900 font-mono tracking-tight">
              38.4 <span className="text-xs font-sans text-gray-500 font-normal">L/min</span>
            </div>

            {/* Mini vertical sparkline bars */}
            <div className="flex items-end gap-1 h-6">
              <span className="w-1 h-2 bg-gray-200 rounded-xs"></span>
              <span className="w-1 h-4 bg-gray-300 rounded-xs"></span>
              <span className="w-1 h-3 bg-gray-400 rounded-xs"></span>
              <span className="w-1 h-5 bg-gray-900 rounded-xs"></span>
              <span className="w-1 h-2 bg-gray-200 rounded-xs"></span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-gray-900 font-semibold">100% OK</span>
            <span>4 ATG Probes</span>
          </div>
        </div>
      </div>

      {/* Middle Row (Left: Sales Trend Dot-Matrix Chart, Right: Revenue Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): SALES TREND (Dot-Matrix Stacked Block Chart) */}
        <div className="lg:col-span-8 bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs">
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                SALES & DISPENSING TREND
              </span>
              <Info className="w-3.5 h-3.5 text-gray-300" />
            </div>

            <div className="flex items-center gap-3">
              <MoreHorizontal className="w-4 h-4 text-gray-400 cursor-pointer" />
            </div>
          </div>

          {/* Subheader Row with Total Revenue, Legend & Granularity Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-6 border-b border-gray-100">
            <div className="flex items-baseline gap-4">
              <span className="text-xs text-gray-500 font-medium">Total Dispensed:</span>
              <span className="text-2xl font-extrabold text-gray-900 font-mono">
                ₹ 28,41,200
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Product Legend */}
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-gray-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Diesel
                </span>
                <span className="flex items-center gap-1.5 text-gray-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-gray-900"></span>
                  Petrol
                </span>
              </div>

              {/* Granularity Tabs (Weekly / Monthly / Yearly) */}
              <div className="bg-gray-100 p-0.5 rounded-lg flex text-xs">
                {(['Weekly', 'Monthly', 'Yearly'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setSalesTrendRange(r)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      salesTrendRange === r
                        ? 'bg-white text-gray-900 shadow-xs'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chart Canvas: Segmented Dot-Matrix Bar Chart (Exact replica of image) */}
          <div className="pt-6 relative">
            {/* Horizontal Axis Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] font-mono text-gray-300 pr-2">
              <div className="border-b border-dashed border-gray-100 pb-1">60k</div>
              <div className="border-b border-dashed border-gray-100 pb-1">50k</div>
              <div className="border-b border-dashed border-gray-100 pb-1">40k</div>
              <div className="border-b border-dashed border-gray-100 pb-1">30k</div>
              <div className="border-b border-dashed border-gray-100 pb-1">20k</div>
              <div className="border-b border-dashed border-gray-100 pb-1">10k</div>
              <div className="border-b border-gray-100 pb-1">0k</div>
            </div>

            {/* Dot-matrix vertical columns */}
            <div className="h-60 flex items-end justify-between gap-1.5 pl-8 pr-2 relative z-10">
              {monthlyData.map((item) => {
                const isHovered = hoveredMonth === item.month;
                return (
                  <div
                    key={item.month}
                    onMouseEnter={() => setHoveredMonth(item.month)}
                    className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer"
                  >
                    {/* Hover Guide & Tooltip Card (Jun 2025 tooltip style in reference image) */}
                    {isHovered && (
                      <div className="absolute -top-10 -translate-x-1/2 left-1/2 bg-white text-gray-900 p-2.5 rounded-xl border border-gray-200 shadow-lg z-30 whitespace-nowrap text-xs">
                        <div className="font-bold text-gray-900 mb-1">{item.month} 2026</div>
                        <div className="flex items-center gap-1.5 text-gray-600 font-mono text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                          <span>Diesel: <strong className="text-gray-900">{item.diesel} L</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600 font-mono text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-gray-900"></span>
                          <span>Petrol: <strong className="text-gray-900">{item.petrol} L</strong></span>
                        </div>
                      </div>
                    )}

                    {/* Dotted vertical guideline when hovered */}
                    {isHovered && (
                      <div className="absolute inset-y-0 w-px border-l border-dashed border-gray-300 pointer-events-none -z-10" />
                    )}

                    {/* Stacked square blocks */}
                    <div className="flex flex-col-reverse gap-1 items-center pb-2">
                      {Array.from({ length: item.blocks }).map((_, blockIdx) => (
                        <div
                          key={blockIdx}
                          className={`w-4 h-3.5 rounded-xs transition-colors ${
                            isHovered
                              ? blockIdx % 2 === 0 ? 'bg-amber-500' : 'bg-gray-900'
                              : 'bg-gray-900 hover:bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Month Label */}
                    <span className="text-[10px] font-semibold text-gray-400 mt-2">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): REVENUE BREAKDOWN */}
        <div className="lg:col-span-4 bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between text-gray-400 mb-4">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  REVENUE BREAKDOWN
                </span>
                <Info className="w-3.5 h-3.5 text-gray-300" />
              </div>
              <MoreHorizontal className="w-4 h-4 text-gray-400 cursor-pointer" />
            </div>

            {/* Subheader */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] text-gray-500 block">Revenue by Fuel Grade</span>
                <span className="text-2xl font-extrabold text-gray-900 font-mono">
                  ₹ 28,41,200
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-gray-600 bg-gray-50 border border-gray-200 px-2 py-1 rounded-lg">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span>Jan 1 - Oct 6</span>
              </div>
            </div>

            {/* Callout Card (Get AI insight banner in reference image) */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-6 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-gray-700 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>FIP Gateway: 4 Loop Channels Synced</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
            </div>

            {/* Vertical Multi-bar comparative chart (as in reference image) */}
            <div className="h-44 flex items-end justify-between gap-2 px-2 pt-4">
              {[
                { label: 'HSD', name: 'Diesel', h: '85%', color: 'bg-amber-500' },
                { label: 'MS', name: 'Petrol', h: '70%', color: 'bg-orange-500' },
                { label: 'XP95', name: 'Premium', h: '45%', color: 'bg-rose-500' },
                { label: 'XP100', name: 'Turbo', h: '30%', color: 'bg-emerald-600' },
              ].map((bar) => (
                <div key={bar.label} className="flex-1 flex flex-col items-center justify-end h-full group">
                  <div className="text-[10px] font-mono text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    {bar.h}
                  </div>
                  <div
                    className={`w-full max-w-[28px] rounded-t-md transition-all ${bar.color}`}
                    style={{ height: bar.h }}
                  />
                  <span className="text-[10px] font-bold text-gray-700 mt-2 font-mono">
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between text-xs text-gray-500">
            <span>Average Margin: <strong>₹ 3.42 / L</strong></span>
            <span className="text-emerald-600 font-semibold font-mono">Nominal</span>
          </div>
        </div>
      </div>

      {/* Bottom Table: RECENT TRANSACTIONS (Exact match to reference image table) */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-2xs overflow-hidden">
        {/* Table Header Bar */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              RECENT TRANSACTIONS
            </h3>
            <Info className="w-3.5 h-3.5 text-gray-300" />
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={transactionSearch}
                onChange={(e) => setTransactionSearch(e.target.value)}
                className="w-48 bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white"
              />
            </div>

            {/* Add / Action Button */}
            <button
              onClick={onOpenOnboardModal}
              className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-gray-500" />
              <span>+ Add Transaction</span>
            </button>

            <MoreHorizontal className="w-4 h-4 text-gray-400 cursor-pointer" />
          </div>
        </div>

        {/* The Clean White SaaS Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/60 text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-100 font-semibold">
              <tr>
                <th className="py-3 px-4 w-10">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="py-3 px-4">ID :</th>
                <th className="py-3 px-4">VEHICLE / CUSTOMER :</th>
                <th className="py-3 px-4">PRODUCT :</th>
                <th className="py-3 px-4">STATUS :</th>
                <th className="py-3 px-4">QTY (L) :</th>
                <th className="py-3 px-4">UNIT PRICE :</th>
                <th className="py-3 px-4">TOTAL REVENUE :</th>
                <th className="py-3 px-4 text-center">ACTIONS :</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-gray-700 text-xs">
              {recentTransactions.map((tx) => {
                const prod = FUEL_PRODUCTS[tx.productType];
                return (
                  <tr key={tx.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-500">
                      #{tx.id.replace('TX-', '')}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-gray-900">
                      <div>{tx.vehiclePlate || 'Walk-in Consumer'}</div>
                      <div className="text-[10px] text-gray-400 font-normal">{tx.attendantName}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="flex items-center gap-1.5 font-medium text-gray-800">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: prod.liquidColor }}
                        />
                        {prod.name}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Success
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-gray-900">
                      {tx.volumeLiters.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-500">
                      ₹{tx.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                      ₹{tx.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button className="text-gray-400 hover:text-gray-700 cursor-pointer">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
