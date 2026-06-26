import React from 'react';
import { useLoading } from '../context/LoadingContext';

export const Loader: React.FC = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-[#0f2b2b]/70 backdrop-blur-md flex items-center justify-center z-[9999] transition-all duration-300">
      <div className="flex flex-col items-center gap-5 bg-white/95 border border-teal-50 p-8 rounded-2xl shadow-2xl max-w-sm w-[90%] text-center transform scale-100 transition-all">
        {/* Animated Sprout/Leaf Icon Container */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Outer Pulse/Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping"></div>
          {/* Rotating Dotted Border */}
          <div className="absolute inset-0 rounded-full border-4 border-dashed border-t-[#1b4d4f] border-r-transparent border-b-[#2d7a6e] border-l-transparent animate-spin duration-1000"></div>
          
          {/* Agricultural Icon (Leaf/Sprout) */}
          <div className="relative z-10 text-emerald-600 animate-pulse">
            <svg 
              className="w-10 h-10" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 2a15 15 0 0 0-9 9c0 4.4 3.6 8 8 8h1v-9l-3 3" />
              <path d="M12 9a15 15 0 0 1 9 9c0 4.4-3.6 8-8 8h-1v-9l3 3" />
              <path d="M12 22V10" />
            </svg>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-base font-extrabold text-[#1b4d4f] tracking-wide animate-pulse">
            VelaanBay
          </p>
          <p className="text-xs font-semibold text-slate-700">
            Syncing agricultural marketplace data...
          </p>
          <p className="text-[10px] text-teal-600 font-bold uppercase tracking-wider bg-teal-50 px-2.5 py-0.5 rounded-full inline-block">
            Please wait
          </p>
        </div>
      </div>
    </div>
  );
};
