import React from 'react';
import { 
  LayoutDashboard, 
  Cylinder, 
  Fuel, 
  Network, 
  GitFork, 
  FileSpreadsheet, 
  Layers
} from 'lucide-react';

export type NavTabId = 'overview' | 'tanks' | 'dispensers' | 'nozzles' | 'architecture' | 'reports' | 'wireframes' | 'onboard';

interface NavigationProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
  tankCount: number;
  dispenserCount: number;
  nozzleCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  tankCount,
  dispenserCount,
  nozzleCount,
}) => {
  const tabs = [
    {
      id: 'overview' as NavTabId,
      label: '1. Overview',
      subtitle: 'Live Telemetry & KPIs',
      icon: LayoutDashboard,
    },
    {
      id: 'tanks' as NavTabId,
      label: '2. Tanks Telemetry',
      subtitle: 'Cylinder Level & Water',
      icon: Cylinder,
      badge: `${tankCount} Tanks`,
    },
    {
      id: 'dispensers' as NavTabId,
      label: '3. Dispensers',
      subtitle: 'MPD Bay Controllers',
      icon: Fuel,
      badge: `${dispenserCount} MPDs`,
    },
    {
      id: 'nozzles' as NavTabId,
      label: '4. Nozzles & PNDF',
      subtitle: 'Totalizers & Fuel Metrics',
      icon: GitFork,
      badge: `${nozzleCount} Nozzles`,
    },
    {
      id: 'architecture' as NavTabId,
      label: '5. Station Architecture',
      subtitle: 'Interactive Flow Topology',
      icon: Network,
      highlight: true,
    },
    {
      id: 'reports' as NavTabId,
      label: 'Reports & Logs',
      subtitle: 'Tx History (5-10 logs)',
      icon: FileSpreadsheet,
    },
    {
      id: 'wireframes' as NavTabId,
      label: 'Wireframes & Concept',
      subtitle: 'UI Layouts & Schematics',
      icon: Layers,
    },
  ];

  return (
    <nav className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-[97px] z-20 px-4 overflow-x-auto scrollbar-none">
      <div className="flex items-center space-x-1 min-w-max py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600/20 text-white border border-blue-500/50 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <div
                className={`p-1.5 rounded-md ${
                  isActive
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {tab.label}
                  </span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        isActive
                          ? 'bg-blue-500/30 text-blue-200'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                  {tab.highlight && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                  )}
                </div>
                <span className="text-[10px] block text-slate-500 leading-tight">
                  {tab.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
