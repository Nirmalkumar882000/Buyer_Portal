import React from 'react';
import { useToast } from '../context/ToastContext';

interface DeliveryTrackingPageProps {
  onBackToDashboard: () => void;
}

export const DeliveryTrackingPage: React.FC<DeliveryTrackingPageProps> = ({ onBackToDashboard }) => {
  const { showToast } = useToast();
  return (
    <div className="space-y-6 font-sans">
      {/* Top Navigation & Status */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          {/* Breadcrumbs */}
          <div className="text-xs text-slate-400 font-semibold mb-1">
            <span className="text-slate-400">Transport</span>
            <span className="mx-1.5">&rsaquo;</span>
            <button onClick={onBackToDashboard} className="hover:text-slate-600 underline font-semibold text-slate-450">
              Tracking &mdash; Order #VCG-8821
            </button>
          </div>
          {/* Title and Subtitle */}
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Delivery Tracking</h1>
          <p className="text-xs text-slate-500 font-bold mt-0.5">
            Paddy Grade A (5 MT) &mdash; Thoothukudi APMC &rarr; Thoothukudi
          </p>
        </div>

        {/* Status Badge */}
        <div className="self-start sm:self-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-white text-[11px] font-black rounded-full shadow-xs uppercase tracking-wider">
            🚚 In Transit
          </span>
        </div>
      </div>

      {/* 2 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column - Live Route Map & Driver Info (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div>
            {/* Map Placeholder with Green Gradient */}
            <div className="relative bg-gradient-to-br from-emerald-50 to-emerald-100/60 border border-emerald-150 rounded-lg p-8 text-center space-y-4 overflow-hidden h-72 flex flex-col justify-center items-center">
              {/* Grid Lines Pattern effect */}
              <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
              
              {/* Map Icon Pin representation */}
              <div className="relative z-10 bg-white p-3 rounded-full shadow-md border border-emerald-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L16 4m0 13V4m0 0L9 7" />
                </svg>
              </div>

              <div className="relative z-10 space-y-1">
                <h3 className="text-sm font-bold text-slate-800">Live Route Map</h3>
                <p className="text-xs text-slate-550 font-bold">Thoothukudi APMC &rarr; Kayamozhi Road</p>
                <p className="text-[10px] text-emerald-700 font-extrabold bg-emerald-100/70 inline-block px-2 py-0.5 rounded">
                  Distance: 8.2 km | ETA: 35 minutes
                </p>
              </div>

              {/* Current Position Note (dark pill) */}
              <div className="relative z-10 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1b4d4f] text-white text-[10px] font-bold rounded-full shadow-md">
                <span>📍 Vehicle Location: Near Clock Tower</span>
              </div>
            </div>

            {/* Driver & Vehicle Details Stack */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 mt-6 pb-6 border-b border-slate-150 text-xs font-bold text-slate-650">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block mb-0.5">Driver</span>
                <span className="text-slate-800 text-sm font-extrabold">Krishnamurthy P.</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block mb-0.5">Vehicle</span>
                <span className="text-slate-800 text-sm font-extrabold">TN 69 B 4421</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block mb-0.5">Phone</span>
                <span className="text-slate-800 font-extrabold">+91 94440 12345</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block mb-0.5">ETA</span>
                <span className="text-amber-600 text-sm font-black">4:35 PM</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-2 gap-4 pt-5">
            <button
              onClick={() => showToast('Calling driver Krishnamurthy P. (+91 94440 12345)...', 'info')}
              className="w-full bg-[#1b4d4f] hover:bg-[#123637] text-white text-xs font-bold py-3 rounded-md transition shadow-xs flex items-center justify-center gap-1.5"
            >
              📞 Call Driver
            </button>
            <button
              onClick={() => showToast('Opening WhatsApp chat with driver...', 'info')}
              className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-350 text-xs font-bold py-3 rounded-md transition flex items-center justify-center gap-1.5 shadow-2xs"
            >
              💬 WhatsApp
            </button>
          </div>
        </div>

        {/* Right Column - Timeline Status (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Delivery Status</h3>
            </div>

            {/* Vertical Timeline */}
            <div className="space-y-6 relative pl-6 before:content-[''] before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
              
              {/* Step 1: Confirmed */}
              <div className="relative text-xs leading-normal">
                {/* Green check icon */}
                <span className="absolute -left-[23.5px] top-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white ring-4 ring-emerald-50">
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <div className="font-extrabold text-slate-800">Booking Confirmed</div>
                <p className="text-[10px] text-slate-400 font-semibold">15 Jul, 02:10 PM</p>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Order #VCG-8821 confirmed. Driver assigned.</p>
              </div>

              {/* Step 2: Assigned */}
              <div className="relative text-xs leading-normal">
                {/* Green check icon */}
                <span className="absolute -left-[23.5px] top-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white ring-4 ring-emerald-50">
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <div className="font-extrabold text-slate-800">Vehicle Assigned</div>
                <p className="text-[10px] text-slate-400 font-semibold">15 Jul, 02:45 PM</p>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">TN 69 B 4421 (Mini Truck). Driver: Krishnamurthy P.</p>
              </div>

              {/* Step 3: In Transit */}
              <div className="relative text-xs leading-normal">
                {/* Amber indicator icon */}
                <span className="absolute -left-[23.5px] top-1 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-white ring-4 ring-amber-50">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                </span>
                <div className="font-black text-amber-600">In Transit</div>
                <p className="text-[10px] text-slate-450 font-bold">15 Jul, 04:00 PM</p>
                <p className="text-[11px] text-slate-700 font-bold mt-0.5">Loaded and en route. ETA 4:35 PM.</p>
              </div>

              {/* Step 4: Delivered */}
              <div className="relative text-xs leading-normal text-slate-400">
                {/* Pending Grey icon */}
                <span className="absolute -left-[23.5px] top-1 w-4 h-4 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-400" />
                <div className="font-bold">Delivered</div>
                <p className="text-[10px] font-semibold mt-0.5">Pending</p>
              </div>
            </div>
          </div>

          {/* Return button */}
          <div className="pt-5 border-t border-slate-100 mt-6">
            <button
              onClick={onBackToDashboard}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-md transition text-center"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
