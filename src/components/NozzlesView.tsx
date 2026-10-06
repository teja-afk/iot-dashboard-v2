import React, { useState, useMemo } from 'react';
import { 
  GitFork, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  FileSpreadsheet, 
  Download, 
  UserCheck, 
  CheckCircle2, 
  Clock, 
  MoreHorizontal,
  Info
} from 'lucide-react';
import { DispenserData, NozzleData, FuelType, NozzleTransaction } from '../types/fuel-station';
import { FUEL_PRODUCTS } from '../data/mock-station-data';

interface NozzlesViewProps {
  dispensers: DispenserData[];
  initialDispenserFilter?: string;
  serviceEngineerName: string;
  serviceEngineerId: string;
}

export const NozzlesView: React.FC<NozzlesViewProps> = ({
  dispensers,
  initialDispenserFilter,
  serviceEngineerName,
  serviceEngineerId,
}) => {
  const [selectedDispenserId, setSelectedDispenserId] = useState<string>(
    initialDispenserFilter || 'ALL'
  );
  const [selectedProductFilter, setSelectedProductFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  
  const [sortField, setSortField] = useState<'nozzleNumber' | 'amountTotalizer' | 'volumeTotalizer' | 'transactionCount' | 'lastTransaction'>('nozzleNumber');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6;

  const [activeReportNozzleId, setActiveReportNozzleId] = useState<string | null>(null);

  const allNozzlesWithParent = useMemo(() => {
    const list: Array<{
      nozzle: NozzleData;
      dispenserId: string;
      bayNumber: number;
      pndfConfig: string;
      model: string;
    }> = [];

    dispensers.forEach((disp) => {
      disp.nozzles.forEach((noz) => {
        list.push({
          nozzle: noz,
          dispenserId: disp.id,
          bayNumber: disp.bayNumber,
          pndfConfig: disp.pndfConfig,
          model: disp.model,
        });
      });
    });
    return list;
  }, [dispensers]);

  const filteredNozzles = useMemo(() => {
    return allNozzlesWithParent.filter((item) => {
      if (selectedDispenserId !== 'ALL' && item.dispenserId !== selectedDispenserId) return false;
      if (selectedProductFilter !== 'ALL' && item.nozzle.productType !== selectedProductFilter) return false;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesDispenser = item.dispenserId.toLowerCase().includes(query);
        const matchesPndf = item.pndfConfig.toLowerCase().includes(query);
        const matchesNozzle = `n${item.nozzle.nozzleNumber}`.includes(query);
        const matchesProduct = FUEL_PRODUCTS[item.nozzle.productType].name.toLowerCase().includes(query);
        if (!matchesDispenser && !matchesPndf && !matchesNozzle && !matchesProduct) return false;
      }
      if (dateFilter) {
        const [year, month, day] = dateFilter.split('-');
        const expectedDatePrefix = `${day}-${month}-${year}`;
        if (!item.nozzle.lastTransactionDateTime.startsWith(expectedDatePrefix)) return false;
      }
      return true;
    });
  }, [allNozzlesWithParent, selectedDispenserId, selectedProductFilter, searchQuery, dateFilter]);

  const sortedNozzles = useMemo(() => {
    return [...filteredNozzles].sort((a, b) => {
      let valA: any = a.nozzle[sortField as keyof NozzleData];
      let valB: any = b.nozzle[sortField as keyof NozzleData];

      if (sortField === 'lastTransaction') {
        valA = a.nozzle.lastTransactionDateTime;
        valB = b.nozzle.lastTransactionDateTime;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredNozzles, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedNozzles.length / pageSize) || 1;
  const paginatedNozzles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedNozzles.slice(start, start + pageSize);
  }, [sortedNozzles, currentPage]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const activeReportItem = useMemo(() => {
    if (!activeReportNozzleId) return sortedNozzles[0] || null;
    return sortedNozzles.find((i) => i.nozzle.id === activeReportNozzleId) || sortedNozzles[0] || null;
  }, [activeReportNozzleId, sortedNozzles]);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Dispenser Nozzles & PNDF Telemetry Board
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Dispenser #, PNDF configs, Indian fuel color codes, flow rates, totalizers, and last transactions
          </p>
        </div>

        {/* User Logged In Badge (as requested) */}
        <div className="bg-white border border-gray-200/80 px-3.5 py-1.5 rounded-xl shadow-2xs flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 font-bold text-xs flex items-center justify-center">
            SE
          </div>
          <div className="text-xs">
            <span className="text-gray-400 text-[10px] uppercase font-bold block">User Logged In</span>
            <span className="font-semibold text-gray-900">{serviceEngineerName.split(',')[0]}</span>
            <span className="text-[10px] text-gray-400 font-mono ml-1">({serviceEngineerId})</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar in Clean Light Style */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Dispenser #, PNDF..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white"
            />
          </div>

          {/* Dispenser Filter */}
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs">
            <span className="text-gray-400 mr-2 text-[11px]">Dispenser:</span>
            <select
              value={selectedDispenserId}
              onChange={(e) => {
                setSelectedDispenserId(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-transparent text-gray-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Dispensers</option>
              {dispensers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.id} (PNDF: {d.pndfConfig})
                </option>
              ))}
            </select>
          </div>

          {/* Product Filter */}
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs">
            <span className="text-gray-400 mr-2 text-[11px]">Product:</span>
            <select
              value={selectedProductFilter}
              onChange={(e) => {
                setSelectedProductFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-transparent text-gray-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Grades</option>
              <option value="DIESEL">Diesel (HSD)</option>
              <option value="PETROL">Petrol (MS)</option>
              <option value="PREMIUM_PETROL">Premium (XP95)</option>
              <option value="EXTRA_PREMIUM">Extra Premium (XP100)</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-transparent text-gray-800 focus:outline-none cursor-pointer"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="text-[10px] text-gray-400 hover:text-gray-700 ml-1 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Indian Fuel Legend Bar */}
        <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-500 gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-[11px] font-semibold text-gray-400">Indian Standards:</span>
            {Object.values(FUEL_PRODUCTS).map((p) => (
              <span key={p.id} className="flex items-center gap-1.5 text-[11px]">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: p.liquidColor }}
                />
                <span className="font-medium text-gray-700">{p.code}</span>
                <span className="text-gray-400 font-mono">₹{p.defaultRate}/L</span>
              </span>
            ))}
          </div>

          <div className="text-[11px] text-gray-400">
            Total Matched: <strong className="text-gray-900">{sortedNozzles.length}</strong> Nozzles
          </div>
        </div>
      </div>

      {/* Main SaaS Table: Nozzles Directory */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              NOZZLE TELEMETRY DIRECTORY
            </h3>
            <Info className="w-3.5 h-3.5 text-gray-300" />
          </div>
          <span className="text-xs text-gray-400">Click row to inspect last 5-10 transactions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/60 text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-100 font-semibold">
              <tr>
                <th className="py-3 px-4">
                  <button
                    onClick={() => handleSort('nozzleNumber')}
                    className="flex items-center gap-1 cursor-pointer hover:text-gray-700 font-semibold"
                  >
                    <span>NOZZLE #</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-4">DISPENSER #</th>
                <th className="py-3 px-4">PNDF CONFIG</th>
                <th className="py-3 px-4">PRODUCT GRADE</th>
                <th className="py-3 px-4">UNIT PRICE</th>
                <th className="py-3 px-4">FLOW RATE</th>
                <th className="py-3 px-4">DENSITY @ 15°C</th>
                <th className="py-3 px-4">
                  <button
                    onClick={() => handleSort('amountTotalizer')}
                    className="flex items-center gap-1 cursor-pointer hover:text-gray-700 font-semibold"
                  >
                    <span>AMOUNT TOTALISER</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-4">
                  <button
                    onClick={() => handleSort('volumeTotalizer')}
                    className="flex items-center gap-1 cursor-pointer hover:text-gray-700 font-semibold"
                  >
                    <span>VOLUME TOTALIZER</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-4">COUNT</th>
                <th className="py-3 px-4">
                  <button
                    onClick={() => handleSort('lastTransaction')}
                    className="flex items-center gap-1 cursor-pointer hover:text-gray-700 font-semibold"
                  >
                    <span>LAST TX (DD-MM-YYYY HH:MM:SS)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-4 text-center">REPORTS</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-gray-700 text-xs">
              {paginatedNozzles.map((item) => {
                const noz = item.nozzle;
                const prod = FUEL_PRODUCTS[noz.productType];
                const isSelected = activeReportItem?.nozzle.id === noz.id;

                return (
                  <tr
                    key={noz.id}
                    onClick={() => setActiveReportNozzleId(noz.id)}
                    className={`hover:bg-gray-50/70 transition-colors cursor-pointer ${
                      isSelected ? 'bg-gray-50 font-medium' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                      N{noz.nozzleNumber}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-gray-900">
                      {item.dispenserId}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-blue-600 bg-blue-50/60 rounded px-1 w-fit">
                      {item.pndfConfig}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="flex items-center gap-1.5 font-medium text-gray-800">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: prod.liquidColor }}
                        />
                        {prod.name}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-900 font-semibold">
                      ₹{noz.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-600">
                      {noz.flowRate.toFixed(1)} L/min
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-600">
                      {noz.density.toFixed(1)} kg/m³
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                      ₹{noz.amountTotalizer.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                      {noz.volumeTotalizer.toLocaleString('en-IN', { minimumFractionDigits: 2 })} L
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-600">
                      {noz.transactionCount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-700">
                      {noz.lastTransactionDateTime}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button className="text-gray-400 hover:text-gray-700 cursor-pointer">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedNozzles.length)} of {sortedNozzles.length} nozzles
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-gray-900 font-medium">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Separate Reports Section for Selected Specific Nozzle (Last 5-10 Transactions) */}
      {activeReportItem && (
        <div className="bg-white border border-gray-200/80 rounded-2xl shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                SPECIFIC NOZZLE TRANSACTIONS: Dispenser {activeReportItem.dispenserId} • Nozzle #{activeReportItem.nozzle.nozzleNumber} ({FUEL_PRODUCTS[activeReportItem.nozzle.productType].code})
              </h3>
              <span className="font-mono text-[10px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded">
                PNDF: {activeReportItem.pndfConfig}
              </span>
            </div>
            <span className="text-xs text-gray-400">Last 5 recorded transactions for this specific nozzle</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/60 text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-100 font-semibold">
                <tr>
                  <th className="py-3 px-4">RECEIPT REF :</th>
                  <th className="py-3 px-4">DATE & TIME :</th>
                  <th className="py-3 px-4">QTY (L) :</th>
                  <th className="py-3 px-4">UNIT PRICE :</th>
                  <th className="py-3 px-4">TOTAL AMOUNT :</th>
                  <th className="py-3 px-4">DENSITY :</th>
                  <th className="py-3 px-4">FLOW RATE :</th>
                  <th className="py-3 px-4">PAYMENT :</th>
                  <th className="py-3 px-4">VEHICLE :</th>
                  <th className="py-3 px-4">ATTENDANT :</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 text-xs">
                {activeReportItem.nozzle.recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">{tx.receiptNumber}</td>
                    <td className="py-3.5 px-4 font-mono text-gray-600">{tx.dateTime}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">{tx.volumeLiters.toFixed(2)} L</td>
                    <td className="py-3.5 px-4 font-mono text-gray-500">₹{tx.unitPrice.toFixed(2)}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                      ₹{tx.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-600">{tx.density}</td>
                    <td className="py-3.5 px-4 font-mono text-gray-600">{tx.rate} L/min</td>
                    <td className="py-3.5 px-4 text-gray-600">{tx.paymentMethod}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-gray-800">{tx.vehiclePlate || 'N/A'}</td>
                    <td className="py-3.5 px-4 text-gray-600">{tx.attendantName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
