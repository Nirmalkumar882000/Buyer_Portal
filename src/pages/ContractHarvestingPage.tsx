import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

interface Offer {
  id: string;
  produce: string;
  emoji: string;
  farmer: string;
  location: string;
  qty: string;
  harvestDate: string;
  price: string;
  farmSize: string;
  bgGradient: string;
}

interface ContractHarvestingPageProps {
  onDetailsClick: (offerId: string) => void;
  onRequestInfoClick: (offerId: string) => void;
  onBackToDashboard: () => void;
}

export const ContractHarvestingPage: React.FC<ContractHarvestingPageProps> = ({
  onDetailsClick,
  onRequestInfoClick,
  onBackToDashboard,
}) => {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('Paddy');
  const [selectedState, setSelectedState] = useState('Tamil Nadu');
  const [harvestDate, setHarvestDate] = useState('2025-08-01');

  const offers: Offer[] = [
    {
      id: 'O1',
      produce: 'Paddy (Ponni Variety)',
      emoji: '🌾',
      farmer: 'Rajan Murugesan',
      location: 'Thoothukudi',
      qty: '20 MT',
      harvestDate: 'Aug 2025',
      price: '₹18,000/q',
      farmSize: '15 acres',
      bgGradient: 'from-emerald-50 to-teal-50/40 border-b border-slate-100',
    },
    {
      id: 'O2',
      produce: 'Groundnut (Bold)',
      emoji: '🥜',
      farmer: 'Selvam Kumar',
      location: 'Virudhunagar',
      qty: '8 MT',
      harvestDate: 'Sep 2025',
      price: '₹49/kg',
      farmSize: '8 acres',
      bgGradient: 'from-amber-50 to-orange-50/30 border-b border-slate-100',
    },
    {
      id: 'O3',
      produce: 'Red Chilli (S4)',
      emoji: '🌶️',
      farmer: 'Arumugam',
      location: 'Ramnad',
      qty: '5 MT',
      harvestDate: 'Oct 2025',
      price: '₹95/kg',
      farmSize: '5 acres',
      bgGradient: 'from-purple-50 to-indigo-50/30 border-b border-slate-100',
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Breadcrumbs */}
      <div className="text-xs text-slate-400 font-medium">
        <button onClick={onBackToDashboard} className="hover:text-slate-600 underline">Home</button>
        <span className="mx-1.5">&rsaquo;</span>
        <span className="text-slate-500 font-semibold">Contract Harvesting</span>
      </div>

      {/* Screen Title & Page subtitle */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Contract Harvesting Offers</h1>
        <p className="text-xs text-slate-500 mt-1">Book crop at source. Connect with farmers before harvest.</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-stretch bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
        <div className="flex-1 min-w-[200px] relative rounded-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by crop, farmer, location..."
            className="w-full text-xs px-3.5 py-2 bg-white border border-slate-350 rounded-md focus:border-[#1b4d4f] outline-hidden text-slate-700 font-medium"
          />
        </div>
        <select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className="w-full sm:w-36 text-xs p-2 bg-white border border-slate-350 rounded-md focus:border-[#1b4d4f] outline-hidden text-slate-600 font-semibold"
        >
          <option>Paddy</option>
          <option>Groundnut</option>
          <option>Wheat</option>
          <option>Onion</option>
          <option>Red Chilli</option>
        </select>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="w-full sm:w-36 text-xs p-2 bg-white border border-slate-350 rounded-md focus:border-[#1b4d4f] outline-hidden text-slate-600 font-semibold"
        >
          <option>Tamil Nadu</option>
          <option>Karnataka</option>
          <option>Andhra Pradesh</option>
          <option>Kerala</option>
        </select>
        <input
          type="date"
          value={harvestDate}
          onChange={(e) => setHarvestDate(e.target.value)}
          className="w-full sm:w-36 text-xs p-2 bg-white border border-slate-350 rounded-md focus:border-[#1b4d4f] outline-hidden text-slate-650 font-semibold"
        />
        <button
          onClick={() => showToast(`Filtering listings for ${selectedCrop}...`, 'info')}
          className="bg-[#1b4d4f] hover:bg-[#123637] text-white text-xs font-bold px-5 py-2.5 rounded-md transition shadow-2xs shrink-0"
        >
          🔍 Filter
        </button>
      </div>

      {/* Offer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div key={offer.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between">
            {/* Visual Thumbnail Gradient */}
            <div className={`h-40 flex items-center justify-center text-5xl bg-gradient-to-br ${offer.bgGradient}`}>
              {offer.emoji}
            </div>

            {/* Content Details */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{offer.produce}</h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 flex items-center gap-1.5">
                    👨‍🌾 <span className="text-slate-500">{offer.farmer}</span> &bull; {offer.location}
                    <span className="bg-emerald-50 text-emerald-700 text-[8px] font-extrabold px-1.5 py-0.5 rounded-sm border border-emerald-100">
                      Verified
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-y-2 text-xs font-semibold text-slate-700">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-normal block">Est. Qty</span>
                    <span>{offer.qty}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-normal block">Harvest</span>
                    <span>{offer.harvestDate}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-normal block">Price Indication</span>
                    <span className="text-[#1b4d4f] font-extrabold">{offer.price}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-normal block">Farm Size</span>
                    <span>{offer.farmSize}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50">
                <button
                  onClick={() => onDetailsClick(offer.id)}
                  className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-350 text-[11px] font-bold py-2 rounded-md transition text-center"
                >
                  Details
                </button>
                <button
                  onClick={() => onRequestInfoClick(offer.id)}
                  className="w-full bg-[#1b4d4f] hover:bg-[#123637] text-white text-[11px] font-bold py-2 rounded-md transition shadow-xs text-center"
                >
                  Request Info
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
