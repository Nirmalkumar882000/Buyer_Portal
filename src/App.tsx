import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate, Outlet } from 'react-router-dom';
import { ToastProvider, useToast } from './context/ToastContext';
import { LoadingProvider } from './context/LoadingContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Loader } from './components/Loader';
import { LandingPage } from './pages/LandingPage';
import { RegisterStep1 } from './pages/RegisterStep1';
import { RegisterStep2 } from './pages/RegisterStep2';
import { OtpVerify } from './pages/OtpVerify';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { MarketDiscoveryPage } from './pages/MarketDiscoveryPage';
import { AgentDiscoveryPage } from './pages/AgentDiscoveryPage';
import { AgentProfilePage } from './pages/AgentProfilePage';
import { MyAgentsPage } from './pages/MyAgentsPage';
import { LiveAuctionsPage } from './pages/LiveAuctionsPage';
import { LiveBiddingPage } from './pages/LiveBiddingPage';
import { AuctionWonPage } from './pages/AuctionWonPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { WalletPage } from './pages/WalletPage';
import { TopUpPage } from './pages/TopUpPage';
import { WithdrawPage } from './pages/WithdrawPage';
import { CreditRequestPage } from './pages/CreditRequestPage';
import { DemandBoardPage } from './pages/DemandBoardPage';
import { PostDemandPage } from './pages/PostDemandPage';
import { ContractHarvestingPage } from './pages/ContractHarvestingPage';
import { ContractHarvestingDetailPage } from './pages/ContractHarvestingDetailPage';
import { TransportBookingPage } from './pages/TransportBookingPage';
import { DeliveryTrackingPage } from './pages/DeliveryTrackingPage';
import { ReportsPage } from './pages/ReportsPage';
import { MarketPricesPage } from './pages/MarketPricesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { WhatsAppChatPage } from './pages/WhatsAppChatPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { AppShell } from './layouts/AppShell';
import { SizeProvider } from './context/SizeContext';
import { ParticlesBackground } from './components/ParticlesBackground';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col py-8 sm:py-12 relative bg-[#2a4d4c] overflow-x-hidden">
      <ParticlesBackground />
      <div className="m-auto w-full sm:max-w-4xl px-4 sm:px-6 relative z-10">
        <Outlet />
      </div>
    </div>
  );
};

