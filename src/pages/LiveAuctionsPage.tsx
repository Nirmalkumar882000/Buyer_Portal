import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BackButton } from '../components/BackButton';
import { getBuyerAgentProducts, setBuyerReminder } from '../api/markets';
import { useToast } from '../context/ToastContext';
import { AgriLoader } from '../components/AgriLoader';

interface LiveAuctionsPageProps {
  onJoinAuction: (auction: any) => void;
  onBackToDashboard: () => void;
}

export const LiveAuctionsPage: React.FC<LiveAuctionsPageProps> = ({ onJoinAuction, onBackToDashboard }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'completed'>('live');
  const [searchInput, setSearchInput] = useState('');
  const [searchString, setSearchString] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [reminders, setReminders] = useState<Record<string | number, boolean>>({});

  const apiStatus = activeTab === 'live' ? 'LIVE' : activeTab === 'upcoming' ? 'UPCOMING' : 'COMPLETED';

  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ['buyerAuctions', apiStatus, searchString, selectedAgent, selectedProduct],
    queryFn: () => getBuyerAgentProducts({
      status: apiStatus,
      sales_type: 'AUCTION',
      searchString: searchString || undefined,
      agentname: selectedAgent || undefined,
      productname: selectedProduct || undefined
    })
  });

  const rawAuctionAgents = response?.data?.AUCTION || [];
  const totalRecords = response?.pagination?.totalRecords || 0;

  // Flatten nested structure to individual lots
  const auctionsList: any[] = [];
  for (const agent of rawAuctionAgents) {
    const agentName = agent.agent_details?.find((d: any) => d.field === 'agent_name')?.value || 'Unknown Agent';
    for (const prod of agent.products || []) {
      const productName = prod.product;
      for (const variety of prod.varieties || []) {
        const varietyName = variety.fields?.find((f: any) => f.field === 'variety')?.value || '';
        for (const lot of variety.lots || []) {
          const lotId = lot.find((f: any) => f.field === 'lot_id')?.value;
          const basePrice = lot.find((f: any) => f.field === 'lot_base_price')?.value || 0;
          const startDate = lot.find((f: any) => f.field === 'lot_auction_start_date')?.value;
          const endDate = lot.find((f: any) => f.field === 'lot_auction_end_date')?.value;
          const qty = lot.find((f: any) => f.field === 'lot_qty')?.value || 0;
          const unit = lot.find((f: any) => f.field === 'lot_unit')?.value || '';
          const highestBid = lot.find((f: any) => f.field === 'lot_highest_bid')?.value || 0;
          const totalBids = lot.find((f: any) => f.field === 'total_bids')?.value || 0;
          const lotStatus = lot.find((f: any) => f.field === 'lot_status')?.value || '';
          const grade = lot.find((f: any) => f.field === 'lot_grade')?.value || '';
          const imageUrl = lot.find((f: any) => f.field === 'lot_image_url')?.value || '';

          auctionsList.push({
            lotId,
            agentName,
            productName,
            varietyName,
            basePrice,
            startDate,
            endDate,
            qty,
            unit,
            highestBid,
            totalBids,
            lotStatus,
            grade,
            imageUrl
          });
        }
      }
    }
  }

  // Populate drop-down filter options dynamically from result set
  const uniqueAgents = Array.from(new Set(rawAuctionAgents.map((a: any) => a.agent_details?.find((d: any) => d.field === 'agent_name')?.value).filter(Boolean))) as string[];
  const uniqueProducts = Array.from(new Set(rawAuctionAgents.flatMap((a: any) => (a.products || []).map((p: any) => p.product)).filter(Boolean))) as string[];

  const handleSearch = () => {
    setSearchString(searchInput);
  };

  const handleSetReminder = async (lotId: string | number) => {
    try {
      await setBuyerReminder(lotId);
      setReminders(prev => ({ ...prev, [lotId]: true }));
      showToast('Reminder set successfully! We will notify you 5 minutes before the auction starts.', 'success');
    } catch (error: any) {
      console.error(error);
      showToast(error.response?.data?.message || 'Failed to set reminder.', 'error');
    }
  };

  const getTimeRemaining = (endTimeStr: string) => {
    if (!endTimeStr) return '';
    const diff = new Date(endTimeStr).getTime() - new Date().getTime();
    if (diff <= 0) return 'Ended';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${mins}m left`;
    return `${mins}m left`;
  };

  const getTimeUntilStart = (startTimeStr: string) => {
    if (!startTimeStr) return '';
    const diff = new Date(startTimeStr).getTime() - new Date().getTime();
    if (diff <= 0) return 'Starting now';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Back Button + Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-4">
          <BackButton onClick={onBackToDashboard} label="Dashboard" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Live & Upcoming Auctions</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {isLoading ? 'Loading auctions...' : `From your approved agents — ${totalRecords} auctions available`}
            </p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => refetch()}
            className="bg-[#1b4d4f] hover:bg-[#123637] text-white text-xs font-bold px-4 py-2.5 rounded-md transition shadow-xs"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
        <div>
          <input
            type="text"
            placeholder="Search by produce, agent..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-800 outline-hidden transition focus:border-[#1b4d4f]"
          />
        </div>
        <div>
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-800 outline-hidden transition focus:border-[#1b4d4f]"
          >
            <option value="">All Agents</option>
            {uniqueAgents.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
        <div>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-800 outline-hidden transition focus:border-[#1b4d4f]"
          >
            <option value="">All Products</option>
            {uniqueProducts.map(prod => (
              <option key={prod} value={prod}>{prod}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 items-center">
          {(selectedAgent || selectedProduct || searchString || searchInput) && (
            <button
              onClick={() => {
                setSelectedAgent('');
                setSelectedProduct('');
                setSearchInput('');
                setSearchString('');
              }}
              className="text-xs text-red-650 hover:text-red-750 font-bold transition whitespace-nowrap px-2 py-2"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex border-b border-slate-200 text-xs font-semibold text-slate-400 gap-6">
        <button
          onClick={() => setActiveTab('live')}
          className={`py-2 px-1 border-b-2 transition-all duration-150 ${activeTab === 'live' ? 'border-[#1b4d4f] text-[#1b4d4f]' : 'border-transparent hover:text-slate-600'}`}
        >
          🔴 Live {activeTab === 'live' && `(${totalRecords})`}
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`py-2 px-1 border-b-2 transition-all duration-150 ${activeTab === 'upcoming' ? 'border-[#1b4d4f] text-[#1b4d4f]' : 'border-transparent hover:text-slate-600'}`}
        >
          🟡 Upcoming {activeTab === 'upcoming' && `(${totalRecords})`}
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`py-2 px-1 border-b-2 transition-all duration-150 ${activeTab === 'completed' ? 'border-[#1b4d4f] text-[#1b4d4f]' : 'border-transparent hover:text-slate-600'}`}
        >
          🟢 Completed Today {activeTab === 'completed' && `(${totalRecords})`}
        </button>
      </div>

      {/* Auction Cards Grid */}
      {isLoading ? (
        <AgriLoader message="Loading auctions..." />
      ) : auctionsList.length === 0 ? (
        <div className="py-12 text-center text-slate-500 font-medium">
          No auctions found for this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctionsList.map((auc, idx) => {
            const isLive = activeTab === 'live';
            const isUpcoming = activeTab === 'upcoming';
            const isCompleted = activeTab === 'completed';

            const borderColor = isLive ? 'border-red-500' : isUpcoming ? 'border-amber-400' : 'border-emerald-500';
            const bannerBg = isLive ? 'bg-red-500' : isUpcoming ? 'bg-amber-500' : 'bg-emerald-500';
            const statusLabel = isLive ? '🔴 LIVE NOW' : isUpcoming ? '🟡 UPCOMING' : '🟢 COMPLETED';

            const timeText = isLive
              ? getTimeRemaining(auc.endDate)
              : isUpcoming
                ? `Starts in ${getTimeUntilStart(auc.startDate)}`
                : 'Finished';

            return (
              <div
                key={idx}
                className={`bg-white rounded-lg overflow-hidden border-2 shadow-sm ${borderColor} flex flex-col justify-between`}
              >
                {/* Top Banner */}
                <div className={`text-white px-4 py-2 text-[10px] font-bold flex justify-between items-center ${bannerBg}`}>
                  <span>{statusLabel}</span>
                  <span>⏳ {timeText}</span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-800">{auc.productName} ({auc.grade || 'Grade A'})</h3>
                    <p className="text-[10px] text-slate-400">Agent: {auc.agentName} &bull; Lot #{auc.lotId}</p>
                  </div>

                  {isLive ? (
                    <div className="grid grid-cols-2 gap-y-4 text-xs font-semibold py-2">
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-slate-400 uppercase">Quantity</span>
                        <p className="text-slate-700">{auc.qty} {auc.unit}</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-slate-400 uppercase">Min Bid</span>
                        <p className="text-slate-700">₹{Number(auc.basePrice).toLocaleString()}/{auc.unit}</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-slate-400 uppercase">Current Bid</span>
                        <p className="text-emerald-600 text-sm font-bold">
                          {auc.highestBid > 0 ? `₹${Number(auc.highestBid).toLocaleString()}/${auc.unit}` : 'N/A'}
                        </p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-slate-400 uppercase">Bidders</span>
                        <p className="text-slate-700">{auc.totalBids}</p>
                      </div>
                    </div>
                  ) : isUpcoming ? (
                    <div className="grid grid-cols-2 gap-y-4 text-xs font-semibold py-2">
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-slate-400 uppercase">Quantity</span>
                        <p className="text-slate-700">{auc.qty} {auc.unit}</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-slate-400 uppercase">Base Price</span>
                        <p className="text-slate-700">₹{Number(auc.basePrice).toLocaleString()}/{auc.unit}</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-slate-400 uppercase">Status</span>
                        <p className="text-[#1b4d4f] font-bold">Scheduled</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-slate-400 uppercase">Registered</span>
                        <p className="text-slate-700">{auc.totalBids}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-y-4 text-xs font-semibold py-2">
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-slate-400 uppercase">Quantity</span>
                        <p className="text-slate-700">{auc.qty} {auc.unit}</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-slate-400 uppercase">Sold Price</span>
                        <p className="text-emerald-700 font-bold">
                          ₹{Number(auc.highestBid || auc.basePrice).toLocaleString()}/{auc.unit}
                        </p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-slate-400 uppercase">Total Bids</span>
                        <p className="text-slate-700">{auc.totalBids}</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-slate-400 uppercase">Lot Status</span>
                        <p className="text-slate-700 font-bold uppercase">{auc.lotStatus}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  {isLive ? (
                    <button
                      onClick={() => onJoinAuction(String(auc.lotId))}
                      className="w-full bg-[#1b4d4f] hover:bg-[#123637] text-white text-xs font-bold py-2.5 rounded-md transition shadow-xs text-center"
                    >
                      Join Auction →
                    </button>
                  ) : isUpcoming ? (
                    <button
                      onClick={() => handleSetReminder(auc.lotId)}
                      disabled={reminders[auc.lotId]}
                      className={`w-full text-xs font-bold py-2.5 rounded-md transition text-center border ${reminders[auc.lotId]
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-250 cursor-not-allowed'
                          : 'bg-white hover:bg-slate-50 text-[#1b4d4f] border-[#1b4d4f]'
                        }`}
                    >
                      {reminders[auc.lotId] ? '✓ Reminder Set' : 'Set Reminder'}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-slate-100 text-slate-400 border border-slate-200 text-xs font-bold py-2.5 rounded-md text-center cursor-not-allowed"
                    >
                      Auction Ended
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
