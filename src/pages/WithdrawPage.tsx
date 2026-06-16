import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

interface WithdrawPageProps {
  availableBalance: number;
  onHoldBalance: number;
  onWithdrawSuccess: (amount: number) => void;
  onBackToWallet: () => void;
}

export const WithdrawPage: React.FC<WithdrawPageProps> = ({
  availableBalance,
  onHoldBalance,
  onWithdrawSuccess,
  onBackToWallet,
}) => {
  const { showToast } = useToast();
  const [withdrawAmountStr, setWithdrawAmountStr] = useState<string>('10000');

  const minWithdraw = 500;
  const maxWithdraw = availableBalance;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setWithdrawAmountStr(val);
  };

  const withdrawAmount = parseFloat(withdrawAmountStr) || 0;
  const processingFee = 0;
  const newBalance = availableBalance - withdrawAmount;

  const isAmountValid =
    withdrawAmount >= minWithdraw && withdrawAmount <= maxWithdraw;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAmountValid) {
      showToast(`Enter an amount between ₹${minWithdraw.toLocaleString()} and ₹${maxWithdraw.toLocaleString()}.`, 'error');
      return;
    }
    onWithdrawSuccess(withdrawAmount);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 font-sans">
      {/* Breadcrumbs */}
      <div className="text-xs text-slate-400 font-medium">
        <button onClick={onBackToWallet} className="hover:text-slate-600 underline">Wallet</button>
        <span className="mx-1.5">&rsaquo;</span>
        <span className="text-slate-500 font-semibold">Withdraw</span>
      </div>

      {/* Screen Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Wallet Withdrawal</h1>
      </div>

      {/* Main Form Box */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-6">
        {/* Available Balance Hero Display */}
        <div className="bg-gradient-to-r from-[#173e40] to-[#1c5355] text-white text-center rounded-lg p-6 shadow-xs">
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">AVAILABLE FOR WITHDRAWAL</p>
          <p className="text-3xl font-black mt-1">₹ {availableBalance.toLocaleString()}</p>
          <p className="text-[10px] text-slate-400 mt-2 font-medium">
            ₹{onHoldBalance.toLocaleString()} on hold (active bids &mdash; not withdrawable)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Amount input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Withdrawal Amount *</label>
            <div className="relative rounded-md shadow-2xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs font-bold">
                ₹
              </div>
              <input
                type="text"
                value={withdrawAmountStr}
                onChange={handleAmountChange}
                placeholder="Enter withdrawal amount..."
                className="w-full text-xs pl-7 pr-3 py-3.5 bg-white border border-slate-350 rounded-md focus:border-[#1b4d4f] outline-hidden text-slate-800 font-extrabold"
                required
              />
            </div>
            <p className="text-[9px] text-slate-400 font-bold">
              Min ₹{minWithdraw.toLocaleString()} | Max ₹{maxWithdraw.toLocaleString()}
            </p>
          </div>

          {/* Read-only bank info card */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">TRANSFER TO REGISTERED BANK ACCOUNT</span>
            <div className="grid grid-cols-2 gap-y-3.5 text-xs font-semibold">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-normal block">BANK</span>
                <span className="text-slate-800">Kotak Mahindra Bank</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-normal block">ACCOUNT</span>
                <span className="text-slate-800">**** **** 2954</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-normal block">IFSC</span>
                <span className="text-slate-800">KKBK0008798</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-normal block">ACCOUNT NAME</span>
                <span className="text-slate-800">Kumar Agro Traders</span>
              </div>
            </div>
            <p className="text-[9px] text-slate-400 italic pt-1.5 border-t border-slate-150">
              To change bank account, update in Profile &rarr; Bank Details
            </p>
          </div>

          {/* Processing time notice */}
          <div className="bg-[#e2f2f1]/35 border-l-4 border-[#1b4d4f] p-3.5 rounded-r-md flex gap-3 items-center">
            <span className="text-base text-[#1b4d4f] select-none">💡</span>
            <p className="text-xs font-semibold text-slate-700 leading-normal">
              <span className="text-[#1b4d4f] font-bold">Processing Time:</span> 1&ndash;2 business hours via NEFT/IMPS. No withdrawal fee.
            </p>
          </div>

          {/* Calculations Summary */}
          <div className="bg-slate-50 border border-slate-150 rounded-lg p-4 space-y-2 text-xs font-semibold text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-450 font-normal">Withdrawal Amount</span>
              <span>₹{withdrawAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-450 font-normal">Processing Fee</span>
              <span>₹{processingFee.toLocaleString()}</span>
            </div>
            <hr className="border-slate-200 my-1.5" />
            <div className="flex justify-between text-sm font-extrabold text-[#1b4d4f]">
              <span>New Wallet Balance</span>
              <span>₹{newBalance.toLocaleString()}</span>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            type="submit"
            disabled={!isAmountValid}
            className={`w-full py-3.5 rounded-md text-xs font-bold text-white transition shadow-xs flex items-center justify-center gap-2
              ${!isAmountValid
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-[#1b4d4f] hover:bg-[#123637]'
              }`}
          >
            Confirm Withdrawal &mdash; ₹{withdrawAmount.toLocaleString()}
          </button>
        </form>
      </div>
    </div>
  );
};
