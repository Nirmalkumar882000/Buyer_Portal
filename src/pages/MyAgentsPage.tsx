import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useToast } from '../context/ToastContext';
import { getMyAgents, withdrawRegistrationRequest } from '../api/markets';
import { AgriLoader } from '../components/AgriLoader';

interface MyAgentsPageProps {
  onFindNewAgents: () => void;
  onViewAuctions: (agentName: string) => void;
}

export const MyAgentsPage: React.FC<MyAgentsPageProps> = ({ onFindNewAgents, onViewAuctions }) => {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [withdrawAgentId, setWithdrawAgentId] = useState<number | null>(null);

  const { data: rawAgents = [], isLoading, refetch } = useQuery({
    queryKey: ['myAgents'],
    queryFn: getMyAgents,
  });

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  const executeWithdraw = async (agentId: number) => {
    try {
      await withdrawRegistrationRequest(agentId);
      showToast(t('success_withdraw_req', 'Registration request withdrawn successfully.'), 'success');
      refetch();
    } catch (error: any) {
      console.error(error);
      const errMsg = error.response?.data?.message || error.message || t('err_withdraw_req', 'Failed to withdraw request.');
      showToast(errMsg, 'error');
    }
  };

  const agentData = rawAgents.map((item: any) => {
    let statusText = t('status_pending', 'Pending');
    let statusColor = 'text-amber-700 bg-amber-50 border border-amber-100';
    if (item.status === 'APPROVED') {
      statusText = t('status_approved', 'Approved');
      statusColor = 'text-emerald-700 bg-emerald-50 border border-emerald-100';
    } else if (item.status === 'REJECTED') {
      statusText = t('status_rejected', 'Rejected');
      statusColor = 'text-red-700 bg-red-50 border border-red-100';
    }

    const dateStr = item.created_at
      ? new Date(item.created_at).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      : '';

    return {
      id: item.agent_id,
      name: item.agent_name || t('unknown_agent', 'Unknown Agent'),
      rating: '4.8',
      market: `${item.agent_district}`,
      commodities: item.commodities ? item.commodities.split(',').map((c: string) => c.trim()) : [],
      date: dateStr,
      status: statusText,
      statusColor,
      reject_reason: item.reject_reason,
    };
  });

  const filteredAgents = agentData.filter((agent: any) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'approved') return agent.status === t('status_approved', 'Approved');
    if (activeTab === 'pending') return agent.status === t('status_pending', 'Pending');
    if (activeTab === 'rejected') return agent.status === t('status_rejected', 'Rejected');
    return false;
  });

  const allCount = agentData.length;
  const approvedCount = agentData.filter((a: any) => a.status === t('status_approved', 'Approved')).length;
  const pendingCount = agentData.filter((a: any) => a.status === t('status_pending', 'Pending')).length;
  const rejectedCount = agentData.filter((a: any) => a.status === t('status_rejected', 'Rejected')).length;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-400 font-medium">
        {t('home', 'Home')} &rsaquo; <span className="text-slate-500 font-semibold">{t('my_agents', 'My Agents')}</span>
      </div>

      {/* Screen Title & Top Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t('my_agents', 'My Agents')}</h1>
          <p className="text-xs text-slate-500 mt-1">{t('manage_agent_regs', 'Manage your agent registrations across markets')}</p>
        </div>
        <button
          onClick={onFindNewAgents}
          className="bg-[#1b4d4f] hover:bg-[#123637] text-white text-xs font-bold px-4 py-2.5 rounded-md transition shadow-xs"
        >
          {t('find_new_agents', '+ Find New Agents')}
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-semibold text-slate-400 gap-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`py-2 px-1 border-b-2 transition-all duration-150 ${activeTab === 'all' ? 'border-[#1b4d4f] text-[#1b4d4f]' : 'border-transparent hover:text-slate-600'}`}
        >
          {t('all', 'All')} ({allCount})
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`py-2 px-1 border-b-2 transition-all duration-150 ${activeTab === 'approved' ? 'border-[#1b4d4f] text-[#1b4d4f]' : 'border-transparent hover:text-slate-600'}`}
        >
          {t('status_approved', 'Approved')} ({approvedCount})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`py-2 px-1 border-b-2 transition-all duration-150 ${activeTab === 'pending' ? 'border-[#1b4d4f] text-[#1b4d4f]' : 'border-transparent hover:text-slate-600'}`}
        >
          {t('status_pending', 'Pending')} ({pendingCount})
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          className={`py-2 px-1 border-b-2 transition-all duration-150 ${activeTab === 'rejected' ? 'border-[#1b4d4f] text-[#1b4d4f]' : 'border-transparent hover:text-slate-600'}`}
        >
          {t('status_rejected', 'Rejected')} ({rejectedCount})
        </button>
      </div>

      {/* Agents Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          {isLoading ? (
            <AgriLoader message={t('loading_my_agents', 'Loading your agents...')} />
          ) : filteredAgents.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-medium">
              {t('no_agents_found', 'No agents found in this category.')}
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-bold">
                  <th className="p-4">{t('agent_name_col', 'Agent Name')}</th>
                  <th className="p-4">{t('market_col', 'Market')}</th>
                  <th className="p-4">{t('commodities_col', 'Commodities')}</th>
                  <th className="p-4">{t('request_date_col', 'Request Date')}</th>
                  <th className="p-4">{t('status_col', 'Status')}</th>
                  <th className="p-4">{t('actions_col', 'Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-slate-700 font-medium">
                {filteredAgents.map((agent: any, idx: number) => {
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
                          {agent.commodities.map((item: string, cIdx: number) => (
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
                          {agent.status === t('status_approved', 'Approved') ? `✓ ${t('status_approved', 'Approved')}` : agent.status === t('status_pending', 'Pending') ? `⏳ ${t('status_pending', 'Pending')}` : `❌ ${t('status_rejected', 'Rejected')}`}
                        </span>
                        {agent.status === t('status_rejected', 'Rejected') && agent.reject_reason && (
                          <div className="text-[10px] text-red-500 mt-1">
                            {t('reason', 'Reason:')} {agent.reject_reason}
                          </div>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="p-4">
                        {agent.status === t('status_approved', 'Approved') ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => onViewAuctions(agent.name)}
                              className="bg-[#1b4d4f] hover:bg-[#123637] text-white text-[10px] font-bold px-3 py-1.5 rounded-sm transition"
                            >
                              {t('view_auctions', 'View Auctions')}
                            </button>
                            <button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-[10px] font-bold px-3 py-1.5 rounded-sm transition">
                              {t('chat', 'Chat')}
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              disabled
                              className="bg-slate-100 text-slate-400 text-[10px] font-bold px-3 py-1.5 rounded-sm cursor-not-allowed border border-slate-200"
                            >
                              {t('auctions_locked', 'Auctions (Locked)')}
                            </button>
                            <button
                              onClick={() => setWithdrawAgentId(agent.id)}
                              className="bg-white hover:bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold px-3 py-1.5 rounded-sm transition"
                            >
                              {t('withdraw', 'Withdraw')}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Bottom informational note banner */}
      <div className="border-l-4 border-[#1b4d4f] bg-blue-50/70 p-4 rounded-r-lg text-xs text-blue-800 leading-relaxed">
        <strong>{t('note', 'Note:')}</strong> {t('view_auctions_note', 'You can only view auctions from agents who have approved your registration request. Pending requests are usually reviewed within 1–2 business days.')}
      </div>

      {/* Confirmation Modal */}
      {withdrawAgentId !== null && (
        <div className="fixed inset-0 bg-[#0f2b2b]/60 backdrop-blur-xs flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-white border border-slate-150 p-6 rounded-xl shadow-2xl max-w-sm w-[90%] text-center transform scale-100 transition-all">
            {/* Warning Icon */}
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 text-xl mx-auto mb-4 border border-red-100">
              ⚠️
            </div>
            <h3 className="text-base font-extrabold text-slate-800 mb-2">{t('withdraw_req_title', 'Withdraw Request?')}</h3>
            <p className="text-xs text-slate-550 mb-6 leading-relaxed font-medium">
              {t('withdraw_req_desc', 'Are you sure you want to withdraw this connection request? This action cannot be undone, and you will need to request connection again to view this agent\'s auctions.')}
            </p>
            {/* Action buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setWithdrawAgentId(null)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-md transition cursor-pointer"
              >
                {t('cancel', 'Cancel')}
              </button>
              <button
                onClick={() => {
                  const id = withdrawAgentId;
                  setWithdrawAgentId(null);
                  executeWithdraw(id);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-md transition cursor-pointer shadow-xs"
              >
                {t('yes_withdraw', 'Yes, Withdraw')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
