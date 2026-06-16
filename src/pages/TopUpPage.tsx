import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

interface TopUpPageProps {
  currentAvailableBalance: number;
  onTopUpSuccess: (amount: number) => void;
  onBackToWallet: () => void;
}

export const TopUpPage: React.FC<TopUpPageProps> = ({
  currentAvailableBalance,
  onTopUpSuccess,
  onBackToWallet,
}) => {
  const { showToast } = useToast();
  const [selectedPreset, setSelectedPreset] = useState<number | 'custom'>(1000);
  const [customAmountStr, setCustomAmountStr] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'upi' | 'bank'>('upi');
  const [selectedUpiMethod, setSelectedUpiMethod] = useState<string>('gpay');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showRazorpay, setShowRazorpay] = useState<boolean>(false);

  const presets = [1000, 5000, 10000, 25000, 50000];

  const getTopUpAmount = (): number => {
    if (selectedPreset === 'custom') {
      const parsed = parseFloat(customAmountStr);
      return isNaN(parsed) ? 0 : parsed;
    }
    return selectedPreset;
  };

  const topUpAmount = getTopUpAmount();
  const processingFee = 0;
  const newWalletBalance = currentAvailableBalance + topUpAmount;

  const handlePresetSelect = (val: number | 'custom') => {
    setSelectedPreset(val);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmountStr(val);
  };

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (topUpAmount <= 0) {
      showToast('Please enter a valid top-up amount.', 'error');
      return;
    }
    setShowRazorpay(true);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowRazorpay(false);
      onTopUpSuccess(topUpAmount);
    }, 2000);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 font-sans relative">
      {/* Breadcrumbs */}
      <div className="text-xs text-slate-400 font-medium">
        <button onClick={onBackToWallet} className="hover:text-slate-600 underline">Wallet</button>
        <span className="mx-1.5">&rsaquo;</span>
        <span className="text-slate-500 font-semibold">Top Up</span>
      </div>

      {/* Screen Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Top Up Wallet</h1>
        <p className="text-xs text-slate-500 mt-1">
          Current Balance: ₹{currentAvailableBalance.toLocaleString()} available
        </p>
      </div>

      {/* Top Up Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-6">
        <form onSubmit={handleProceed} className="space-y-6">
          {/* Preset Selector Grid */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Select Amount</label>
            <div className="grid grid-cols-3 gap-3">
              {presets.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handlePresetSelect(amt)}
                  className={`py-3.5 border rounded-lg text-xs font-bold transition text-center
                    ${selectedPreset === amt
                      ? 'border-[#1b4d4f] bg-[#e2f2f1]/30 text-[#1b4d4f] ring-1 ring-[#1b4d4f]'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                >
                  ₹{amt.toLocaleString()}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handlePresetSelect('custom')}
                className={`py-3.5 border rounded-lg text-xs font-bold transition text-center
                  ${selectedPreset === 'custom'
                    ? 'border-[#1b4d4f] bg-[#e2f2f1]/30 text-[#1b4d4f] ring-1 ring-[#1b4d4f]'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
              >
                Custom
              </button>
            </div>
          </div>

          {/* Custom Amount Free-text input */}
          {selectedPreset === 'custom' && (
            <div className="space-y-1.5 animate-fadeIn">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Custom Amount (₹)</label>
              <input
                type="text"
                value={customAmountStr}
                onChange={handleCustomAmountChange}
                placeholder="Or enter custom amount.."
                className="w-full text-xs p-3 bg-white border border-slate-300 rounded-md focus:border-[#1b4d4f] outline-hidden text-slate-700 font-bold"
                required
              />
            </div>
          )}

          {/* Tab Selector */}
          <div className="border-b border-slate-200">
            <div className="flex gap-6 -mb-px">
              <button
                type="button"
                onClick={() => setActiveTab('upi')}
                className={`pb-2.5 text-xs font-bold transition flex items-center gap-1.5 border-b-2
                  ${activeTab === 'upi'
                    ? 'border-[#1b4d4f] text-[#1b4d4f]'
                    : 'border-transparent text-slate-450 hover:text-slate-700'
                  }`}
              >
                💳 UPI / Online (Instant)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('bank')}
                className={`pb-2.5 text-xs font-bold transition flex items-center gap-1.5 border-b-2
                  ${activeTab === 'bank'
                    ? 'border-[#1b4d4f] text-[#1b4d4f]'
                    : 'border-transparent text-slate-450 hover:text-slate-700'
                  }`}
              >
                🏦 Bank Transfer (NEFT/IMPS)
              </button>
            </div>
          </div>

          {/* UPI Grid Option */}
          {activeTab === 'upi' && (
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">CHOOSE PAYMENT METHOD</label>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { id: 'gpay', label: 'GPay', emoji: '📱' },
                  { id: 'phonepe', label: 'PhonePe', emoji: '💸' },
                  { id: 'paytm', label: 'Paytm', emoji: '🪙' },
                  { id: 'card', label: 'Card', emoji: '💳' },
                  { id: 'netbank', label: 'Net Banking', emoji: '🏦' },
                  { id: 'upi_id', label: 'UPI ID', emoji: '🪙' },
                  { id: 'bhim', label: 'BHIM', emoji: '📲' },
                  { id: 'amazon', label: 'Amazon Pay', emoji: '🛍' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedUpiMethod(m.id)}
                    className={`p-3 border rounded-lg flex flex-col items-center justify-center gap-1.5 transition hover:bg-slate-50
                      ${selectedUpiMethod === m.id
                        ? 'border-[#1b4d4f] bg-[#e2f2f1]/20 ring-1 ring-[#1b4d4f]'
                        : 'border-slate-200 text-slate-700'
                      }`}
                  >
                    <span className="text-xl">{m.emoji}</span>
                    <span className="text-[9px] font-bold text-slate-550">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bank Transfer Information */}
          {activeTab === 'bank' && (
            <div className="space-y-4 bg-slate-50/70 border border-slate-200 rounded-lg p-4 font-semibold text-xs text-slate-700">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide pb-1.5 border-b border-slate-150">VelaanBay Bank Details</p>
              <div className="grid grid-cols-2 gap-y-2 text-slate-650">
                <span>Account Name:</span>
                <span className="text-slate-800">VelaanBay Agrotech Pvt Ltd</span>
                <span>Bank Name:</span>
                <span className="text-slate-800">ICICI Bank</span>
                <span>Account Number:</span>
                <span className="text-slate-800">908273645012</span>
                <span>IFSC Code:</span>
                <span className="text-slate-800">ICIC0000104</span>
                <span>Branch:</span>
                <span className="text-slate-800">Thoothukudi</span>
              </div>
              <p className="text-[9px] text-slate-400 leading-normal italic pt-2 border-t border-slate-150">
                * Note: Bank transfers take 2 to 4 hours to verify and settle into your wallet balance.
              </p>
            </div>
          )}

          {/* Payment Summary Box */}
          <div className="bg-slate-50 border border-slate-150 rounded-lg p-4.5 space-y-2 text-xs font-semibold text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-450 font-normal">Top Up Amount</span>
              <span>₹{topUpAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-450 font-normal">Processing Fee</span>
              <span>₹{processingFee.toLocaleString()}</span>
            </div>
            <hr className="border-slate-200 my-1.5" />
            <div className="flex justify-between text-sm font-extrabold text-[#1b4d4f]">
              <span>New Wallet Balance</span>
              <span>₹{newWalletBalance.toLocaleString()}</span>
            </div>
          </div>

          {/* Proceed to Pay CTA */}
          <div className="space-y-2.5">
            <button
              type="submit"
              disabled={topUpAmount <= 0}
              className={`w-full py-3.5 rounded-md text-xs font-bold text-white transition shadow-xs flex items-center justify-center gap-2
                ${topUpAmount <= 0
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-[#1b4d4f] hover:bg-[#123637]'
                }`}
            >
              Proceed to Pay &mdash; ₹{topUpAmount.toLocaleString()} via Razorpay &rarr;
            </button>
            <p className="text-[9px] text-slate-400 text-center leading-relaxed font-semibold">
              Secured by Razorpay | PCI DSS Compliant | 256-bit SSL Secure Connection
            </p>
          </div>
        </form>
      </div>

      {/* Razorpay Simulated Gateway Modal */}
      {showRazorpay && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 w-full max-w-sm rounded-xl overflow-hidden shadow-2xl border border-slate-800 text-white font-sans">
            {/* Gateway Header */}
            <div className="bg-slate-900 px-5 py-4 flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-extrabold text-sm tracking-widest">Razorpay</span>
                <span className="text-[10px] text-slate-450 border border-slate-700 px-1.5 py-0.5 rounded-sm">DEMO SECURE</span>
              </div>
              <button
                onClick={() => setShowRazorpay(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            {/* Gateway Body */}
            <div className="p-6 space-y-6 text-center">
              <div className="space-y-1.5">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">PAYING VELAANBAY AGROTECH</p>
                <p className="text-3xl font-black text-white">₹{topUpAmount.toLocaleString()}</p>
              </div>

              {isProcessing ? (
                <div className="py-6 flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-semibold text-slate-350">Processing payment secure check...</p>
                </div>
              ) : (
                <div className="py-6 space-y-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-left space-y-1.5">
                    <p className="font-bold">UPI Payment Simulation</p>
                    <p className="text-slate-400 text-[10px]">Method: {selectedUpiMethod.toUpperCase()}</p>
                    <p className="text-slate-400 text-[10px]">Account: buyer@velaanbay.in</p>
                  </div>
                  <button
                    onClick={handleSimulatePayment}
                    className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-black text-xs rounded-md transition tracking-wider uppercase shadow-md shadow-cyan-500/10"
                  >
                    Simulate Success Payment
                  </button>
                </div>
              )}
            </div>

            {/* Gateway Footer */}
            <div className="bg-slate-900/60 px-5 py-3 border-t border-slate-900 text-center text-[9px] text-slate-450 font-semibold">
              🔒 Powered by Razorpay Securitas | 256-bit AES Encryption
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
