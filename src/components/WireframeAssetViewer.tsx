import React, { useState } from 'react';
import { 
  Layers, 
  ExternalLink, 
  CheckCircle2, 
  Maximize2, 
  Sparkles, 
  Network
} from 'lucide-react';

import wireframeImg from '../assets/images/dover_dashboard_wireframe_1791302517593.jpg';
import architectureImg from '../assets/images/fuel_station_arch_concept_1791302534139.jpg';

interface WireframeAssetViewerProps {
  onProceedToDashboard: () => void;
}

export const WireframeAssetViewer: React.FC<WireframeAssetViewerProps> = ({
  onProceedToDashboard,
}) => {
  const [selectedAsset, setSelectedAsset] = useState<'wireframe' | 'architecture'>('wireframe');
  const [fullScreenModal, setFullScreenModal] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Wireframe Specs & Architecture Blueprints
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Design assets, 3D station piping manifolds, and telemetry UI layout schematics
          </p>
        </div>

        <button
          onClick={onProceedToDashboard}
          className="flex items-center gap-1.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer w-fit"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Switch to Live Telemetry</span>
        </button>
      </div>

      {/* Switcher Tabs in Light Pill Format */}
      <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setSelectedAsset('wireframe')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            selectedAsset === 'wireframe'
              ? 'bg-white text-gray-900 shadow-xs'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Asset 1: Dashboard UI UX Wireframe</span>
        </button>

        <button
          onClick={() => setSelectedAsset('architecture')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            selectedAsset === 'architecture'
              ? 'bg-white text-gray-900 shadow-xs'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Network className="w-3.5 h-3.5" />
          <span>Asset 2: Piping Manifold Blueprint</span>
        </button>
      </div>

      {/* Main Showcase Card in Clean White Aesthetic */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs space-y-6">
        {selectedAsset === 'wireframe' ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Dover FuelIQ™ Enterprise Dashboard Layout Wireframe
                </h3>
                <p className="text-xs text-gray-500">
                  Wireframe mockup showing tank level cylinders, PNDF multi-product dispensers, and Indian fuel color coding
                </p>
              </div>

              <button
                onClick={() => setFullScreenModal(wireframeImg)}
                className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 font-medium cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Fullscreen</span>
              </button>
            </div>

            {/* Image Preview Container */}
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-xs">
              <img
                src={wireframeImg}
                alt="Dover FuelIQ Dashboard Wireframe Mockup"
                className="w-full h-auto max-h-[560px] object-contain mx-auto"
              />
            </div>

            {/* Spec callouts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
              <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200">
                <div className="font-bold text-gray-900 text-xs mb-1">
                  Indian Fuel Color Code Mapping
                </div>
                <p className="text-gray-500 text-[11px] leading-relaxed">
                  Authentic color specifications: <strong>Diesel (Golden Amber)</strong>, <strong>Petrol (Warm Orange)</strong>, <strong>Premium XP95 (Ruby Red)</strong>, and <strong>XP100 (Neon Emerald)</strong>.
                </p>
              </div>

              <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200">
                <div className="font-bold text-gray-900 text-xs mb-1">
                  PNDF Protocol Standard
                </div>
                <p className="text-gray-500 text-[11px] leading-relaxed">
                  Wayne & Tokheim FIP loop mapping (e.g. <strong>"1111"</strong>, <strong>"2422"</strong>) displayed on dispensers and nozzles for zero confusion during servicing.
                </p>
              </div>

              <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200">
                <div className="font-bold text-gray-900 text-xs mb-1">
                  Totalizers & Calibrated Densities
                </div>
                <p className="text-gray-500 text-[11px] leading-relaxed">
                  Lifetime volume and rupees totalizers combined with hydrometer calibrated density @ 15°C to meet IS 1448 petroleum standards.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Dover Smart Station Manifold & Pipeline Topology Schematic
                </h3>
                <p className="text-xs text-gray-500">
                  Technical 3D isometric piping schematic showing underground storage tanks connected to dispensers and nozzles
                </p>
              </div>

              <button
                onClick={() => setFullScreenModal(architectureImg)}
                className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 font-medium cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Fullscreen</span>
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-xs">
              <img
                src={architectureImg}
                alt="Dover Fueling Solutions Station Architecture Blueprint"
                className="w-full h-auto max-h-[560px] object-contain mx-auto"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
              <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200">
                <div className="font-bold text-gray-900 text-xs mb-1">
                  OPW Suction Manifold Routing
                </div>
                <p className="text-gray-500 text-[11px] leading-relaxed">
                  Demonstrates underground tanks feeding common suction lines equipped with shear valves and check valves.
                </p>
              </div>

              <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200">
                <div className="font-bold text-gray-900 text-xs mb-1">
                  Dispenser Bay Distribution
                </div>
                <p className="text-gray-500 text-[11px] leading-relaxed">
                  Routing fuel products across Bay 1 to Bay 4 multi-product dispensers with electronic pulser totalizers.
                </p>
              </div>

              <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200">
                <div className="font-bold text-gray-900 text-xs mb-1">
                  FIP Automation Loop Gateway
                </div>
                <p className="text-gray-500 text-[11px] leading-relaxed">
                  Direct telemetry communication from the Wayne FIP controller to central Cloud IoT and local station POS.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal View */}
      {fullScreenModal && (
        <div 
          onClick={() => setFullScreenModal(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs p-4 flex items-center justify-center cursor-pointer"
        >
          <div className="relative max-w-7xl max-h-screen">
            <img
              src={fullScreenModal}
              alt="Fullscreen Blueprint"
              className="max-h-[92vh] max-w-full rounded-xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
