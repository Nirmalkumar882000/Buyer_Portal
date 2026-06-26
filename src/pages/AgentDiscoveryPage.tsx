import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getDistrictAgents } from '../api/markets';
import { AgriLoader } from '../components/AgriLoader';
import { BackButton } from '../components/BackButton';

interface AgentDiscoveryPageProps {
  onBackToMarkets: () => void;
  onViewAuctions: () => void;
  onViewProfile: (id: any) => void;
  marketName?: string;
}

export const AgentDiscoveryPage: React.FC<AgentDiscoveryPageProps> = ({
  onBackToMarkets,
  onViewAuctions,
  onViewProfile,
  marketName: propMarketName
}) => {
  const [searchParams] = useSearchParams();
  const marketName = propMarketName || searchParams.get('district') || 'Thoothukudi';
  const [searchInput, setSearchInput] = useState('');
  const [searchString, setSearchString] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

  const { data: response, isLoading } = useQuery({
    queryKey: ['districtAgents', marketName, searchString, selectedProduct],
    queryFn: () => getDistrictAgents(marketName, searchString, selectedProduct),
    enabled: !!marketName
  });

  const agents = Array.isArray(response) ? response : (response?.data || []);

  const availableCommodities = Array.isArray(response?.all_commodities)
    ? response.all_commodities
    : (Array.from(new Set(agents.flatMap((agent: any) => agent.specialties || []))) as string[]).map((comm) => ({
        id: comm,
        name: comm
      }));

  const handleSearch = () => {
    setSearchString(searchInput);
  };


  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="text-xs text-slate-400 font-medium">
        <button onClick={onBackToMarkets} className="hover:text-slate-600 underline">Markets</button>
        <span className="mx-1.5">&rsaquo;</span>
        <span className="text-slate-400">{marketName}</span>
        <span className="mx-1.5">&rsaquo;</span>
        <span className="text-slate-500 font-semibold">Agents</span>
      </div>

      {/* Page Title */}
      <div className="flex items-center gap-3">
        <BackButton onClick={onBackToMarkets} label="Markets" />
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mandi Agents — {marketName}</h1>
          <p className="text-xs text-slate-550 mt-1">
            {isLoading ? 'Loading agents...' : `${agents.length} registered agents at this market. Register with an agent to access live auctions.`}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
          <input
            type="text"
            placeholder="Search agents..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-800 outline-hidden transition-all duration-200 focus:border-[#1b4d4f] focus:ring-1 focus:ring-[#1b4d4f]"
          />
        </div>
        <div className="w-full md:w-48">
          <select 
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-800 outline-hidden transition-all duration-200 focus:border-[#1b4d4f] focus:ring-1 focus:ring-[#1b4d4f]"
          >
            <option value="">All Commodities</option>
            {availableCommodities.map((comm: any) => (
              <option key={comm.id} value={comm.id}>{comm.name}</option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-48">
          <select className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-800 outline-hidden transition-all duration-200 focus:border-[#1b4d4f] focus:ring-1 focus:ring-[#1b4d4f]">
            <option>Sort: Rating &darr;</option>
            <option>Sort: Popularity</option>
          </select>
        </div>
        {(selectedProduct || searchString || searchInput) && (
          <button
            onClick={() => {
              setSelectedProduct('');
              setSearchInput('');
              setSearchString('');
            }}
            className="text-xs text-red-600 hover:text-red-750 font-bold transition whitespace-nowrap px-2 py-2"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Agent grid cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-4">
            <AgriLoader message="Loading agents..." />
          </div>
        ) : agents.length === 0 ? (
          <div className="col-span-full py-10 text-center text-slate-500 font-medium">No agents found.</div>
        ) : (
          agents.map((agent: any, idx: number) => {
          const ratingStars = '★'.repeat(Math.round(parseFloat(agent.rating))) + '☆'.repeat(5 - Math.round(parseFloat(agent.rating)));

          return (
            <div
              key={idx}
              className={`bg-white rounded-xl p-6 flex flex-col items-center justify-between text-center gap-5 relative transition shadow-xs border
                ${agent.isRegistered 
                  ? 'border-[#1b4d4f] ring-1 ring-[#1b4d4f]' 
                  : 'border-slate-200'
                }`}
            >
              {/* Photo placeholder circle */}
              <div className="relative">
                <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-xl font-bold ${agent.avatarColor}`}>
                  {agent.initials}
                </div>
                {agent.isRegistered && (
                  <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 text-white border-2 border-white flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="space-y-3 w-full">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{agent.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{agent.market}</p>
                </div>

                {/* Rating */}
                <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1 font-medium">
                  <span className="text-amber-400 text-xs">{ratingStars}</span>
                  <span>({agent.rating} &bull; {agent.reviews} reviews)</span>
                </div>

                {/* Specialties tags */}
                <div className="flex justify-center gap-1.5 flex-wrap">
                  {agent.specialties.map((tag, sIdx) => (
                    <span key={sIdx} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-sm font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Details Strip */}
                <div className="bg-slate-50 border border-slate-100 rounded-md py-2 px-3 text-[10px] text-slate-600 flex justify-center gap-3 font-semibold">
                  <span>⚖️ {agent.activeAuctions} active auctions</span>
                  <span className="text-slate-300">|</span>
                  <span>📦 {agent.lotsPerMonth} lots/month</span>
                </div>
              </div>

              {/* Action trigger keys */}
              <div className="w-full">
                {agent.isRegistered ? (
                  <div className="space-y-3">
                    <div className="text-[10px] text-emerald-600 font-bold">✓ Registered & Approved</div>
                    <button
                      onClick={onViewAuctions}
                      className="w-full bg-[#1b4d4f] hover:bg-[#123637] text-white text-xs font-bold py-2.5 rounded-md transition shadow-xs"
                    >
                      View Auctions
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => onViewProfile(agent.id)}
                      className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-350 text-xs font-bold py-2 rounded-md transition"
                    >
                      View Profile
                    </button>
                    <button 
                      onClick={() => onViewProfile(agent.id)}
                      className="w-full bg-[#1b4d4f] hover:bg-[#123637] text-white text-xs font-bold py-2 rounded-md transition shadow-xs"
                    >
                      Register
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        }))}
      </div>
    </div>
  );
};
