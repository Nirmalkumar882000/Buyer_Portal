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
  const [selectedLot, setSelectedLot] = useState<any | null>(null);

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
        const categoryName = variety.fields?.find((f: any) => f.field === 'category')?.value || '';
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
            categoryName,
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

  const formatDateTimeWithSeconds = (dateTimeStr: string | null | undefined) => {
    if (!dateTimeStr) return '—';
    try {
      const date = new Date(dateTimeStr);
      if (isNaN(date.getTime())) return dateTimeStr;
      const day = String(date.getDate()).padStart(2, "0");
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      let hours = date.getHours();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      const displayHours = String(hours).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${day}-${month}-${year} ${displayHours}:${minutes}:${seconds} ${ampm}`;
    } catch {
      return dateTimeStr || '—';
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button + Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-4">
          <BackButton onClick={onBackToDashboard} label="Back" />
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

                {/* Lot Image */}
                {auc.imageUrl && (
                  <img
                    src={auc.imageUrl.startsWith('http') ? auc.imageUrl : `http://localhost:6200/uploads/${auc.imageUrl}`}
                    alt={auc.productName}
                    className="w-full h-36 object-cover border-b border-slate-100"
                  />
                )}

                {/* Content */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full">
                      {auc.categoryName || 'Fruits'}
                    </span>
                    <h3 className="text-base font-bold text-slate-800 mt-1">
                      {auc.productName} ({auc.varietyName || 'Unknown Variety'})
                    </h3>
                    <p className="text-[10px] text-slate-400">Agent: {auc.agentName} &bull; Lot #{auc.lotId} &bull; Grade: <span className="font-bold text-slate-600">{auc.grade || 'Grade A'}</span></p>
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
                        <span className="text-[9px] text-slate-400 uppercase">Total Bids</span>
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
                        <span className="text-[9px] text-slate-400 uppercase">Total Bids</span>
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

                  {/* Start & End Times with Seconds */}
                  <div className="text-[10px] text-slate-500 space-y-1 bg-slate-50 p-2.5 rounded-md border border-slate-100">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-400">Start Time:</span>
                      <span className="font-bold text-slate-700">{formatDateTimeWithSeconds(auc.startDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-400">End Time:</span>
                      <span className="font-bold text-slate-700">{formatDateTimeWithSeconds(auc.endDate)}</span>
                    </div>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex gap-2">
                    {isLive ? (
                      <button
                        onClick={() => onJoinAuction(auc)}
                        className="flex-1 bg-[#1b4d4f] hover:bg-[#123637] text-white text-xs font-bold py-2.5 rounded-md transition shadow-xs text-center"
                      >
                        Join Auction →
                      </button>
                    ) : isUpcoming ? (
                      <button
                        onClick={() => handleSetReminder(auc.lotId)}
                        disabled={reminders[auc.lotId]}
                        className={`flex-1 text-xs font-bold py-2.5 rounded-md transition text-center border ${reminders[auc.lotId]
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 cursor-not-allowed'
                            : 'bg-white hover:bg-slate-50 text-[#1b4d4f] border-[#1b4d4f]'
                          }`}
                      >
                        {reminders[auc.lotId] ? '✓ Reminder Set' : 'Set Reminder'}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex-1 bg-slate-100 text-slate-400 border border-slate-200 text-xs font-bold py-2.5 rounded-md text-center cursor-not-allowed"
                      >
                        Auction Ended
                      </button>
                    )}
                    {/* View Details Button */}
                    <button
                      onClick={() => setSelectedLot({ ...auc, isLive, isUpcoming, isCompleted })}
                      className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 text-xs font-bold rounded-md border border-slate-200 transition flex items-center gap-1"
                      title="View Details"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full-Screen Detail Modal */}
      {selectedLot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedLot(null); }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className={`flex items-center justify-between px-4 py-2 text-white rounded-t-xl ${
              selectedLot.isLive ? 'bg-red-500' : selectedLot.isUpcoming ? 'bg-amber-500' : 'bg-emerald-500'
            }`}>
              <span className="text-xs font-bold">
                {selectedLot.isLive ? '🔴 LIVE NOW' : selectedLot.isUpcoming ? '🟡 UPCOMING' : '🟢 COMPLETED'} — Lot #{selectedLot.lotId}
              </span>
              <button
                onClick={() => setSelectedLot(null)}
                className="hover:bg-white/20 rounded-full p-0.5 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Lot Image */}
            {selectedLot.imageUrl ? (
              <img
                src={selectedLot.imageUrl.startsWith('http') ? selectedLot.imageUrl : `http://localhost:6200/uploads/${selectedLot.imageUrl}`}
                alt={selectedLot.productName}
                className="w-full h-40 object-cover"
              />
            ) : (
              <div className="w-full h-20 bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                No Image Available
              </div>
            )}

            {/* Modal Body */}
            <div className="p-4 space-y-3">
              {/* Product Info */}
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full">
                  {selectedLot.categoryName || 'Fruits'}
                </span>
                <h2 className="text-sm font-bold text-slate-800 mt-1.5">
                  {selectedLot.productName} ({selectedLot.varietyName || 'Unknown Variety'})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Agent: <span className="font-semibold text-slate-700">{selectedLot.agentName}</span> &bull; Grade: <span className="font-semibold text-slate-700">{selectedLot.grade || 'Grade A'}</span></p>
              </div>

              {/* Details Grid — 3 columns */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                  <p className="text-[8px] uppercase text-slate-400 font-bold tracking-wide mb-0.5">Quantity</p>
                  <p className="text-xs font-bold text-slate-800">{selectedLot.qty} {selectedLot.unit}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                  <p className="text-[8px] uppercase text-slate-400 font-bold tracking-wide mb-0.5">Base Price</p>
                  <p className="text-xs font-bold text-slate-800">₹{Number(selectedLot.basePrice).toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                  <p className="text-[8px] uppercase text-slate-400 font-bold tracking-wide mb-0.5">Highest Bid</p>
                  <p className="text-xs font-bold text-emerald-600">
                    {selectedLot.highestBid > 0 ? `₹${Number(selectedLot.highestBid).toLocaleString()}` : 'N/A'}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                  <p className="text-[8px] uppercase text-slate-400 font-bold tracking-wide mb-0.5">Total Bids</p>
                  <p className="text-xs font-bold text-slate-800">{selectedLot.totalBids}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2 border border-slate-100 col-span-2">
                  <p className="text-[8px] uppercase text-slate-400 font-bold tracking-wide mb-0.5">Lot Status</p>
                  <p className="text-xs font-bold text-slate-800 uppercase">{selectedLot.lotStatus || '—'}</p>
                </div>
              </div>

              {/* Times */}
              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400 font-semibold">Start</span>
                  <span className="font-bold text-slate-700">{formatDateTimeWithSeconds(selectedLot.startDate)}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400 font-semibold">End</span>
                  <span className="font-bold text-slate-700">{formatDateTimeWithSeconds(selectedLot.endDate)}</span>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex gap-2">
                {selectedLot.isLive ? (
                  <button
                    onClick={() => { onJoinAuction(selectedLot); setSelectedLot(null); }}
                    className="flex-1 bg-[#1b4d4f] hover:bg-[#123637] text-white text-xs font-bold py-2 rounded-lg transition shadow"
                  >
                    Join Auction →
                  </button>
                ) : selectedLot.isUpcoming ? (
                  <button
                    onClick={() => { handleSetReminder(selectedLot.lotId); setSelectedLot(null); }}
                    disabled={reminders[selectedLot.lotId]}
                    className={`flex-1 text-xs font-bold py-2 rounded-lg transition text-center border ${
                      reminders[selectedLot.lotId]
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 cursor-not-allowed'
                        : 'bg-white hover:bg-slate-50 text-[#1b4d4f] border-[#1b4d4f]'
                    }`}
                  >
                    {reminders[selectedLot.lotId] ? '✓ Reminder Set' : 'Set Reminder'}
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex-1 bg-slate-100 text-slate-400 border border-slate-200 text-xs font-bold py-2 rounded-lg text-center cursor-not-allowed"
                  >
                    Auction Ended
                  </button>
                )}
                <button
                  onClick={() => setSelectedLot(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
