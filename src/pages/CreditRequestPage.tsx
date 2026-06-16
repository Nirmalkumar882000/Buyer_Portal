import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

interface CreditLine {
  id: string;
  agent: string;
  limit: string;
  used: string;
  available: string;
  status: 'Active' | 'Pending';
}

interface CreditRequestPageProps {
  onBackToWallet: () => void;
}

export const CreditRequestPage: React.FC<CreditRequestPageProps> = ({ onBackToWallet }) => {
  const { showToast } = useToast();
  const [selectedAgent, setSelectedAgent] = useState('Murugan Kandasamy (Thoothukudi APMC)');
  const [requestedLimit, setRequestedLimit] = useState('100000');
  const [purpose, setPurpose] = useState(
    'We regularly buy paddy and groundnut 2-3 times a month. Credit limit will help us participate in more auctions without delay.'
  );
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [creditLimits, setCreditLimits] = useState<CreditLine[]>([
    {
      id: '1',
      agent: 'Murugan Kandasamy\nThoothukudi APMC',
      limit: '₹50,000',
      used: '₹0',
      available: '₹50,000',
      status: 'Active',
    },
    {
      id: '2',
      agent: 'Pandiyan Kumar\nThoothukudi APMC',
      limit: '₹25,000',
      used: '₹12,000',
      available: '₹13,000',
      status: 'Active',
    },
    {
      id: '3',
      agent: 'Arjunan Nair\nMadurai APMC',
      limit: '—',
      used: '—',
      available: '—',
      status: 'Pending',
    },
  ]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setRequestedLimit(val);
  };

  const handleFileUploadClick = () => {
    // Simulate support file upload
    const mockFile = `gst_certificate_${Math.floor(100 + Math.random() * 900)}.pdf`;
    setUploadedFiles((prev) => [...prev, mockFile]);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestedLimit || parseFloat(requestedLimit) <= 0) {
      showToast('Please enter a valid requested credit limit.', 'error');
      return;
    }

    // Extract basic agent name
    const agentShortName = selectedAgent.split(' (')[0];
    const agentSubDetails = selectedAgent.includes('Thoothukudi') ? 'Thoothukudi APMC' : 'Madurai APMC';

    const newRequest: CreditLine = {
      id: String(creditLimits.length + 1),
      agent: `${agentShortName}\n${agentSubDetails}`,
      limit: '—',
      used: '—',
      available: '—',
      status: 'Pending',
    };

    setCreditLimits((prev) => [...prev, newRequest]);
    showToast(`Credit request for ₹${parseFloat(requestedLimit).toLocaleString()} submitted to ${agentShortName}!`, 'success');
    setRequestedLimit('');
    setPurpose('');
    setUploadedFiles([]);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Breadcrumbs */}
      <div className="text-xs text-slate-400 font-medium">
        <button onClick={onBackToWallet} className="hover:text-slate-600 underline">Wallet</button>
        <span className="mx-1.5">&rsaquo;</span>
        <span className="text-slate-500 font-semibold">Credit Request</span>
      </div>

      {/* Screen Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Request Credit Limit</h1>
        <p className="text-xs text-slate-500 mt-1">Request a credit limit from your mandi agent or seller</p>
      </div>

      {/* Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Credit Request Form) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100">New Credit Request</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Agent Select Dropdown */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Request Credit From *</label>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full text-xs p-3 bg-white border border-slate-350 rounded-md focus:border-[#1b4d4f] outline-hidden text-slate-700 font-bold"
              >
                <option>Murugan Kandasamy (Thoothukudi APMC)</option>
                <option>Pandiyan Kumar (Thoothukudi APMC)</option>
                <option>Arjunan Nair (Madurai APMC)</option>
              </select>
            </div>

            {/* Requested Limit */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Requested Credit Limit (INR) *</label>
              <div className="relative rounded-md shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs font-bold">
                  ₹
                </div>
                <input
                  type="text"
                  value={requestedLimit === '' ? '' : parseFloat(requestedLimit).toLocaleString()}
                  onChange={handleAmountChange}
                  placeholder="Enter limit amount..."
                  className="w-full text-xs pl-7 pr-3 py-3.5 bg-white border border-slate-350 rounded-md focus:border-[#1b4d4f] outline-hidden text-slate-800 font-extrabold"
                  required
                />
              </div>
              <p className="text-[9px] text-slate-405 leading-normal">
                Max credit limit is set by the agent based on your trading history
              </p>
            </div>

            {/* Purpose Notes */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Purpose / Notes</label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Enter justification details..."
                rows={3}
                className="w-full text-xs p-3 bg-white border border-slate-300 rounded-md focus:border-[#1b4d4f] outline-hidden text-slate-750 font-semibold"
                required
              />
            </div>

            {/* Document Upload Zone */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Supporting Documents (optional)</label>
              <div
                onClick={handleFileUploadClick}
                className="border-2 border-dashed border-slate-250 hover:border-[#1b4d4f] rounded-lg p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition bg-slate-50/50 hover:bg-slate-50"
              >
                <span className="text-2xl text-slate-405">🔗</span>
                <div className="text-center">
                  <p className="text-xs font-bold text-[#1b4d4f]">Click to upload or drag & drop</p>
                  <p className="text-[10px] text-slate-450 font-medium mt-0.5">
                    GST certificate, trade license, bank statement &mdash; PDF/JPG/PNG up to 5MB each
                  </p>
                </div>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-1.5 pt-1.5">
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[10px] font-bold text-slate-650 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md">
                      <span>📄 {file}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="text-rose-500 hover:text-rose-700 text-xs font-black px-1"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#1b4d4f] hover:bg-[#123637] text-white text-xs font-bold rounded-md transition shadow-xs"
            >
              Submit Credit Request
            </button>
          </form>
        </div>

        {/* Right Column (Existing Credit Limits) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100">Existing Credit Limits</h2>
            <div className="overflow-x-auto text-[11px] font-semibold text-slate-700">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-150">
                    <th className="p-2.5">Agent / Seller</th>
                    <th className="p-2.5 text-right">Limit</th>
                    <th className="p-2.5 text-right">Used</th>
                    <th className="p-2.5 text-right">Available</th>
                    <th className="p-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 whitespace-pre-line leading-relaxed">
                  {creditLimits.map((cl) => (
                    <tr key={cl.id} className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-bold text-slate-800 text-[10px]">{cl.agent}</td>
                      <td className="p-2.5 text-right">{cl.limit}</td>
                      <td className="p-2.5 text-right">{cl.used}</td>
                      <td className="p-2.5 text-right font-extrabold text-slate-900">{cl.available}</td>
                      <td className="p-2.5 text-center">
                        <span
                          className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-sm
                            ${cl.status === 'Active'
                              ? 'bg-emerald-50 border border-emerald-100 text-emerald-700'
                              : 'bg-amber-50 border border-amber-100 text-amber-700'
                            }`}
                        >
                          {cl.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info Alert Box */}
          <div className="bg-[#e2f2f1]/35 border-l-4 border-[#1b4d4f] p-4 rounded-r-md text-xs font-semibold text-slate-750 leading-relaxed">
            Credit limits are set individually by each agent or seller. The platform does not guarantee credit approval. Repayment is tracked separately.
          </div>
        </div>
      </div>
    </div>
  );
};
