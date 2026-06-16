import React, { useState } from 'react';

interface NotificationItem {
  id: string;
  type: 'auction' | 'payment' | 'delivery' | 'demand';
  title: string;
  description: string;
  time: string;
  unread: boolean;
  icon: string;
  iconBg: string;
  borderColorClass?: string;
  targetView: string;
  targetParams?: any;
}

interface NotificationsPageProps {
  onNavigate: (view: string, params?: any) => void;
  onMarkAllReadGlobal?: () => void;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'n1',
    type: 'auction',
    title: 'You won the auction!',
    description: 'Paddy Lot #A-2295 — Winning bid: ₹19,500/q. Invoice #INV-2295 generated.',
    time: '2 mins ago',
    unread: true,
    icon: '🏆',
    iconBg: 'bg-amber-50 border border-amber-100',
    borderColorClass: 'border-l-4 border-emerald-500',
    targetView: 'order-success',
  },
  {
    id: 'n2',
    type: 'auction',
    title: "You've been outbid!",
    description: 'Onion Lot #A-2291 — New high bid: ₹22,400. Your funds released back to wallet.',
    time: '18 mins ago',
    unread: true,
    icon: '⚠️',
    iconBg: 'bg-rose-50 border border-rose-100',
    borderColorClass: 'border-l-4 border-rose-500',
    targetView: 'bidding',
  },
  {
    id: 'n3',
    type: 'auction',
    title: 'Agent Registration Approved',
    description: 'Murugan Kandasamy (Thoothukudi APMC) has approved your registration request.',
    time: '1 hour ago',
    unread: false,
    icon: '✅',
    iconBg: 'bg-emerald-50 border border-emerald-100',
    targetView: 'my-agents',
  },
  {
    id: 'n4',
    type: 'delivery',
    title: 'Delivery ETA Today 4 PM',
    description: 'Groundnut order (500 kg) from Rajan Farm is in transit. Driver: Krishnamurthy P. (TN 69 B 4421)',
    time: '3 hours ago',
    unread: false,
    icon: '🚚',
    iconBg: 'bg-cyan-50 border border-cyan-100',
    targetView: 'delivery-tracking',
  },
  {
    id: 'n5',
    type: 'payment',
    title: 'Wallet Top Up Successful',
    description: '₹10,00,000 credited to your wallet via UPI (Razorpay #RZP00144)',
    time: 'Yesterday, 3:45 PM',
    unread: false,
    icon: '💰',
    iconBg: 'bg-yellow-50 border border-yellow-100',
    targetView: 'wallet',
  },
  {
    id: 'n6',
    type: 'demand',
    title: 'New Quote on Your Demand',
    description: 'Murugan Kandasamy quoted ₹18,200/q for your Paddy 5MT demand. Review now.',
    time: 'Yesterday, 11:20 AM',
    unread: false,
    icon: '📋',
    iconBg: 'bg-blue-50 border border-blue-100',
    targetView: 'demand-board',
  },
];

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  onNavigate,
  onMarkAllReadGlobal,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'auctions' | 'payments' | 'deliveries' | 'demands'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false, borderColorClass: undefined })));
    if (onMarkAllReadGlobal) onMarkAllReadGlobal();
  };

  const handleNotificationClick = (n: NotificationItem) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((item) => (item.id === n.id ? { ...item, unread: false, borderColorClass: undefined } : item))
    );
    // Navigate
    onNavigate(n.targetView, n.targetParams);
  };

  // Calculations for badges
  const auctionsUnread = notifications.filter((n) => n.type === 'auction' && n.unread).length;

  const filtered = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'auctions') return n.type === 'auction';
    if (activeTab === 'payments') return n.type === 'payment';
    if (activeTab === 'deliveries') return n.type === 'delivery';
    if (activeTab === 'demands') return n.type === 'demand';
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          {/* Breadcrumbs */}
          <div className="text-xs text-slate-400 font-semibold mb-1">
            <span className="text-slate-455">Home</span>
            <span className="mx-1.5">&rsaquo;</span>
            <span className="text-slate-500 font-semibold">Notifications</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Notifications</h1>
          <p className="text-xs text-slate-550 font-semibold mt-0.5">
            Stay updated on auctions, payments, and deliveries
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleMarkAllRead}
          className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold rounded-md shadow-2xs transition self-start sm:self-center flex items-center gap-1"
        >
          ✓ Mark All as Read
        </button>
      </div>

      {/* Tabs list bar */}
      <div className="border-b border-slate-200 flex flex-wrap gap-6 text-xs font-bold text-slate-500">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 relative transition-all ${
            activeTab === 'all' ? 'text-[#1b4d4f] font-extrabold border-b-2 border-[#1b4d4f]' : 'hover:text-slate-800'
          }`}
        >
          All ({notifications.length})
        </button>

        <button
          onClick={() => setActiveTab('auctions')}
          className={`pb-3 relative transition-all flex items-center gap-1.5 ${
            activeTab === 'auctions' ? 'text-[#1b4d4f] font-extrabold border-b-2 border-[#1b4d4f]' : 'hover:text-slate-800'
          }`}
        >
          Auctions
          {auctionsUnread > 0 && (
            <span className="w-2 h-3.5 bg-rose-500 rounded-full inline-block" title={`${auctionsUnread} unread`} />
          )}
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`pb-3 relative transition-all ${
            activeTab === 'payments' ? 'text-[#1b4d4f] font-extrabold border-b-2 border-[#1b4d4f]' : 'hover:text-slate-800'
          }`}
        >
          Payments (2)
        </button>

        <button
          onClick={() => setActiveTab('deliveries')}
          className={`pb-3 relative transition-all ${
            activeTab === 'deliveries' ? 'text-[#1b4d4f] font-extrabold border-b-2 border-[#1b4d4f]' : 'hover:text-slate-800'
          }`}
        >
          Deliveries (2)
        </button>

        <button
          onClick={() => setActiveTab('demands')}
          className={`pb-3 relative transition-all ${
            activeTab === 'demands' ? 'text-[#1b4d4f] font-extrabold border-b-2 border-[#1b4d4f]' : 'hover:text-slate-800'
          }`}
        >
          Demands (1)
        </button>
      </div>

      {/* Notifications List Stack */}
      <div className="space-y-4">
        {filtered.map((n) => (
          <div
            key={n.id}
            onClick={() => handleNotificationClick(n)}
            className={`bg-white border border-slate-200 rounded-lg p-4 shadow-2xs transition-all duration-200 hover:border-slate-350 cursor-pointer relative flex gap-4 items-start
              ${n.unread ? n.borderColorClass || 'border-l-4 border-emerald-500' : 'opacity-80'}`}
          >
            {/* Round Icon */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${n.iconBg} shrink-0`}>
              {n.icon}
            </div>

            {/* Content info */}
            <div className="flex-1 space-y-0.5 text-xs font-semibold">
              <h3 className={`text-slate-800 font-extrabold ${n.unread ? 'text-[13px]' : 'text-xs'}`}>
                {n.title}
              </h3>
              <p className="text-slate-500 font-medium leading-normal">{n.description}</p>
              <span className="text-[10px] text-slate-400 font-bold block pt-1">{n.time}</span>
            </div>

            {/* Blue Dot Indicator for Unread */}
            {n.unread && (
              <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-cyan-600" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
