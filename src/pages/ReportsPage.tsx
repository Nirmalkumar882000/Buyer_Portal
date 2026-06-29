import React, { useState } from 'react';
import { ReportsDashboardPage } from './ReportsDashboardPage';
import { PurchaseHistoryPage } from './PurchaseHistoryPage';
import { AccountLedgerPage } from './AccountLedgerPage';

interface ReportsPageProps {
  onViewInvoice: (orderSummary: any) => void;
  deliveryAddress: string;
  onBackToDashboard: () => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  onViewInvoice,
  deliveryAddress,
  onBackToDashboard,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'ledger'>('history');

  return (
    <div className="space-y-6 font-sans">
      {/* Sub Tabs Panel */}
      <div className="border-b border-slate-200 flex gap-6">
        {/* <button
          onClick={() => setActiveTab('dashboard')}
          className={`pb-3 text-sm font-bold transition-all relative
            ${activeTab === 'dashboard'
              ? 'text-[#1b4d4f] font-extrabold border-b-2 border-[#1b4d4f]'
              : 'text-slate-500 hover:text-slate-800'
            }`}
        >
          Reports Dashboard
        </button> */}
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 text-sm font-bold transition-all relative
            ${activeTab === 'history'
              ? 'text-[#1b4d4f] font-extrabold border-b-2 border-[#1b4d4f]'
              : 'text-slate-500 hover:text-slate-800'
            }`}
        >
          Purchase History
        </button>
        {/* <button
          onClick={() => setActiveTab('ledger')}
          className={`pb-3 text-sm font-bold transition-all relative
            ${activeTab === 'ledger'
              ? 'text-[#1b4d4f] font-extrabold border-b-2 border-[#1b4d4f]'
              : 'text-slate-500 hover:text-slate-800'
            }`}
        >
          Account Ledger / Statement
        </button> */}
      </div>

      {/* {activeTab === 'dashboard' && (
        <ReportsDashboardPage onNavigateTab={(tab) => setActiveTab(tab)} />
      )} */}

      {activeTab === 'history' && (
        <PurchaseHistoryPage
          onViewInvoice={onViewInvoice}
          deliveryAddress={deliveryAddress}
        />
      )}

      {/* {activeTab === 'ledger' && (
        <AccountLedgerPage
          onBackToDashboard={onBackToDashboard}
        />
      )} */}
    </div>
  );
};
