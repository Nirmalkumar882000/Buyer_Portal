import React, { useState } from 'react';
import { BackButton } from '../components/BackButton';

interface LiveAuctionsPageProps {
  onJoinAuction: (lotNumber: string) => void;
  onBackToDashboard: () => void;
}

export const LiveAuctionsPage: React.FC<LiveAuctionsPageProps> = ({ onJoinAuction, onBackToDashboard }) => {
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'completed'>('live');

  const auctions = [
    {
      lot: '#A-2295',
      produce: 'Paddy (Grade A)',
      agent: 'Murugan Kandasamy',
      quantity: '5 MT',
      minBid: '₹17,800/q',
      currentBid: '₹19,200/q',
      bidders: 7,
      isLive: true,
      timeText: '18:42 left',
      borderColor: 'border-red-500',
      bannerBg: 'bg-red-500',
    },
    {
      lot: '#A-2290',
      produce: 'Groundnut (Bold)',
      agent: 'Pandiyan Kumar',
      quantity: '2 MT',
      minBid: '₹50,000/MT',
      currentBid: '₹52,400/MT',
      bidders: 12,
      isLive: true,
      timeText: '05:11 left',
      borderColor: 'border-red-500',
      bannerBg: 'bg-red-500',
    },
    {
      lot: '#A-2296',
      produce: 'Onion (Large)',
      agent: 'Arjunan Nair',
      quantity: '3 MT',
      minBid: '₹19,000/MT',
      currentBid: 'N/A',
      bidders: 4,
      isLive: false,
      timeText: 'Starts in 1h 20m',
      borderColor: 'border-amber-400',
      bannerBg: 'bg-amber-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button + Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-4">
          <BackButton onClick={onBackToDashboard} label="Dashboard" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Live & Upcoming Auctions</h1>
            <p className="text-xs text-slate-500 mt-0.5">From your approved agents — 11 auctions available</p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="bg-white border border-amber-450 hover:bg-amber-50 text-amber-600 text-xs font-bold px-4 py-2.5 rounded-md transition shadow-xs">
            ⚠️ Set Alert
          </button>
          <button className="bg-[#1b4d4f] hover:bg-[#123637] text-white text-xs font-bold px-4 py-2.5 rounded-md transition shadow-xs">
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <input
            type="text"
            placeholder="Search by produce, agent..."
            className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-800 outline-hidden transition focus:border-[#1b4d4f]"
          />
        </div>
        <div>
          <select className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-800 outline-hidden transition focus:border-[#1b4d4f]">
            <option>Murugan Kandasamy</option>
            <option>Pandiyan Kumar</option>
          </select>
        </div>
        <div>
          <select className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-800 outline-hidden transition focus:border-[#1b4d4f]">
            <option>Paddy</option>
            <option>Onion</option>
          </select>
        </div>
        <div>
          <select className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-800 outline-hidden transition focus:border-[#1b4d4f]">
            <option>🔴 Live</option>
            <option>Upcoming</option>
          </select>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex border-b border-slate-200 text-xs font-semibold text-slate-400 gap-6">
        <button
          onClick={() => setActiveTab('live')}
          className={`py-2 px-1 border-b-2 transition-all duration-150 ${activeTab === 'live' ? 'border-[#1b4d4f] text-[#1b4d4f]' : 'border-transparent hover:text-slate-600'}`}
        >
          🔴 Live (4)
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`py-2 px-1 border-b-2 transition-all duration-150 ${activeTab === 'upcoming' ? 'border-[#1b4d4f] text-[#1b4d4f]' : 'border-transparent hover:text-slate-600'}`}
        >
          🟡 Upcoming (7)
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`py-2 px-1 border-b-2 transition-all duration-150 ${activeTab === 'completed' ? 'border-[#1b4d4f] text-[#1b4d4f]' : 'border-transparent hover:text-slate-600'}`}
        >
          🟢 Completed Today
        </button>
      </div>

      {/* Auction Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auctions.map((auc, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-lg overflow-hidden border-2 shadow-sm ${auc.borderColor} flex flex-col justify-between`}
          >
            {/* Top Banner */}
            <div className={`text-white px-4 py-2 text-[10px] font-bold flex justify-between items-center ${auc.bannerBg}`}>
              <span>{auc.isLive ? '🔴 LIVE NOW' : '🟡 UPCOMING'}</span>
              <span>⏳ {auc.timeText}</span>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800">{auc.produce}</h3>
                <p className="text-[10px] text-slate-400">Agent: {auc.agent} &bull; Lot {auc.lot}</p>
              </div>

              {auc.isLive ? (
                <div className="grid grid-cols-2 gap-y-4 text-xs font-semibold py-2">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 uppercase">Quantity</span>
                    <p className="text-slate-700">{auc.quantity}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 uppercase">Min Bid</span>
                    <p className="text-slate-700">{auc.minBid}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 uppercase">Current Bid</span>
                    <p className="text-emerald-600 text-sm font-bold">{auc.currentBid}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 uppercase">Bidders</span>
                    <p className="text-slate-700">{auc.bidders}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-y-4 text-xs font-semibold py-2">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 uppercase">Quantity</span>
                    <p className="text-slate-700">{auc.quantity}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 uppercase">Base Price</span>
                    <p className="text-slate-700">{auc.minBid}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 uppercase">Status</span>
                    <p className="text-[#1b4d4f] font-bold">Scheduled</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 uppercase">Registered</span>
                    <p className="text-slate-700">{auc.bidders}</p>
                  </div>
                </div>
              )}

              {/* Action Button */}
              {auc.isLive ? (
                <button
                  onClick={() => onJoinAuction(auc.lot)}
                  className="w-full bg-[#1b4d4f] hover:bg-[#123637] text-white text-xs font-bold py-2.5 rounded-md transition shadow-xs text-center"
                >
                  Join Auction →
                </button>
              ) : (
                <button className="w-full bg-white hover:bg-slate-50 text-[#1b4d4f] border border-[#1b4d4f] text-xs font-bold py-2.5 rounded-md transition text-center">
                  Set Reminder
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
