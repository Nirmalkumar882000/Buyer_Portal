import React from 'react';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick, label = 'Back' }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#1b4d4f] bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-200 px-3 py-1.5 rounded-md transition-all duration-150 shadow-xs group"
    aria-label={label}
  >
    <svg
      className="w-3.5 h-3.5 transition-transform duration-150 group-hover:-translate-x-0.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
    {label}
  </button>
);
