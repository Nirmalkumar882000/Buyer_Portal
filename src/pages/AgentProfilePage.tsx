import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAgentProfile, getRegistrationStatus, sendRegistrationRequest, getBuyerProfile } from '../api/markets';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';
import { useTranslation } from 'react-i18next';

import { useToast } from '../context/ToastContext';
import { AgriLoader } from '../components/AgriLoader';

interface AgentProfilePageProps {
  onBackToAgents: () => void;
  onSubmitRequest: () => void;
  formData?: {
    fullName: string;
    mobile: string;
    businessName: string;
    district: string;
    address: string;
  };
}

export const AgentProfilePage: React.FC<AgentProfilePageProps> = ({
  onBackToAgents,
  onSubmitRequest,
  formData
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const agentId = searchParams.get('agent_id');
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data: agent, isLoading } = useQuery({
    queryKey: ['agentProfile', agentId],
    queryFn: () => getAgentProfile(agentId || ''),
    enabled: !!agentId
  });

  const { data: requestStatus, refetch: refetchStatus } = useQuery({
    queryKey: ['agentRequestStatus', agentId],
    queryFn: () => getRegistrationStatus(agentId || ''),
    enabled: !!agentId
  });

  const { data: buyerProfile } = useQuery({
    queryKey: ['buyerProfile'],
    queryFn: getBuyerProfile,
  });

  const [message, setMessage] = useState(
    t('default_buy_message', 'Looking to buy regularly. I am a wholesale buyer.')
  );

  const [buyerName, setBuyerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [mobile, setMobile] = useState('');

  React.useEffect(() => {
    if (buyerProfile) {
      setBuyerName(buyerProfile.username || buyerProfile.name || '');
      setBusinessName(buyerProfile.business_name || '');
      setMobile(buyerProfile.mobile_number || '');
    } else if (formData) {
      setBuyerName(formData.fullName || '');
      setBusinessName(formData.businessName || '');
      setMobile(formData.mobile || '');
    }
  }, [buyerProfile, formData]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFormEvenIfRejected, setShowFormEvenIfRejected] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentId) return;
    setIsSubmitting(true);
    try {
      await sendRegistrationRequest({
        agent_id: agentId,
        buyer_name: buyerName || 'Ravi Kumar',
        business_name: businessName || 'Kumar Agro Traders',
        mobile: mobile || '+91 98765 43210',
        commodities: agent?.specialties?.join(', ') || '',
        message,
      });
      showToast(t('connection_request_sent', 'Connection request sent successfully!'), "success");
      queryClient.invalidateQueries({ queryKey: ['myAgents'] });
      await refetchStatus();
      onSubmitRequest();
    } catch (error: any) {
      console.error(error);
      const errMsg = error.response?.data?.message || error.message || t('failed_to_send_request', 'Failed to send request. Please try again.');
      showToast(errMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <AgriLoader message={t('loading_agent_profile', 'Loading agent profile...')} />;
  }

  const agentName = agent?.name || t('unknown_agent', 'Unknown Agent');
  const marketName = agent?.market || 'Tamil Nadu APMC, Tamil Nadu';
  const activeAuctions = agent?.activeAuctions ?? 0;
  const lotsPerMonth = agent?.lotsPerMonth ?? '0+';
  const buyersRegistered = agent?.buyersRegistered ?? 0;
  const ratingStars = '★'.repeat(Math.round(parseFloat(agent?.rating || '5'))) + '☆'.repeat(5 - Math.round(parseFloat(agent?.rating || '5')));

  const years = agent ? (Number(agent.id) * 3) % 10 + 5 : 8;
  const description = `${agentName} ${t('has_been_operating_at', 'has been operating at')} ${marketName} ${t('for', 'for')} ${years} ${t('years_specialises_in', 'years. Specialises in')} ${agent?.products || t('various_auctions', 'various')} ${t('auctions_known_for', 'auctions. Known for transparency, fair pricing, and fast settlement.')}`;

  return (
    <div className="space-y-6">
      {/* Back Button + Title Row */}
      <div className="flex items-center gap-4">
        <BackButton onClick={onBackToAgents} label={t('back_to_agents', 'Back to Agents')} />
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t('agent_profile', 'Agent Profile')}</h1>
          <p className="text-xs text-slate-400 mt-0.5">{t('nav_markets', 'Markets')} › {marketName} › {t('nav_agents', 'Agents')} › <span className="font-semibold text-slate-600">{agentName}</span></p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Profile info & reviews) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Agent Header Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start text-center sm:text-left">
              <div className="w-16 h-16 rounded-full border-2 border-[#1b4d4f] text-[#1b4d4f] flex items-center justify-center text-xl font-bold">
                {agent?.initials || 'AG'}
              </div>
              <div className="space-y-1.5">
                <h2 className="text-lg font-bold text-slate-800">{agentName}</h2>
                <p className="text-xs text-slate-400">📍 {marketName}</p>
                <div className="text-[10px] text-slate-500 flex items-center gap-1.5 justify-center sm:justify-start">
                  <span className="text-amber-400 text-xs">{ratingStars}</span>
                  <span className="font-semibold">{agent?.rating || '4.8'} ({agent?.reviews || 0} {t('reviews', 'reviews')})</span>
                </div>
                <div className="flex gap-2 justify-center sm:justify-start">
                  <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-sm">
                    {t('verified_agent', 'Verified Agent')}
                  </span>
                  <span className="bg-blue-50 border border-blue-100 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded-sm">
                    {t('apmc_licensed', 'APMC Licensed')}
                  </span>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{t('speciality_commodities', 'SPECIALITY COMMODITIES')}</span>
                <div className="flex gap-1 flex-wrap">
                  {agent?.specialties && agent.specialties.length > 0 ? (
                    agent.specialties.map((item: string, idx: number) => (
                      <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-sm font-semibold">
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-[10px]">{t('none_listed', 'None listed')}</span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{t('active_auctions_caps', 'ACTIVE AUCTIONS')}</span>
                <p className="font-bold text-slate-800 text-sm">{activeAuctions}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{t('lots_per_month_caps', 'LOTS / MONTH')}</span>
                <p className="font-bold text-slate-800 text-sm">{lotsPerMonth}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{t('buyers_registered_caps', 'BUYERS REGISTERED')}</span>
                <p className="font-bold text-slate-800 text-sm">{buyersRegistered}</p>
              </div>
            </div>

            <hr className="border-slate-100" />

            <p className="text-xs text-slate-500 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Buyer Reviews */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800">{t('buyer_reviews', 'Buyer Reviews')}</h3>

            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-100 rounded-md p-4 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <strong className="text-slate-700">Karthik Enterprises</strong>
                  <span className="text-amber-400">★★★★★</span>
                </div>
                <p className="text-xs text-slate-500 italic">"Great agent. Quick settlement and always honest about lot quality."</p>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-md p-4 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <strong className="text-slate-700">Sivakumar Traders</strong>
                  <span className="text-amber-400">★★★★★</span>
                </div>
                <p className="text-xs text-slate-500 italic">"Best paddy agent in Thoothukudi. Highly recommend."</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Form Panel) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-5">
          {agent?.isRegistered || requestStatus?.status === 'APPROVED' ? (
            <div className="space-y-5 text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center text-2xl mx-auto">
                ✓
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-800">{t('already_registered', 'Already Registered')}</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-normal">
                  {t('already_registered_desc', "You are a registered buyer with {agentName}. You can view and participate in this agent's active auctions.", { agentName })}
                </p>
              </div>
              <Button onClick={() => navigate('/auctions-list')} variant="primary" className="w-full py-3">
                {t('view_auctions', 'View Auctions')}
              </Button>
            </div>
          ) : requestStatus?.status === 'PENDING' ? (
            <div className="space-y-5 text-center py-6">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center text-2xl mx-auto animate-pulse">
                ⏳
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-800">{t('request_pending', 'Request Pending')}</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-normal">
                  {t('request_pending_desc', "Your request to join {agentName}'s list is pending review. The agent will review your profile shortly.", { agentName })}
                </p>
              </div>
              <Button disabled variant="outline" className="w-full py-3">
                {t('pending_agent_approval', 'Pending Agent Approval')}
              </Button>
            </div>
          ) : (requestStatus?.status === 'REJECTED' && !showFormEvenIfRejected) ? (
            <div className="space-y-5 text-center py-6">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center text-2xl mx-auto">
                ✕
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-800">{t('request_rejected', 'Request Rejected')}</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-normal">
                  {t('request_declined_desc', 'Your request was declined by the agent.')}
                </p>
                {requestStatus?.reject_reason && (
                  <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded-md italic">
                    {t('reason', 'Reason')}: "{requestStatus.reject_reason}"
                  </p>
                )}
              </div>
              <Button onClick={() => setShowFormEvenIfRejected(true)} variant="primary" className="w-full py-3">
                {t('reapply', 'Re-apply / Submit Again')}
              </Button>
            </div>
          ) : (
            <>
              <h3 className="text-sm font-bold text-slate-800">{t('send_registration_request', 'Send Registration Request')}</h3>

              <div className="bg-blue-50/70 border border-blue-100 rounded-md p-3.5 text-xs text-blue-800 leading-relaxed">
                {t('pre_filled_details_desc', 'Your details are pre-filled from your profile. The agent will review and approve your request.')}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{t('your_name', 'Your Name')}</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-md text-xs text-slate-800 outline-hidden"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{t('business_name', 'Business Name')}</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-md text-xs text-slate-800 outline-hidden"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{t('mobile', 'Mobile')}</label>
                  <input
                    type="text"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-md text-xs text-slate-800 outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{t('commodities_of_interest', 'Commodities of Interest')}</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {agent?.specialties && agent.specialties.length > 0 ? (
                      agent.specialties.map((item: string, idx: number) => (
                        <span key={idx} className="bg-teal-50 border border-teal-100 text-[#1b4d4f] text-[10px] px-2.5 py-0.5 rounded-sm font-semibold">
                          {item}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-xs font-semibold">{t('none_listed', 'None listed')}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{t('message_to_agent', 'Message to Agent (optional)')}</label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-350 rounded-md text-xs text-slate-800 outline-hidden transition focus:border-[#1b4d4f] focus:ring-1 focus:ring-[#1b4d4f]"
                  />
                </div>

                <Button type="submit" variant="primary" fullWidth className="py-3" disabled={isSubmitting}>
                  {isSubmitting ? t('sending_request', 'Sending Request...') : t('send_registration_request', 'Send Registration Request')}
                </Button>

                <p className="text-[10px] text-slate-400 text-center leading-normal">
                  {t('review_time_desc', 'The agent will review your request within 1–2 business days')}
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
