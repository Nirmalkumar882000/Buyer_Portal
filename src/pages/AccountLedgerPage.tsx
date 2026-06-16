import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

interface LedgerItem {
  date: string;
  txId: string;
  desc: string;
  debit: number | null;
  credit: number | null;
  balance: number;
}

interface AccountLedgerPageProps {
  onBackToDashboard: () => void;
}

const initialLedger: LedgerItem[] = [
  {
    date: '15 Jul',
    txId: 'TXN-8841',
    desc: 'Wallet Top Up — UPI (Razorpay)',
    debit: null,
    credit: 1000000,
    balance: 1024500,
  },
  {
    date: '15 Jul',
    txId: 'TXN-8840',
    desc: 'Auction Win — Paddy Lot #A-2295',
    debit: 975000,
    credit: null,
    balance: 24500,
  },
  {
    date: '12 Jul',
    txId: 'TXN-8822',
    desc: 'Bid Escrow Released — Onion Lot #A-2291',
    debit: null,
    credit: 2100,
    balance: 999500,
  },
  {
    date: '10 Jul',
    txId: 'TXN-8791',
    desc: 'Fixed Price Purchase — Groundnut 500kg',
    debit: 26000,
    credit: null,
    balance: 997400,
  },
  {
    date: '08 Jul',
    txId: 'TXN-8770',
    desc: 'Wallet Top Up — Bank Transfer (NEFT)',
    debit: null,
    credit: 50000,
    balance: 1023400,
  },
  {
    date: '05 Jul',
    txId: 'TXN-8742',
    desc: 'Withdrawal to Bank (NEFT)',
    debit: 10000,
    credit: null,
    balance: 973400,
  },
];

export const AccountLedgerPage: React.FC<AccountLedgerPageProps> = ({ onBackToDashboard: _onBackToDashboard }) => {
  const { showToast } = useToast();
  const [fromDate, setFromDate] = useState('2025-07-01');
  const [toDate, setToDate] = useState('2025-07-15');
  const [selectedType, setSelectedType] = useState('All');
  const [ledger, setLedger] = useState<LedgerItem[]>(initialLedger);

  const handleGenerate = () => {
    const results = initialLedger.filter((item) => {
      if (selectedType === 'Purchases' && !item.desc.toLowerCase().includes('purchase') && !item.desc.toLowerCase().includes('win')) {
        return false;
      }
      if (selectedType === 'Wallet' && !item.desc.toLowerCase().includes('top up') && !item.desc.toLowerCase().includes('withdrawal')) {
        return false;
      }
      return true;
    });
    setLedger(results);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Breadcrumbs and Title */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <div className="text-xs text-slate-400 font-semibold mb-1">
            <span className="text-slate-450">Reports</span>
            <span className="mx-1.5">&rsaquo;</span>
            <span className="text-slate-500 font-semibold">Ledger / Statement</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Account Ledger</h1>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Complete financial statement for your buyer account
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 self-start sm:self-center">
          <button
            onClick={() => showToast('Downloading PDF ledger...', 'info')}
            className="px-3.5 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-md shadow-2xs flex items-center gap-1.5 transition"
          >
            📄 Download PDF
          </button>
          <button
            onClick={() => showToast('Exporting ledger to Excel...', 'info')}
            className="px-3.5 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-md shadow-2xs flex items-center gap-1.5 transition"
          >
            📊 Export Excel
          </button>
        </div>
      </div>

      {/* Date Range and Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-slate-450 text-[10px] uppercase tracking-wide">Period:</span>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="p-2 border border-slate-300 rounded-md bg-white text-slate-700 font-semibold focus:border-[#1b4d4f] outline-hidden"
          />
          <span className="text-slate-400 font-normal">to</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="p-2 border border-slate-300 rounded-md bg-white text-slate-700 font-semibold focus:border-[#1b4d4f] outline-hidden"
          />
        </div>

        {/* Transaction Type Dropdown */}
        <div className="flex-1 min-w-[150px]">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-md bg-white text-slate-700 font-semibold focus:border-[#1b4d4f] outline-hidden"
          >
            <option value="All">All Transactions</option>
            <option value="Purchases">Purchases</option>
            <option value="Wallet">Wallet Actions</option>
          </select>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          className="px-5 py-2.5 bg-[#1b4d4f] hover:bg-[#123637] text-white text-xs font-bold rounded-md shadow-xs transition"
        >
          Generate Statement
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Opening Balance</span>
          <span className="text-2xl font-black text-slate-800">₹10,000</span>
          <span className="text-[10px] text-slate-450 block font-semibold mt-1">01 Jul 2025</span>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Total Credits</span>
          <span className="text-2xl font-black text-emerald-600">+₹10,62,100</span>
          <span className="text-[10px] text-slate-450 block font-semibold mt-1">3 top ups + 1 escrow release</span>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Total Debits</span>
          <span className="text-2xl font-black text-rose-600">-₹10,47,600</span>
          <span className="text-[10px] text-slate-450 block font-semibold mt-1">5 purchases, 1 withdrawal</span>
        </div>
      </div>

      {/* Account Ledger Table Card */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <th className="p-4">Date</th>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Description</th>
                <th className="p-4 text-right">Debit (₹)</th>
                <th className="p-4 text-right">Credit (₹)</th>
                <th className="p-4 text-right">Balance (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {ledger.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition">
                  <td className="p-4 text-slate-500">{item.date}</td>
                  <td className="p-4 font-mono text-[11px] text-slate-600">{item.txId}</td>
                  <td className="p-4 text-slate-800">{item.desc}</td>
                  <td className="p-4 text-right text-rose-600">
                    {item.debit ? `-${item.debit.toLocaleString()}` : '—'}
                  </td>
                  <td className="p-4 text-right text-emerald-600">
                    {item.credit ? `+${item.credit.toLocaleString()}` : '—'}
                  </td>
                  <td className="p-4 text-right font-extrabold text-slate-900">
                    {item.balance.toLocaleString()}
                  </td>
                </tr>
              ))}

              {/* Closing Balance row */}
              <tr className="bg-cyan-50/20 font-black text-[#1b4d4f] border-t border-slate-200">
                <td colSpan={3} className="p-4 text-sm font-bold">
                  Closing Balance &mdash; 15 Jul 2025
                </td>
                <td className="p-4 text-right text-rose-600 text-sm">
                  -₹10,47,600
                </td>
                <td className="p-4 text-right text-emerald-600 text-sm">
                  +₹10,62,100
                </td>
                <td className="p-4 text-right text-slate-900 text-sm font-extrabold">
                  ₹10,24,500
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
