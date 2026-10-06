import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Cylinder, 
  Fuel, 
  GitFork, 
  Network, 
  FileText, 
  Layers, 
  PlusCircle, 
  ChevronDown, 
  ChevronRight, 
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import { NavTabId } from './Navigation';
import { StationData } from '../types/fuel-station';

interface SidebarProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
  stationData: StationData;
  activeStationId: string;
  onSelectStation: (id: string) => void;
  stationsList: Array<{ id: string; name: string; city: string; }>;
  onOpenLoginModal: () => void;
}

interface FloatingTooltipData {
  text: string;
  badge?: string;
  subtitle?: string;
  top: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  stationData,
  activeStationId,
  onSelectStation,
  stationsList,
  onOpenLoginModal,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [floatingTooltip, setFloatingTooltip] = useState<FloatingTooltipData | null>(null);

  const mainMenuItems = [
    {
      id: 'overview' as NavTabId,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'tanks' as NavTabId,
      label: 'Tanks & Levels',
      icon: Cylinder,
      badge: `${stationData.tanks.length}`,
    },
    {
      id: 'dispensers' as NavTabId,
      label: 'Dispensers (MPD)',
      icon: Fuel,
      badge: `${stationData.dispensers.length}`,
    },
    {
      id: 'nozzles' as NavTabId,
      label: 'Nozzles & PNDF',
      icon: GitFork,
      badge: `${stationData.dispensers.reduce((acc, d) => acc + d.nozzles.length, 0)}`,
    },
    {
      id: 'architecture' as NavTabId,
      label: 'Station Architecture',
      icon: Network,
      highlight: true,
    },
    {
      id: 'onboard' as NavTabId,
      label: 'Onboard Dispenser',
      icon: PlusCircle,
      isSpecial: true,
    },
    {
      id: 'reports' as NavTabId,
      label: 'Reports & Analytics',
      icon: FileText,
    },
    {
      id: 'wireframes' as NavTabId,
      label: 'Wireframes & Blueprint',
      icon: Layers,
    },
  ];

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLElement>,
    text: string,
    badge?: string,
    subtitle?: string
  ) => {
    if (!isCollapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setFloatingTooltip({
      text,
      badge,
      subtitle,
      top: rect.top + rect.height / 2,
    });
  };

  const handleMouseLeave = () => {
    setFloatingTooltip(null);
  };

  return (
    <>
      <aside 
        className={`${
          isCollapsed ? 'w-[72px]' : 'w-60'
        } bg-white border-r border-gray-200/90 flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-hidden select-none z-30 transition-all duration-300 ease-in-out`}
      >
        {/* Top Header & Navigation Links */}
        <div className="flex flex-col min-h-0">
          {/* Organization / Station Selector + Collapse Toggle */}
          <div className="p-3 border-b border-gray-100 flex items-center justify-between gap-1.5">
            {!isCollapsed ? (
              <>
                <div className="flex-1 flex items-center justify-between p-1.5 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200/60 shadow-2xs cursor-pointer group relative overflow-hidden">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center font-black text-xs tracking-wider shadow-xs shrink-0">
                      DFS
                    </div>
                    <div className="text-left truncate">
                      <div className="text-[9px] text-gray-400 font-bold tracking-wider uppercase truncate">
                        Dover FuelIQ
                      </div>
                      <div className="text-xs font-bold text-gray-900 leading-tight truncate">
                        {stationData.stationId}
                      </div>
                    </div>
                  </div>
                  <select
                    value={activeStationId}
                    onChange={(e) => onSelectStation(e.target.value)}
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                    title="Switch Station Node"
                  >
                    {stationsList.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.city})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700 transition-colors shrink-0" />
                </div>

                {/* Collapse Button */}
                <button
                  onClick={() => {
                    setFloatingTooltip(null);
                    setIsCollapsed(true);
                  }}
                  className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Collapse sidebar to icon-only"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </>
            ) : (
              /* Collapsed Header */
              <div className="w-full flex flex-col items-center gap-2">
                <button
                  onClick={() => {
                    setFloatingTooltip(null);
                    setIsCollapsed(false);
                  }}
                  onMouseEnter={(e) =>
                    handleMouseEnter(
                      e,
                      'Dover FuelIQ Enterprise',
                      stationData.stationId,
                      'DLF Cyber City Hub'
                    )
                  }
                  onMouseLeave={handleMouseLeave}
                  className="w-9 h-9 rounded-lg bg-gray-900 text-white flex items-center justify-center font-black text-xs tracking-wider shadow-xs hover:bg-black transition-all cursor-pointer"
                  title="Expand sidebar"
                >
                  <span>DFS</span>
                </button>

                <button
                  onClick={() => {
                    setFloatingTooltip(null);
                    setIsCollapsed(false);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                  title="Expand sidebar"
                >
                  <PanelLeftOpen className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Section: Main Menu */}
          <div className="px-2 py-3">
            {!isCollapsed && (
              <div className="px-2.5 text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1.5">
                Main Menu
              </div>
            )}
            <nav className="space-y-1">
              {mainMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    onMouseEnter={(e) => handleMouseEnter(e, item.label, item.badge)}
                    onMouseLeave={handleMouseLeave}
                    className={`w-full flex items-center ${
                      isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-2.5 py-2'
                    } rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gray-900 text-white shadow-xs font-semibold'
                        : item.isSpecial
                          ? 'text-blue-700 bg-blue-50/70 hover:bg-blue-100/80 font-semibold'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${
                        isActive 
                          ? 'text-white' 
                          : item.isSpecial 
                            ? 'text-blue-600' 
                            : 'text-gray-500'
                      }`} />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isActive
                            ? 'bg-gray-800 text-gray-200'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {!isCollapsed && item.highlight && !isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Compact Telemetry Status */}
          <div className="px-3 py-2 border-t border-gray-100 text-[11px] font-mono">
            {!isCollapsed ? (
              <div className="space-y-1.5 text-gray-500">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>FIP Gateway</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">
                    CH 1-4 OK
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span>OPW ATG Probe</span>
                  </span>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1 rounded">
                    4/4 Active
                  </span>
                </div>
              </div>
            ) : (
              <div 
                onMouseEnter={(e) =>
                  handleMouseEnter(
                    e,
                    'FIP Gateway: CH 1-4 OK',
                    'ONLINE',
                    'OPW ATG: 4/4 Probes Online'
                  )
                }
                onMouseLeave={handleMouseLeave}
                className="flex flex-col items-center gap-2 py-1 cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="FIP Loop Online"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-500" title="ATG Probe Active"></span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Profile Card */}
        <div className="p-2 border-t border-gray-200/80">
          <div
            onClick={onOpenLoginModal}
            onMouseEnter={(e) =>
              handleMouseEnter(
                e,
                stationData.serviceEngineer.name.split(',')[0],
                stationData.serviceEngineer.id,
                stationData.serviceEngineer.role
              )
            }
            onMouseLeave={handleMouseLeave}
            className={`flex items-center ${
              isCollapsed ? 'justify-center p-1.5' : 'justify-between p-2'
            } rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-200`}
            title="Click to switch role or view credentials"
          >
            <div className="flex items-center gap-2 truncate">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 text-white font-bold text-[11px] flex items-center justify-center shadow-2xs shrink-0">
                RK
              </div>
              {!isCollapsed && (
                <div className="text-left truncate">
                  <div className="text-xs font-bold text-gray-900 leading-tight truncate">
                    {stationData.serviceEngineer.name.split(',')[0]}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">
                    Service Engineer
                  </div>
                </div>
              )}
            </div>
            {!isCollapsed && <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
          </div>
        </div>
      </aside>

      {/* Floating Viewport Tooltip (Rendered outside sidebar via fixed coordinates: Zero Clipping Guarantee!) */}
      {isCollapsed && floatingTooltip && (
        <div
          style={{ top: `${floatingTooltip.top}px` }}
          className="fixed left-[80px] -translate-y-1/2 bg-gray-900 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-2xl z-[99999] pointer-events-none whitespace-nowrap border border-gray-800 transition-all duration-100 ease-out"
        >
          {/* Main Title & Badge */}
          <div className="flex items-center gap-2">
            <span>{floatingTooltip.text}</span>
            {floatingTooltip.badge && (
              <span className="text-[10px] bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded font-mono font-bold">
                {floatingTooltip.badge}
              </span>
            )}
          </div>

          {/* Subtitle if available */}
          {floatingTooltip.subtitle && (
            <div className="text-[10px] text-gray-400 font-normal mt-0.5 font-mono">
              {floatingTooltip.subtitle}
            </div>
          )}

          {/* Pointer Triangle pointing left toward the hovered icon */}
          <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-gray-900 rotate-45 border-l border-b border-gray-800" />
        </div>
      )}
    </>
  );
};
