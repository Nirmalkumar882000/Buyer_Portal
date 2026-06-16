import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { useLoading } from '../context/LoadingContext';
import { Skeleton } from '../components/Skeleton';

interface RegisterStep2Props {
  formData: any;
  setFormData: (data: any) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export const RegisterStep2: React.FC<RegisterStep2Props> = ({
  formData,
  setFormData,
  onBack,
  onSubmit,
}) => {
  const { withLoading } = useLoading();
  const [internalLoading, setInternalLoading] = useState(false);

  const turnovers = [
    { value: '₹10L – ₹50L', label: '₹10L – ₹50L' },
    { value: '₹50L – ₹2Cr', label: '₹50L – ₹2Cr' },
    { value: 'Above ₹2Cr', label: 'Above ₹2Cr' },
  ];

  const handleCheckboxChange = (key: string) => {
    setFormData({
      ...formData,
      commodities: {
        ...formData.commodities,
        [key]: !formData.commodities[key],
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInternalLoading(true);
    await withLoading(async () => {
      await new Promise((res) => setTimeout(res, 800));
    });
    setInternalLoading(false);
    onSubmit();
  };

  const commodityList = [
    { id: 'paddyRice', label: 'Paddy / Rice' },
    { id: 'wheat', label: 'Wheat' },
    { id: 'onion', label: 'Onion' },
    { id: 'tomato', label: 'Tomato' },
    { id: 'groundnut', label: 'Groundnut' },
    { id: 'cotton', label: 'Cotton' },
    { id: 'turmeric', label: 'Turmeric' },
    { id: 'chilli', label: 'Chilli' },
    { id: 'coconut', label: 'Coconut' },
    { id: 'banana', label: 'Banana' },
    { id: 'maize', label: 'Maize' },
    { id: 'otherPulses', label: 'Other Pulses' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Registration</span>
        <h2 className="text-2xl font-bold text-slate-800 mt-1">Create Your Buyer Account</h2>
        <p className="text-xs text-slate-500 mt-1">Step 2 of 2 — Business Details</p>

        {/* Stepper Progress Bar */}
        <div className="flex gap-2 mt-4">
          <div className="h-1.5 flex-1 bg-[#1b4d4f] rounded-full"></div>
          <div className="h-1.5 flex-1 bg-[#1b4d4f] rounded-full"></div>
        </div>
      </div>

      {internalLoading ? (
        <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-xs">
          <h3 className="text-base font-bold text-slate-800 mb-6">Business & GST Details</h3>
          <Skeleton type="card" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-800">Business & GST Details</h3>
          <hr className="border-slate-100" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="GSTIN"
              value={formData.gstin}
              onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
              placeholder="e.g. 33AABCT1332L1ZT"
              helperText="Optional — enter if GST registered"
            />
            <Select
              label="Annual Turnover Range"
              required
              options={turnovers}
              value={formData.turnover}
              onChange={(e) => setFormData({ ...formData, turnover: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Business Address <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-md text-sm text-slate-800 outline-hidden transition-all duration-200 focus:border-[#1b4d4f] focus:ring-1 focus:ring-[#1b4d4f]"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Commodity Types You Trade <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-150 rounded-lg">
              {commodityList.map((item) => (
                <label key={item.id} className="flex items-center gap-2.5 text-sm text-slate-700 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.commodities[item.id]}
                    onChange={() => handleCheckboxChange(item.id)}
                    className="rounded border-slate-300 text-[#1b4d4f] focus:ring-[#1b4d4f]"
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={onBack}>
              ← Back
            </Button>
            <Button type="submit" variant="primary">
              Submit Registration →
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
