import React, { useState } from 'react';
import { 
  Network, 
  Cylinder, 
  Fuel, 
  GitFork, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  Filter, 
  Info, 
  Zap, 
  MoreHorizontal
} from 'lucide-react';
import { StationData, TankData, DispenserData, NozzleData, FuelType } from '../types/fuel-station';
import { FUEL_PRODUCTS } from '../data/mock-station-data';

interface StationArchitectureViewProps {
  stationData: StationData;
  onSelectDispenser?: (dispenserId: string) => void;
  onOpenWireframes?: () => void;
}

export const StationArchitectureView: React.FC<StationArchitectureViewProps> = ({
  stationData,
  onSelectDispenser,
  onOpenWireframes,
}) => {
  const [selectedProductFilter, setSelectedProductFilter] = useState<string>('ALL');
  const [selectedNode, setSelectedNode] = useState<{
    type: 'TANK' | 'DISPENSER' | 'NOZZLE';
    data: any;
  } | null>(null);

  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const tankCount = stationData.tanks.length;
  const dispenserCount = stationData.dispensers.length;
  const totalNozzlesCount = stationData.dispensers.reduce(
    (acc, d) => acc + d.nozzles.length,
    0
  );

  const displayedTanks = stationData.tanks.filter(
    (t) => selectedProductFilter === 'ALL' || t.fuelType === selectedProductFilter
  );

  const displayedDispensers = stationData.dispensers.filter((d) => {
    if (selectedProductFilter === 'ALL') return true;
    return d.nozzles.some((n) => n.productType === selectedProductFilter);
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Station Topology & Piping Manifold Architecture
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Hierarchical overview: {tankCount} Underground Tanks → {dispenserCount} Dispensers → {totalNozzlesCount} Nozzles
          </p>
        </div>

        {/* View Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Suction Line Filter */}
          <div className="flex items-center bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
            <select
              value={selectedProductFilter}
              onChange={(e) => setSelectedProductFilter(e.target.value)}
              className="bg-transparent text-gray-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Suction Lines</option>
              <option value="DIESEL">Diesel Lines</option>
              <option value="PETROL">Petrol Lines</option>
              <option value="PREMIUM_PETROL">XP95 Lines</option>
              <option value="EXTRA_PREMIUM">XP100 Lines</option>
            </select>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 gap-1 shadow-2xs">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.7, +(z - 0.1).toFixed(1)))}
              className="p-1 text-gray-500 hover:text-gray-900 rounded cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono text-gray-600 px-1">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.3, +(z + 0.1).toFixed(1)))}
              className="p-1 text-gray-500 hover:text-gray-900 rounded cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 text-gray-500 hover:text-gray-900 rounded cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {onOpenWireframes && (
            <button
              onClick={onOpenWireframes}
              className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-gray-500" />
              <span>Blueprint Renders</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Clean Light Canvas */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs relative min-h-[560px]">
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #E5E7EB 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Legend bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between pb-4 border-b border-gray-100 mb-6 text-xs text-gray-500">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span className="font-semibold text-gray-800">Layer 1: Tanks (UST)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-900"></span>
              <span className="font-semibold text-gray-800">Layer 2: Dispensers (MPD)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="font-semibold text-gray-800">Layer 3: Nozzles</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-600 font-semibold font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Suction Line Flow: Active</span>
          </div>
        </div>

        {/* Scaled Flow Graph Layout */}
        <div
          className="transition-transform duration-200 origin-top-left relative z-10"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Column 1: Tanks */}
            <div className="space-y-4">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                <Cylinder className="w-4 h-4 text-blue-600" />
                <span>Underground Storage Tanks ({displayedTanks.length})</span>
              </div>

              {displayedTanks.map((tank) => {
                const prod = FUEL_PRODUCTS[tank.fuelType];
                const isSelected = selectedNode?.data?.id === tank.id;
                return (
                  <div
                    key={tank.id}
                    onClick={() => setSelectedNode({ type: 'TANK', data: tank })}
                    className={`p-4 rounded-xl border transition-all cursor-pointer bg-white relative ${
                      isSelected
                        ? 'border-gray-900 shadow-md ring-1 ring-gray-900'
                        : 'border-gray-200 hover:border-gray-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: prod.liquidColor }}
                        />
                        <span className="font-bold text-gray-900 text-sm">
                          Tank {tank.id}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        {prod.code}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 mt-1">{prod.name}</div>

                    <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                      <div>
                        <span className="text-[10px] text-gray-400 block">Stock</span>
                        <span className="font-mono font-bold text-gray-900">
                          {tank.currentFuelLiters.toLocaleString()} L
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 block">Water</span>
                        <span className="font-mono font-bold text-cyan-600">
                          {tank.waterLevelMm} mm
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Column 2: Dispensers */}
            <div className="space-y-4">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                <Fuel className="w-4 h-4 text-gray-900" />
                <span>Dispensers (MPD) ({displayedDispensers.length})</span>
              </div>

              {displayedDispensers.map((disp) => {
                const isSelected = selectedNode?.data?.id === disp.id;
                return (
                  <div
                    key={disp.id}
                    onClick={() => setSelectedNode({ type: 'DISPENSER', data: disp })}
                    className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${
                      isSelected
                        ? 'border-gray-900 shadow-md ring-1 ring-gray-900'
                        : 'border-gray-200 hover:border-gray-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="bg-gray-100 text-gray-800 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                          BAY {disp.bayNumber}
                        </span>
                        <span className="font-bold text-gray-900 text-sm font-mono">
                          {disp.id}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                        PNDF: {disp.pndfConfig}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 mt-1 truncate">{disp.model}</div>

                    <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-mono">
                      <span>{disp.nozzles.length} Hoses Mounted</span>
                      <span className="text-gray-900 font-semibold">{disp.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Column 3: Nozzles */}
            <div className="space-y-4">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                <GitFork className="w-4 h-4 text-amber-500" />
                <span>Connected Nozzles ({totalNozzlesCount})</span>
              </div>

              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {displayedDispensers.flatMap((disp) =>
                  disp.nozzles.map((noz) => {
                    const prod = FUEL_PRODUCTS[noz.productType];
                    const isSelected = selectedNode?.data?.id === noz.id;
                    return (
                      <div
                        key={noz.id}
                        onClick={() =>
                          setSelectedNode({
                            type: 'NOZZLE',
                            data: { ...noz, dispenserId: disp.id, pndfConfig: disp.pndfConfig },
                          })
                        }
                        className={`p-3 rounded-xl border transition-all cursor-pointer bg-white ${
                          isSelected
                            ? 'border-gray-900 shadow-md ring-1 ring-gray-900'
                            : 'border-gray-200 hover:border-gray-300 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: prod.liquidColor }}
                            />
                            <div>
                              <span className="font-bold text-xs text-gray-900">
                                {disp.id} • N{noz.nozzleNumber} ({prod.code})
                              </span>
                              <div className="text-[10px] text-gray-400 font-mono">
                                Tank: {noz.connectedTankId}
                              </div>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-xs text-gray-900">
                            ₹{noz.unitPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Selected Node Inspector Card */}
        {selectedNode && (
          <div className="mt-8 pt-4 border-t border-gray-200 bg-gray-50/90 p-4 rounded-xl border border-gray-200 text-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-gray-900 uppercase">
                Selected Topology Node: {selectedNode.type}
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer font-medium"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
              <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                <span className="text-gray-400 text-[10px] block">Identifier</span>
                <span className="font-bold text-gray-900">{selectedNode.data.id}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                <span className="text-gray-400 text-[10px] block">Config / Grade</span>
                <span className="font-bold text-gray-900">{selectedNode.data.pndfConfig || selectedNode.data.fuelType}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                <span className="text-gray-400 text-[10px] block">Volume / Stock</span>
                <span className="font-bold text-gray-900">
                  {selectedNode.data.currentFuelLiters?.toLocaleString() || selectedNode.data.volumeTotalizer?.toLocaleString()} L
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                <span className="text-gray-400 text-[10px] block">Rate / Status</span>
                <span className="font-bold text-emerald-600">
                  {selectedNode.data.unitPrice ? `₹${selectedNode.data.unitPrice}/L` : 'ONLINE'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
