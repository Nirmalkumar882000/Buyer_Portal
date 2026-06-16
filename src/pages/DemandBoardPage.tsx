import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

interface Demand {
  id: string;
  produce: string;
  qty: string;
  postedDate: string;
  deadlineDate: string;
  targetPrice: string;
  delivery: string;
  grade: string;
  status: 'active' | 'completed' | 'expired';
  quotesCount: number;
  expiresInDays: number;
  borderColorClass: string;
}

interface DemandBoardPageProps {
  demands: Demand[];
  onCloseDemand: (id: string) => void;
  onPostNewDemandClick: () => void;
  onViewQuotesClick: (demandId: string) => void;
  onBackToDashboard: () => void;
}

export const DemandBoardPage: React.FC<DemandBoardPageProps> = ({
  demands,
  onCloseDemand,
  onPostNewDemandClick,
  onViewQuotesClick,
  onBackToDashboard,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'active' | 'quotes' | 'completed' | 'expired'>('active');

  const getFilteredDemands = () => {
    if (activeTab === 'active') {
      return demands.filter((d) => d.status === 'active');
    }
    if (activeTab === 'quotes') {
      return demands.filter((d) => d.status === 'active' && d.quotesCount > 0);
    }
    if (activeTab === 'completed') {
      return demands.filter((d) => d.status === 'completed');
    }
    return demands.filter((d) => d.status === 'expired');
  };

  const filteredList = getFilteredDemands();

  const countActive = demands.filter((d) => d.status === 'active').length;
  const countQuotes = demands.filter((d) => d.status === 'active' && d.quotesCount > 0).length;
  const countCompleted = demands.filter((d) => d.status === 'completed').length;
  const countExpired = demands.filter((d) => d.status === 'expired').length;

  return (
    <div className="space-y-6 font-sans">
      {/* Breadcrumbs */}
      <div className="text-xs text-slate-400 font-medium">
        <button onClick={onBackToDashboard} className="hover:text-slate-600 underline">Home</button>
        <span className="mx-1.5">&rsaquo;</span>
        <span className="text-slate-500 font-semibold">Demand Board</span>
      </div>

      {/* Screen Title & Quick CTA */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Demand Board</h1>
          <p className="text-xs text-slate-500 mt-1">Post your requirements. Receive quotes from farmers and agents.</p>
        </div>
        <button
          onClick={onPostNewDemandClick}
          className="bg-[#1b4d4f] hover:bg-[#123637] text-white text-xs font-bold px-4 py-2.5 rounded-md transition shadow-xs"
        >
          + Post New Demand
        </button>
      </div>

      {/* Status tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-6 -mb-px">
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-2.5 text-xs font-bold transition border-b-2
              ${activeTab === 'active'
                ? 'border-[#1b4d4f] text-[#1b4d4f]'
                : 'border-transparent text-slate-450 hover:text-slate-700'
              }`}
          >
            Active ({countActive})
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`pb-2.5 text-xs font-bold transition border-b-2
              ${activeTab === 'quotes'
                ? 'border-[#1b4d4f] text-[#1b4d4f]'
                : 'border-transparent text-slate-450 hover:text-slate-700'
              }`}
          >
            Quotes Received ({countQuotes})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`pb-2.5 text-xs font-bold transition border-b-2
              ${activeTab === 'completed'
                ? 'border-[#1b4d4f] text-[#1b4d4f]'
                : 'border-transparent text-slate-450 hover:text-slate-700'
              }`}
          >
            Completed ({countCompleted})
          </button>
          <button
            onClick={() => setActiveTab('expired')}
            className={`pb-2.5 text-xs font-bold transition border-b-2
              ${activeTab === 'expired'
                ? 'border-[#1b4d4f] text-[#1b4d4f]'
                : 'border-transparent text-slate-450 hover:text-slate-700'
              }`}
          >
            Expired ({countExpired})
          </button>
        </div>
      </div>

      {/* Demand Cards List */}
      <div className="space-y-4">
        {filteredList.length === 0 ? (
          <div className="py-12 bg-white border border-slate-200 rounded-lg text-center text-slate-400 text-xs font-medium">
            No demands found in this section.
          </div>
        ) : (
          filteredList.map((d) => (
            <div
              key={d.id}
              className={`bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${d.borderColorClass}`}
            >
              {/* Card Details */}
              <div className="space-y-3 flex-1">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">
                    {d.produce} &mdash; <span className="text-[#1b4d4f]">{d.qty}</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    Posted: {d.postedDate} &nbsp;|&nbsp; Deadline: {d.deadlineDate}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-xs font-semibold text-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 font-normal block">Target Price</span>
                    <span className="text-slate-800">{d.targetPrice}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-normal block">Delivery Location</span>
                    <span className="text-slate-800">{d.delivery}</span>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <span className="text-[10px] text-slate-400 font-normal block">Grade Specification</span>
                    <span className="text-slate-800">{d.grade}</span>
                  </div>
                </div>

                {/* Actions group */}
                <div className="flex gap-2 pt-1">
                  {d.quotesCount > 0 && d.status === 'active' ? (
                    <button
                      onClick={() => onViewQuotesClick(d.id)}
                      className="bg-[#1b4d4f] hover:bg-[#123637] text-white text-[11px] font-bold px-4 py-2 rounded-md transition shadow-2xs"
                    >
                      View Quotes ({d.quotesCount})
                    </button>
                  ) : (
                    <button
                      disabled
                      className="bg-slate-100 text-slate-400 border border-slate-200 text-[11px] font-bold px-4 py-2 rounded-md cursor-not-allowed"
                    >
                      No Quotes
                    </button>
                  )}
                  <button
                    onClick={() => showToast(`Editing demand ${d.id}...`, 'info')}
                    className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-350 text-[11px] font-bold px-4 py-2 rounded-md transition shadow-2xs"
                  >
                    Edit
                  </button>
                  {d.status === 'active' && (
                    <button
                      onClick={() => onCloseDemand(d.id)}
                      className="bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-[11px] font-bold px-4 py-2 rounded-md transition shadow-2xs"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>

              {/* Status and Expiry Indicators */}
              <div className="md:text-right shrink-0 flex md:flex-col justify-between items-baseline md:items-end w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-3 md:pt-0 gap-2.5">
                <span
                  className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide
                    ${d.status === 'active'
                      ? d.quotesCount > 0
                        ? 'bg-emerald-50 border border-emerald-100 text-emerald-700'
                        : 'bg-amber-50 border border-amber-100 text-amber-700'
                      : d.status === 'completed'
                      ? 'bg-slate-50 border border-slate-200 text-slate-500'
                      : 'bg-rose-50 border border-rose-100 text-rose-700'
                    }`}
                >
                  {d.status === 'active' ? (d.quotesCount > 0 ? 'Active' : 'No Quotes Yet') : d.status}
                </span>

                <div className="space-y-0.5 text-xs font-semibold">
                  <p className="text-slate-450 text-[10px] font-bold">
                    Quotes: <span className="text-[#1b4d4f] font-black">{d.quotesCount} received</span>
                  </p>
                  {d.expiresInDays > 0 && (
                    <p className="text-rose-600 font-extrabold text-[10px]">
                      Expires in {d.expiresInDays} days
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