function AppContent() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, logout, isAuthenticated } = useAuth();

  const [orderSummary, setOrderSummary] = useState<any>(null);
  const [walletAvailable, setWalletAvailable] = useState<number>(18000);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(2);
  const walletOnHold = 6500;
  const [selectedAuction, setSelectedAuction] = useState<any>(null);

  const [demands, setDemands] = useState<any[]>([
    {
      id: 'D1',
      produce: 'Paddy (Grade A)',
      qty: '5 MT',
      postedDate: '14 Jul 2025',
      deadlineDate: '22 Jul 2025',
      targetPrice: '₹18,500/q',
      delivery: 'Thoothukudi',
      grade: 'Grade A, Moisture < 14%',
      status: 'active',
      quotesCount: 3,
      expiresInDays: 8,
      borderColorClass: 'border-l-4 border-emerald-500',
    },
    {
      id: 'D2',
      produce: 'Onion (Large)',
      qty: '2 MT',
      postedDate: '12 Jul 2025',
      deadlineDate: '20 Jul 2025',
      targetPrice: '₹20/kg',
      delivery: 'Thoothukudi',
      grade: 'Large size, dry',
      status: 'active',
      quotesCount: 1,
      borderColorClass: 'border-l-4 border-amber-400',
      expiresInDays: 8,
    },
    {
      id: 'D3',
      produce: 'Groundnut (Bold)',
      qty: '1 MT',
      postedDate: '10 Jul 2025',
      deadlineDate: '18 Jul 2025',
      targetPrice: '₹50/kg',
      delivery: 'Thoothukudi',
      grade: 'Bold, clean',
      status: 'active',
      quotesCount: 0,
      borderColorClass: 'border-l-4 border-slate-300',
      expiresInDays: 3,
    },
    {
      id: 'D4',
      produce: 'Tomato (Local)',
      qty: '500 kg',
      postedDate: '01 Jul 2025',
      deadlineDate: '08 Jul 2025',
      targetPrice: '₹15/kg',
      delivery: 'Thoothukudi',
      grade: 'Fully ripe, red',
      status: 'completed',
      quotesCount: 5,
      borderColorClass: 'border-l-4 border-slate-400',
      expiresInDays: 0,
    },
    {
      id: 'D5',
      produce: 'Wheat (Sarbati)',
      qty: '10 MT',
      postedDate: '15 Jun 2025',
      deadlineDate: '22 Jun 2025',
      targetPrice: '₹2,200/q',
      delivery: 'Thoothukudi',
      grade: 'Grade A, premium clean',
      status: 'expired',
      quotesCount: 0,
      borderColorClass: 'border-l-4 border-rose-300',
      expiresInDays: 0,
    },
  ]);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    businessName: '',
    businessType: '',
    state: '',
    district: '',
    city: '',
    gstin: '',
    turnover: '',
    address: '',
    commodities: {
      paddyRice: true,
      wheat: true,
      onion: false,
      tomato: false,
      groundnut: true,
      cotton: false,
      turmeric: false,
      chilli: false,
      coconut: false,
      banana: false,
      maize: false,
      otherPulses: false,
      otherOilseeds: false,
    },
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const path = location.pathname.substring(1) || 'landing';
  let activeMenu = path;
  if (['product-detail', 'checkout', 'order-success', 'contract-harvesting', 'contract-harvesting-detail'].includes(path)) {
    activeMenu = 'marketplace';
  } else if (['top-up', 'withdraw', 'credit-request'].includes(path)) {
    activeMenu = 'wallet';
  } else if (['post-demand'].includes(path)) {
    activeMenu = 'demand-board';
  } else if (['transport-booking', 'delivery-tracking', 'notifications', 'whatsapp-chat', 'feedback'].includes(path)) {
    activeMenu = 'dashboard';
  } else if (['agents', 'profile', 'auctions-list', 'bidding', 'won'].includes(path)) {
    activeMenu = 'auctions';
  }

  return (
    <>
      <Loader />

      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage onRegisterClick={() => navigate('/register-step1')} onLoginClick={() => navigate('/login')} />} />

        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage onLoginSuccess={() => navigate('/dashboard', { replace: true })} onBack={() => navigate('/')} onRegisterClick={() => navigate('/register-step1')} />} />

        <Route element={<AuthLayout />}>
          <Route path="/register-step1" element={<RegisterStep1 formData={formData} setFormData={setFormData} onNext={() => navigate('/register-step2')} onLoginClick={() => navigate('/login')} onBack={() => navigate('/')} />} />
          <Route path="/register-step2" element={<RegisterStep2 formData={formData} setFormData={setFormData} onBack={() => navigate('/register-step1')} onSubmit={() => navigate('/otp-verify')} />} />
          <Route path="/otp-verify" element={
            <OtpVerify mobile={formData.mobile} onBack={() => navigate('/register-step2')} onVerify={() => {
              login({ fullName: formData.fullName, mobile: formData.mobile, sessionStart: Date.now() });
              navigate('/dashboard', { replace: true });
            }} />
          } />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={
            <AppShell
              activeMenu={activeMenu}
              onMenuClick={(menu) => navigate(`/${menu}`)}
              walletBalance={`₹ ${(walletAvailable + walletOnHold).toLocaleString()}`}
              unreadCount={unreadNotifications}
              onLogout={handleLogout}
            >
              <Outlet />
            </AppShell>
          }>
            <Route path="/dashboard" element={<DashboardPage formData={formData} onLogout={handleLogout} onActionClick={(view) => navigate(`/${view}`)} />} />
            <Route path="/auctions" element={<MarketDiscoveryPage onBrowseAgents={(district) => navigate(`/agents?district=${encodeURIComponent(district)}`)} />} />
            <Route path="/agents" element={<AgentDiscoveryPage onBackToMarkets={() => navigate('/auctions')} onViewAuctions={() => navigate('/auctions-list')} onViewProfile={(id) => navigate(`/profile?agent_id=${id}`)} />} />
            <Route path="/profile" element={<AgentProfilePage formData={formData} onBackToAgents={() => navigate('/agents')} onSubmitRequest={() => navigate('/my-agents')} />} />
            <Route path="/my-agents" element={<MyAgentsPage onFindNewAgents={() => navigate('/auctions')} onViewAuctions={() => navigate('/auctions-list')} />} />
            <Route path="/auctions-list" element={<LiveAuctionsPage onJoinAuction={(auc) => { setSelectedAuction(auc); navigate('/bidding'); }} onBackToDashboard={() => navigate(-1)} />} />
            <Route path="/bidding" element={<LiveBiddingPage auction={selectedAuction} onBackToAuctions={() => navigate('/auctions-list')} onPlaceBidSuccess={() => navigate('/won')} />} />
            <Route path="/won" element={<AuctionWonPage onBackToAuctions={() => navigate('/auctions-list')} onBookTransport={() => navigate('/transport-booking')} />} />
            <Route path="/marketplace" element={<MarketplacePage onBackToDashboard={() => navigate('/dashboard')} onSelectProduct={(lotId, agentId) => navigate(`/product-detail?lotId=${lotId}&agentId=${agentId}`)} />} />
            <Route path="/product-detail" element={
              <ProductDetailPage
                onBackToMarketplace={() => navigate('/marketplace')}
                onBuyNow={(order) => {
                  if (order.success) {
                    setOrderSummary({ items: [{ name: order.productName, qty: order.qty, pricePerKg: order.total/order.qty, seller: 'Marketplace Seller' }], subtotal: order.total, paymentMethod: order.paymentMethod, deliveryAddress: formData.address });
                    navigate('/order-success');
                    return;
                  }
                  
                  const items = [
                    { id: '1', name: 'Paddy (Ponni) – Grade A', emoji: '🌾', grade: 'Grade A', seller: 'Murugan Kandasamy | Thoothukudi', pricePerKg: 19.5, qty: order.qty, bg: 'bg-emerald-50/70' },
                    { id: '2', name: 'Groundnut (Bold) – Grade B', emoji: '🥜', grade: 'Grade B', seller: 'Rajan Farm | Thoothukudi', pricePerKg: 52.0, qty: 500, bg: 'bg-amber-50/40' }
                  ];
                  const subtotal = order.qty * 19.5 + 500 * 52.0;
                  setOrderSummary({ items, subtotal, paymentMethod: order.paymentMethod, deliveryAddress: formData.address });
                  navigate('/checkout');
                }}
              />
            } />
            <Route path="/checkout" element={<CheckoutPage initialCart={orderSummary?.items} onBackToMarketplace={() => navigate('/marketplace')} onPlaceOrder={(summary) => { setOrderSummary(summary); navigate('/order-success'); }} />} />
            <Route path="/order-success" element={<OrderSuccessPage orderSummary={orderSummary} onBackToMarketplace={() => navigate('/marketplace')} onBookTransport={() => navigate('/transport-booking')} onRateTransaction={() => navigate('/feedback')} />} />

            <Route path="/wallet" element={
              <WalletPage
                availableBalance={walletAvailable}
                onHoldBalance={walletOnHold}
                onTopUpClick={() => navigate('/top-up')}
                onWithdrawClick={() => navigate('/withdraw')}
                onRequestCreditClick={() => navigate('/credit-request')}
                onInvoiceClick={(ref) => {
                  if (ref === 'INV-9012') {
                    setOrderSummary({
                      items: [{ name: 'Groundnut (Bold) – Grade B', emoji: '🥜', pricePerKg: 52.0, qty: 500 }],
                      subtotal: 26000, paymentMethod: 'wallet', deliveryAddress: formData.address
                    });
                  } else {
                    setOrderSummary({
                      items: [{ name: 'Paddy (Ponni) – Grade A', emoji: '🌾', pricePerKg: 19.5, qty: 50000 }],
                      subtotal: 975000, paymentMethod: 'wallet', deliveryAddress: formData.address
                    });
                  }
                  navigate('/order-success');
                }}
                onBackToDashboard={() => navigate('/dashboard')}
              />
            } />

            <Route path="/top-up" element={<TopUpPage currentAvailableBalance={walletAvailable} onBackToWallet={() => navigate('/wallet')} onTopUpSuccess={(amount) => { setWalletAvailable((prev) => prev + amount); navigate('/wallet'); showToast(`₹${amount.toLocaleString()} added to your wallet!`, 'success'); }} />} />
            <Route path="/withdraw" element={<WithdrawPage availableBalance={walletAvailable} onHoldBalance={walletOnHold} onBackToWallet={() => navigate('/wallet')} onWithdrawSuccess={(amount) => { setWalletAvailable((prev) => prev - amount); navigate('/wallet'); showToast(`₹${amount.toLocaleString()} withdrawn to your Kotak Mahindra Bank account.`, 'success'); }} />} />
            <Route path="/credit-request" element={<CreditRequestPage onBackToWallet={() => navigate('/wallet')} />} />

            <Route path="/demand-board" element={
              <DemandBoardPage
                demands={demands}
                onCloseDemand={(id) => {
                  setDemands((prev) => prev.map((d) => d.id === id ? { ...d, status: 'completed', borderColorClass: 'border-l-4 border-slate-400', expiresInDays: 0 } : d));
                  showToast('Demand closed and moved to Completed.', 'success');
                }}
                onPostNewDemandClick={() => navigate('/post-demand')}
                onViewQuotesClick={(id) => showToast(`Loading quotes for demand ${id}...`, 'info')}
                onBackToDashboard={() => navigate('/dashboard')}
              />
            } />
            <Route path="/post-demand" element={<PostDemandPage onCancel={() => navigate('/demand-board')} onPostDemandSuccess={(newDemand) => { setDemands((prev) => [{ ...newDemand, id: 'D' + (prev.length + 1), postedDate: 'Today', status: 'active', quotesCount: 0, expiresInDays: 7, borderColorClass: 'border-l-4 border-slate-300' }, ...prev]); navigate('/demand-board'); showToast('Demand posted successfully!', 'success'); }} />} />

            <Route path="/contract-harvesting" element={<ContractHarvestingPage onDetailsClick={() => navigate('/contract-harvesting-detail')} onRequestInfoClick={(id) => showToast(`Info request sent for offer ${id}. You'll be notified when they reply.`, 'info')} onBackToDashboard={() => navigate('/dashboard')} />} />
            <Route path="/contract-harvesting-detail" element={<ContractHarvestingDetailPage onBackToList={() => navigate('/contract-harvesting')} />} />
            <Route path="/transport-booking" element={<TransportBookingPage onBookingConfirm={() => navigate('/delivery-tracking')} onBackToDashboard={() => navigate('/dashboard')} />} />
            <Route path="/delivery-tracking" element={<DeliveryTrackingPage onBackToDashboard={() => navigate('/dashboard')} />} />
            <Route path="/reports" element={<ReportsPage deliveryAddress={formData.address} onViewInvoice={(summary) => { setOrderSummary(summary); navigate('/order-success'); }} onBackToDashboard={() => navigate('/dashboard')} />} />
            <Route path="/market-prices" element={<MarketPricesPage />} />
            <Route path="/notifications" element={<NotificationsPage onNavigate={(view, params) => { if (params && view === 'order-success') { setOrderSummary(params); } navigate(`/${view}`); }} onMarkAllReadGlobal={() => setUnreadNotifications(0)} />} />
            <Route path="/whatsapp-chat" element={<WhatsAppChatPage onBackToDashboard={() => navigate('/dashboard')} />} />
            <Route path="/settings" element={<ProfileSettingsPage formData={formData} onBackToDashboard={() => navigate('/dashboard')} />} />
            <Route path="/feedback" element={<FeedbackPage onSubmit={() => navigate('/dashboard')} onBack={() => navigate('/order-success')} />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <SizeProvider>
      <AuthProvider>
        <LoadingProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </LoadingProvider>
      </AuthProvider>
    </SizeProvider>
  );
}
