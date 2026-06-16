import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';

interface LiveBiddingPageProps {
  lotNumber?: string;
  onBackToAuctions: () => void;
  onPlaceBidSuccess: () => void;
}

export const LiveBiddingPage: React.FC<LiveBiddingPageProps> = ({
  lotNumber = '#A-2295',
  onBackToAuctions,
  onPlaceBidSuccess
}) => {
  const { showToast } = useToast();
  const [currentBid, setCurrentBid] = useState(19200);
  const [yourBid, setYourBid] = useState(19500);
  const [bidsCount, setBidsCount] = useState(24);
  const [countdown, setCountdown] = useState({ min: 18, sec: 42 });

  // Feed list
  const [feed, setFeed] = useState([
    { bidder: '****78', type: 'Portal', time: '18:52 ago', amount: '₹19,200', isPortal: true },
    { bidder: 'Floor Buyer', type: 'Floor', time: '19:08 ago', amount: '₹19,100', isPortal: false },
    { bidder: '****23', type: 'Portal', time: '19:44 ago', amount: '₹19,000', isPortal: true },
    { bidder: 'Floor Buyer', type: 'Floor', time: '20:12 ago', amount: '₹18,800', isPortal: false },
    { bidder: '****56', type: 'Portal', time: '21:30 ago', amount: '₹18,500', isPortal: true },
  ]);

  // Handle timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev.sec > 0) {
          return { ...prev, sec: prev.sec - 1 };
        } else if (prev.min > 0) {
          return { min: prev.min - 1, sec: 59 };
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleIncrement = (amount: number) => {
    setYourBid((prev) => prev + amount);
  };

  const handlePlaceBid = () => {
    if (yourBid <= currentBid) {
      showToast('Your bid must be higher than the current highest bid!', 'error');
      return;
    }
    // Update center screen state
    setCurrentBid(yourBid);
    setBidsCount((prev) => prev + 1);

    // Update right feed list
    const newEntry = {
      bidder: '****78',
      type: 'Portal',
      time: 'Just now',
      amount: `₹${yourBid.toLocaleString()}`,
      isPortal: true,
    };
    setFeed([newEntry, ...feed]);
    setYourBid(yourBid + 100);

    // Simulate winning transition
    setTimeout(() => {
      onPlaceBidSuccess();
    }, 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-400 font-medium">
        <button onClick={onBackToAuctions} className="hover:text-slate-600 underline">Auctions</button>
        <span className="mx-1.5">&rsaquo;</span>
        <span className="text-slate-500 font-semibold">Lot {lotNumber} &mdash; Live Bidding</span>
      </div>

      {/* Page Title & Badges */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Live Auction &mdash; Paddy Grade A</h1>
        </div>
        <div className="flex gap-2 items-center text-xs font-bold">
          <span className="bg-[#1b4d4f] text-white px-3 py-1.5 rounded-sm tracking-wide">
            BUYER PORTAL ACTIVE
          </span>
          <span className="bg-red-500 text-white px-3 py-1.5 rounded-sm flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
            LIVE
          </span>
        </div>
      </div>

      {/* Three Panel Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Lot & Wallet details */}
        <div className="lg:col-span-3 space-y-6">
          {/* Lot Details */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Paddy (Grade A)</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Lot {lotNumber} | Thoothukudi APMC</p>
            </div>
            <hr className="border-slate-100" />
            <div className="space-y-2.5 text-[11px] font-medium text-slate-600">
              <div><span className="text-slate-400 font-normal">Agent:</span> Murugan Kandasamy</div>
              <div><span className="text-slate-400 font-normal">Seller:</span> Rajan Farm (Verified)</div>
              <div><span className="text-slate-400 font-normal">Quantity:</span> 5 MT (50 bags &times; 100kg)</div>
              <div><span className="text-slate-400 font-normal">Grade:</span> Grade A &mdash; Moisture 14%</div>
              <div><span className="text-slate-400 font-normal">Origin:</span> Thoothukudi, TN</div>
              <div><span className="text-slate-400 font-normal">Base Price:</span> ₹17,800/quintal</div>
            </div>
            <div className="bg-amber-50 border border-amber-100/70 p-3 rounded-md text-[10px] text-amber-700 leading-normal">
              <strong>&Delta; Wallet Escrow:</strong> Your bid amount will be held in escrow. Released immediately if outbid.
            </div>
          </div>

          {/* Wallet */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
            <span className="text-xs font-bold text-slate-800">Your Wallet</span>
            <hr className="border-slate-100" />
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Available Balance</span>
              <p className="text-2xl font-black text-slate-850">₹18,000</p>
              <p className="text-[10px] text-orange-500 font-semibold mt-1">₹6,500 on hold (3 bids)</p>
            </div>
            <button className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold py-2 rounded-md transition text-center">
              + Top Up Wallet
            </button>
          </div>
        </div>

        {/* CENTRE COLUMN: Active bid controls */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-6 shadow-xs flex flex-col justify-between gap-6 text-center">
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider block">CURRENT HIGHEST BID</span>
            <div className="text-4xl font-black text-emerald-600 tracking-tight">
              ₹ {currentBid.toLocaleString()}<span className="text-sm font-semibold text-slate-400">/quintal</span>
            </div>
            <p className="text-[10px] text-slate-400">Bidder: ****78 (Portal Buyer)</p>
          </div>

          <hr className="border-slate-100" />

          {/* Countdown block */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[9px] font-bold text-slate-400 tracking-wide block">Time Remaining</span>
              <div className="text-2xl font-bold text-red-500 mt-1">
                {countdown.min}:{countdown.sec < 10 ? `0${countdown.sec}` : countdown.sec}
              </div>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 tracking-wide block">Total Bids</span>
              <div className="text-2xl font-bold text-slate-800 mt-1">{bidsCount}</div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Bidding inputs */}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 tracking-wide block mb-1">
                YOUR BID (min: ₹{(currentBid + 100).toLocaleString()}/q)
              </label>
              <div className="text-2xl font-extrabold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg py-2.5 max-w-xs mx-auto">
                ₹ {yourBid.toLocaleString()}
              </div>
            </div>

            {/* Increments */}
            <div className="flex justify-center gap-2 max-w-xs mx-auto">
              <button onClick={() => handleIncrement(100)} className="flex-1 bg-teal-50/50 hover:bg-teal-100/50 text-[#1b4d4f] border border-teal-100 text-[10px] font-bold py-1.5 rounded-md transition">
                + ₹100
              </button>
              <button onClick={() => handleIncrement(500)} className="flex-1 bg-teal-50/50 hover:bg-teal-100/50 text-[#1b4d4f] border border-teal-100 text-[10px] font-bold py-1.5 rounded-md transition">
                + ₹500
              </button>
              <button onClick={() => handleIncrement(1000)} className="flex-1 bg-teal-50/50 hover:bg-teal-100/50 text-[#1b4d4f] border border-teal-100 text-[10px] font-bold py-1.5 rounded-md transition">
                + ₹1,000
              </button>
            </div>

            {/* Total calculation */}
            <p className="text-[10px] text-slate-400 font-semibold">
              Total if won: <span className="text-slate-700">₹{(yourBid * 50).toLocaleString()} (5 MT &times; ₹{yourBid.toLocaleString()}/q)</span>
            </p>

            <button
              onClick={handlePlaceBid}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold py-3 rounded-lg shadow-sm transition flex items-center justify-center gap-2"
            >
              🔨 Place Bid &mdash; ₹{yourBid.toLocaleString()}/q
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Bid Feed */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-800">Live Bid Feed</h3>
            <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-sm font-bold flex items-center gap-0.5">
              <span className="w-1 h-1 bg-red-600 rounded-full animate-ping"></span>
              LIVE
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto space-y-3.5 pr-1">
            {feed.map((entry, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs pt-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-700">{entry.bidder}</span>
                    {entry.isPortal && (
                      <span className="bg-blue-100 text-blue-700 text-[8px] font-extrabold px-1 rounded-sm">Portal</span>
                    )}
                  </div>
                  <p className="text-[9px] text-slate-400">{entry.time}</p>
                </div>
                <div className="font-bold text-slate-800">{entry.amount}</div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-150 text-[9px] text-slate-400 leading-relaxed text-center">
            Portal bids shown with tag. Floor bids shown as "Floor Buyer".
          </div>
        </div>
      </div>
    </div>
  );
};
