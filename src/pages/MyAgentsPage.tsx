import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

interface MyAgentsPageProps {
  onFindNewAgents: () => void;
  onViewAuctions: (agentName: string) => void;
}

export const MyAgentsPage: React.FC<MyAgentsPageProps> = ({ onFindNewAgents, onViewAuctions }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');

  const agentData = [
    {
      name: 'Murugan Kandasamy',
      rating: '4.9',
      market: 'Thoothukudi APMC',
      commodities: ['Paddy', 'Groundnut'],
      date: '10 Jul 2025',
      status: 'Approved',
      statusColor: 'text-emerald-700 bg-emerald-50 border border-emerald-100',
    },
    {
      name: 'Pandiyan Kumar',
      rating: '4.7',
      market: 'Thoothukudi APMC',
      commodities: ['Paddy', 'Turmeric'],
      date: '05 Jul 2025',
      status: 'Approved',
      statusColor: 'text-emerald-700 bg-emerald-50 border border-emerald-100',
    },
    {
      name: 'Arjunan Nair',
      rating: '4.2',
      market: 'Madurai APMC',
      commodities: ['Onion', 'Tomato'],
      date: '12 Jul 2025',
      status: 'Approved',
      statusColor: 'text-emerald-700 bg-emerald-50 border border-emerald-100',
    },
    {
      name: 'Selvam Rajan',
      rating: '4.3',
      market: 'Thoothukudi APMC',
      commodities: ['Cotton', 'Onion'],
      date: '14 Jul 2025',
      status: 'Pending',
      statusColor: 'text-amber-700 bg-amber-50 border border-amber-100',
    },
  ];

  const filteredAgents = agentData.filter((agent) => {
    if (activeTab === 'all') return true;
    return agent.status.toLowerCase() === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-400 font-medium">
        Home &rsaquo; <span className="text-slate-500 font-semibold">My Agents</span>
      </div>

      {/* Screen Title & Top Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Agents</h1>
          <p className="text-xs text-slate-500 mt-1">Manage your agent registrations across markets</p>
        </div>
        <button
          onClick={onFindNewAgents}
          className="bg-[#1b4d4f] hover:bg-[#123637] text-white text-xs font-bold px-4 py-2.5 rounded-md transition shadow-xs"
        >
          + Find New Agents
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-semibold text-slate-400 gap-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`py-2 px-1 border-b-2 transition-all duration-150 ${activeTab === 'all' ? 'border-[#1b4d4f] text-[#1b4d4f]' : 'border-transparent hover:text-slate-600'}`}
        >
          All (4)
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`py-2 px-1 border-b-2 transition-all duration-150 ${activeTab === 'approved' ? 'border-[#1b4d4f] text-[#1b4d4f]' : 'border-transparent hover:text-slate-600'}`}
        >
          Approved (3)
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`py-2 px-1 border-b-2 transition-all duration-150 ${activeTab === 'pending' ? 'border-[#1b4d4f] text-[#1b4d4f]' : 'border-transparent hover:text-slate-600'}`}
        >
          Pending (1)
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          className={`py-2 px-1 border-b-2 transition-all duration-150 ${activeTab === 'rejected' ? 'border-[#1b4d4f] text-[#1b4d4f]' : 'border-transparent hover:text-slate-600'}`}
        >
          Rejected (0)
        </button>
      </div>

      {/* Agents Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-bold">
                <th className="p-4">Agent Name</th>
                <th className="p-4">Market</th>
                <th className="p-4">Commodities</th>
                <th className="p-4">Request Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 text-slate-700 font-medium">
              {filteredAgents.map((agent, idx) => {
                const starsCount = Math.round(parseFloat(agent.rating));
                const ratingStars = '★'.repeat(starsCount) + '☆'.repeat(5 - starsCount);

                return (
                  <tr key={idx} className="hover:bg-slate-50/50 transition">
                    {/* Agent Name with Rating */}
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-800">{agent.name}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <span className="text-amber-400">{ratingStars}</span>
                          <span>{agent.rating}</span>
                        </div>
                      </div>
                    </td>

                    {/* Market */}
                    <td className="p-4 text-slate-600">{agent.market}</td>

                    {/* Commodities */}
                    <td className="p-4">
                      <div className="flex gap-1.5 flex-wrap">
                        {agent.commodities.map((item, cIdx) => (
                          <span key={cIdx} className="bg-teal-50 text-[#1b4d4f] text-[10px] px-2 py-0.5 rounded-sm font-semibold">
                            {item}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="p-4 text-slate-500">{agent.date}</td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold ${agent.statusColor}`}>
                        {agent.status === 'Approved' ? '✓ Approved' : '⏳ Pending'}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="p-4">
                      {agent.status === 'Approved' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => onViewAuctions(agent.name)}
                            className="bg-[#1b4d4f] hover:bg-[#123637] text-white text-[10px] font-bold px-3 py-1.5 rounded-sm transition"
                          >
                            View Auctions
                          </button>
                          <button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-[10px] font-bold px-3 py-1.5 rounded-sm transition">
                            Chat
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            disabled
                            className="bg-slate-100 text-slate-400 text-[10px] font-bold px-3 py-1.5 rounded-sm cursor-not-allowed border border-slate-200"
                          >
                            Auctions (Locked)
                          </button>
                          <button
                            onClick={() => showToast('Registration request withdrawn.', 'info')}
                            className="bg-white hover:bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold px-3 py-1.5 rounded-sm transition"
                          >
                            Withdraw
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom informational note banner */}
      <div className="border-l-4 border-[#1b4d4f] bg-blue-50/70 p-4 rounded-r-lg text-xs text-blue-800 leading-relaxed">
        <strong>Note:</strong> You can only view auctions from agents who have approved your registration request. Pending requests are usually reviewed within 1–2 business days.
      </div>
    </div>
  );
};
