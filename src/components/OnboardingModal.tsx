import React, { useState } from 'react';
import { 
  X, 
  Fuel, 
  CheckCircle2, 
  Activity, 
  AlertCircle, 
  Wifi, 
  ShieldCheck, 
  Cylinder, 
  Layers,
  Save
} from 'lucide-react';
import { TankData, FuelType, DispenserData } from '../types/fuel-station';
import { FUEL_PRODUCTS } from '../data/mock-station-data';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  stationId: string;
  stationName: string;
  tanks: TankData[];
  onAddDispenser: (dispenser: DispenserData) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  stationId,
  stationName,
  tanks,
  onAddDispenser,
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

  if (!isOpen) return null;

  const handleTestPing = () => {
    setPingStatus('TESTING');
    setTimeout(() => {
      setPingStatus('SUCCESS');
    }, 1000);
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
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1200);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-gray-200 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center">
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Onboard Dispenser on Location
              </h3>
              <p className="text-xs text-gray-500">
                Commission a Wayne Helix or Tokheim MPD into the station FIP network
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-gray-900">
              Dispenser Successfully Onboarded!
            </h4>
            <p className="text-xs text-gray-500 font-mono">
              Bay #{bayNumber} • Dispenser ID: {dispenserId} • PNDF: {pndfConfig}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Station context */}
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 grid grid-cols-2 gap-3">
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Station ID</span>
                <span className="font-mono text-gray-900 font-bold">{stationId}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Station Name</span>
                <span className="text-gray-800 font-medium truncate block">{stationName}</span>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="text-gray-700 font-semibold block mb-1">
                  Dispenser Number (e.g. T2628482) *
                </label>
                <input
                  type="text"
                  required
                  value={dispenserId}
                  onChange={(e) => setDispenserId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-gray-900 font-mono focus:outline-none focus:bg-white"
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
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-gray-900 focus:outline-none focus:bg-white cursor-pointer"
                >
                  <option value={1}>Bay 1</option>
                  <option value={2}>Bay 2</option>
                  <option value={3}>Bay 3</option>
                  <option value={4}>Bay 4</option>
                  <option value={5}>Bay 5</option>
                  <option value={6}>Bay 6</option>
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
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-gray-900 font-mono focus:outline-none focus:bg-white"
                  placeholder="e.g. 1111 or 2422"
                  maxLength={4}
                />
              </div>

              <div>
                <label className="text-gray-700 font-semibold block mb-1">
                  Primary Feed Tank ID *
                </label>
                <select
                  value={selectedTankId}
                  onChange={(e) => setSelectedTankId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-gray-900 focus:outline-none focus:bg-white cursor-pointer"
                >
                  {tanks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.id} - {FUEL_PRODUCTS[t.fuelType].name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-700 font-semibold block mb-1">
                  Dispenser Model *
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-gray-900 focus:outline-none focus:bg-white cursor-pointer"
                >
                  <option value="Dover Wayne Helix 5000 Quad MPD">Dover Wayne Helix 5000 Quad MPD</option>
                  <option value="Dover Tokheim Quantium 510 Pro">Dover Tokheim Quantium 510 Pro</option>
                  <option value="Dover Wayne Helix 6000 Wide MPD">Dover Wayne Helix 6000 Wide MPD</option>
                </select>
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
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-gray-900 font-mono focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            {/* Fuel Grades */}
            <div>
              <label className="text-gray-700 font-semibold block mb-1.5">
                Assign Fuel Grades (Indian Standards)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['DIESEL', 'PETROL', 'PREMIUM_PETROL', 'EXTRA_PREMIUM'] as FuelType[]).map((grade) => {
                  const prod = FUEL_PRODUCTS[grade];
                  const isChecked = selectedGrades.includes(grade);
                  return (
                    <button
                      type="button"
                      key={grade}
                      onClick={() => toggleGrade(grade)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                        isChecked
                          ? 'bg-white border-gray-900 shadow-2xs'
                          : 'bg-gray-50 border-gray-200 opacity-60'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: prod.liquidColor }}
                      />
                      <div className="text-[11px] truncate">
                        <div className="font-bold text-gray-900">{prod.code}</div>
                        <div className="text-gray-500 text-[10px]">₹{prod.defaultRate}/L</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Loop Ping test */}
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700 font-medium">FIP Protocol Loop Connectivity Test</span>
              </div>
              <button
                type="button"
                onClick={handleTestPing}
                disabled={pingStatus === 'TESTING'}
                className="bg-white border border-gray-200 hover:bg-gray-100 text-gray-800 px-2.5 py-1 rounded-lg font-mono text-[11px] cursor-pointer"
              >
                {pingStatus === 'IDLE' && 'Test Loop'}
                {pingStatus === 'TESTING' && 'Pinging...'}
                {pingStatus === 'SUCCESS' && '✓ Loop OK (0.8ms)'}
              </button>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-gray-500 hover:text-gray-900 font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
              >
                Register & Commission
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
