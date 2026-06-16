import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

interface ReportsDashboardPageProps {
  onNavigateTab: (tab: 'history' | 'ledger') => void;
}

export const ReportsDashboardPage: React.FC<ReportsDashboardPageProps> = ({ onNavigateTab }) => {
  const { showToast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState('July 2025');

  // Hardcoded bar heights for 15 days in July 2025
  const barHeights = [28, 16, 32, 54, 45, 62, 70, 50, 80, 68, 55, 60, 88, 76, 92];
  const isHighValue = (val: number) => val > 75; // Bars over 75 are light teal/cyan

  return (
    <div className="space-y-6 font-sans">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes pop-in {
          0% {
            transform: scale(0.7) rotate(-25deg);
            opacity: 0;
          }
          75% {
            transform: scale(1.04) rotate(3deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        @keyframes grow-up {
          0% {
            transform: scaleY(0);
          }
          100% {
            transform: scaleY(1);
          }
        }
        .animate-pop-in {
          animation: pop-in 0.85s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-grow-up {
          transform-origin: bottom;
          animation: grow-up 0.75s cubic-bezier(0.25, 1, 0.5, 1) both;
        }
      `}} />
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          {/* Breadcrumbs */}
          <div className="text-xs text-slate-400 font-semibold mb-1">
            <span className="text-slate-450">Home</span>
            <span className="mx-1.5">&rsaquo;</span>
            <span className="text-slate-500 font-semibold">Reports</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Reports Dashboard</h1>
          <p className="text-xs text-slate-500 font-bold mt-0.5">
            Summary analytics for {selectedMonth}
          </p>
        </div>

        {/* Month Selector dropdown */}
        <div className="self-start sm:self-center">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="p-2.5 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-md shadow-2xs focus:border-[#1b4d4f] outline-hidden min-w-[130px]"
          >
            <option value="July 2025">July 2025</option>
            <option value="June 2025">June 2025</option>
            <option value="May 2025">May 2025</option>
          </select>
        </div>
      </div>

      {/* 4 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Card 1: Daily Purchases */}
        <div
          onClick={() => onNavigateTab('history')}
          className="bg-white border border-slate-200 hover:border-[#1b4d4f] rounded-lg p-5 shadow-2xs transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Daily Purchases</span>
            <span className="text-lg">🛒</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-800">₹1.2L</span>
            <span className="text-[10px] text-slate-450 block font-bold mt-0.5">Today's total</span>
          </div>
        </div>

        {/* Card 2: Bids Placed */}
        <div
          onClick={() => showToast('Loading bids summary...', 'info')}
          className="bg-white border border-slate-200 hover:border-[#1b4d4f] rounded-lg p-5 shadow-2xs transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Bids Placed</span>
            <span className="text-lg">🏷️</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-800">47</span>
            <span className="text-[10px] text-emerald-600 block font-bold mt-0.5">This month | 28 won</span>
          </div>
        </div>

        {/* Card 3: Payables */}
        <div
          onClick={() => onNavigateTab('ledger')}
          className="bg-white border border-slate-200 hover:border-[#1b4d4f] rounded-lg p-5 shadow-2xs transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Payables</span>
            <span className="text-lg">📊</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-800">₹12,000</span>
            <span className="text-[10px] text-rose-600 block font-bold mt-0.5">Credit dues pending</span>
          </div>
        </div>

        {/* Card 4: Monthly Purchases */}
        <div
          onClick={() => onNavigateTab('history')}
          className="bg-white border border-slate-200 hover:border-[#1b4d4f] rounded-lg p-5 shadow-2xs transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Monthly Purchases</span>
            <span className="text-lg">📅</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-800">₹10.9L</span>
            <span className="text-[10px] text-emerald-600 block font-bold mt-0.5">↑ 18% vs June</span>
          </div>
        </div>

      </div>

      {/* Charts 2 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* Left Column - Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">
              Daily Purchase Value &mdash; July 2025 (₹)
            </h3>

            {/* Bar Chart Visualization */}
            <div className="bg-slate-50/50 border border-slate-150 rounded-lg p-6 h-56 flex items-end justify-between gap-1 sm:gap-2">
              {barHeights.map((h, idx) => {
                const high = isHighValue(h);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    {/* The bar */}
                    <div
                      style={{ height: `${h}%`, animationDelay: `${idx * 50}ms` }}
                      className={`w-full rounded-t-xs transition-all duration-300 hover:opacity-85 cursor-pointer relative group animate-grow-up
                        ${high ? 'bg-[#57c7c0]' : 'bg-[#1b4d4f]'}`}
                    >
                      {/* Tooltip on hover */}
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-20">
                        ₹{(h * 3000).toLocaleString()}
                      </span>
                    </div>
                    {/* Day label */}
                    <span className="text-[9px] text-slate-400 font-bold">{idx + 1}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center mt-3 text-[10px] text-slate-400 font-bold">
            Date (Jul 2025) | Bars show daily purchase value
          </div>
        </div>

        {/* Right Column - Donut Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">
              Payment Method Breakdown
            </h3>

            {/* Donut and Legend row */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 h-56">

              {/* Solid Pie Chart (conic-gradient) */}
              <div
                className="w-36 h-36 rounded-full shadow-xs border border-slate-150 shrink-0 animate-pop-in hover:scale-105 duration-300 transition-all cursor-pointer"
                style={{
                  background: 'conic-gradient(#1b4d4f 0% 60%, #8acfd2 60% 80%, #e59e30 80% 90%, #d9534f 90% 100%)'
                }}
              />

              {/* Legend List */}
              <div className="space-y-2.5 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-sm shrink-0" style={{ backgroundColor: '#1b4d4f' }} />
                  <span>Wallet &mdash; 60%</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-sm shrink-0" style={{ backgroundColor: '#8acfd2' }} />
                  <span>Credit Limit &mdash; 20%</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-sm shrink-0" style={{ backgroundColor: '#e59e30' }} />
                  <span>UPI/Online &mdash; 10%</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-sm shrink-0" style={{ backgroundColor: '#d9534f' }} />
                  <span>Other &mdash; 10%</span>
                </div>
              </div>

            </div>
          </div>

          {/* Action CTAs at bottom */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab('history')}
              className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-350 text-xs font-bold rounded-md transition shadow-2xs flex items-center justify-center gap-1.5"
            >
              📄 Full Report
            </button>
            <button
              onClick={() => showToast('Exporting payment breakdown to Excel...', 'info')}
              className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-350 text-xs font-bold rounded-md transition shadow-2xs flex items-center justify-center gap-1.5"
            >
              📊 Export Excel
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
