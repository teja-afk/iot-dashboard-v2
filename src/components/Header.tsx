import React from 'react';
import { 
  Fuel, 
  Wifi, 
  HardDrive, 
  Clock, 
  UserCheck, 
  PlusCircle, 
  Layers, 
  MapPin, 
  ShieldCheck,
  ChevronDown,
  Activity
} from 'lucide-react';
import { StationData } from '../types/fuel-station';

interface HeaderProps {
  stationData: StationData;
  activeStationId: string;
  onSelectStation: (id: string) => void;
  stationsList: Array<{ id: string; name: string; city: string; }>;
  onOpenOnboardModal: () => void;
  onOpenLoginModal: () => void;
  onViewWireframes: () => void;
  currentTimeString: string;
}

export const Header: React.FC<HeaderProps> = ({
  stationData,
  activeStationId,
  onSelectStation,
  stationsList,
  onOpenOnboardModal,
  onOpenLoginModal,
  onViewWireframes,
  currentTimeString,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white shadow-xl sticky top-0 z-30">
      {/* Top system banner */}
      <div className="bg-slate-950/80 px-4 py-1.5 border-b border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400 font-mono font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            DOVER FIP GATEWAY v4.8: ONLINE (LOOP 1-4 NOMINAL)
          </span>
          <span className="hidden md:inline-block text-slate-600">|</span>
          <span className="hidden md:flex items-center gap-1 text-slate-300">
            <HardDrive className="w-3.5 h-3.5 text-blue-400" />
            SmartATG Console: <strong className="text-white font-mono">OPW SiteSentinel #VR-9102</strong>
          </span>
          <span className="hidden lg:inline-block text-slate-600">|</span>
          <span className="hidden lg:flex items-center gap-1 text-slate-400">
            PESO License: <span className="font-mono text-slate-300">{stationData.licenseNumber}</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>IST: {currentTimeString}</span>
          </div>

          <button
            onClick={onViewWireframes}
            className="flex items-center gap-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded text-xs transition-colors cursor-pointer"
            title="View Dashboard Wireframes & Architecture Concept Renders"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Wireframes & Concept Assets</span>
          </button>
        </div>
      </div>

      {/* Main header row */}
      <div className="px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Dover Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30 shrink-0">
            <Fuel className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-base uppercase bg-gradient-to-r from-blue-400 via-indigo-300 to-white bg-clip-text text-transparent">
                DOVER FUELING SOLUTIONS
              </span>
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded font-mono">
                FuelIQ™ IoT
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <span>Enterprise Fuel Station Telemetry & Dispenser Automation System</span>
            </p>
          </div>
        </div>

        {/* Station Selector Dropdown */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative group">
            <label className="text-[10px] uppercase font-bold text-slate-400 block -mb-0.5 ml-1">
              Active Station Location
            </label>
            <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 hover:border-slate-600 transition-colors">
              <MapPin className="w-4 h-4 text-emerald-400 mr-2 shrink-0" />
              <select
                value={activeStationId}
                onChange={(e) => onSelectStation(e.target.value)}
                className="bg-transparent text-sm font-medium text-white focus:outline-none cursor-pointer pr-4"
              >
                {stationsList.map((st) => (
                  <option key={st.id} value={st.id} className="bg-slate-900 text-white">
                    [{st.id}] {st.name} ({st.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Onboard Dispenser button */}
          <button
            onClick={onOpenOnboardModal}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium text-xs px-3 py-2 rounded-lg shadow-sm shadow-blue-600/30 transition-all cursor-pointer border border-blue-400/40"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Onboard Dispenser</span>
          </button>

          {/* Current Logged In User badge (Service Engineer) */}
          <button
            onClick={onOpenLoginModal}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg px-2.5 py-1.5 text-left transition-colors cursor-pointer"
            title="Logged In as Service Engineer. Click to switch role."
          >
            <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="text-xs leading-tight">
              <div className="font-semibold text-slate-200 flex items-center gap-1">
                <span>{stationData.serviceEngineer.name.split(',')[0]}</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1 rounded">SE</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {stationData.serviceEngineer.id} • Certified
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>
        </div>
      </div>
    </header>
  );
};
