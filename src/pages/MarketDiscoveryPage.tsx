import React from 'react';
import { Button } from '../components/Button';

interface MarketDiscoveryPageProps {
  onBrowseAgents: (marketName: string) => void;
}

export const MarketDiscoveryPage: React.FC<MarketDiscoveryPageProps> = ({ onBrowseAgents }) => {
  const markets = [
    {
      name: 'Thoothukudi APMC',
      location: 'Thoothukudi, Tamil Nadu',
      agents: 12,
      lots: 8,
      commodities: 'Paddy, Groundnut',
      status: 'Active',
      statusColor: 'bg-emerald-100 text-emerald-800',
      isActiveButton: true,
    },
    {
      name: 'Madurai APMC',
      location: 'Madurai, Tamil Nadu',
      agents: 18,
      lots: 14,
      commodities: 'Onion, Tomato',
      status: 'Active',
      statusColor: 'bg-emerald-100 text-emerald-800',
      isActiveButton: true,
    },
    {
      name: 'Trichy APMC',
      location: 'Trichy, Tamil Nadu',
      agents: 9,
      lots: 5,
      commodities: 'Paddy, Wheat',
      status: 'Active',
      statusColor: 'bg-emerald-100 text-emerald-800',
      isActiveButton: true,
    },
    {
      name: 'Coimbatore APMC',
      location: 'Coimbatore, Tamil Nadu',
      agents: 21,
      lots: 0,
      commodities: 'Cotton, Coconut',
      status: 'Weekend',
      statusColor: 'bg-amber-100 text-amber-800',
      isActiveButton: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-400 font-medium">
        Home &rsaquo; <span className="text-slate-500 font-semibold">Markets</span>
      </div>

      {/* Screen Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Market Discovery</h1>
        <p className="text-xs text-slate-500 mt-1">
          Browse APMC markets across India. Find agents and live auctions.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <input
            type="text"
            placeholder="Search markets..."
            defaultValue=""
            className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-800 outline-hidden transition-all duration-200 focus:border-[#1b4d4f] focus:ring-1 focus:ring-[#1b4d4f]"
          />
        </div>
        <div className="w-full md:w-48">
          <select className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-800 outline-hidden transition-all duration-200 focus:border-[#1b4d4f] focus:ring-1 focus:ring-[#1b4d4f]">
            <option>Tamil Nadu</option>
            <option>Karnataka</option>
            <option>Maharashtra</option>
          </select>
        </div>
        <div className="w-full md:w-48">
          <select className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-800 outline-hidden transition-all duration-200 focus:border-[#1b4d4f] focus:ring-1 focus:ring-[#1b4d4f]">
            <option>Thoothukudi</option>
            <option>Chennai</option>
            <option>Coimbatore</option>
          </select>
        </div>
        <div className="w-full md:w-48">
          <select className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-800 outline-hidden transition-all duration-200 focus:border-[#1b4d4f] focus:ring-1 focus:ring-[#1b4d4f]">
            <option>All Commodities</option>
            <option>Paddy</option>
            <option>Onion</option>
          </select>
        </div>
        <Button variant="primary" className="w-full md:w-auto shrink-0 flex items-center justify-center gap-1.5 py-2">
          <span>🔍</span> Search
        </Button>
      </div>

      <div className="text-xs text-slate-400 font-medium">
        Showing 142 markets in Tamil Nadu
      </div>

      {/* Main discovery area */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Map Placeholder Box */}
        <div className="w-full lg:w-80 bg-emerald-50/50 border border-emerald-100/70 rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-6 shrink-0">
          <div className="text-4xl">🗺️</div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#1b4d4f]">India Market Map</h3>
            <p className="text-xs text-slate-400">Click on a state to filter markets by region</p>
          </div>
          <div className="w-full grid grid-cols-2 gap-2 text-[10px] font-bold">
            <button className="bg-white border border-slate-200 rounded px-2 py-1.5 text-slate-700 hover:bg-[#e2f2f1] hover:text-[#1b4d4f] transition">
              Tamil Nadu (142)
            </button>
            <button className="bg-white border border-slate-200 rounded px-2 py-1.5 text-slate-700 hover:bg-[#e2f2f1] hover:text-[#1b4d4f] transition">
              Maharashtra (287)
            </button>
            <button className="bg-white border border-slate-200 rounded px-2 py-1.5 text-slate-700 hover:bg-[#e2f2f1] hover:text-[#1b4d4f] transition">
              AP (196)
            </button>
            <button className="bg-white border border-slate-200 rounded px-2 py-1.5 text-slate-700 hover:bg-[#e2f2f1] hover:text-[#1b4d4f] transition">
              Karnataka (165)
            </button>
            <button className="bg-white border border-slate-200 rounded px-2 py-1.5 text-slate-700 hover:bg-[#e2f2f1] hover:text-[#1b4d4f] transition col-span-2">
              UP (310)
            </button>
          </div>
        </div>

        {/* Right Cards list */}
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {markets.map((market, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{market.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">📍 {market.location}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${market.statusColor}`}>
                      {market.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-1 text-[11px] font-medium text-slate-600 border-t border-b border-slate-50">
                    <div>
                      <span className="text-slate-400">👤</span> {market.agents} Agents
                    </div>
                    <div>
                      <span className="text-slate-400">📦</span> {market.lots} Active Lots
                    </div>
                    <div className="col-span-1 text-slate-500 font-semibold">
                      🌾 {market.commodities}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onBrowseAgents(market.name)}
                  className={`w-full text-center py-2 rounded-md text-xs font-bold transition-all duration-200
                    ${market.isActiveButton
                      ? 'bg-[#1b4d4f] hover:bg-[#13383a] text-white'
                      : 'bg-white hover:bg-slate-50 text-[#1b4d4f] border border-[#1b4d4f]'
                    }`}
                >
                  Browse Agents
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-end gap-1 text-xs font-bold">
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
