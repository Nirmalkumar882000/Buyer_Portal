import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { useLoading } from '../context/LoadingContext';
import { Skeleton } from '../components/Skeleton';

interface RegisterStep1Props {
  formData: any;
  setFormData: (data: any) => void;
  onNext: () => void;
  onLoginClick: () => void;
}

export const RegisterStep1: React.FC<RegisterStep1Props> = ({
  formData,
  setFormData,
  onNext,
  onLoginClick,
}) => {
  const { withLoading } = useLoading();
  const [internalLoading, setInternalLoading] = useState(false);

  const businessTypes = [
    { value: 'Wholesale Trader', label: 'Wholesale Trader' },
    { value: 'Retailer', label: 'Retailer' },
    { value: 'Processor/Mill', label: 'Processor/Mill' },
    { value: 'Exporter', label: 'Exporter' },
    { value: 'Individual', label: 'Individual' },
  ];

  const states = [
    { value: 'Tamil Nadu', label: 'Tamil Nadu' },
    { value: 'Karnataka', label: 'Karnataka' },
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Punjab', label: 'Punjab' },
  ];

  const districts = [
    { value: 'Thoothukudi', label: 'Thoothukudi' },
    { value: 'Chennai', label: 'Chennai' },
    { value: 'Coimbatore', label: 'Coimbatore' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInternalLoading(true);
    // Simulate API check
    await withLoading(async () => {
      await new Promise((res) => setTimeout(res, 800));
    });
    setInternalLoading(false);
    onNext();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Registration</span>
        <h2 className="text-2xl font-bold text-slate-800 mt-1">Create Your Buyer Account</h2>
        <p className="text-xs text-slate-500 mt-1">
          Step 1 of 2 — Basic Details &bull; Free Forever. No subscription required.
        </p>

        {/* Stepper Progress Bar */}
        <div className="flex gap-2 mt-4">
          <div className="h-1.5 flex-1 bg-[#1b4d4f] rounded-full"></div>
          <div className="h-1.5 flex-1 bg-slate-200 rounded-full"></div>
        </div>
      </div>

      {internalLoading ? (
        <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-xs">
          <h3 className="text-base font-bold text-slate-800 mb-6">Personal & Business Information</h3>
          <Skeleton type="card" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-800">Personal & Business Information</h3>
          <hr className="border-slate-100" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
            <div>
              <Input
                label="Mobile Number"
                required
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                helperText="OTP will be sent to this number"
              />
            </div>
            <Input
              label="Email Address"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@example.com"
            />
            <Input
              label="Business Name"
              required
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="e.g. Kumar Agro Traders"
            />
            <Select
              label="Business Type"
              required
              options={businessTypes}
              value={formData.businessType}
              onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
            />
            <Select
              label="State"
              required
              options={states}
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />
            <Select
              label="District"
              required
              options={districts}
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            />
            <Input
              label="City / Town"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500 text-center sm:text-left">
              Already have an account?{' '}
              <button type="button" onClick={onLoginClick} className="text-[#1b4d4f] font-bold underline hover:text-[#13383a]">
                Login here
              </button>
            </span>
            <Button type="submit" variant="primary">
              Next: Business Details →
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
