import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  UserCheck, 
  KeyRound, 
  CheckCircle2
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEngineerName: string;
  currentEngineerId: string;
  onUpdateEngineer: (name: string, id: string, role: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentEngineerName,
  currentEngineerId,
  onUpdateEngineer,
}) => {
  const [selectedProfile, setSelectedProfile] = useState<string>(currentEngineerId);
  const [passcode, setPasscode] = useState<string>('••••••••');

  if (!isOpen) return null;

  const profiles = [
    {
      id: 'DFS-ENG-8821',
      name: 'Rajesh Kumar',
      role: 'Lead Service Engineer (Level 3 Dover Certified)',
      certification: 'Dover Wayne Helix / Tokheim Master',
    },
    {
      id: 'DFS-MGR-4401',
      name: 'Priya Sharma',
      role: 'Station Retail Manager & Auditor',
      certification: 'PESO & Petroleum Retail Compliance Lead',
    },
    {
      id: 'DFS-TECH-9012',
      name: 'Amit Patel',
      role: 'Calibration & Weights & Measures Inspector',
      certification: 'Legal Metrology W&M Certified',
    },
  ];

  const handleApply = () => {
    const p = profiles.find((prof) => prof.id === selectedProfile) || profiles[0];
    onUpdateEngineer(p.name, p.id, p.role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-gray-200 w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-900 font-bold">
              <ShieldCheck className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Engineer Access & Role Switcher
              </h3>
              <p className="text-[11px] text-gray-500">
                Switch user identity & calibration authority
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div>
            <label className="text-gray-700 font-semibold block mb-2">
              Select Authenticated Profile:
            </label>
            <div className="space-y-2">
              {profiles.map((p) => {
                const isSelected = p.id === selectedProfile;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProfile(p.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gray-50 border-gray-900 shadow-2xs ring-1 ring-gray-900'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-gray-900 text-xs">{p.name}</div>
                      <span className="font-mono text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                        {p.id}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{p.role}</div>
                    <div className="text-[10px] text-emerald-600 mt-1 font-mono">
                      {p.certification}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-gray-700 font-semibold block mb-1">
              Engineer Access Pin / Security Token
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-gray-900 font-mono focus:outline-none focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-gray-500 hover:text-gray-900 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="bg-gray-900 hover:bg-black text-white font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Confirm & Switch Role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
