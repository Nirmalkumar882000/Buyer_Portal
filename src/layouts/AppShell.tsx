import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, LayoutDashboard, Gavel, Store, Users, FileText, 
  TrendingUp, UserCog, Wallet, ClipboardList, FileSignature, Globe, ChevronDown
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSizeMode } from '../context/SizeContext';
import type { SizeMode } from '../context/SizeContext';

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
  const { t } = useTranslation();

  const menuItems = [
    { id: 'dashboard', label: t('sidebar_dashboard', 'Dashboard'), icon: LayoutDashboard },
    { id: 'auctions', label: t('sidebar_auctions', 'Auctions'), icon: Gavel },
    { id: 'marketplace', label: t('sidebar_marketplace', 'Marketplace'), icon: Store },
    { id: 'my-agents', label: t('sidebar_my_agents', 'My Agents'), icon: Users },
    { id: 'reports', label: t('sidebar_reports', 'Reports'), icon: FileText },
    { id: 'market-prices', label: t('sidebar_market_prices', 'Market Prices'), icon: TrendingUp },
    { id: 'settings', label: t('sidebar_profile_settings', 'Profile & Settings'), icon: UserCog },
    { id: 'wallet', label: t('sidebar_wallet', 'Wallet'), underDevelopment: true, icon: Wallet },
    { id: 'demand-board', label: t('sidebar_demand_board', 'Demand Board'), underDevelopment: true, icon: ClipboardList },
    { id: 'contract-sourcing', label: t('sidebar_contract_sourcing', 'Contract Sourcing'), underDevelopment: true, icon: FileSignature },
  ];

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const { sizeMode, setSizeMode } = useSizeMode();

  useEffect(() => {
    const userStr = localStorage.getItem('buyer_user');
    if (userStr) {
      try {
        setUserData(JSON.parse(userStr));
      } catch (e) {
        // ignore
      }
    }

    // Close dropdowns on click outside
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
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

  const currentLang = localStorage.getItem('buyer_language') || 'en';
  const handleLanguageChange = (lang: string) => {
    if (currentLang !== lang) {
      localStorage.setItem('buyer_language', lang);
      window.location.reload();
    }
  };

  // Size toggle labels and tooltip descriptions
  const sizeOptions: { label: SizeMode; title: string }[] = [
    { label: 'S', title: 'Small – Compact view' },
    { label: 'M', title: 'Medium – Default view' },
    { label: 'L', title: 'Large – Spacious view' },
  ];


  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-800 antialiased">
      {/* Top Header */}
      <header
        className="bg-[#1a4a49] flex justify-between items-center px-4 md:px-6 text-white border-b border-white/10 shrink-0 sticky top-0 z-50 shadow-md"
        style={{ height: 'var(--app-header-h, 64px)' }}
      >
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="VelaanBay Logo" className="h-8 w-auto drop-shadow-md" />
          <div className="text-lg font-bold tracking-tight">
            VelaanBay <span className="text-slate-300 font-normal text-sm ml-1.5 hidden sm:inline">{t('buyer_portal', 'Buyer Portal')}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">

          {/* ── Language Dropdown ── */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition text-xs font-semibold"
            >
              <Globe className="w-4 h-4 text-slate-200" />
              <span>{currentLang === 'ta' ? 'தமிழ்' : 'English'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 text-slate-800">
                <button
                  onClick={() => { setIsLangOpen(false); handleLanguageChange('en'); }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${currentLang === 'en' ? 'bg-[#e2f2f1] text-[#1a4a49] font-bold' : 'hover:bg-slate-50'}`}
                >
                  English
                </button>
                <button
                  onClick={() => { setIsLangOpen(false); handleLanguageChange('ta'); }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${currentLang === 'ta' ? 'bg-[#e2f2f1] text-[#1a4a49] font-bold' : 'hover:bg-slate-50'}`}
                >
                  தமிழ்
                </button>
              </div>
            )}
          </div>

          {/* ── S / M / L Size Toggle ── */}
          <div
            className="flex items-center rounded-lg overflow-hidden border border-white/20 bg-white/10 backdrop-blur-sm"
            role="group"
            aria-label="Display size"
          >
            {sizeOptions.map(({ label, title }) => {
              const isActive = sizeMode === label;
              return (
                <button
                  key={label}
                  title={title}
                  onClick={() => setSizeMode(label)}
                  aria-pressed={isActive}
                  style={{
                    fontSize: 'var(--app-text-xs, 11px)',
                    padding: '4px 10px',
                    fontWeight: isActive ? 700 : 500,
                    letterSpacing: '0.04em',
                    transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
                    background: isActive ? 'rgba(255,255,255,0.22)' : 'transparent',
                    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.60)',
                    borderRight: label !== 'L' ? '1px solid rgba(255,255,255,0.15)' : 'none',
                    cursor: 'pointer',
                    boxShadow: isActive ? 'inset 0 1px 3px rgba(0,0,0,0.15)' : 'none',
                    position: 'relative',
                  }}
                >
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(87,199,192,0.25)',
                        borderRadius: 0,
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                  {label}
                </button>
              );
            })}
          </div>

          {/* Notification Bell */}
          <button
            onClick={() => onMenuClick('notifications')}
            className="relative p-1.5 rounded-full text-slate-200 hover:bg-white/10 hover:text-white transition duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 'var(--app-icon-size, 18px)', height: 'var(--app-icon-size, 18px)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shadow-xs border-2 border-[#1a4a49]" style={{ fontSize: '9px' }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-2 cursor-pointer hover:bg-white/10 py-1.5 px-2 rounded-lg transition"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div
                className="rounded-full bg-[#57c7c0] text-white flex items-center justify-center font-bold shadow-xs"
                style={{
                  width: 'var(--app-avatar-size, 36px)',
                  height: 'var(--app-avatar-size, 36px)',
                  fontSize: 'var(--app-avatar-text, 13px)',
                }}
              >
                {userInitials}
              </div>
              <span className="font-medium hidden sm:inline" style={{ fontSize: 'var(--app-text-sm, 13px)' }}>{displayUserName}</span>
            </div>

            {/* Profile Dropdown Menu */}
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
                  {t('profile_settings', 'Profile & Settings')}
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
                  {t('logout', 'Logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container — font-size on <html> scales all rem-based page content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`bg-white border-r border-slate-200 flex-col shrink-0 transition-all duration-300 overflow-hidden flex`}
          style={{ width: isSidebarOpen ? 'var(--app-sidebar-w, 240px)' : '80px' }}
        >
          {/* Sidebar Toggle Area */}
          <div className={`flex items-center py-4 border-b border-slate-100 ${isSidebarOpen ? 'justify-between px-6' : 'justify-center'}`}>
            {isSidebarOpen && <span className="font-bold text-slate-700">Menu</span>}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 text-slate-400 hover:text-[#1a4a49] hover:bg-slate-100 rounded-md transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>

          <div className={`text-xs font-bold text-slate-400 mt-4 mb-2 tracking-widest uppercase ${isSidebarOpen ? 'px-6' : 'text-center text-[10px]'}`}>
            {isSidebarOpen ? t('main_menu', 'Main Menu') : '•••'}
          </div>
          <nav className="flex flex-col gap-0.5">
            {menuItems.map((item) => {
              const isActive = activeMenu === item.id;
              const isUnderDev = item.underDevelopment;

              let btnClass = `w-full text-left py-3 text-sm font-medium transition-all duration-150 flex items-center border-l-4 ${isSidebarOpen ? 'px-6 justify-between' : 'px-0 justify-center'} `;
              if (isUnderDev) {
                btnClass += 'opacity-50 cursor-not-allowed text-slate-400 border-transparent bg-white/50';
              } else if (isActive) {
                btnClass += `bg-[#e2f2f1] text-[#1a4a49] border-[#1a4a49] ${isSidebarOpen ? 'pl-5' : ''}`;
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
                  title={!isSidebarOpen ? item.label : undefined}
                >
                  <div className={`flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center w-full'}`}>
                    {item.icon ? (
                      <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#1a4a49]' : isUnderDev ? 'text-slate-300' : 'text-slate-400'}`} />
                    ) : (
                      <span className="text-[0.5em] text-slate-400 shrink-0">■</span>
                    )}
                    {isSidebarOpen && <span className="truncate">{item.label}</span>}
                  </div>
                  {isSidebarOpen && isUnderDev && (
                    <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                      <Settings className="w-3 h-3 text-slate-500 animate-[spin_4s_linear_infinite]" />
                      <span className="text-[0.55em] font-bold text-slate-500 uppercase tracking-widest">Dev</span>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-white flex flex-col justify-between" style={{ padding: '1rem 1.5rem' }}>
          <div className="w-full">
            {children}
          </div>

          {/* Dashboard Footer */}
          <footer className="mt-8 pt-4 border-t border-slate-200 text-slate-400 text-xs flex flex-col sm:flex-row justify-between items-center gap-2">
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
            <h3 className="text-xl font-bold text-slate-800 mb-2">{t('ready_to_leave', 'Ready to Leave?')}</h3>
            <p className="text-sm text-slate-500 mb-8">
              {t('logout_confirmation', 'Are you sure you want to log out of your Buyer Portal session?')}
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition"
              >
                {t('cancel', 'Cancel')}
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition shadow-md shadow-red-200"
              >
                {t('logout', 'Logout')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
