import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  required?: boolean;
  options: { value: string; label: string }[];
  error?: string;
  helperText?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  required = false,
  options,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={selectId} className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={selectId}
        className={`w-full px-3.5 py-2.5 bg-white border rounded-md text-sm text-slate-800 outline-hidden transition-all duration-200
          ${error 
            ? 'border-red-500 focus:ring-1 focus:ring-red-500' 
            : 'border-slate-300 focus:border-[#1b4d4f] focus:ring-1 focus:ring-[#1b4d4f]'
          } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
      {!error && helperText && <span className="text-xs text-slate-400">{helperText}</span>}
    </div>
  );
};
