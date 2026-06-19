import React, { useState, useRef, useEffect } from 'react';

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  required?: boolean;
  options: { value: string; label: string }[];
  error?: string;
  helperText?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string | number | readonly string[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  required = false,
  options,
  error,
  helperText,
  className = '',
  id,
  onChange,
  value,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : 'select-dropdown');

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : '';

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (val: string) => {
    setIsOpen(false);
    setSearch('');
    if (onChange) {
      onChange({
        target: { value: val, name: props.name || '' }
      } as React.ChangeEvent<HTMLSelectElement>);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full" ref={wrapperRef}>
      {label && (
        <label htmlFor={selectId} className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-3.5 py-2.5 bg-white border rounded-md text-sm text-left flex justify-between items-center transition-all duration-200
            ${error
              ? 'border-red-500 focus:ring-1 focus:ring-red-500'
              : isOpen ? 'border-[#1b4d4f] ring-1 ring-[#1b4d4f]' : 'border-slate-300 hover:border-slate-400'
            } ${className}`}
        >
          <span className={`block truncate ${!selectedOption?.value ? 'text-slate-400' : 'text-slate-800'}`}>
            {displayValue || 'Select...'}
          </span>
          <svg className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 flex flex-col overflow-hidden">
            <div className="p-2 border-b border-slate-100 shrink-0">
              <input
                type="text"
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:border-[#1b4d4f]"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
            <ul className="overflow-y-auto p-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <li
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`px-3 py-2 text-sm rounded-sm cursor-pointer transition-colors
                      ${opt.value === value
                        ? 'bg-[#1b4d4f]/10 text-[#1b4d4f] font-medium'
                        : 'text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    {opt.label}
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-sm text-slate-500 text-center">No results found</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {error && <span className="text-xs text-red-500">{error}</span>}
      {!error && helperText && <span className="text-xs text-slate-400">{helperText}</span>}
    </div>
  );
};
