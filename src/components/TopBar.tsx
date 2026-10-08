import React from 'react';
import { 
  Search, 
  Bell, 
  Calendar, 
  Download, 
  ChevronDown, 
  Clock
} from 'lucide-react';
import { NavTabId } from './Navigation';
import { StationData } from '../types/fuel-station';

interface TopBarProps {
  activeTab: NavTabId;
  stationData: StationData;
  currentTimeString: string;
  onExportCSV?: () => void;
  timePeriod: 'Daily' | 'Weekly' | 'Monthly';
  onChangePeriod: (period: 'Daily' | 'Weekly' | 'Monthly') => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  stationData,
  currentTimeString,
  onExportCSV,
  timePeriod,
  onChangePeriod,
}) => {
  const getTabLabel = (tab: NavTabId) => {
    switch (tab) {
      case 'overview': return 'Overview';
      case 'tanks': return 'Tanks & Inventory';
      case 'dispensers': return 'Dispensers (MPD)';
      case 'nozzles': return 'Nozzles & PNDF';
      case 'architecture': return 'Station Architecture';
      case 'onboard': return 'Onboard Dispenser';
      case 'reports': return 'Reports & Analytics';
      case 'mongo': return 'MongoDB Schemas & Collections';
      case 'wireframes': return 'Wireframes & Blueprint';
      default: return 'Overview';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200/90 sticky top-0 z-50 px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-2xs">
      {/* Left Breadcrumb */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-gray-400 font-medium">Dashboard</span>
        <span className="text-gray-300">›</span>
        <span className="text-gray-900 font-semibold">{getTabLabel(activeTab)}</span>
      </div>

      {/* Right Controls Row (matching reference image) */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Search Input with ⌘K badge */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search telemetry, PNDF, tanks..."
            className="w-48 lg:w-60 bg-gray-50/80 border border-gray-200 rounded-lg pl-8 pr-10 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-400 transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-mono text-gray-400 bg-white border border-gray-200 px-1 rounded">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>

        {/* Live IST Clock */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-gray-600 bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>{currentTimeString} IST</span>
        </div>

        {/* Notifications Icon with dot */}
        <button 
          className="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
          title="Telemetry Alarms & Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
        </button>

        {/* Period Selector (Daily ⌵ in reference image) */}
        <div className="relative">
          <select
            value={timePeriod}
            onChange={(e) => onChangePeriod(e.target.value as any)}
            className="bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-lg pl-3 pr-6 py-1.5 focus:outline-none cursor-pointer appearance-none shadow-2xs hover:border-gray-300"
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Date Button (6 Nov 2025 in reference image) */}
        <div className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-lg px-3 py-1.5 shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-gray-500" />
          <span>06 Oct 2026</span>
        </div>

        {/* Primary Action Button: Export CSV (Exactly matching reference image) */}
        <button
          onClick={onExportCSV}
          className="flex items-center gap-1.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
          title="Export CSV Telemetry Report"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>
    </header>
  );
};
