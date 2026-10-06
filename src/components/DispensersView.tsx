import React, { useState, useEffect } from 'react';
import { 
  Fuel, 
  Activity, 
  Play, 
  Square, 
  CheckCircle2, 
  AlertTriangle, 
  FileSpreadsheet, 
  Layers, 
  Radio, 
  Wrench,
  Zap,
  ArrowRight,
  Info,
  MoreHorizontal
} from 'lucide-react';
import { DispenserData, NozzleTransaction } from '../types/fuel-station';
import { FUEL_PRODUCTS } from '../data/mock-station-data';

interface DispensersViewProps {
  dispensers: DispenserData[];
  onNavigateToNozzles: (dispenserId?: string) => void;
  onOpenOnboardModal: () => void;
}

export const DispensersView: React.FC<DispensersViewProps> = ({
  dispensers,
  onNavigateToNozzles,
  onOpenOnboardModal,
}) => {
  const [selectedDispenserId, setSelectedDispenserId] = useState<string>(
    dispensers[0]?.id || 'T2628482'
  );
  
  // Real-time pump simulation state
  const [isSimulatingPump, setIsSimulatingPump] = useState<boolean>(true);
  const [liveVolume, setLiveVolume] = useState<number>(42.50);
  const [liveAmount, setLiveAmount] = useState<number>(3808.85);

  const currentDispenser =
    dispensers.find((d) => d.id === selectedDispenserId) || dispensers[0];

  useEffect(() => {
    let interval: any;
    if (isSimulatingPump && currentDispenser?.status === 'DISPENSING') {
      interval = setInterval(() => {
        setLiveVolume((prev) => {
          const next = +(prev + 0.15).toFixed(2);
          setLiveAmount(+(next * 89.62).toFixed(2));
          return next;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isSimulatingPump, currentDispenser?.status]);

  // Aggregate latest 5-10 transactions across the selected dispenser's nozzles
  const allDispenserTransactions: NozzleTransaction[] = [];
  currentDispenser.nozzles.forEach((noz) => {
    allDispenserTransactions.push(...noz.recentTransactions);
  });
  allDispenserTransactions.sort(
    (a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime()
  );
  const latestDispenserTransactions = allDispenserTransactions.slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Multi-Product Dispensers (MPD)
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Wayne Helix & Tokheim Quantium bay controllers, PNDF configurations, and real-time totalizers
          </p>
        </div>

        <button
          onClick={onOpenOnboardModal}
          className="flex items-center gap-1.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer w-fit"
        >
          <span>+ Onboard Dispenser</span>
        </button>
      </div>

      {/* Grid of Dispensers (Bays) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dispensers.map((disp) => {
          const isSelected = disp.id === selectedDispenserId;
          const isDispensing = disp.status === 'DISPENSING';
          return (
            <div
              key={disp.id}
              onClick={() => setSelectedDispenserId(disp.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
                isSelected
                  ? 'border-gray-900 shadow-md ring-1 ring-gray-900'
                  : 'border-gray-200/80 hover:border-gray-300 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-gray-100 text-gray-800 font-bold font-mono text-[10px] px-2 py-0.5 rounded">
                    BAY {disp.bayNumber}
                  </span>
                  <span className="font-mono font-bold text-sm text-gray-900">
                    {disp.id}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                    isDispensing
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isDispensing ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                  {disp.status}
                </span>
              </div>

              <div className="text-xs text-gray-600 font-medium truncate mt-1">
                {disp.model}
              </div>

              {/* PNDF Badge */}
              <div className="mt-3 flex items-center justify-between text-xs bg-gray-50 p-2 rounded-lg border border-gray-100">
                <span className="text-gray-400 text-[10px] font-medium">PNDF Config:</span>
                <span className="font-mono font-extrabold text-gray-900 text-xs">
                  {disp.pndfConfig}
                </span>
              </div>

              {/* Fuel grades preview */}
              <div className="mt-3 pt-2.5 border-t border-gray-100">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {disp.nozzles.map((noz) => {
                    const prod = FUEL_PRODUCTS[noz.productType];
                    return (
                      <span
                        key={noz.id}
                        className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold flex items-center gap-1 bg-gray-50 border border-gray-200 text-gray-700"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: prod.liquidColor }}
                        />
                        N{noz.nozzleNumber} {prod.code}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Dispenser Detailed Terminal View */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Dispenser Hardware Graphic */}
          <div className="lg:col-span-5 bg-gray-50/80 p-5 rounded-2xl border border-gray-200 flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-xs text-gray-500 mb-4">
              <span className="font-bold text-gray-900 font-mono flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-blue-600" />
                WAYNE HELIX MPD #{currentDispenser.id}
              </span>
              <span className="text-[10px] font-mono bg-white border border-gray-200 text-gray-700 px-2 py-0.5 rounded">
                BAY {currentDispenser.bayNumber}
              </span>
            </div>

            {/* Industrial Pump Display Card */}
            <div className="w-full max-w-xs bg-gray-900 rounded-2xl border-4 border-gray-800 p-4 shadow-xl text-white">
              <div className="text-center pb-2 border-b border-gray-800 flex items-center justify-between">
                <span className="text-[10px] font-extrabold tracking-wider text-blue-400 uppercase">
                  DOVER WAYNE HELIX
                </span>
                <span className="text-[9px] font-mono text-gray-400">
                  IP: {currentDispenser.ipAddress}
                </span>
              </div>

              {/* 7-Segment Digital Readout Displays */}
              <div className="my-3 space-y-2 bg-black/95 p-3 rounded-xl border border-gray-800 font-mono">
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-gray-400 flex justify-between">
                    <span>SALE AMOUNT (₹)</span>
                    <span className="text-emerald-400 text-[8px]">INR</span>
                  </div>
                  <div className="text-2xl font-black text-amber-400 text-right tracking-widest font-mono">
                    {currentDispenser.status === 'DISPENSING'
                      ? liveAmount.toFixed(2).padStart(8, ' ')
                      : '    0.00'}
                  </div>
                </div>

                <div>
                  <div className="text-[9px] uppercase tracking-wider text-gray-400 flex justify-between">
                    <span>VOLUME (L)</span>
                    <span className="text-cyan-400 text-[8px]">LITRES</span>
                  </div>
                  <div className="text-2xl font-black text-cyan-300 text-right tracking-widest font-mono">
                    {currentDispenser.status === 'DISPENSING'
                      ? liveVolume.toFixed(2).padStart(8, ' ')
                      : '    0.00'}
                  </div>
                </div>

                <div>
                  <div className="text-[9px] uppercase tracking-wider text-gray-400 flex justify-between">
                    <span>RATE (₹ / LITRE)</span>
                    <span className="text-gray-400 text-[8px]">₹89.62</span>
                  </div>
                  <div className="text-base font-black text-emerald-400 text-right tracking-widest font-mono">
                    89.62
                  </div>
                </div>
              </div>

              {/* Nozzle holsters */}
              <div className="pt-2 border-t border-gray-800 flex items-center justify-around">
                {currentDispenser.nozzles.map((noz) => {
                  const p = FUEL_PRODUCTS[noz.productType];
                  const isNozzlePumping = noz.status === 'DISPENSING';
                  return (
                    <div key={noz.id} className="text-center">
                      <div
                        className={`w-9 h-11 rounded-lg border flex flex-col items-center justify-center transition-all ${
                          isNozzlePumping
                            ? 'ring-2 ring-emerald-400 bg-gray-800'
                            : 'bg-gray-800/80 border-gray-700'
                        }`}
                      >
                        <span className="text-[9px] font-bold text-white font-mono">
                          N{noz.nozzleNumber}
                        </span>
                        <div
                          className="w-2.5 h-3.5 rounded-xs mt-0.5"
                          style={{ backgroundColor: p.liquidColor }}
                        />
                      </div>
                      <span className="text-[8px] font-mono text-gray-400 block mt-1">
                        {p.code}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Simulation button */}
              <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between text-xs">
                <span className="text-[10px] text-gray-400 font-mono">
                  Status: <strong>{currentDispenser.status}</strong>
                </span>
                <button
                  onClick={() => setIsSimulatingPump(!isSimulatingPump)}
                  className="text-[10px] font-semibold px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-white cursor-pointer"
                >
                  {isSimulatingPump ? 'Pause Pumping' : 'Resume Pumping'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: PNDF Config Explanation & Details */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  DISPENSER AUTOMATION TERMINAL
                </span>
                <h3 className="text-2xl font-bold text-gray-900">
                  Dispenser #{currentDispenser.id}
                </h3>
              </div>
              <button
                onClick={() => onNavigateToNozzles(currentDispenser.id)}
                className="flex items-center gap-1.5 text-xs font-semibold bg-gray-900 hover:bg-black text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <span>View Assigned Nozzles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* PNDF Card */}
            <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-blue-600" />
                  Dispenser Configuration (PNDF)
                </span>
                <span className="font-mono text-sm font-extrabold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200 shadow-2xs">
                  {currentDispenser.pndfConfig}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                PNDF (Product Nozzle Display Fip) Protocol mapping for Dover Wayne & Tokheim electronic registers:
              </p>
              <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs font-mono">
                <div className="bg-white p-2 rounded-lg border border-gray-200">
                  <span className="text-gray-400 text-[10px] block">P (Product)</span>
                  <span className="font-bold text-gray-900">{currentDispenser.pndfConfig[0] || '1'}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-gray-200">
                  <span className="text-gray-400 text-[10px] block">N (Nozzle)</span>
                  <span className="font-bold text-gray-900">{currentDispenser.pndfConfig[1] || '1'}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-gray-200">
                  <span className="text-gray-400 text-[10px] block">D (Display)</span>
                  <span className="font-bold text-gray-900">{currentDispenser.pndfConfig[2] || '1'}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-gray-200">
                  <span className="text-gray-400 text-[10px] block">F (FIP Port)</span>
                  <span className="font-bold text-gray-900">{currentDispenser.pndfConfig[3] || '1'}</span>
                </div>
              </div>
            </div>

            {/* Spec details */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-200">
                <span className="text-gray-400 text-[10px] block">Serial Number</span>
                <span className="font-mono text-gray-900 font-semibold text-[11px] truncate block">
                  {currentDispenser.serialNumber}
                </span>
              </div>
              <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-200">
                <span className="text-gray-400 text-[10px] block">Loop Channel</span>
                <span className="font-mono text-gray-900 font-semibold text-[11px]">
                  Loop #{currentDispenser.fipLoopChannel}
                </span>
              </div>
              <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-200">
                <span className="text-gray-400 text-[10px] block">Last Maintenance</span>
                <span className="font-mono text-gray-900 text-[11px]">
                  {currentDispenser.lastMaintenanceDate}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dispenser Reports Section */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              DISPENSER TRANSACTIONS: #{currentDispenser.id} (Bay {currentDispenser.bayNumber})
            </h3>
            <Info className="w-3.5 h-3.5 text-gray-300" />
          </div>
          <span className="text-xs text-gray-400">
            Showing last {latestDispenserTransactions.length} transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/60 text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-100 font-semibold">
              <tr>
                <th className="py-3 px-4">RECEIPT :</th>
                <th className="py-3 px-4">NOZZLE # :</th>
                <th className="py-3 px-4">PRODUCT :</th>
                <th className="py-3 px-4">DATE & TIME :</th>
                <th className="py-3 px-4">QTY (L) :</th>
                <th className="py-3 px-4">UNIT PRICE :</th>
                <th className="py-3 px-4">TOTAL REVENUE :</th>
                <th className="py-3 px-4">PAYMENT :</th>
                <th className="py-3 px-4">VEHICLE :</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 text-xs">
              {latestDispenserTransactions.map((tx) => {
                const p = FUEL_PRODUCTS[tx.productType];
                return (
                  <tr key={tx.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">{tx.receiptNumber}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">N{tx.nozzleNumber}</td>
                    <td className="py-3.5 px-4">
                      <span className="flex items-center gap-1.5 font-medium text-gray-800">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: p.liquidColor }}
                        />
                        {p.code}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 font-mono">{tx.dateTime}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">{tx.volumeLiters.toFixed(2)} L</td>
                    <td className="py-3.5 px-4 font-mono text-gray-500">₹{tx.unitPrice.toFixed(2)}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                      ₹{tx.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">{tx.paymentMethod}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-gray-800">{tx.vehiclePlate || 'N/A'}</td>
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
