import React, { useState, useEffect, useRef } from 'react';
import { Settings } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  activeMenu: string;
  onMenuClick: (menu: string) => void;
  userName?: string;
  walletBalance?: string;
  unreadCount?: number;
  onLogout?: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  activeMenu,
  onMenuClick,
  userName = 'Ravi Kumar',
  walletBalance = '₹ 24,500',
  unreadCount = 3,
  onLogout,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'auctions', label: 'Auctions' },
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'my-agents', label: 'My Agents' },
    { id: 'reports', label: 'Reports' },
    { id: 'market-prices', label: 'Market Prices' },
    { id: 'settings', label: 'Profile & Settings' },
    { id: 'wallet', label: 'Wallet', underDevelopment: true },
    { id: 'demand-board', label: 'Demand Board', underDevelopment: true },
    { id: 'contract-sourcing', label: 'Contract Sourcing', underDevelopment: true },
  ];

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('buyer_user');
    if (userStr) {
      try {
        setUserData(JSON.parse(userStr));
      } catch (e) {
        // ignore
      }
    }

    // Close dropdown on click outside
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayUserName = userData?.username || userData?.fullName || userData?.name || userName;
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };
  const userInitials = getInitials(displayUserName);

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    if (onLogout) onLogout();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-800 antialiased">
      {/* Top Header */}
      <header className="h-16 bg-[#1a4a49] flex justify-between items-center px-6 text-white border-b border-white/10 shrink-0 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="VelaanBay Logo" className="h-8 w-auto drop-shadow-md" />
          <div className="text-lg font-bold tracking-tight">
            VelaanBay <span className="text-slate-300 font-normal text-sm ml-1.5 hidden sm:inline">Buyer Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-5">
          {/* 
          <div className="text-sm font-semibold flex items-center">
            {walletBalance} <span className="text-slate-400 font-normal text-xs ml-1">Wallet</span>
          </div>
          */}
          <button
            onClick={() => onMenuClick('notifications')}
            className="relative p-1.5 rounded-full text-slate-200 hover:bg-white/10 hover:text-white transition duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center text-[9px] font-bold shadow-xs border-2 border-[#1a4a49]">
                {unreadCount}
              </span>
            )}
          </button>
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-2 cursor-pointer hover:bg-white/10 py-1.5 px-2 rounded-lg transition"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="w-8 h-8 rounded-full bg-[#57c7c0] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                {userInitials}
              </div>
              <span className="text-sm font-medium hidden sm:inline">{displayUserName}</span>
            </div>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 text-slate-800">
                <div className="px-4 py-2 border-b border-slate-100">
                  <div className="text-sm font-bold">{displayUserName}</div>
                  <div className="text-xs text-slate-500 truncate">{userData?.mobile_number || userData?.email || 'Buyer Account'}</div>
                </div>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onMenuClick('settings');
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-slate-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  Profile & Settings
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 text-red-600 transition-colors flex items-center gap-2 border-t border-slate-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
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
              const isUnderDev = item.underDevelopment;

              let btnClass = 'w-full text-left px-6 py-3 text-sm font-medium transition-all duration-150 flex items-center justify-between border-l-4 ';
              if (isUnderDev) {
                btnClass += 'opacity-50 cursor-not-allowed text-slate-400 border-transparent bg-white/50';
              } else if (isActive) {
                btnClass += 'bg-[#e2f2f1] text-[#1a4a49] border-[#1a4a49] pl-5';
              } else {
                btnClass += 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent';
              }

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (!isUnderDev) onMenuClick(item.id);
                  }}
                  disabled={isUnderDev}
                  className={btnClass}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[8px] text-slate-400">■</span>
                    {item.label}
                  </div>
                  {isUnderDev && (
                    <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                      <Settings className="w-3 h-3 text-slate-500 animate-[spin_4s_linear_infinite]" />
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Dev</span>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-white flex flex-col justify-between">
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

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Ready to Leave?</h3>
            <p className="text-sm text-slate-500 mb-8">
              Are you sure you want to log out of your Buyer Portal session?
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition shadow-md shadow-red-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
