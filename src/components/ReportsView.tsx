import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  Info,
  MoreHorizontal
} from 'lucide-react';
import { StationData, NozzleTransaction } from '../types/fuel-station';
import { FUEL_PRODUCTS } from '../data/mock-station-data';

interface ReportsViewProps {
  stationData: StationData;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ stationData }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('ALL');

  const allTransactions: Array<NozzleTransaction & { pndfConfig: string; bayNumber: number }> = [];

  stationData.dispensers.forEach((disp) => {
    disp.nozzles.forEach((noz) => {
      noz.recentTransactions.forEach((tx) => {
        allTransactions.push({
          ...tx,
          pndfConfig: disp.pndfConfig,
          bayNumber: disp.bayNumber,
        });
      });
    });
  });

  allTransactions.sort(
    (a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime()
  );

  const filtered = allTransactions.filter((tx) => {
    if (selectedProduct !== 'ALL' && tx.productType !== selectedProduct) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchReceipt = tx.receiptNumber.toLowerCase().includes(q);
      const matchDisp = tx.dispenserId.toLowerCase().includes(q);
      const matchPlate = (tx.vehiclePlate || '').toLowerCase().includes(q);
      const matchPndf = tx.pndfConfig.toLowerCase().includes(q);
      if (!matchReceipt && !matchDisp && !matchPlate && !matchPndf) return false;
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = [
      'Receipt No',
      'Dispenser ID',
      'Bay',
      'PNDF',
      'Nozzle',
      'Product',
      'Date & Time',
      'Volume (L)',
      'Unit Price (INR)',
      'Total Amount (INR)',
      'Density (kg/m3)',
      'Rate (L/min)',
      'Payment',
      'Vehicle Plate',
      'Attendant',
    ];

    const rows = filtered.map((tx) => [
      tx.receiptNumber,
      tx.dispenserId,
      tx.bayNumber,
      tx.pndfConfig,
      tx.nozzleNumber,
      tx.productType,
      tx.dateTime,
      tx.volumeLiters,
      tx.unitPrice,
      tx.totalAmount,
      tx.density,
      tx.rate,
      tx.paymentMethod,
      tx.vehiclePlate || 'N/A',
      tx.attendantName,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dover_telemetry_report_${stationData.stationId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Station Reports & Audit Log
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Complete transaction and calibration audit trail for tanks, dispensers, and nozzles
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer w-fit"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by Receipt, Dispenser, Plate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white"
            />
          </div>

          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5">
            <span className="text-gray-400 mr-2 text-[11px]">Product:</span>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="bg-transparent text-gray-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Products</option>
              <option value="DIESEL">Diesel (HSD)</option>
              <option value="PETROL">Petrol (MS)</option>
              <option value="PREMIUM_PETROL">Premium (XP95)</option>
              <option value="EXTRA_PREMIUM">Extra Premium (XP100)</option>
            </select>
          </div>
        </div>

        <div className="text-gray-400 text-[11px]">
          Showing <strong className="text-gray-900">{filtered.length}</strong> recorded audit transactions
        </div>
      </div>

      {/* Clean White Table */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/60 text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-100 font-semibold">
              <tr>
                <th className="py-3 px-4">RECEIPT REF :</th>
                <th className="py-3 px-4">DISPENSER & BAY :</th>
                <th className="py-3 px-4">PNDF :</th>
                <th className="py-3 px-4">NOZZLE :</th>
                <th className="py-3 px-4">PRODUCT GRADE :</th>
                <th className="py-3 px-4">DATE & TIME :</th>
                <th className="py-3 px-4">QTY (L) :</th>
                <th className="py-3 px-4">UNIT PRICE :</th>
                <th className="py-3 px-4">TOTAL REVENUE :</th>
                <th className="py-3 px-4">PAYMENT :</th>
                <th className="py-3 px-4">VEHICLE :</th>
                <th className="py-3 px-4">ATTENDANT :</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 text-xs">
              {filtered.map((tx) => {
                const prod = FUEL_PRODUCTS[tx.productType];
                return (
                  <tr key={tx.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">{tx.receiptNumber}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-gray-900 font-semibold">{tx.dispenserId}</span>
                      <span className="text-gray-400 text-[10px] block font-mono">Bay {tx.bayNumber}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-blue-600 bg-blue-50/60 rounded px-1 w-fit">
                      {tx.pndfConfig}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">N{tx.nozzleNumber}</td>
                    <td className="py-3.5 px-4">
                      <span className="flex items-center gap-1.5 font-medium text-gray-800">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: prod.liquidColor }}
                        />
                        {prod.name}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-600">{tx.dateTime}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">{tx.volumeLiters.toFixed(2)} L</td>
                    <td className="py-3.5 px-4 font-mono text-gray-500">₹{tx.unitPrice.toFixed(2)}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                      ₹{tx.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">{tx.paymentMethod}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-gray-800">{tx.vehiclePlate || 'N/A'}</td>
                    <td className="py-3.5 px-4 text-gray-600">{tx.attendantName}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
