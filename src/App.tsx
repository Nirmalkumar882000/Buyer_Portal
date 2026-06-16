import { useState } from 'react';
import { ToastProvider, useToast } from './context/ToastContext';
import { LoadingProvider } from './context/LoadingContext';
import { Loader } from './components/Loader';
import { LandingPage } from './pages/LandingPage';
import { RegisterStep1 } from './pages/RegisterStep1';
import { RegisterStep2 } from './pages/RegisterStep2';
import { OtpVerify } from './pages/OtpVerify';
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

type ViewState =
  | 'landing'
  | 'register-step1'
  | 'register-step2'
  | 'otp-verify'
  | 'dashboard'
  | 'auctions'
  | 'agents'
  | 'profile'
  | 'my-agents'
  | 'auctions-list'
  | 'bidding'
  | 'won'
  | 'marketplace'
  | 'product-detail'
  | 'checkout'
  | 'order-success'
  | 'wallet'
  | 'top-up'
  | 'withdraw'
  | 'credit-request'
  | 'demand-board'
  | 'post-demand'
  | 'contract-harvesting'
  | 'contract-harvesting-detail'
  | 'transport-booking'
  | 'delivery-tracking'
  | 'reports'
  | 'market-prices'
  | 'notifications'
  | 'whatsapp-chat'
  | 'settings'
  | 'feedback';

