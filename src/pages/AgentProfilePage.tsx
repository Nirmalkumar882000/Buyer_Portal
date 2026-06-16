import React, { useState } from 'react';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';

interface AgentProfilePageProps {
  onBackToAgents: () => void;
  onSubmitRequest: () => void;
  agentName?: string;
}

export const AgentProfilePage: React.FC<AgentProfilePageProps> = ({
  onBackToAgents,
  onSubmitRequest,
  agentName = 'Murugan Kandasamy'
}) => {
  const [message, setMessage] = useState(
    'Looking to buy Paddy and Groundnut regularly. I am a wholesale buyer from Thoothukudi.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitRequest();
  };

  return (
    <div className="space-y-6">
      {/* Back Button + Title Row */}
      <div className="flex items-center gap-4">
        <BackButton onClick={onBackToAgents} label="Back to Agents" />
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Agent Profile</h1>
          <p className="text-xs text-slate-400 mt-0.5">Markets › Thoothukudi APMC › Agents › <span className="font-semibold text-slate-600">{agentName}</span></p>
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
                MK
              </div>
              <div className="space-y-1.5">
                <h2 className="text-lg font-bold text-slate-800">{agentName}</h2>
                <p className="text-xs text-slate-400">📍 Thoothukudi APMC, Tamil Nadu</p>
                <div className="text-[10px] text-slate-500 flex items-center gap-1.5 justify-center sm:justify-start">
                  <span className="text-amber-400 text-xs">★★★★★</span>
                  <span className="font-semibold">4.9 (142 reviews)</span>
                </div>
                <div className="flex gap-2 justify-center sm:justify-start">
                  <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-sm">
                    Verified Agent
                  </span>
                  <span className="bg-blue-50 border border-blue-100 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded-sm">
                    APMC Licensed
                  </span>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Speciality Commodities</span>
                <div className="flex gap-1">
                  <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-sm font-semibold">Paddy</span>
                  <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-sm font-semibold">Groundnut</span>
                  <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-sm font-semibold">Wheat</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Active Auctions</span>
                <p className="font-bold text-slate-800 text-sm">8</p>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Lots / Month</span>
                <p className="font-bold text-slate-800 text-sm">200+</p>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Buyers Registered</span>
                <p className="font-bold text-slate-800 text-sm">47</p>
              </div>
            </div>

            <hr className="border-slate-100" />

            <p className="text-xs text-slate-500 leading-relaxed">
              Murugan Kandasamy has been operating at Thoothukudi APMC for 12 years. Specialises in Paddy and Groundnut auctions. Known for transparency, fair pricing, and fast settlement.
            </p>
          </div>

          {/* Buyer Reviews */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Buyer Reviews</h3>
            
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
          <h3 className="text-sm font-bold text-slate-800">Send Registration Request</h3>
          
          <div className="bg-blue-50/70 border border-blue-100 rounded-md p-3.5 text-xs text-blue-800 leading-relaxed">
            Your details are pre-filled from your profile. The agent will review and approve your request.
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Your Name</label>
              <input
                type="text"
                readOnly
                defaultValue="Ravi Kumar"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-500 outline-hidden cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Business Name</label>
              <input
                type="text"
                readOnly
                defaultValue="Kumar Agro Traders"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-500 outline-hidden cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Mobile</label>
              <input
                type="text"
                readOnly
                defaultValue="+91 98765 43210"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-500 outline-hidden cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Commodities of Interest</label>
              <div className="flex gap-1.5">
                <span className="bg-teal-50 border border-teal-100 text-[#1b4d4f] text-[10px] px-2.5 py-0.5 rounded-sm font-semibold">Paddy</span>
                <span className="bg-teal-50 border border-teal-100 text-[#1b4d4f] text-[10px] px-2.5 py-0.5 rounded-sm font-semibold">Groundnut</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Message to Agent (optional)</label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-350 rounded-md text-xs text-slate-800 outline-hidden transition focus:border-[#1b4d4f] focus:ring-1 focus:ring-[#1b4d4f]"
              />
            </div>

            <Button type="submit" variant="primary" fullWidth className="py-3">
              Send Registration Request
            </Button>

            <p className="text-[10px] text-slate-400 text-center leading-normal">
              The agent will review your request within 1–2 business days
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
