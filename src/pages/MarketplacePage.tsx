import React, { useState } from 'react';

interface MarketplacePageProps {
  onBackToDashboard: () => void;
  onSelectProduct: (productName: string) => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  onBackToDashboard,
  onSelectProduct,
}) => {
  const [cartCount, setCartCount] = useState(2);

  const commodities = [
    { name: 'Paddy (Ponni)', emoji: '🌾', grade: 'Grade A', gradeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-100', seller: 'Agent: Murugan K. | Thoothukudi', price: '₹19.50/kg', qty: '10 MT available', bg: 'bg-emerald-50/70' },
    { name: 'Groundnut (Bold)', emoji: '🥜', grade: 'Grade B', gradeColor: 'bg-amber-50 text-amber-700 border border-amber-105', seller: 'Farmer: Rajan | Thoothukudi', price: '₹52/kg', qty: '2 MT available', bg: 'bg-amber-50/40' },
    { name: 'Onion (Large)', emoji: '🧅', grade: 'Premium', gradeColor: 'bg-purple-50 text-purple-700 border border-purple-100', seller: 'Agent: Arjunan N. | Madurai', price: '₹22/kg', qty: '5 MT available', bg: 'bg-purple-50/30' }
  ];

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-400 font-medium">
        <button onClick={onBackToDashboard} className="hover:text-slate-600 underline">Home</button>
        <span className="mx-1.5">&rsaquo;</span>
        <span className="text-slate-500 font-semibold">Marketplace</span>
      </div>

      {/* Title & Cart Count */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Fixed Price Marketplace</h1>
          <p className="text-xs text-slate-500 mt-1">Browse and buy agricultural produce at fixed prices</p>
        </div>
        <button className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold px-4 py-2.5 rounded-md transition shadow-xs">
          <span>🛒</span> Cart ({cartCount})
        </button>
      </div>

      {/* Main filter + list section */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Side Filters Box */}
        <div className="w-full lg:w-64 bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-6 shrink-0 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="font-bold text-slate-800 text-sm">Filters</span>
            <button className="text-[10px] text-slate-500 font-semibold border border-slate-200 px-2 py-0.5 rounded-sm hover:bg-slate-50">
              Clear All
            </button>
          </div>

          {/* Commodity Section */}
          <div className="space-y-2.5">
            <span className="font-bold text-slate-450 uppercase tracking-wide text-[9px]">Commodity</span>
            <div className="space-y-2 font-semibold text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#1b4d4f] focus:ring-[#1b4d4f]" /> Paddy / Rice
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-[#1b4d4f] focus:ring-[#1b4d4f]" /> Wheat
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#1b4d4f] focus:ring-[#1b4d4f]" /> Groundnut
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-[#1b4d4f] focus:ring-[#1b4d4f]" /> Onion
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-[#1b4d4f] focus:ring-[#1b4d4f]" /> Tomato
              </label>
            </div>
          </div>

          {/* Price Range Section */}
          <div className="space-y-2.5">
            <span className="font-bold text-slate-450 uppercase tracking-wide text-[9px]">Price Range (₹/kg)</span>
            <div className="flex items-center gap-2 font-medium text-slate-500">
              <input type="number" defaultValue="10" className="w-16 px-2 py-1 bg-white border border-slate-350 rounded-sm text-center outline-hidden focus:border-[#1b4d4f]" />
              <span>to</span>
              <input type="number" defaultValue="200" className="w-16 px-2 py-1 bg-white border border-slate-350 rounded-sm text-center outline-hidden focus:border-[#1b4d4f]" />
            </div>
          </div>

          {/* Location Section */}
          <div className="space-y-2.5">
            <span className="font-bold text-slate-450 uppercase tracking-wide text-[9px]">Location</span>
            <select className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md outline-hidden transition focus:border-[#1b4d4f]">
              <option>Tamil Nadu</option>
              <option>Karnataka</option>
            </select>
          </div>

          {/* Seller Type Section */}
          <div className="space-y-2.5">
            <span className="font-bold text-slate-450 uppercase tracking-wide text-[9px]">Seller Type</span>
            <div className="space-y-2 font-semibold text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#1b4d4f] focus:ring-[#1b4d4f]" /> Mandi Agent
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#1b4d4f] focus:ring-[#1b4d4f]" /> Farmer Direct
              </label>
            </div>
          </div>
        </div>

        {/* Right Side Grid */}
        <div className="flex-1 space-y-4 w-full">
          {/* Grid Top bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex gap-2 w-full sm:max-w-xs">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-3.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-800 outline-hidden focus:border-[#1b4d4f]"
              />
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto text-xs text-slate-400 font-medium">
              <select className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-md outline-hidden text-slate-700">
                <option>Sort: Newest</option>
                <option>Price: Low to High</option>
              </select>
              <span>Showing 24 products</span>
            </div>
          </div>

          {/* Commodity Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {commodities.map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between">
                {/* Visual Thumbnail */}
                <div
                  onClick={() => onSelectProduct(item.name)}
                  className={`h-40 flex items-center justify-center text-5xl cursor-pointer hover:opacity-90 transition ${item.bg}`}
                >
                  {item.emoji}
                </div>

                {/* Details */}
                <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${item.gradeColor}`}>
                      {item.grade}
                    </span>
                    <div className="cursor-pointer" onClick={() => onSelectProduct(item.name)}>
                      <h4 className="text-sm font-bold text-slate-800 hover:text-[#1b4d4f] transition">{item.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.seller}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline border-t border-slate-50 pt-2 text-xs font-bold">
                    <span className="text-[#1b4d4f] text-sm">{item.price}</span>
                    <span className="text-slate-400 text-[10px] font-semibold">{item.qty}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1.5">
                    <button
                      onClick={handleAddToCart}
                      className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-350 text-[11px] font-bold py-2 rounded-md transition"
                    >
                      + Cart
                    </button>
                    <button
                      onClick={() => onSelectProduct(item.name)}
                      className="w-full bg-[#1b4d4f] hover:bg-[#123637] text-white text-[11px] font-bold py-2 rounded-md transition shadow-xs"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-end gap-1 text-xs font-bold pt-4">
            <button className="w-8 h-8 rounded bg-[#1b4d4f] text-white flex items-center justify-center">1</button>
            <button className="w-8 h-8 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center">2</button>
            <button className="w-8 h-8 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center">3</button>
            <button className="w-8 h-8 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center">&rarr;</button>
          </div>
        </div>
      </div>
    </div>
  );
};

