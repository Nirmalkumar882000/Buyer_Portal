import React, { useState } from 'react';
import { BackButton } from '../components/BackButton';

interface TransportBookingPageProps {
  onBookingConfirm: (method: 'agent' | 'cargo', details: any) => void;
  onBackToDashboard: () => void;
}

export const TransportBookingPage: React.FC<TransportBookingPageProps> = ({
  onBookingConfirm,
  onBackToDashboard,
}) => {
  const [agentMessage, setAgentMessage] = useState('Please arrange for enclosed vehicle. Delivery needed before 6 PM.');
  const [cargoTab, setCargoTab] = useState<'shared' | 'fixed'>('shared');
  const [deliveryAddress, setDeliveryAddress] = useState('Kumar Agro Traders, Kayamozhi Road, Thoothukudi – 628213');
  const [vehicleType, setVehicleType] = useState('mini');

  const handleAgentBook = (e: React.FormEvent) => {
    e.preventDefault();
    onBookingConfirm('agent', { message: agentMessage });
  };

  const handleCargoBook = (e: React.FormEvent) => {
    e.preventDefault();
    onBookingConfirm('cargo', {
      tab: cargoTab,
      deliveryAddress,
      vehicleType,
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Back Button + Title */}
      <div className="flex items-center gap-4">
        <BackButton onClick={onBackToDashboard} label="Back" />
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Transport Booking</h1>
          <p className="text-xs text-slate-400 mt-0.5">Purchase #INV-2295 › Book Transport</p>
        </div>
      </div>

      {/* Purchase Context Card */}
      <div className="bg-cyan-50/20 border border-slate-200 rounded-lg p-5 shadow-xs">
        <h2 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">
          Purchase Summary &mdash; Paddy Grade A (5 MT)
        </h2>
        <div className="flex flex-wrap justify-between items-center gap-4 text-xs font-semibold text-slate-650">
          <div>
            <span className="text-[10px] text-slate-400 font-normal block">Pickup</span>
            <span className="text-slate-800">Thoothukudi APMC (Murugan K.)</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-normal block">Quantity</span>
            <span className="text-slate-800">5 MT</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-normal block">Value</span>
            <span className="text-[#1b4d4f] font-extrabold">₹9,75,000</span>
          </div>
        </div>
      </div>

      {/* Two Column Side-by-Side Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Option A (Agent Book) */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-800">Option A &mdash; Request Agent to Book</h3>
              <span className="bg-blue-50 border border-blue-100 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded-sm">
                Recommended
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Your mandi agent (Murugan Kandasamy) will arrange the best available transporter from their network. Fastest and easiest option.
            </p>

            <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-md text-xs font-semibold text-emerald-800 leading-normal">
              Agent typically arranges transport within 2&ndash;3 hours of request
            </div>

            <form onSubmit={handleAgentBook} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide block">Message to Agent (optional)</label>
                <textarea
                  value={agentMessage}
                  onChange={(e) => setAgentMessage(e.target.value)}
                  placeholder="Enter specific request notes..."
                  rows={3}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-md focus:border-[#1b4d4f] outline-hidden text-slate-700 font-medium"
                />
              </div>
            </form>
          </div>

          <div className="pt-5 border-t border-slate-150 mt-5">
            <button
              onClick={handleAgentBook}
              className="w-full py-3.5 bg-[#1b4d4f] hover:bg-[#123637] text-white text-xs font-bold rounded-md transition shadow-xs flex items-center justify-center gap-1.5"
            >
              1-Click: Request Agent to Book &rarr;
            </button>
          </div>
        </div>

        {/* Option B (Direct Book via Cargo) */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <form onSubmit={handleCargoBook} className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-800">Option B &mdash; Book via Velaan Cargo</h3>
            </div>

            {/* Cargo tab selector */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-50 border border-slate-200 rounded-lg">
              <button
                type="button"
                onClick={() => setCargoTab('shared')}
                className={`py-2 text-xs font-bold rounded-md transition text-center
                  ${cargoTab === 'shared'
                    ? 'bg-white text-[#1b4d4f] shadow-2xs border border-slate-200/50'
                    : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                Shared Hire
              </button>
              <button
                type="button"
                onClick={() => setCargoTab('fixed')}
                className={`py-2 text-xs font-bold rounded-md transition text-center
                  ${cargoTab === 'fixed'
                    ? 'bg-white text-[#1b4d4f] shadow-2xs border border-slate-200/50'
                    : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                Fixed Hire
              </button>
            </div>

            {/* Address fields */}
            <div className="space-y-3.5 text-xs font-semibold">
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">Pickup Address</span>
                <input
                  type="text"
                  value="Thoothukudi APMC, Near Market Gate, TN &mdash; 628002"
                  readOnly
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-md outline-hidden text-slate-550 font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">Delivery Address *</span>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-md focus:border-[#1b4d4f] outline-hidden text-slate-700 font-bold"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">Vehicle Type</span>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-md focus:border-[#1b4d4f] outline-hidden text-slate-700 font-semibold"
                >
                  <option value="mini">Mini Truck (up to 5MT)</option>
                  <option value="medium">Tractor Trailer (up to 10MT)</option>
                  <option value="large">Heavy Duty Truck (up to 25MT)</option>
                </select>
              </div>
            </div>

            {/* Freight Summary Box */}
            <div className="bg-slate-50 border border-slate-150 rounded-lg p-4 space-y-2 text-xs font-semibold text-slate-700">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-450 block font-normal">Estimated Freight</span>
                  <span className="text-slate-800 text-sm font-black">₹2,800</span>
                </div>
                <div className="text-right space-y-0.5 font-bold">
                  <p className="text-slate-450 text-[10px] font-normal">Distance: ~8 km</p>
                  <p className="text-slate-800">ETA: 2 hours</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-[#1b4d4f] hover:bg-[#123637] text-white text-xs font-bold rounded-md transition shadow-xs flex items-center justify-center gap-1.5"
              >
                Confirm Booking via Velaan Cargo &rarr;
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
