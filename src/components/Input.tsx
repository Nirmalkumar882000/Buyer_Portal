import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  helperText?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  required = false,
  helperText,
  error,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={inputId} className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={inputId}
        className={`w-full px-3.5 py-2.5 bg-white border rounded-md text-sm text-slate-800 outline-hidden transition-all duration-200 placeholder:text-slate-400
          ${error 
            ? 'border-red-500 focus:ring-1 focus:ring-red-500' 
            : 'border-slate-300 focus:border-[#1b4d4f] focus:ring-1 focus:ring-[#1b4d4f]'
          } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
      {!error && helperText && <span className="text-xs text-slate-400">{helperText}</span>}
    </div>
  );
};
