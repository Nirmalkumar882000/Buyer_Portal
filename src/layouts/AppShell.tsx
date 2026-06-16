import React from 'react';

interface AppShellProps {
  children: React.ReactNode;
  activeMenu: string;
  onMenuClick: (menu: string) => void;
  userName?: string;
  walletBalance?: string;
  unreadCount?: number;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  activeMenu,
  onMenuClick,
  userName = 'Ravi Kumar',
  walletBalance = '₹ 24,500',
  unreadCount = 3,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'auctions', label: 'Auctions' },
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'my-agents', label: 'My Agents' },
    { id: 'demand-board', label: 'Demand Board' },
    { id: 'wallet', label: 'Wallet' },
    { id: 'reports', label: 'Reports' },
    { id: 'market-prices', label: 'Market Prices' },
    { id: 'settings', label: 'Profile & Settings' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 antialiased">
      {/* Top Header */}
      <header className="h-16 bg-[#1a4a49] flex justify-between items-center px-6 text-white border-b border-white/10 shrink-0 sticky top-0 z-50 shadow-md">
        <div className="text-lg font-bold flex items-center tracking-tight">
          VelaanBay <span className="text-slate-300 font-normal text-sm ml-1.5">Buyer Portal</span>
        </div>
        <div className="flex items-center gap-5">
          <div className="text-sm font-semibold flex items-center">
            {walletBalance} <span className="text-slate-400 font-normal text-xs ml-1">Wallet</span>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => onMenuClick('notifications')}
              className="w-5 h-5 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center text-[10px] font-bold shadow-sm cursor-pointer border-none outline-hidden transition duration-150"
            >
              {unreadCount}
            </button>
          )}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onMenuClick('settings')}>
            <div className="w-8 h-8 rounded-full bg-[#57c7c0] text-white flex items-center justify-center text-xs font-bold shadow-xs" title="Profile & Settings">
              RK
            </div>
            <span className="text-sm font-medium hidden sm:inline">{userName}</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-60 bg-white border-r border-slate-200 py-6 flex-col hidden md:flex shrink-0">
          <div className="text-[10px] font-bold text-slate-400 px-6 mb-3 tracking-widest uppercase">
            Main Menu
          </div>
          <nav className="flex flex-col gap-0.5">
            {menuItems.map((item) => {
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onMenuClick(item.id)}
                  className={`w-full text-left px-6 py-3 text-sm font-medium transition-all duration-150 flex items-center gap-2.5 
                    ${isActive
                      ? 'bg-[#e2f2f1] text-[#1a4a49] border-l-4 border-[#1a4a49] pl-5'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'
                    }`}
                >
                  <span className="text-[8px] text-slate-400">■</span>
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50 flex flex-col justify-between">
          <div className="w-full">
            {children}
          </div>
          
          {/* Dashboard Footer */}
          <footer className="mt-8 pt-4 border-t border-slate-200 text-slate-400 text-[10px] flex flex-col sm:flex-row justify-between items-center gap-2">
            <div>© 2025 Skandavel Webtech Private Limited | CIN: U62099TN2025PTC177787 | buyer.velaanbay.in</div>
            <div className="flex gap-3">
              <a href="#privacy" className="hover:text-slate-600 transition">Privacy Policy</a>
              <span>•</span>
              <a href="#terms" className="hover:text-slate-600 transition">Terms</a>
              <span>•</span>
              <a href="mailto:admin@skandavelwebtech.com" className="hover:text-slate-600 transition">Contact</a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};
