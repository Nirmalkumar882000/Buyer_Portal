import React from 'react';
import { useToast } from '../context/ToastContext';

interface Transaction {
  date: string;
  description: string;
  debit: string | null;
  credit: string | null;
  balance: string;
  ref: string | null;
}

interface WalletPageProps {
  availableBalance: number;
  onHoldBalance: number;
  onTopUpClick: () => void;
  onWithdrawClick: () => void;
  onRequestCreditClick: () => void;
  onInvoiceClick: (invoiceRef: string) => void;
  onBackToDashboard: () => void;
}

export const WalletPage: React.FC<WalletPageProps> = ({
  availableBalance,
  onHoldBalance,
  onTopUpClick,
  onWithdrawClick,
  onRequestCreditClick,
  onInvoiceClick,
  onBackToDashboard,
}) => {
  const { showToast } = useToast();
  const transactions: Transaction[] = [
    {
      date: '15 Jul 2025',
      description: 'Auction Win — Paddy Lot #A-2295 (Escrow Settled)',
      debit: '9,75,000',
      credit: null,
      balance: '24,500',
      ref: 'INV-2295',
    },
    {
      date: '15 Jul 2025',
      description: 'Wallet Top Up — UPI (Razorpay #RZP001)',
      debit: null,
      credit: '10,00,000',
      balance: '9,99,500',
      ref: null,
    },
    {
      date: '12 Jul 2025',
      description: 'Bid Escrow Released — Onion Lot #A-2291 (Outbid)',
      debit: null,
      credit: '2,100',
      balance: '1,500',
      ref: null,
    },
    {
      date: '12 Jul 2025',
      description: 'Bid Placed (Escrow) — Onion Lot #A-2291',
      debit: '2,100',
      credit: null,
      balance: '-600',
      ref: null,
    },
    {
      date: '10 Jul 2025',
      description: 'Fixed Price Purchase — Groundnut 500kg (Rajan Farm)',
      debit: '26,000',
      balance: '1,500',
      credit: null,
      ref: 'INV-9012',
    },
    {
      date: '08 Jul 2025',
      description: 'Wallet Top Up — NEFT (Kotak Bank)',
      debit: null,
      credit: '50,000',
      balance: '27,500',
      ref: null,
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Breadcrumbs */}
      <div className="text-xs text-slate-400 font-medium">
        <button onClick={onBackToDashboard} className="hover:text-slate-600 underline">Home</button>
        <span className="mx-1.5">&rsaquo;</span>
        <span className="text-slate-500 font-semibold">Wallet</span>
      </div>

      {/* Title & Quick Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Wallet</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onTopUpClick}
            className="bg-[#1b4d4f] hover:bg-[#123637] text-white text-xs font-bold px-4 py-2.5 rounded-md transition shadow-xs flex items-center gap-1.5"
          >
            &uarr; Top Up
          </button>
          <button
            onClick={onWithdrawClick}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-350 text-xs font-bold px-4 py-2.5 rounded-md transition text-center shadow-2xs"
          >
            &darr; Withdraw
          </button>
          <button
            onClick={onRequestCreditClick}
            className="bg-white hover:bg-slate-50 text-[#1b4d4f] border border-slate-350 text-xs font-bold px-4 py-2.5 rounded-md transition text-center shadow-2xs flex items-center gap-1"
          >
            💳 Request Credit
          </button>
        </div>
      </div>

      {/* Balance Hero Card */}
      <div className="bg-gradient-to-r from-[#173e40] to-[#1c5355] text-white rounded-xl p-7 shadow-md relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-4">
          <div>
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">TOTAL WALLET BALANCE</p>
            <p className="text-3xl md:text-4xl font-black mt-1">₹ {(availableBalance + onHoldBalance).toLocaleString()}</p>
          </div>
          <div className="flex gap-8">
            <div>
              <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">ON HOLD (BIDS)</p>
              <p className="text-sm font-extrabold text-amber-400 mt-0.5">₹ {onHoldBalance.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">AVAILABLE</p>
              <p className="text-sm font-extrabold text-cyan-300 mt-0.5">₹ {availableBalance.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Brand/Owner Details */}
        <div className="text-right text-[11px] text-slate-350 font-medium md:border-l md:border-white/10 md:pl-8 space-y-1 self-stretch flex flex-col justify-center items-start md:items-end">
          <p className="font-bold text-white text-xs">Kumar Agro Traders</p>
          <p>buyer.velaanbay.in</p>
          <p className="text-[10px] text-slate-400 italic">Last updated: Now</p>
        </div>
      </div>

      {/* Ledger Section */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-800">Transaction History</h2>
          <div className="flex gap-2">
            <select className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-md outline-hidden text-xs text-slate-600 font-semibold">
              <option>Last 30 days</option>
              <option>Last 6 months</option>
              <option>Year to Date</option>
            </select>
            <button
              onClick={() => showToast('Downloading wallet statement...', 'info')}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-350 text-xs font-bold px-3 py-1.5 rounded-md transition text-center shadow-2xs"
            >
              &darr; Download
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-150">
                <th className="p-3">Date</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-right">Debit (₹)</th>
                <th className="p-3 text-right">Credit (₹)</th>
                <th className="p-3 text-right">Balance (₹)</th>
                <th className="p-3 text-center">Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {transactions.map((tx, idx) => (
                <tr key={idx} className="hover:bg-slate-50/40">
                  <td className="p-3 text-slate-500">{tx.date}</td>
                  <td className="p-3 text-slate-850 font-semibold">{tx.description}</td>
                  <td className="p-3 text-right text-rose-600 font-bold">
                    {tx.debit ? `-${tx.debit}` : '—'}
                  </td>
                  <td className="p-3 text-right text-emerald-600 font-bold">
                    {tx.credit ? `+${tx.credit}` : '—'}
                  </td>
                  <td className="p-3 text-right text-slate-800">{tx.balance}</td>
                  <td className="p-3 text-center">
                    {tx.ref ? (
                      <button
                        onClick={() => onInvoiceClick(tx.ref!)}
                        className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md hover:bg-emerald-100 transition shadow-2xs"
                      >
                        {tx.ref}
                      </button>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
