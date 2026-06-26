import React from 'react';

interface AgriLoaderProps {
  message?: string;
  inline?: boolean;
}

export const AgriLoader: React.FC<AgriLoaderProps> = ({ 
  message = "Loading data...", 
  inline = false 
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      {/* Agricultural Sprout Spinner */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Pulsing glow ring */}
        <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping"></div>
        {/* Green/Teal Rotating Border */}
        <div className="absolute inset-0 rounded-full border-4 border-[#1b4d4f]/20 border-t-[#2d7a6e] border-r-transparent rounded-full animate-spin"></div>
        
        {/* Leaf SVG in Center */}
        <div className="relative z-10 text-emerald-600 animate-pulse">
          <svg 
            className="w-8 h-8" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2Z" fill="currentColor" fillOpacity="0.2"/>
            <path d="M9 22c0-3.3 1-6 3-9" />
          </svg>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-bold text-[#1b4d4f]">{message}</p>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold animate-pulse">
          VelaanBay Marketplace
        </p>
      </div>
    </div>
  );

  if (inline) {
    return content;
  }

  return (
    <div className="w-full flex items-center justify-center min-h-[250px] bg-slate-50/30 rounded-xl border border-slate-100/50">
      {content}
    </div>
  );
};
