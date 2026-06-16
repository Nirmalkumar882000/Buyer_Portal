import React from 'react';
import { useLoading } from '../context/LoadingContext';

export const Loader: React.FC = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-[#0f2b2b]/75 backdrop-blur-xs flex items-center justify-center z-9999">
      <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-xl shadow-xl border border-slate-100 max-w-xs w-full text-center">
        <div className="w-12 h-12 border-4 border-[#1b4d4f] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-700">Loading Buyer Portal...</p>
        <p className="text-xs text-slate-400">Please wait while we sync details</p>
      </div>
    </div>
  );
};
