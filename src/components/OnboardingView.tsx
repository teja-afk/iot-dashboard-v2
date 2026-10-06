import React, { useState } from 'react';
import { 
  Fuel, 
  CheckCircle2, 
  Wifi, 
  Save, 
  PlusCircle, 
  Sliders, 
  Radio, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import { TankData, FuelType, DispenserData } from '../types/fuel-station';
import { FUEL_PRODUCTS } from '../data/mock-station-data';

interface OnboardingViewProps {
  stationId: string;
  stationName: string;
  tanks: TankData[];
  onAddDispenser: (dispenser: DispenserData) => void;
  onNavigateToDispensers: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  stationId,
  stationName,
  tanks,
  onAddDispenser,
  onNavigateToDispensers,
}) => {
  const [bayNumber, setBayNumber] = useState<number>(5);
  const [dispenserId, setDispenserId] = useState<string>('T2628485');
  const [dispenserSerial, setDispenserSerial] = useState<string>('DW-HELIX-2026-90412');
  const [model, setModel] = useState<string>('Dover Wayne Helix 5000 Quad MPD');
  const [pndfConfig, setPndfConfig] = useState<string>('1111');
  const [selectedTankId, setSelectedTankId] = useState<string>(tanks[0]?.id || 'TK-01');
  const [ipAddress, setIpAddress] = useState<string>('192.168.10.15');
  const [fipChannel, setFipChannel] = useState<number>(5);
  const [serviceEngineer, setServiceEngineer] = useState<string>('Rajesh Kumar (DFS-ENG-8821)');
  
  const [selectedGrades, setSelectedGrades] = useState<FuelType[]>([
    'DIESEL',
    'PETROL',
    'PREMIUM_PETROL',
  ]);

  const [pingStatus, setPingStatus] = useState<'IDLE' | 'TESTING' | 'SUCCESS'>('IDLE');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleTestPing = () => {
    setPingStatus('TESTING');
    setTimeout(() => {
      setPingStatus('SUCCESS');
    }, 900);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newDispenser: DispenserData = {
      id: dispenserId.trim() || `T${Math.floor(1000000 + Math.random() * 9000000)}`,
      serialNumber: dispenserSerial.trim() || `DW-${Date.now()}`,
      bayNumber: Number(bayNumber),
      model: model,
      pndfConfig: pndfConfig.trim() || '1111',
      ipAddress: ipAddress,
      fipLoopChannel: Number(fipChannel),
      status: 'IDLE',
      lastMaintenanceDate: '06-10-2026',
      commissionedDate: '06-10-2026',
      nozzles: selectedGrades.map((grade, idx) => {
        const prod = FUEL_PRODUCTS[grade];
        return {
          id: `NZ-${bayNumber}0${idx + 1}`,
          nozzleNumber: idx + 1,
          productType: grade,
          connectedTankId: selectedTankId,
          unitPrice: prod.defaultRate,
          flowRate: 38.0,
          density: prod.defaultDensity,
          amountTotalizer: 0.00,
          volumeTotalizer: 0.00,
          transactionCount: 0,
          lastTransactionDateTime: '06-10-2026 09:00:00',
          lastTransactionVolume: 0.00,
          lastTransactionAmount: 0.00,
          status: 'IDLE',
          recentTransactions: [],
        };
      }),
    };

    onAddDispenser(newDispenser);
    setIsSubmitted(true);
  };

  const toggleGrade = (grade: FuelType) => {
    if (selectedGrades.includes(grade)) {
      if (selectedGrades.length > 1) {
        setSelectedGrades(selectedGrades.filter((g) => g !== grade));
      }
    } else {
      setSelectedGrades([...selectedGrades, grade]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Onboard Dispenser on Location
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Commission and integrate multi-product dispensers into station FIP automation loop
          </p>
        </div>

        <button
          onClick={onNavigateToDispensers}
          className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 font-semibold cursor-pointer"
        >
          <span>View All Registered Dispensers</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {isSubmitted ? (
        <div className="bg-white border border-gray-200/80 rounded-2xl p-12 text-center shadow-2xs space-y-4 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Dispenser Successfully Onboarded!
          </h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Dispenser <strong className="text-gray-900">{dispenserId}</strong> (Bay {bayNumber}) with PNDF config <strong className="text-blue-600">{pndfConfig}</strong> has been registered and initialized in the FIP loop.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setDispenserId(`T${Math.floor(2000000 + Math.random() * 8000000)}`);
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-xl cursor-pointer"
            >
              + Onboard Another Dispenser
            </button>
            <button
              onClick={onNavigateToDispensers}
              className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl cursor-pointer"
            >
              Go to Dispensers Bay →
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-2xs max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Station context */}
            <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">
                  Station Location ID
                </span>
                <span className="font-mono text-gray-900 font-bold text-sm">{stationId}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">
                  Station Name
                </span>
                <span className="text-gray-800 font-medium truncate block">{stationName}</span>
              </div>
            </div>

            {/* Input fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-gray-700 font-semibold block mb-1">
                  Dispenser Number (e.g. T2628482) *
                </label>
                <input
                  type="text"
                  required
                  value={dispenserId}
                  onChange={(e) => setDispenserId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 font-mono focus:outline-none focus:bg-white"
                  placeholder="e.g. T2628482"
                />
              </div>

              <div>
                <label className="text-gray-700 font-semibold block mb-1">
                  Bay Number *
                </label>
                <select
                  value={bayNumber}
                  onChange={(e) => setBayNumber(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:bg-white cursor-pointer"
                >
                  <option value={1}>Bay 1 (Express Retail)</option>
                  <option value={2}>Bay 2 (Express Retail)</option>
                  <option value={3}>Bay 3 (Commercial Fleet)</option>
                  <option value={4}>Bay 4 (High Flow Diesel)</option>
                  <option value={5}>Bay 5 (New Retail Island)</option>
                  <option value={6}>Bay 6 (New Retail Island)</option>
                </select>
              </div>

              <div>
                <label className="text-gray-700 font-semibold block mb-1">
                  Dispenser Config (PNDF) *
                </label>
                <input
                  type="text"
                  required
                  value={pndfConfig}
                  onChange={(e) => setPndfConfig(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 font-mono focus:outline-none focus:bg-white"
                  placeholder="e.g. 1111 or 2422"
                  maxLength={4}
                />
                <span className="text-[10px] text-gray-400 block mt-0.5">
                  Product Nozzle Display Fip mapping (4 Digits)
                </span>
              </div>

              <div>
                <label className="text-gray-700 font-semibold block mb-1">
                  Feed Tank ID *
                </label>
                <select
                  value={selectedTankId}
                  onChange={(e) => setSelectedTankId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:bg-white cursor-pointer"
                >
                  {tanks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.id} - {FUEL_PRODUCTS[t.fuelType].name} ({t.currentFuelLiters.toLocaleString()} L)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-700 font-semibold block mb-1">
                  Dispenser Hardware Model *
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:bg-white cursor-pointer"
                >
                  <option value="Dover Wayne Helix 5000 Quad MPD">Dover Wayne Helix 5000 Quad MPD</option>
                  <option value="Dover Tokheim Quantium 510 Pro">Dover Tokheim Quantium 510 Pro</option>
                  <option value="Dover Wayne Helix 6000 Wide MPD">Dover Wayne Helix 6000 Wide MPD</option>
                  <option value="Dover Tokheim High-Speed Commercial MPD">Dover Tokheim High-Speed Commercial MPD</option>
                </select>
              </div>

              <div>
                <label className="text-gray-700 font-semibold block mb-1">
                  Hardware Serial Number *
                </label>
                <input
                  type="text"
                  required
                  value={dispenserSerial}
                  onChange={(e) => setDispenserSerial(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 font-mono focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="text-gray-700 font-semibold block mb-1">
                  Loop IP Address *
                </label>
                <input
                  type="text"
                  required
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 font-mono focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="text-gray-700 font-semibold block mb-1">
                  Commissioning Service Engineer *
                </label>
                <input
                  type="text"
                  required
                  value={serviceEngineer}
                  onChange={(e) => setServiceEngineer(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            {/* Fuel Grades to Assign */}
            <div>
              <label className="text-gray-700 font-semibold block mb-2 text-xs">
                Assign Fuel Grades (Indian Color Coded Standards)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(['DIESEL', 'PETROL', 'PREMIUM_PETROL', 'EXTRA_PREMIUM'] as FuelType[]).map((grade) => {
                  const prod = FUEL_PRODUCTS[grade];
                  const isChecked = selectedGrades.includes(grade);
                  return (
                    <button
                      type="button"
                      key={grade}
                      onClick={() => toggleGrade(grade)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        isChecked
                          ? 'bg-white border-gray-900 shadow-xs'
                          : 'bg-gray-50 border-gray-200 opacity-60'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: prod.liquidColor }}
                      />
                      <div className="text-xs truncate">
                        <div className="font-bold text-gray-900">{prod.code}</div>
                        <div className="text-gray-500 text-[10px]">₹{prod.defaultRate}/L</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FIP loop test */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Wifi className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="font-semibold text-gray-900 block">FIP Protocol Loop Connectivity Test</span>
                  <span className="text-gray-500 text-[11px]">Handshake test before writing to station telemetry</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleTestPing}
                disabled={pingStatus === 'TESTING'}
                className="bg-white border border-gray-200 hover:bg-gray-100 text-gray-800 px-3 py-1.5 rounded-lg font-mono text-[11px] cursor-pointer"
              >
                {pingStatus === 'IDLE' && 'Test FIP Loop'}
                {pingStatus === 'TESTING' && 'Pinging Loop...'}
                {pingStatus === 'SUCCESS' && '✓ Handshake OK (0.8ms)'}
              </button>
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
              <button
                type="submit"
                className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Commission & Register Dispenser</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
