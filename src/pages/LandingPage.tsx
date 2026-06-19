import React from 'react';
import { ParticlesBackground } from '../components/ParticlesBackground';

interface LandingPageProps {
  onRegisterClick: () => void;
  onLoginClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onRegisterClick, onLoginClick }) => {
  const commodities = [
    { name: 'Paddy', price: '₹1,840/q' },
    { name: 'Onion', price: '₹2,200/q' },
    { name: 'Tomato', price: '₹1,100/q' },
    { name: 'Groundnut', price: '₹5,200/q' },
    { name: 'Cotton', price: '₹6,400/q' },
    { name: 'Wheat', price: '₹2,150/q' }
  ];

  const Marquee = 'marquee' as any;

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-800">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 md:px-20 py-5 bg-[#1b4d4f] border-b border-white/10 shrink-0">
        <div className="text-xl font-bold text-white flex items-center gap-2">
          <img src="/logo.png" alt="VelaanBay Logo" className="h-8 w-auto object-contain animate-pulse drop-shadow-md" />
          VelaanBay <span className="text-slate-300 font-normal text-sm ml-1.5 hidden sm:inline">Buyer Portal</span>
        </div>
        <div className="hidden lg:flex items-center gap-7">
          <a href="#markets" className="text-sm font-medium text-slate-200 hover:text-white transition">Markets</a>
          <a href="#prices" className="text-sm font-medium text-slate-200 hover:text-white transition">Market Prices</a>
          <a href="#how-it-works" className="text-sm font-medium text-slate-200 hover:text-white transition">How It Works</a>
          <a href="#about" className="text-sm font-medium text-slate-200 hover:text-white transition">About</a>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onLoginClick} className="text-sm font-semibold text-white bg-transparent border border-white px-5 py-2 rounded-md hover:bg-white/10 transition">
            Login
          </button>
          <button onClick={onRegisterClick} className="text-sm font-semibold text-[#1b4d4f] bg-white border border-transparent px-5 py-2 rounded-md hover:bg-slate-100 transition">
            Register Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden bg-radial from-[#2b5d4f] to-[#1b4d4f] px-6 md:px-20 py-20 text-white">
        <ParticlesBackground />
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
          {/* Left Side Info */}
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-white">
              Buy Fresh. Buy Direct.<br />
              <span className="text-[#a7f3d0]">Buy Smart.</span>
            </h1>
            <p className="text-slate-200 leading-relaxed text-base max-w-lg">
              Access live APMC auctions, fixed-price listings, and farmer demand boards — all in one free platform for agricultural buyers across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button onClick={onRegisterClick} className="px-7 py-4 text-base font-semibold text-[#1b4d4f] bg-white rounded-lg shadow-lg hover:bg-slate-100 transition text-center">
                Register Free — It's 100% Free
              </button>
              <button onClick={onRegisterClick} className="px-7 py-4 text-base font-semibold text-white bg-transparent border border-white/40 rounded-lg hover:bg-white/10 transition text-center">
                Browse Market Prices
              </button>
            </div>
            <p className="text-xs text-slate-400">
              No subscription. No licence fee. Free forever for buyers.
            </p>
          </div>

          {/* Right Side Card Mock */}
          <div className="w-full max-w-md">
            <div className="bg-white/8 border border-white/15 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden">
              <div className="flex items-center px-4 py-3 border-b border-white/10">
                <div className="flex gap-1.5 mr-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                </div>
                <span className="text-[10px] text-white/50 font-mono">buyer.velaanbay.in</span>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                    <div className="text-xl font-bold text-white">₹24,500</div>
                    <div className="text-xs text-slate-400 mt-1">Wallet Balance</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                    <div className="text-xl font-bold text-white">3</div>
                    <div className="text-xs text-slate-400 mt-1">Active Bids</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                    <div className="text-xl font-bold text-white">12</div>
                    <div className="text-xs text-slate-400 mt-1">Live Auctions</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                    <div className="text-xl font-bold text-red-400">LIVE</div>
                    <div className="text-xs text-red-400/80 mt-1">Paddy Lot</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Live Ticker Strip */}
      <div className="flex items-center bg-white border-b border-slate-200 px-6 md:px-10 py-3.5 overflow-hidden">
        <div className="bg-[#1b4d4f] text-white text-xs font-bold px-3 py-1 rounded-sm mr-5 shrink-0 tracking-wider">
          LIVE PRICES
        </div>
        <div className="flex-1 overflow-hidden">
          <Marquee className="text-sm text-slate-600 font-medium" scrollamount="4">
            {commodities.map((item, idx) => (
              <span key={idx} className="mr-8">
                <strong className="text-slate-800">{item.name}:</strong> {item.price} &nbsp;&nbsp;|&nbsp;&nbsp;
              </span>
            ))}
          </Marquee>
        </div>
      </div>

      {/* Everything a Buyer Needs Feature Grid */}
      <section className="py-20 px-6 bg-slate-50 text-center" id="how-it-works">
        <div className="max-w-5xl mx-auto space-y-3 mb-12">
          <h2 className="text-3xl font-extrabold text-[#1e3a3a] tracking-tight">Everything a Buyer Needs</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">One platform. All agricultural markets. Zero fees.</p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-xl mx-auto">💼</div>
            <h3 className="text-base font-semibold text-[#1b4d4f]">Live APMC Auctions</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Bid in real-time auctions from verified mandi agents.</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition text-center space-y-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-xl mx-auto">🛒</div>
            <h3 className="text-base font-semibold text-[#1b4d4f]">Fixed Price Listings</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Browse and buy agricultural produce directly.</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition text-center space-y-4">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-xl mx-auto">📋</div>
            <h3 className="text-base font-semibold text-[#1b4d4f]">Demand Board</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Post your requirements and get competitive quotes.</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition text-center space-y-4">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-xl mx-auto">🚚</div>
            <h3 className="text-base font-semibold text-[#1b4d4f]">Velaan Cargo Transport</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Book shared or fixed hire vehicles for delivery.</p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#1b4d4f] text-white py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <div className="text-3xl font-extrabold">500+</div>
            <div className="text-xs text-emerald-300">APMC Markets</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-extrabold">2,000+</div>
            <div className="text-xs text-emerald-300">Mandi Agents</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-extrabold">10,000+</div>
            <div className="text-xs text-emerald-300">Registered Buyers</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-extrabold">₹0</div>
            <div className="text-xs text-emerald-300">Licence Fee for Buyers</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f2b2b] text-slate-400 py-6 px-6 md:px-20 text-xs mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© 2025 Skandavel Webtech Private Limited | CIN: U62099TN2025PTC177787 | buyer.velaanbay.in</div>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-white transition">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-white transition">Terms</a>
            <span>•</span>
            <a href="mailto:admin@skandavelwebtech.com" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
