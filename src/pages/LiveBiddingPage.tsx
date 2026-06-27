import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useLiveRoom } from '../features/realtime/useLiveRoom';
import { socketService } from '../features/realtime/socket';
import { placeBuyerBid, getBidsList } from '../api/markets';

interface LiveBiddingPageProps {
  auction?: any; // The selected auction lot passed from route state
  onBackToAuctions: () => void;
  onPlaceBidSuccess: () => void;
}

export const LiveBiddingPage: React.FC<LiveBiddingPageProps> = ({
  auction,
  onBackToAuctions,
  onPlaceBidSuccess
}) => {
  const { showToast } = useToast();
  const { user } = useAuth();

  // ── Buyer identity ─────────────────────────────────────────────────────────
  const rawBuyerUser = localStorage.getItem('buyer_user');
  const buyerUser = useMemo(() => {
    try { return rawBuyerUser ? JSON.parse(rawBuyerUser) : null; } catch { return null; }
  }, [rawBuyerUser]);

  const buyerId = buyerUser?.id || 1;
  const buyerName = user?.fullName || buyerUser?.username || 'Portal Buyer';
  const buyerMobile = user?.mobile || buyerUser?.mobile_number || '';

  // ── Socket / live room ─────────────────────────────────────────────────────
  const roomId = auction?.lotId ? String(auction.lotId) : undefined;
  const currentUserId = String(buyerUser?.id ?? 'web');
  const { latest, feed: socketFeed } = useLiveRoom(roomId, currentUserId);

  // ── Component state ─────────────────────────────────────────────────────────
  const [apiHistory, setApiHistory] = useState<any[]>([]);
  const [loadingBids, setLoadingBids] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Wallet state (hardcoded until wallet API is available)
  const [walletAvailable] = useState<number | null>(18000);
  const [walletOnHold] = useState<number>(0);

  // ── Fetch bid history from /bidding/list ────────────────────────────────────
  const fetchBidsHistory = useCallback(async () => {
    if (!auction?.lotId) return;
    try {
      setLoadingBids(true);
      const bids = await getBidsList(auction.lotId);
      setApiHistory(Array.isArray(bids) ? bids : []);
    } catch (err) {
      console.error('Error fetching bids history', err);
    } finally {
      setLoadingBids(false);
    }
  }, [auction?.lotId]);

  useEffect(() => {
    fetchBidsHistory();
    // Poll every 15 seconds for background updates
    const interval = setInterval(fetchBidsHistory, 15000);
    return () => clearInterval(interval);
  }, [fetchBidsHistory]);

  // ── Merged feed: API history + socket live bids ─────────────────────────────
  // Convert socket feed entries to same shape as API bids
  const socketBidsNormalized = useMemo(() =>
    socketFeed.map(s => ({
      buyer_name: s.username === buyerMobile ? buyerName : `Buyer ****${String(s.username).slice(-2)}`,
      buyer_mobile_number: s.username,
      bid_amount: s.value,
      bid_time: new Date(s.at).toISOString(),
      isSocket: true,
    }))
  , [socketFeed, buyerMobile, buyerName]);

  const mergedFeed = useMemo(() => {
    // Merge API + socket; remove duplicates by amount+mobile
    const combined = [...socketBidsNormalized, ...apiHistory];
    const seen = new Set<string>();
    return combined
      .filter(b => {
        const key = `${b.bid_amount}_${b.buyer_mobile_number}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => b.bid_amount - a.bid_amount);
  }, [socketBidsNormalized, apiHistory]);

  // ── Bid amount logic ─────────────────────────────────────────────────────────
  const basePrice = Number(auction?.basePrice || 0);
  const apiHighest = apiHistory.length > 0 ? Math.max(...apiHistory.map(b => Number(b.bid_amount))) : 0;
  const serverHighest = Math.max(basePrice, apiHighest, latest?.value ?? 0);
  const [yourBid, setYourBid] = useState(serverHighest + 100);

  // Bump bid suggestion when highest increases
  useEffect(() => {
    setYourBid(prev => Math.max(prev, serverHighest + 100));
  }, [serverHighest]);

  const handleIncrement = (amount: number) => setYourBid(prev => prev + amount);
  const handleDecrement = () => setYourBid(prev => Math.max(serverHighest + 100, prev - 100));

  // ── Place bid ────────────────────────────────────────────────────────────────
  const handlePlaceBid = async () => {
    if (yourBid <= serverHighest) {
      showToast(`Your bid must be higher than ₹${serverHighest.toLocaleString()}!`, 'error');
      return;
    }
    if (!auction?.lotId) return;

    try {
      setSubmitting(true);
      await placeBuyerBid({
        lot_id: Number(auction.lotId),
        buyer_id: Number(buyerId),
        buyer_name: buyerName,
        buyer_mobile_number: buyerMobile,
        bid_amount: yourBid,
      });

      // Broadcast via socket
      socketService.connect();
      socketService.sendMessage({
        room: String(auction.lotId),
        username: buyerMobile,
        message: String(yourBid),
      });

      // Immediately add to local API history
      setApiHistory(prev => [{
        buyer_name: buyerName,
        buyer_mobile_number: buyerMobile,
        bid_amount: yourBid,
        bid_time: new Date().toISOString(),
        isPortal: true,
      }, ...prev]);

      showToast(`Bid placed: ₹${yourBid.toLocaleString()}`, 'success');
      setYourBid(yourBid + 100);
    } catch (error: any) {
      console.error(error);
      showToast(error.response?.data?.message || 'Failed to place bid.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Countdown timer ──────────────────────────────────────────────────────────
  const [timeLeft, setTimeLeft] = useState('—');
  const [auctionEnded, setAuctionEnded] = useState(false);

  useEffect(() => {
    if (!auction?.endDate) return;
    const tick = () => {
      const diff = new Date(auction.endDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('Ended');
        setAuctionEnded(true);
      } else {
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setTimeLeft(h > 0
          ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
          : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
      }
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [auction?.endDate]);

  const isEnded = auctionEnded || timeLeft === 'Ended';

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const formatTime = (iso?: string) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Top bidder display
  const topBid = mergedFeed[0];
  const topBidderLabel = topBid
    ? (topBid.buyer_mobile_number === buyerMobile ? '🏆 You (Portal)' : `Buyer ****${String(topBid.buyer_mobile_number).slice(-2)}`)
    : 'No bids yet';

  return (
    <div className="space-y-5 font-sans">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
        <button onClick={onBackToAuctions} className="hover:text-[#1b4d4f] underline transition">
          ← Auctions
        </button>
        <span className="text-slate-300">/</span>
        <span className="text-slate-600 font-semibold">
          Lot #{auction?.lotId || '—'} — Live Bidding
        </span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            {auction?.productName || 'Product'}{auction?.varietyName ? ` — ${auction.varietyName}` : ''}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Agent: <span className="font-semibold text-slate-700">{auction?.agentName || '—'}</span>
            {auction?.categoryName && <> &bull; {auction.categoryName}</>}
          </p>
        </div>
        <div className="flex gap-2 items-center shrink-0 text-[10px] font-bold">
          <span className="bg-[#1b4d4f] text-white px-3 py-1.5 rounded-sm tracking-wide">BUYER PORTAL</span>
          {!isEnded ? (
            <span className="bg-red-500 text-white px-3 py-1.5 rounded-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
              LIVE
            </span>
          ) : (
            <span className="bg-slate-400 text-white px-3 py-1.5 rounded-sm">ENDED</span>
          )}
        </div>
      </div>

      {/* Main 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* ── LEFT: Product + Agent + Wallet ──────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-4">

          {/* Product Image */}
          {auction?.imageUrl && (
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
              <img
                src={auction.imageUrl.startsWith('http') ? auction.imageUrl : `http://localhost:6200/uploads/${auction.imageUrl}`}
                alt={auction.productName}
                className="w-full h-32 object-cover"
              />
            </div>
          )}

          {/* Lot Details */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">
              📦 Lot Details
            </h3>
            <div className="space-y-2 text-[11px] text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Lot #</span>
                <span className="font-bold text-slate-800">{auction?.lotId || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Agent</span>
                <span className="font-semibold text-slate-700 text-right max-w-[120px] truncate">{auction?.agentName || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Category</span>
                <span className="font-semibold">{auction?.categoryName || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Variety</span>
                <span className="font-semibold">{auction?.varietyName || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Quantity</span>
                <span className="font-semibold">{auction?.qty} {auction?.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Grade</span>
                <span className="font-semibold">{auction?.grade || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Base Price</span>
                <span className="font-bold text-[#1b4d4f]">₹{Number(auction?.basePrice).toLocaleString()}/{auction?.unit}</span>
              </div>
            </div>

            {/* Time info */}
            <div className="bg-slate-50 border border-slate-100 rounded-md p-2.5 space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Start</span>
                <span className="font-bold text-slate-700">{formatTime(auction?.startDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">End</span>
                <span className={`font-bold ${isEnded ? 'text-red-500' : 'text-slate-700'}`}>{formatTime(auction?.endDate)}</span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-2.5 rounded-md text-[10px] text-amber-700 leading-relaxed">
              <strong>△ Wallet Escrow:</strong> Your bid amount will be held in escrow and released immediately if you are outbid.
            </div>
          </div>

          {/* Wallet */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">💳 Your Wallet</h3>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Available Balance</span>
              <p className="text-2xl font-black text-slate-800 mt-0.5">
                {walletAvailable !== null ? `₹${walletAvailable.toLocaleString()}` : '—'}
              </p>
              {walletOnHold > 0 && (
                <p className="text-[10px] text-orange-500 font-semibold mt-1">
                  ₹{walletOnHold.toLocaleString()} on hold
                </p>
              )}
            </div>
            <button className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold py-2 rounded-md transition">
              + Top Up Wallet
            </button>
          </div>
        </div>

        {/* ── CENTRE: Bid Controls ─────────────────────────────────────────────── */}
        <div className="lg:col-span-5 space-y-4">

          {/* Current Highest Bid Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs text-center space-y-3">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider block">CURRENT HIGHEST BID</span>
            <div className="text-4xl font-black text-emerald-600 tracking-tight">
              ₹ {serverHighest.toLocaleString()}
              <span className="text-sm font-semibold text-slate-400">/{auction?.unit}</span>
            </div>
            <p className="text-[11px] text-slate-400">{topBidderLabel}</p>

            {/* Timer + Total bids */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <span className="text-[9px] font-bold text-slate-400 tracking-wide block">TIME LEFT</span>
                <div className={`text-2xl font-bold mt-1 ${isEnded ? 'text-slate-400' : 'text-red-500'}`}>
                  {timeLeft}
                </div>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 tracking-wide block">TOTAL BIDS</span>
                <div className="text-2xl font-bold text-slate-800 mt-1">
                  {loadingBids ? '…' : mergedFeed.length}
                </div>
              </div>
            </div>
          </div>

          {/* Bid Input Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
            {/* Your bid display */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 tracking-wide block mb-1.5">
                YOUR BID &nbsp;
                <span className="text-slate-500 font-normal">(min: ₹{(serverHighest + 100).toLocaleString()}/{auction?.unit})</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDecrement}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold w-9 h-9 rounded-md transition text-lg flex items-center justify-center"
                >−</button>
                <div className="flex-1 text-center text-2xl font-extrabold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg py-2">
                  ₹ {yourBid.toLocaleString()}
                </div>
                <button
                  onClick={() => handleIncrement(100)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold w-9 h-9 rounded-md transition text-lg flex items-center justify-center"
                >+</button>
              </div>
            </div>

            {/* Quick increment buttons */}
            <div className="grid grid-cols-3 gap-2">
              {[100, 500, 1000, 2000, 5000, 10000].map(amt => (
                <button
                  key={amt}
                  onClick={() => handleIncrement(amt)}
                  className="bg-teal-50 hover:bg-teal-100 text-[#1b4d4f] border border-teal-100 text-[10px] font-bold py-1.5 rounded-md transition"
                >
                  +₹{amt >= 1000 ? `${amt / 1000}K` : amt}
                </button>
              ))}
            </div>

            {/* Total if won */}
            <p className="text-[10px] text-slate-400 font-medium text-center">
              Total if won:{' '}
              <span className="text-slate-700 font-bold">
                ₹{(yourBid * Number(auction?.qty || 0)).toLocaleString()}
              </span>
              <span className="text-slate-400"> ({auction?.qty} {auction?.unit} × ₹{yourBid.toLocaleString()}/{auction?.unit})</span>
            </p>

            {/* Place bid button */}
            <button
              onClick={handlePlaceBid}
              disabled={submitting || isEnded}
              className="w-full bg-[#1b4d4f] hover:bg-[#123637] disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-bold py-3 rounded-lg shadow-sm transition flex items-center justify-center gap-2"
            >
              {isEnded
                ? '🔒 Auction Ended'
                : submitting
                  ? '⏳ Placing Bid…'
                  : `🔨 Place Bid — ₹${yourBid.toLocaleString()}/${auction?.unit}`}
            </button>

            {yourBid <= serverHighest && !isEnded && (
              <p className="text-[10px] text-red-500 font-semibold text-center">
                ⚠ Bid must exceed current highest bid of ₹{serverHighest.toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* ── RIGHT: Live Bid Feed ─────────────────────────────────────────────── */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-800">Live Bid Feed</h3>
            <div className="flex items-center gap-2">
              {loadingBids && (
                <span className="text-[9px] text-slate-400">Refreshing…</span>
              )}
              <button
                onClick={fetchBidsHistory}
                className="text-[9px] text-[#1b4d4f] hover:underline font-bold"
              >
                Refresh
              </button>
              <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-sm font-bold flex items-center gap-0.5">
                <span className="w-1 h-1 bg-red-500 rounded-full animate-ping" />
                LIVE
              </span>
            </div>
          </div>

          {/* Feed list */}
          <div className="divide-y divide-slate-50 max-h-96 overflow-y-auto">
            {mergedFeed.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                {loadingBids ? 'Loading bids…' : 'No bids yet. Be the first!'}
              </div>
            ) : (
              mergedFeed.map((entry, idx) => {
                const isMe = entry.buyer_mobile_number === buyerMobile;
                const isTop = idx === 0;
                return (
                  <div
                    key={idx}
                    className={`flex justify-between items-center px-4 py-2.5 text-xs transition ${
                      isMe ? 'bg-teal-50/50' : isTop ? 'bg-emerald-50/30' : ''
                    }`}
                  >
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isTop && <span className="text-[8px] text-amber-600 font-extrabold">🏆 TOP</span>}
                        <span className={`font-semibold truncate ${isMe ? 'text-[#1b4d4f]' : 'text-slate-700'}`}>
                          {isMe ? 'You (Portal)' : entry.buyer_name || `Buyer ****${String(entry.buyer_mobile_number).slice(-2)}`}
                        </span>
                        {entry.isSocket && (
                          <span className="bg-blue-100 text-blue-600 text-[7px] font-extrabold px-1 rounded-sm">LIVE</span>
                        )}
                        {entry.isPortal && (
                          <span className="bg-teal-100 text-teal-700 text-[7px] font-extrabold px-1 rounded-sm">Portal</span>
                        )}
                      </div>
                      <p className="text-[9px] text-slate-400">{formatTime(entry.bid_time)}</p>
                    </div>
                    <div className={`font-bold shrink-0 ml-2 ${isTop ? 'text-emerald-600' : 'text-slate-800'}`}>
                      ₹{Number(entry.bid_amount).toLocaleString()}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="px-4 py-2 border-t border-slate-100 text-[9px] text-slate-400 text-center leading-relaxed">
            Your bids shown in teal. Socket live bids tagged LIVE. Top bid highlighted in green.
          </div>
        </div>
      </div>
    </div>
  );
};
