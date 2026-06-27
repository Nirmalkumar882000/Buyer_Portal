import React from 'react';
import { Button } from '../components/Button';
import { Gavel, Truck, TrendingUp, Users, ShoppingBag, Tractor, Store, Search, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLivePrices } from '../hooks/useLivePrices';

interface DashboardPageProps {
  formData: any;
  onLogout: () => void;
  onActionClick: (view: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ formData, onLogout, onActionClick }) => {
  const { t } = useTranslation();

  const recentPurchases = [
    { product: 'Paddy (Grade A)', qty: '5 MT', amount: '₹94,860', status: 'Delivered', statusColor: 'bg-emerald-100 text-emerald-800' },
    { product: 'Groundnut', qty: '500 kg', amount: '₹26,000', status: 'In Transit', statusColor: 'bg-amber-100 text-amber-800' },
    { product: 'Onion (Large)', qty: '1 MT', amount: '₹19,200', status: 'Processing', statusColor: 'bg-blue-100 text-blue-800' },
  ];
  
  const { prices: livePrices } = useLivePrices();

  const notifications = [
    { text: 'Auction Win! Paddy Lot #A-2294 — ₹94,860', time: '2 mins ago', dotColor: 'bg-slate-600' },
    { text: 'Outbid on Onion Lot #A-2291. New high: ₹22,400', time: '18 mins ago', dotColor: 'bg-orange-500' },
    { text: 'Agent Murugan (Trichy APMC) approved your request', time: '1 hour ago', dotColor: 'bg-emerald-500' },
    { text: 'Groundnut delivery ETA today 4 PM', time: '3 hours ago', dotColor: 'bg-teal-500' },
  ];

  const Marquee = 'marquee' as any;

  return (
    <div className="space-y-6">
      {/* Welcome Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            {t('good_morning', 'Good morning')}, {formData.fullName || 'Ravi Kumar'} <span className="animate-bounce">👋</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Tuesday, 15 July 2025 | buyer.velaanbay.in</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs">
          <span>🔔 {t('notifications', 'Notifications')}</span>
          <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold">3</span>
        </button>
      </div>

      {/* Wallet Balance Hero Card - UNDER DEVELOPMENT - COMMENTED OUT
      <div className="bg-gradient-to-r from-[#236361] to-[#1a4a49] text-white rounded-xl p-6 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-300 tracking-widest uppercase">Wallet Balance</span>
          <div className="text-4xl font-extrabold tracking-tight">₹ 24,500</div>
          <div className="text-xs text-slate-300">
            Available: <strong className="text-white">₹18,000</strong> &nbsp;|&nbsp; On Hold (Bids): <strong className="text-white">₹6,500</strong>
          </div>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => onActionClick('top-up')}
            className="px-5 py-2.5 bg-white text-[#1a4a49] font-bold rounded-lg text-sm shadow-sm hover:bg-slate-50 transition"
          >
            ↑ Top Up
          </button>
          <button
            onClick={() => onActionClick('withdraw')}
            className="px-5 py-2.5 bg-[#173e3d] border border-white/20 text-white font-bold rounded-lg text-sm hover:bg-[#112f2e] transition"
          >
            ↓ Withdraw
          </button>
        </div>
      </div>
      */}

      {/* 4 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group cursor-default">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#1b4d4f] group-hover:bg-[#57c7c0] transition-colors"></div>
          <div className="flex justify-between items-start mb-2">
            <div className="p-1.5 bg-slate-50 rounded-lg text-slate-500 group-hover:bg-[#e2f2f1] group-hover:text-[#1b4d4f] transition-colors">
              <Gavel className="w-4 h-4" />
            </div>
          </div>
          <span className="text-[9px] font-bold text-slate-700 tracking-wider uppercase">{t('active_bids', 'Active Bids')}</span>
          <div className="text-2xl font-black text-black my-0.5">3</div>
          <div className="text-xs text-slate-500 mb-3">{t('live_auctions_now', '2 live auctions now')}</div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#1b4d4f] group-hover:bg-[#57c7c0] transition-colors h-full w-2/3"></div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group cursor-default">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#1b4d4f] group-hover:bg-[#57c7c0] transition-colors"></div>
          <div className="flex justify-between items-start mb-2">
            <div className="p-1.5 bg-slate-50 rounded-lg text-slate-500 group-hover:bg-[#e2f2f1] group-hover:text-[#1b4d4f] transition-colors">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <span className="text-[9px] font-bold text-slate-700 tracking-wider uppercase">{t('pending_deliveries', 'Pending Deliveries')}</span>
          <div className="text-2xl font-black text-black my-0.5">2</div>
          <div className="text-xs text-slate-500 mb-3">{t('expected_today', 'Expected today: 1')}</div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#1b4d4f] group-hover:bg-[#57c7c0] transition-colors h-full w-1/2"></div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group cursor-default">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#1b4d4f] group-hover:bg-[#57c7c0] transition-colors"></div>
          <div className="flex justify-between items-start mb-2">
            <div className="p-1.5 bg-slate-50 rounded-lg text-slate-500 group-hover:bg-[#e2f2f1] group-hover:text-[#1b4d4f] transition-colors">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-[9px] font-bold text-slate-700 tracking-wider uppercase">{t('this_month_purchases', 'This Month Purchases')}</span>
          <div className="text-2xl font-black text-black my-0.5">₹1.2L</div>
          <div className="text-xs text-emerald-600 font-medium mb-3">↑ 18% {t('vs_last_month', 'vs last month')}</div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#1b4d4f] group-hover:bg-[#57c7c0] transition-colors h-full w-3/4"></div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group cursor-default">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#1b4d4f] group-hover:bg-[#57c7c0] transition-colors"></div>
          <div className="flex justify-between items-start mb-2">
            <div className="p-1.5 bg-slate-50 rounded-lg text-slate-500 group-hover:bg-[#e2f2f1] group-hover:text-[#1b4d4f] transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <span className="text-[9px] font-bold text-slate-700 tracking-wider uppercase">{t('registered_agents', 'Registered Agents')}</span>
          <div className="text-2xl font-black text-black my-0.5">4</div>
          <div className="text-xs text-slate-500 mb-3">{t('approved_pending', '3 approved, 1 pending')}</div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#1b4d4f] group-hover:bg-[#57c7c0] transition-colors h-full w-4/5"></div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-extrabold text-slate-800">{t('quick_actions', 'Quick Actions')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <button
            onClick={() => onActionClick('auctions-list')}
            className="flex flex-col items-center justify-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-[#1b4d4f] hover:bg-[#e2f2f1] hover:shadow-md transition-all group"
          >
            <ShoppingBag className="w-6 h-6 text-[#1b4d4f] group-hover:-translate-y-1 transition-transform" />
            <span className="text-xs font-bold text-slate-700 group-hover:text-[#1b4d4f]">{t('browse_auctions', 'Browse Auctions')}</span>
          </button>

          {/* Post Demand & Top Up Wallet - UNDER DEVELOPMENT (Hidden) */}

          {/* Contract Sourcing - UNDER DEVELOPMENT
          <button
            onClick={() => onActionClick('contract-harvesting')}
            className="flex flex-col items-center justify-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl hover:border-amber-500 hover:bg-amber-100 hover:shadow-md transition-all group"
          >
            <Tractor className="w-6 h-6 text-amber-600 group-hover:-translate-y-1 transition-transform" />
            <span className="text-xs font-bold text-amber-800">Contract Sourcing</span>
          </button>
          */}

          <button
            onClick={() => onActionClick('marketplace')}
            className="flex flex-col items-center justify-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-[#1b4d4f] hover:bg-[#e2f2f1] hover:shadow-md transition-all group"
          >
            <Store className="w-6 h-6 text-[#1b4d4f] group-hover:-translate-y-1 transition-transform" />
            <span className="text-xs font-bold text-slate-700 group-hover:text-[#1b4d4f]">{t('fixed_market', 'Fixed Market')}</span>
          </button>

          <button
            onClick={() => onActionClick('agents')}
            className="flex flex-col items-center justify-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-[#1b4d4f] hover:bg-[#e2f2f1] hover:shadow-md transition-all group"
          >
            <Search className="w-6 h-6 text-[#1b4d4f] group-hover:-translate-y-1 transition-transform" />
            <span className="text-xs font-bold text-slate-700 group-hover:text-[#1b4d4f]">{t('find_agents', 'Find Agents')}</span>
          </button>

          <button
            onClick={() => onActionClick('whatsapp-chat')}
            className="flex flex-col items-center justify-center gap-3 p-4 bg-[#25d366]/10 border border-[#25d366]/20 rounded-xl hover:border-[#25d366] hover:bg-[#25d366]/20 hover:shadow-md transition-all group"
          >
            <MessageCircle className="w-6 h-6 text-[#25d366] group-hover:-translate-y-1 transition-transform" />
            <span className="text-xs font-bold text-[#1a8a43] group-hover:text-[#136630]">{t('whatsapp_chat', 'WhatsApp Chat')}</span>
          </button>
        </div>
      </div>

      {/* Live price ticker strip */}
      <div className="flex items-center bg-[#1b4d4f] text-white rounded-lg p-3 overflow-hidden shadow-xs">
        <div className="bg-white text-[#1b4d4f] text-[10px] font-bold px-2 py-0.5 rounded-sm mr-4 shrink-0">
          {t('live_prices_marquee', 'LIVE PRICES')}
        </div>
        <div className="flex-1 overflow-hidden">
          <Marquee className="text-xs font-medium text-slate-200" scrollamount="3">
            {livePrices.map((item, idx) => (
              <span key={idx} className="mr-8">
                <strong className="text-white">{item.name}:</strong> {item.price} &nbsp;&nbsp;|&nbsp;&nbsp;
              </span>
            ))}
          </Marquee>
        </div>
      </div>

      {/* Bottom Grid: Recent Purchases & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Purchases */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800">{t('recent_purchases', 'Recent Purchases')}</h3>
            <button className="text-xs font-bold text-[#1b4d4f] border border-[#1b4d4f] px-3 py-1 rounded-md hover:bg-teal-50 transition">
              {t('view_all', 'View All')}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                  <th className="py-2.5">{t('table_product', 'Product')}</th>
                  <th className="py-2.5">{t('table_qty', 'Qty')}</th>
                  <th className="py-2.5">{t('table_amount', 'Amount')}</th>
                  <th className="py-2.5">{t('table_status', 'Status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {recentPurchases.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3">{item.product}</td>
                    <td className="py-3">{item.qty}</td>
                    <td className="py-3">{item.amount}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800">{t('notifications', 'Notifications')}</h3>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">3 new</span>
          </div>
          <div className="space-y-4">
            {notifications.map((item, idx) => (
              <div key={idx} className="flex gap-3 text-xs leading-normal">
                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${item.dotColor}`}></span>
                <div className="space-y-0.5">
                  <p className="text-slate-700 font-semibold">{item.text}</p>
                  <p className="text-[10px] text-slate-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Logout button in details view */}
      <div className="pt-6 border-t border-slate-200 flex justify-end">
        <Button variant="secondary" onClick={onLogout}>
          Logout to Public Landing Page
        </Button>
      </div>
    </div>
  );
};
