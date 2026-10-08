import React, { useState } from 'react';
import { 
  Cylinder, 
  Droplet, 
  AlertTriangle, 
  CheckCircle2, 
  Thermometer, 
  FileSpreadsheet, 
  RefreshCw, 
  Info,
  Calendar,
  ShieldCheck,
  Search,
  MoreHorizontal
} from 'lucide-react';
import { TankData, FuelType } from '../types/fuel-station';
import { FUEL_PRODUCTS } from '../data/mock-station-data';

interface TanksViewProps {
  tanks: TankData[];
  onSelectDispenser?: (dispenserId: string) => void;
}

export const TanksView: React.FC<TanksViewProps> = ({ tanks, onSelectDispenser }) => {
  const [selectedTankId, setSelectedTankId] = useState<string>(tanks[0]?.id || 'TK-01');

  const currentTank = tanks.find((t) => t.id === selectedTankId) || tanks[0];
  const productInfo = FUEL_PRODUCTS[currentTank.fuelType];

  const tankDeliveryHistory = [
    {
      id: 'DEL-2026-9011',
      date: '04-10-2026',
      time: '14:20:15',
      type: 'TT Decantation (Delivery)',
      quantityLiters: 12000,
      initialFuelLiters: 10450,
      postFuelLiters: 22450,
      density15C: 832.4,
      waterAfterMm: 6.2,
      truckChallan: 'IOCL-TT-DL-01-AB-4921',
      driver: 'Ramphal Yadav',
      status: 'Success',
    },
    {
      id: 'DIP-2026-8994',
      date: '03-10-2026',
      time: '06:00:00',
      type: 'Morning Dip & Water Check',
      quantityLiters: 13210,
      initialFuelLiters: 13210,
      postFuelLiters: 13210,
      density15C: 832.5,
      waterAfterMm: 6.0,
      truckChallan: 'Station ATG Dip',
      driver: 'Rajesh Kumar (SE)',
      status: 'Success',
    },
    {
      id: 'DEL-2026-8840',
      date: '28-09-2026',
      time: '11:15:42',
      type: 'TT Decantation (Delivery)',
      quantityLiters: 10000,
      initialFuelLiters: 7120,
      postFuelLiters: 17120,
      density15C: 832.6,
      waterAfterMm: 6.0,
      truckChallan: 'IOCL-TT-HR-26-Z-1099',
      driver: 'Satish Tanwar',
      status: 'Success',
    },
    {
      id: 'DIP-2026-8722',
      date: '25-09-2026',
      time: '18:00:00',
      type: 'Water Paste Dip Check',
      quantityLiters: 19400,
      initialFuelLiters: 19400,
      postFuelLiters: 19400,
      density15C: 832.4,
      waterAfterMm: 5.5,
      truckChallan: 'Kolor Kut Paste Check',
      driver: 'Sunil Verma',
      status: 'Success',
    },
    {
      id: 'DEL-2026-8610',
      date: '20-09-2026',
      time: '16:40:10',
      type: 'TT Decantation (Delivery)',
      quantityLiters: 14000,
      initialFuelLiters: 8900,
      postFuelLiters: 22900,
      density15C: 832.4,
      waterAfterMm: 5.5,
      truckChallan: 'IOCL-TT-UP-16-G-5512',
      driver: 'Dharamveer S.',
      status: 'Success',
    },
  ];

  const fillPercentage = Math.round((currentTank.currentFuelLiters / currentTank.capacityLiters) * 100);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Underground Storage Tanks (UST)
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Automatic Tank Gauge (ATG) probes, water bottom detection, density & ullage
          </p>
        </div>

        {/* Tank selector pills */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
          {tanks.map((tank) => {
            const p = FUEL_PRODUCTS[tank.fuelType];
            const isSelected = tank.id === selectedTankId;
            return (
              <button
                key={tank.id}
                onClick={() => setSelectedTankId(tank.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: p.liquidColor }}
                />
                <span>Tank #{tank.tankNumber}</span>
                <span className="font-mono text-[10px] text-gray-400">{p.code}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tank Detail Card */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs isolate">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Cylindrical Tank Physical UI */}
          <div className="lg:col-span-5 bg-gray-50/80 rounded-2xl p-5 border border-gray-200 flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-xs text-gray-500 mb-3">
              <span className="font-bold text-gray-900 flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: productInfo.liquidColor }}
                />
                Tank {currentTank.id} • {productInfo.name}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                ATG Probe Online
              </span>
            </div>

            {/* Horizontal Cylindrical Tank Graphic */}
            <div className="relative w-full max-w-sm h-56 my-2 flex items-center justify-center">
              <div className="relative w-full h-44 rounded-[36px] border-3 border-gray-300 bg-white shadow-inner overflow-hidden flex flex-col justify-end isolate">
                
                {/* Horizontal Level Guides */}
                <div className="absolute inset-0 flex flex-col justify-between p-3.5 pointer-events-none z-[1] text-[9px] font-mono text-gray-400 opacity-60">
                  <div className="border-b border-dashed border-gray-200 flex justify-between">
                    <span>100% OVERFILL ALARM</span>
                    <span>2850 mm</span>
                  </div>
                  <div className="border-b border-dashed border-gray-200 flex justify-between">
                    <span>95% SAFE FILL CUTOFF</span>
                    <span>2700 mm</span>
                  </div>
                  <div className="border-b border-dashed border-gray-200 flex justify-between">
                    <span>50% REFERENCE LEVEL</span>
                    <span>1425 mm</span>
                  </div>
                  <div className="border-b border-dashed border-red-300 flex justify-between text-red-500">
                    <span>WATER BOTTOM ALARM THRESHOLD</span>
                    <span>25 mm</span>
                  </div>
                </div>

                {/* Vertical Probe Stem */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-gray-300 z-[2]">
                  {/* Water float */}
                  <div 
                    className="absolute w-3.5 h-3.5 rounded-full bg-cyan-500 border border-white -translate-x-1/2 left-1/2 shadow-xs"
                    style={{ bottom: `${Math.max(5, (currentTank.waterLevelMm / currentTank.tankHeightMm) * 100)}%` }}
                    title={`Water Interface: ${currentTank.waterLevelMm}mm`}
                  />
                  {/* Fuel float */}
                  <div 
                    className="absolute w-3.5 h-3.5 rounded-full bg-amber-400 border border-white -translate-x-1/2 left-1/2 shadow-xs"
                    style={{ bottom: `${(currentTank.fuelHeightMm / currentTank.tankHeightMm) * 100}%` }}
                    title={`Fuel Level: ${currentTank.fuelHeightMm}mm`}
                  />
                </div>

                {/* Liquid Volume Layer */}
                <div 
                  className="w-full transition-all duration-700 relative shadow-inner"
                  style={{
                    backgroundColor: productInfo.liquidColor,
                    height: `${fillPercentage}%`,
                    opacity: 0.85,
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/40" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/95 px-3 py-1 rounded-lg border border-gray-200 shadow-xs text-center">
                      <div className="text-gray-900 font-mono font-extrabold text-sm">
                        {currentTank.currentFuelLiters.toLocaleString()} Liters
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono">
                        {fillPercentage}% Capacity
                      </div>
                    </div>
                  </div>
                </div>

                {/* Water bottom layer at base of tank */}
                <div 
                  className="w-full bg-cyan-600 transition-all relative z-1"
                  style={{
                    height: `${Math.max(6, (currentTank.waterLevelMm / currentTank.tankHeightMm) * 100 * 2)}px`,
                  }}
                >
                  <div className="text-[8px] text-cyan-50 font-mono text-center flex items-center justify-center h-full">
                    Water Bottom: {currentTank.waterLevelMm} mm
                  </div>
                </div>
              </div>

              {/* Riser pipes */}
              <div className="absolute -top-1 left-1/4 w-2.5 h-4 bg-gray-400 rounded-t"></div>
              <div className="absolute -top-1 right-1/4 w-3.5 h-4 bg-gray-400 rounded-t"></div>
            </div>

            <div className="mt-2 flex items-center justify-between w-full text-[11px] text-gray-500 border-t border-gray-200 pt-2 font-mono">
              <span>Dimensions: Ø 2.85m × L 5.2m</span>
              <span className="text-emerald-600 font-semibold">Sump: DRY</span>
            </div>
          </div>

          {/* Right Column: Tank Telemetry Metrics Grid */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  TANK TELEMETRY METRICS
                </span>
                <h3 className="text-2xl font-bold text-gray-900">
                  {productInfo.name}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-gray-400 font-medium">Current Fuel Rate</div>
                <div className="text-xl font-bold text-gray-900 font-mono">
                  ₹ {productInfo.defaultRate.toFixed(2)} / L
                </div>
              </div>
            </div>

            {/* 6 Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Metric 1: Fuel Quantity */}
              <div className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-200">
                <span className="text-[11px] text-gray-500 block">Fuel Quantity</span>
                <span className="text-lg font-bold text-gray-900 font-mono">
                  {currentTank.currentFuelLiters.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500 ml-1">L</span>
                <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                  Height: {currentTank.fuelHeightMm} mm
                </div>
              </div>

              {/* Metric 2: Water Quantity */}
              <div className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-200">
                <span className="text-[11px] text-gray-500 block">Water Quantity</span>
                <span className="text-lg font-bold text-cyan-600 font-mono">
                  {currentTank.waterLevelLiters}
                </span>
                <span className="text-xs text-gray-500 ml-1">L</span>
                <div className="text-[10px] text-cyan-700 font-mono mt-0.5">
                  Water Height: {currentTank.waterLevelMm} mm
                </div>
              </div>

              {/* Metric 3: Tank Capacity */}
              <div className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-200">
                <span className="text-[11px] text-gray-500 block">Tank Capacity</span>
                <span className="text-lg font-bold text-gray-900 font-mono">
                  {currentTank.capacityLiters.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500 ml-1">L</span>
                <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                  Total Volume
                </div>
              </div>

              {/* Metric 4: Ullage */}
              <div className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-200">
                <span className="text-[11px] text-gray-500 block">Ullage Headroom</span>
                <span className="text-lg font-bold text-gray-900 font-mono">
                  {currentTank.ullageLiters.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500 ml-1">L</span>
                <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                  Max Drop: {(currentTank.ullageLiters - 1500).toLocaleString()} L
                </div>
              </div>

              {/* Metric 5: Density */}
              <div className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-200">
                <span className="text-[11px] text-gray-500 block">Calibrated Density</span>
                <span className="text-lg font-bold text-gray-900 font-mono">
                  {currentTank.density}
                </span>
                <span className="text-xs text-gray-500 ml-1">kg/m³</span>
                <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                  IS 1448 Calibrated
                </div>
              </div>

              {/* Metric 6: Temperature */}
              <div className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-200">
                <span className="text-[11px] text-gray-500 block">Fuel Temp</span>
                <span className="text-lg font-bold text-gray-900 font-mono">
                  {currentTank.temperatureCelsius}
                </span>
                <span className="text-xs text-gray-500 ml-1">°C</span>
                <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                  Thermal Status OK
                </div>
              </div>
            </div>

            {/* Connected Dispensers */}
            <div className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-200">
              <span className="text-[11px] text-gray-400 font-bold uppercase block mb-1.5">
                Connected Suction Line Dispensers
              </span>
              <div className="flex flex-wrap gap-2">
                {currentTank.connectedDispensers.map((dispId) => (
                  <span
                    key={dispId}
                    className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-800 px-2.5 py-1 rounded-lg text-xs font-mono font-medium shadow-2xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Dispenser #{dispId}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tank Reports Section: Last 5 to 10 deliveries/dips */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              TANK REPORTS & AUDIT LOG: {currentTank.id} ({productInfo.code})
            </h3>
            <Info className="w-3.5 h-3.5 text-gray-300" />
          </div>
          <span className="text-xs text-gray-400">Latest recorded decantations & dips</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/60 text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-100 font-semibold">
              <tr>
                <th className="py-3 px-4">EVENT ID :</th>
                <th className="py-3 px-4">DATE & TIME :</th>
                <th className="py-3 px-4">OPERATION :</th>
                <th className="py-3 px-4">QUANTITY (L) :</th>
                <th className="py-3 px-4">DENSITY @ 15°C :</th>
                <th className="py-3 px-4">WATER (MM) :</th>
                <th className="py-3 px-4">CHALLAN REF :</th>
                <th className="py-3 px-4">OPERATOR :</th>
                <th className="py-3 px-4">STATUS :</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 text-xs">
              {tankDeliveryHistory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-gray-900">{item.id}</td>
                  <td className="py-3.5 px-4 text-gray-600">
                    <div>{item.date}</div>
                    <div className="text-[10px] text-gray-400">{item.time}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-gray-800">{item.type}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                    {item.quantityLiters.toLocaleString()} L
                  </td>
                  <td className="py-3.5 px-4 font-mono text-gray-600">{item.density15C} kg/m³</td>
                  <td className="py-3.5 px-4 font-mono text-cyan-600 font-semibold">{item.waterAfterMm} mm</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-gray-500">{item.truckChallan}</td>
                  <td className="py-3.5 px-4 text-gray-600">{item.driver}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Success
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
