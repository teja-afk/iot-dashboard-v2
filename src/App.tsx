/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { OverviewView } from './components/OverviewView';
import { TanksView } from './components/TanksView';
import { DispensersView } from './components/DispensersView';
import { NozzlesView } from './components/NozzlesView';
import { StationArchitectureView } from './components/StationArchitectureView';
import { ReportsView } from './components/ReportsView';
import { WireframeAssetViewer } from './components/WireframeAssetViewer';
import { OnboardingView } from './components/OnboardingView';
import { LoginModal } from './components/LoginModal';
import { INITIAL_STATION_DATA, ALTERNATIVE_STATIONS } from './data/mock-station-data';
import { DispenserData, StationData } from './types/fuel-station';
import { NavTabId } from './components/Navigation';

export default function App() {
  const [stationData, setStationData] = useState<StationData>(INITIAL_STATION_DATA);
  const [activeStationId, setActiveStationId] = useState<string>('DOV-4091');
  const [activeTab, setActiveTab] = useState<NavTabId>('overview');
  
  // Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [initialNozzleDispenserFilter, setInitialNozzleDispenserFilter] = useState<string>('ALL');

  // TopBar period selector
  const [timePeriod, setTimePeriod] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');

  // Live IST Clock
  const [currentTimeString, setCurrentTimeString] = useState<string>('09:00:10');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTimeString(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddDispenser = (newDispenser: DispenserData) => {
    setStationData((prev) => ({
      ...prev,
      dispensers: [...prev.dispensers, newDispenser],
    }));
  };

  const handleUpdateEngineer = (name: string, id: string, role: string) => {
    setStationData((prev) => ({
      ...prev,
      serviceEngineer: {
        ...prev.serviceEngineer,
        name,
        id,
        role,
      },
    }));
  };

  const handleSelectStation = (id: string) => {
    setActiveStationId(id);
    const found = ALTERNATIVE_STATIONS.find((s) => s.id === id);
    if (found) {
      setStationData((prev) => ({
        ...prev,
        stationId: found.id,
        stationName: found.name,
        city: found.city.split(',')[0],
      }));
    }
  };

  const handleNavigateToNozzles = (dispenserId?: string) => {
    if (dispenserId) {
      setInitialNozzleDispenserFilter(dispenserId);
    } else {
      setInitialNozzleDispenserFilter('ALL');
    }
    setActiveTab('nozzles');
  };

  const handleExportCSV = () => {
    const rows = [
      ['Station ID', stationData.stationId],
      ['Station Name', stationData.stationName],
      ['Export Date', '06-10-2026'],
      [],
      ['Receipt No', 'Dispenser ID', 'Bay', 'Nozzle', 'Product', 'Date Time', 'Volume (L)', 'Unit Price (INR)', 'Total Amount (INR)', 'Status'],
    ];

    stationData.dispensers.forEach((disp) => {
      disp.nozzles.forEach((noz) => {
        noz.recentTransactions.forEach((tx) => {
          rows.push([
            tx.receiptNumber,
            disp.id,
            String(disp.bayNumber),
            String(noz.nozzleNumber),
            tx.productType,
            tx.dateTime,
            String(tx.volumeLiters),
            String(tx.unitPrice),
            String(tx.totalAmount),
            'Success',
          ]);
        });
      });
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      rows.map((e) => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dover_station_${stationData.stationId}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 flex font-sans selection:bg-gray-900 selection:text-white">
      {/* Left Sidebar (Non-scrollable, dedicated Onboard Dispenser menu item) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'nozzles') setInitialNozzleDispenserFilter('ALL');
        }}
        stationData={stationData}
        activeStationId={activeStationId}
        onSelectStation={handleSelectStation}
        stationsList={ALTERNATIVE_STATIONS}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Main Content View Area on Right */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* TopBar with breadcrumb, search, daily filter, and Export CSV button */}
        <TopBar
          activeTab={activeTab}
          stationData={stationData}
          currentTimeString={currentTimeString}
          onExportCSV={handleExportCSV}
          timePeriod={timePeriod}
          onChangePeriod={setTimePeriod}
        />

        {/* View Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <OverviewView
              stationData={stationData}
              onNavigateToTab={(tab) => setActiveTab(tab)}
              onOpenOnboardModal={() => setActiveTab('onboard')}
            />
          )}

          {activeTab === 'tanks' && (
            <TanksView
              tanks={stationData.tanks}
              onSelectDispenser={(dispId) => handleNavigateToNozzles(dispId)}
            />
          )}

          {activeTab === 'dispensers' && (
            <DispensersView
              dispensers={stationData.dispensers}
              onNavigateToNozzles={(dispId) => handleNavigateToNozzles(dispId)}
              onOpenOnboardModal={() => setActiveTab('onboard')}
            />
          )}

          {activeTab === 'nozzles' && (
            <NozzlesView
              dispensers={stationData.dispensers}
              initialDispenserFilter={initialNozzleDispenserFilter}
              serviceEngineerName={stationData.serviceEngineer.name}
              serviceEngineerId={stationData.serviceEngineer.id}
            />
          )}

          {activeTab === 'architecture' && (
            <StationArchitectureView
              stationData={stationData}
              onSelectDispenser={(dispId) => handleNavigateToNozzles(dispId)}
              onOpenWireframes={() => setActiveTab('wireframes')}
            />
          )}

          {activeTab === 'onboard' && (
            <OnboardingView
              stationId={stationData.stationId}
              stationName={stationData.stationName}
              tanks={stationData.tanks}
              onAddDispenser={handleAddDispenser}
              onNavigateToDispensers={() => setActiveTab('dispensers')}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView stationData={stationData} />
          )}

          {activeTab === 'wireframes' && (
            <WireframeAssetViewer
              onProceedToDashboard={() => setActiveTab('overview')}
            />
          )}
        </main>
      </div>

      {/* Login & Switch Role Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentEngineerName={stationData.serviceEngineer.name}
        currentEngineerId={stationData.serviceEngineer.id}
        onUpdateEngineer={handleUpdateEngineer}
      />
    </div>
  );
}