function AppContent() {
  const { showToast } = useToast();
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [orderSummary, setOrderSummary] = useState<any>(null);
  const [walletAvailable, setWalletAvailable] = useState<number>(18000);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(2);
  const walletOnHold = 6500;

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
    fullName: 'Ravi Kumar',
    mobile: '+91 98765 43210',
    email: 'name@example.com',
    businessName: '',
    businessType: 'Wholesale Trader',
    state: 'Tamil Nadu',
    district: 'Thoothukudi',
    city: 'Thoothukudi',
    gstin: '',
    turnover: '₹10L – ₹50L',
    address: '2/58K, Shri Lakshmi Complex, Kayamozhi Road, Thoothukudi – 628213',
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
    setCurrentView('landing');
  };

  return (
    <>
      {/* Global Loader Indicator overlay */}
      <Loader />

      {currentView === 'landing' && (
        <LandingPage
          onRegisterClick={() => setCurrentView('register-step1')}
          onLoginClick={() => setCurrentView('otp-verify')}
        />
      )}

      {currentView !== 'landing' && (
        <AppShell
          activeMenu={currentView === 'product-detail' || currentView === 'checkout' || currentView === 'order-success' || currentView === 'contract-harvesting' || currentView === 'contract-harvesting-detail' ? 'marketplace' : currentView === 'top-up' || currentView === 'withdraw' || currentView === 'credit-request' ? 'wallet' : currentView === 'post-demand' ? 'demand-board' : currentView === 'transport-booking' || currentView === 'delivery-tracking' || currentView === 'notifications' || currentView === 'whatsapp-chat' || currentView === 'feedback' ? 'dashboard' : currentView === 'settings' ? 'settings' : currentView}
          onMenuClick={(menu) => setCurrentView(menu as any)}
          walletBalance={`₹ ${(walletAvailable + walletOnHold).toLocaleString()}`}
          unreadCount={unreadNotifications}
        >
          {currentView === 'register-step1' && (
            <RegisterStep1
              formData={formData}
              setFormData={setFormData}
              onNext={() => setCurrentView('register-step2')}
              onLoginClick={() => setCurrentView('otp-verify')}
            />
          )}

          {currentView === 'register-step2' && (
            <RegisterStep2
              formData={formData}
              setFormData={setFormData}
              onBack={() => setCurrentView('register-step1')}
              onSubmit={() => setCurrentView('otp-verify')}
            />
          )}

          {currentView === 'otp-verify' && (
            <OtpVerify mobile={formData.mobile} onVerify={() => setCurrentView('dashboard')} />
          )}

          {currentView === 'dashboard' && (
            <DashboardPage
              formData={formData}
              onLogout={handleLogout}
              onActionClick={(view) => setCurrentView(view as any)}
            />
          )}

          {currentView === 'auctions' && (
            <MarketDiscoveryPage onBrowseAgents={() => setCurrentView('agents')} />
          )}

          {currentView === 'agents' && (
            <AgentDiscoveryPage
              onBackToMarkets={() => setCurrentView('auctions')}
              onViewAuctions={() => setCurrentView('auctions-list')}
              onViewProfile={() => setCurrentView('profile')}
            />
          )}

          {currentView === 'profile' && (
            <AgentProfilePage
              onBackToAgents={() => setCurrentView('agents')}
              onSubmitRequest={() => { showToast('Registration request sent successfully!', 'success'); setCurrentView('my-agents'); }}
            />
          )}

          {currentView === 'my-agents' && (
            <MyAgentsPage
              onFindNewAgents={() => setCurrentView('auctions')}
              onViewAuctions={() => setCurrentView('auctions-list')}
            />
          )}

          {currentView === 'auctions-list' && (
            <LiveAuctionsPage
              onJoinAuction={() => setCurrentView('bidding')}
              onBackToDashboard={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'bidding' && (
            <LiveBiddingPage
              onBackToAuctions={() => setCurrentView('auctions-list')}
              onPlaceBidSuccess={() => setCurrentView('won')}
            />
          )}

          {currentView === 'won' && (
            <AuctionWonPage
              onBackToAuctions={() => setCurrentView('auctions-list')}
              onBookTransport={() => setCurrentView('transport-booking')}
            />
          )}

          {currentView === 'marketplace' && (
            <MarketplacePage
              onBackToDashboard={() => setCurrentView('dashboard')}
              onSelectProduct={() => {
                setCurrentView('product-detail');
              }}
            />
          )}

          {currentView === 'product-detail' && (
            <ProductDetailPage
              onBackToMarketplace={() => setCurrentView('marketplace')}
              onBuyNow={(order) => {
                // Initialize default cart pre-filled with this item, plus Groundnut as shown in mockup
                const items = [
                  {
                    id: '1',
                    name: 'Paddy (Ponni) – Grade A',
                    emoji: '🌾',
                    grade: 'Grade A',
                    seller: 'Murugan Kandasamy | Thoothukudi',
                    pricePerKg: 19.5,
                    qty: order.qty,
                    bg: 'bg-emerald-50/70',
                  },
                  {
                    id: '2',
                    name: 'Groundnut (Bold) – Grade B',
                    emoji: '🥜',
                    grade: 'Grade B',
                    seller: 'Rajan Farm | Thoothukudi',
                    pricePerKg: 52.0,
                    qty: 500,
                    bg: 'bg-amber-50/40',
                  },
                ];
                const subtotal = order.qty * 19.5 + 500 * 52.0;

                setOrderSummary({
                  items,
                  subtotal,
                  paymentMethod: order.paymentMethod,
                  deliveryAddress: formData.address,
                });
                setCurrentView('checkout');
              }}
            />
          )}

          {currentView === 'checkout' && (
            <CheckoutPage
              initialCart={orderSummary?.items}
              onBackToMarketplace={() => setCurrentView('marketplace')}
              onPlaceOrder={(summary) => {
                setOrderSummary(summary);
                setCurrentView('order-success');
              }}
            />
          )}

          {currentView === 'order-success' && (
            <OrderSuccessPage
              orderSummary={orderSummary}
              onBackToMarketplace={() => setCurrentView('marketplace')}
              onBookTransport={() => setCurrentView('transport-booking')}
              onRateTransaction={() => setCurrentView('feedback')}
            />
          )}

          {currentView === 'wallet' && (
            <WalletPage
              availableBalance={walletAvailable}
              onHoldBalance={walletOnHold}
              onTopUpClick={() => setCurrentView('top-up')}
              onWithdrawClick={() => setCurrentView('withdraw')}
              onRequestCreditClick={() => setCurrentView('credit-request')}
              onInvoiceClick={(ref) => {
                // Set mock invoice details matching the clicked reference
                if (ref === 'INV-9012') {
                  setOrderSummary({
                    items: [
                      {
                        name: 'Groundnut (Bold) – Grade B',
                        emoji: '🥜',
                        pricePerKg: 52.0,
                        qty: 500,
                      },
                    ],
                    subtotal: 26000,
                    paymentMethod: 'wallet',
                    deliveryAddress: formData.address,
                  });
                } else {
                  setOrderSummary({
                    items: [
                      {
                        name: 'Paddy (Ponni) – Grade A',
                        emoji: '🌾',
                        pricePerKg: 19.5,
                        qty: 50000, // 975000 / 19.5 = 50000 kg
                      },
                    ],
                    subtotal: 975000,
                    paymentMethod: 'wallet',
                    deliveryAddress: formData.address,
                  });
                }
                setCurrentView('order-success');
              }}
              onBackToDashboard={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'top-up' && (
            <TopUpPage
              currentAvailableBalance={walletAvailable}
              onBackToWallet={() => setCurrentView('wallet')}
              onTopUpSuccess={(amount) => {
                setWalletAvailable((prev) => prev + amount);
                setCurrentView('wallet');
                showToast(`₹${amount.toLocaleString()} added to your wallet!`, 'success');
              }}
            />
          )}

          {currentView === 'withdraw' && (
            <WithdrawPage
              availableBalance={walletAvailable}
              onHoldBalance={walletOnHold}
              onBackToWallet={() => setCurrentView('wallet')}
              onWithdrawSuccess={(amount) => {
                setWalletAvailable((prev) => prev - amount);
                setCurrentView('wallet');
                showToast(`₹${amount.toLocaleString()} withdrawn to your Kotak Mahindra Bank account.`, 'success');
              }}
            />
          )}

          {currentView === 'credit-request' && (
            <CreditRequestPage onBackToWallet={() => setCurrentView('wallet')} />
          )}

          {currentView === 'demand-board' && (
            <DemandBoardPage
              demands={demands}
              onCloseDemand={(id) => {
                setDemands((prev) =>
                  prev.map((d) =>
                    d.id === id
                      ? {
                        ...d,
                        status: 'completed',
                        borderColorClass: 'border-l-4 border-slate-400',
                        expiresInDays: 0,
                      }
                      : d
                  )
                );
                showToast('Demand closed and moved to Completed.', 'success');
              }}
              onPostNewDemandClick={() => setCurrentView('post-demand')}
              onViewQuotesClick={(id) => showToast(`Loading quotes for demand ${id}...`, 'info')}
              onBackToDashboard={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'post-demand' && (
            <PostDemandPage
              onCancel={() => setCurrentView('demand-board')}
              onPostDemandSuccess={(newDemand) => {
                setDemands((prev) => [
                  {
                    ...newDemand,
                    id: 'D' + (prev.length + 1),
                    postedDate: 'Today',
                    status: 'active',
                    quotesCount: 0,
                    expiresInDays: 7,
                    borderColorClass: 'border-l-4 border-slate-300',
                  },
                  ...prev,
                ]);
                setCurrentView('demand-board');
                showToast('Demand posted successfully!', 'success');
              }}
            />
          )}

          {currentView === 'contract-harvesting' && (
            <ContractHarvestingPage
              onDetailsClick={(_id) => setCurrentView('contract-harvesting-detail')}
              onRequestInfoClick={(id) => showToast(`Info request sent for offer ${id}. You'll be notified when they reply.`, 'info')}
              onBackToDashboard={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'contract-harvesting-detail' && (
            <ContractHarvestingDetailPage
              onBackToList={() => setCurrentView('contract-harvesting')}
            />
          )}

          {currentView === 'transport-booking' && (
            <TransportBookingPage
              onBookingConfirm={(_method, _details) => setCurrentView('delivery-tracking')}
              onBackToDashboard={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'delivery-tracking' && (
            <DeliveryTrackingPage
              onBackToDashboard={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'reports' && (
            <ReportsPage
              deliveryAddress={formData.address}
              onViewInvoice={(summary) => {
                setOrderSummary(summary);
                setCurrentView('order-success');
              }}
              onBackToDashboard={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'market-prices' && (
            <MarketPricesPage />
          )}

          {currentView === 'notifications' && (
            <NotificationsPage
              onNavigate={(view, params) => {
                if (params && view === 'order-success') {
                  setOrderSummary(params);
                }
                setCurrentView(view as any);
              }}
              onMarkAllReadGlobal={() => setUnreadNotifications(0)}
            />
          )}

          {currentView === 'whatsapp-chat' && (
            <WhatsAppChatPage
              onBackToDashboard={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'settings' && (
            <ProfileSettingsPage
              formData={formData}
              onBackToDashboard={() => setCurrentView('dashboard')}
              onSaveSuccess={() => showToast('Profile saved successfully!', 'success')}
            />
          )}

          {currentView === 'feedback' && (
            <FeedbackPage
              onSubmit={() => setCurrentView('dashboard')}
              onBack={() => setCurrentView('order-success')}
            />
          )}
        </AppShell>
      )}
    </>
  );
}

export default function App() {
  return (
    <LoadingProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </LoadingProvider>
  );
}

