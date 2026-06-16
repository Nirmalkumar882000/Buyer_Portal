import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

interface PriceRow {
  commodity: string;
  variety: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
  updatedTime: string;
}

const initialPrices: PriceRow[] = [
  {
    commodity: 'Paddy',
    variety: 'Ponni (Grade A)',
    minPrice: 1750,
    maxPrice: 1900,
    modalPrice: 1840,
    unit: 'Per Quintal',
    updatedTime: '08:30 AM',
  },
  {
    commodity: 'Paddy',
    variety: 'IR-64 (Grade B)',
    minPrice: 1600,
    maxPrice: 1750,
    modalPrice: 1680,
    unit: 'Per Quintal',
    updatedTime: '08:30 AM',
  },
  {
    commodity: 'Groundnut',
    variety: 'Bold (Runner)',
    minPrice: 4800,
    maxPrice: 5400,
    modalPrice: 5200,
    unit: 'Per Quintal',
    updatedTime: '08:30 AM',
  },
  {
    commodity: 'Onion',
    variety: 'Large (Local)',
    minPrice: 2000,
    maxPrice: 2400,
    modalPrice: 2200,
    unit: 'Per Quintal',
    updatedTime: '08:30 AM',
  },
  {
    commodity: 'Tomato',
    variety: 'Hybrid',
    minPrice: 900,
    maxPrice: 1300,
    modalPrice: 1100,
    unit: 'Per Quintal',
    updatedTime: '08:30 AM',
  },
  {
    commodity: 'Cotton',
    variety: 'Shankar-6',
    minPrice: 6000,
    maxPrice: 6800,
    modalPrice: 6400,
    unit: 'Per Quintal',
    updatedTime: '08:30 AM',
  },
  {
    commodity: 'Wheat',
    variety: 'Lok-1',
    minPrice: 2050,
    maxPrice: 2250,
    modalPrice: 2150,
    unit: 'Per Quintal',
    updatedTime: '08:30 AM',
  },
  {
    commodity: 'Turmeric',
    variety: 'Finger (Salem)',
    minPrice: 13000,
    maxPrice: 14500,
    modalPrice: 13800,
    unit: 'Per Quintal',
    updatedTime: '08:30 AM',
  },
];

export const MarketPricesPage: React.FC = () => {
  const { showToast } = useToast();
  const [selectedState, setSelectedState] = useState('Tamil Nadu');
  const [selectedMarket, setSelectedMarket] = useState('Thoothukudi APMC');
  const [selectedCommodity, setSelectedCommodity] = useState('Paddy');
  const [prices, setPrices] = useState<PriceRow[]>(initialPrices);

  const handleFilter = () => {
    const results = initialPrices.filter((item) => {
      if (selectedCommodity !== 'All' && item.commodity !== selectedCommodity) {
        return false;
      }
      return true;
    });
    setPrices(results);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          {/* Breadcrumbs */}
          <div className="text-xs text-slate-400 font-semibold mb-1">
            <span className="text-slate-450">Home</span>
            <span className="mx-1.5">&rsaquo;</span>
            <span className="text-slate-500 font-semibold">Market Prices</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Market Price List</h1>
          <p className="text-xs text-slate-500 font-bold mt-0.5">
            Daily commodity prices across Indian APMC markets. Updated by Velaan Bay back office.
          </p>
        </div>

        {/* Public Badge */}
        <div className="self-start sm:self-center">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white text-[11px] font-black rounded-md shadow-xs uppercase tracking-wider">
            ✓ No Login Required
          </span>
        </div>
      </div>

      {/* Info Alert Box */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3.5 flex gap-2.5 items-center">
        <span className="text-blue-500 text-lg">📢</span>
        <p className="text-xs text-blue-800 font-semibold">
          Prices are updated daily by the Velaan Bay back office. Last updated:{' '}
          <span className="text-[#1b4d4f] font-black">15 Jul 2025, 08:30 AM</span>
        </p>
      </div>

      {/* Filter Bar Panel */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700">
        {/* State Dropdown */}
        <div className="flex-1 min-w-[140px]">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-md bg-white text-slate-700 font-semibold focus:border-[#1b4d4f] outline-hidden"
          >
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
          </select>
        </div>

        {/* Market Dropdown */}
        <div className="flex-1 min-w-[180px]">
          <select
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-md bg-white text-slate-700 font-semibold focus:border-[#1b4d4f] outline-hidden"
          >
            <option value="Thoothukudi APMC">Thoothukudi APMC</option>
            <option value="Madurai APMC">Madurai APMC</option>
            <option value="Coimbatore APMC">Coimbatore APMC</option>
          </select>
        </div>

        {/* Commodity Dropdown */}
        <div className="flex-1 min-w-[140px]">
          <select
            value={selectedCommodity}
            onChange={(e) => setSelectedCommodity(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-md bg-white text-slate-700 font-semibold focus:border-[#1b4d4f] outline-hidden"
          >
            <option value="All">All Commodities</option>
            <option value="Paddy">Paddy</option>
            <option value="Groundnut">Groundnut</option>
            <option value="Onion">Onion</option>
            <option value="Tomato">Tomato</option>
            <option value="Cotton">Cotton</option>
            <option value="Wheat">Wheat</option>
            <option value="Turmeric">Turmeric</option>
          </select>
        </div>

        {/* Filter Button */}
        <button
          onClick={handleFilter}
          className="px-5 py-2.5 bg-[#1b4d4f] hover:bg-[#123637] text-white text-xs font-bold rounded-md shadow-xs transition"
        >
          ⚙ Filter
        </button>

        {/* Download Prices Button */}
        <button
          onClick={() => showToast("Downloading today's prices PDF...", 'info')}
          className="px-3.5 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-md shadow-2xs flex items-center gap-1.5 transition ml-auto"
        >
          📊 Download Today's Prices
        </button>
      </div>

      {/* Main Prices Table Card */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        {/* Table Title Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex justify-between items-center text-xs font-bold">
          <span className="text-slate-800 font-extrabold">{selectedMarket} &mdash; 15 July 2025</span>
          <span className="text-slate-400 font-semibold text-[10px]">Prices in ₹ per Quintal (100 kg)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <th className="p-4">Commodity</th>
                <th className="p-4">Variety</th>
                <th className="p-4">Min Price</th>
                <th className="p-4">Max Price</th>
                <th className="p-4">Modal Price</th>
                <th className="p-4">Unit</th>
                <th className="p-4">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {prices.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition">
                  <td className="p-4 text-slate-900 font-extrabold">{item.commodity}</td>
                  <td className="p-4 text-slate-650">{item.variety}</td>
                  <td className="p-4 text-slate-600">₹{item.minPrice.toLocaleString()}</td>
                  <td className="p-4 text-slate-600">₹{item.maxPrice.toLocaleString()}</td>
                  <td className="p-4 text-[#1b4d4f] font-black text-sm">₹{item.modalPrice.toLocaleString()}</td>
                  <td className="p-4 text-slate-500">{item.unit}</td>
                  <td className="p-4 text-slate-500 font-bold">{item.updatedTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="text-[10px] text-slate-400 font-bold leading-relaxed">
        Disclaimer: Prices are indicative and sourced from APMC market data. Actual transaction prices may vary. Maintained by Skandavel Webtech Private Limited.
      </div>
    </div>
  );
};
