import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPlaces } from '../api/auth';
import { useTranslation } from 'react-i18next';
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
  onBack: () => void;
}

export const RegisterStep1: React.FC<RegisterStep1Props> = ({
  formData,
  setFormData,
  onNext,
  onLoginClick,
  onBack,
}) => {
  const { withLoading } = useLoading();
  const [internalLoading, setInternalLoading] = useState(false);
  const { t, i18n } = useTranslation();

  const { data: placesData = [] } = useQuery({
    queryKey: ['places', i18n.language || 'en'],
    queryFn: async () => {
      const data = await getPlaces(i18n.language || 'en');
      if (!data.success || !data.data) throw new Error("Failed to fetch places");
      return data.data;
    },
  });

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

  const districtOptions = [
    { label: t('select_district', { defaultValue: 'Select District' }), value: '' },
    ...placesData.map((d: any) => ({ label: d.label, value: d.value }))
  ];
  const selectedDistrictObj = placesData.find((d: any) => d.value === formData.district);
  const talukOptions = [
    { label: t('select_taluk', { defaultValue: 'Select Taluk' }), value: '' },
    ...(selectedDistrictObj ? selectedDistrictObj.taluks.map((t: any) => ({ label: t.label, value: t.value })) : [])
  ];

  const getPasswordStrength = (pass: string) => {
    if (!pass) return null;
    if (pass.length < 6) return <span className="text-red-500 font-medium">Weak (too short)</span>;

    const hasLetters = /[a-zA-Z]/.test(pass);
    const hasNumbers = /\d/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

    if (pass.length >= 8 && hasLetters && hasNumbers && hasSpecial) {
      return <span className="text-emerald-500 font-medium">Strong</span>;
    }
    if (pass.length >= 6 && hasLetters && hasNumbers) {
      return <span className="text-amber-500 font-medium">Medium</span>;
    }
    return <span className="text-red-500 font-medium">Weak</span>;
  };

  const getPasswordMatch = () => {
    if (!formData.confirmPassword) return null;
    return formData.password === formData.confirmPassword
      ? <span className="text-emerald-500 font-medium">Matched</span>
      : <span className="text-red-500 font-medium">Not Matched</span>;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInternalLoading(true);
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      setInternalLoading(false);
      return;
    }

    // Simulate API check
    await withLoading(async () => {
      await new Promise((res) => setTimeout(res, 800));
    });
    setInternalLoading(false);
    onNext();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="w-full">
        <div className="flex justify-between items-start w-full">
          <div className="flex items-center gap-2 cursor-pointer w-fit group pt-2" onClick={onBack}>
            <span className="text-white font-bold group-hover:text-slate-200 transition group-hover:-translate-x-1">{t('back')}</span>
          </div>
          <img src="/logo.png" alt="VelaanBay Logo" className="h-32 w-auto object-contain drop-shadow-lg" />
        </div>

        <div className="text-center sm:text-left">
          <span className="text-xs font-bold text-[#a7f3d0] uppercase tracking-widest">{t('registration')}</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 drop-shadow-md">{t('create_buyer_account')}</h2>
          <p className="text-sm text-slate-200 mt-1 drop-shadow-sm">
            {t('step_1_desc')}
          </p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="flex gap-2 mt-4">
          <div className="h-1.5 flex-1 bg-[#a7f3d0] rounded-full shadow-[0_0_8px_rgba(167,243,208,0.5)]"></div>
          <div className="h-1.5 flex-1 bg-white/20 rounded-full"></div>
        </div>
      </div>

      {internalLoading ? (
        <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-xs">
          <h3 className="text-base font-bold text-slate-800 mb-6">{t('personal_business_info')}</h3>
          <Skeleton type="card" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-800">{t('personal_business_info')}</h3>
          <hr className="border-slate-100" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label={t('full_name')}
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
            <div>
              <Input
                label={t('mobile_number')}
                required
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                helperText={t('otp_sent_msg')}
              />
            </div>
            <Input
              label={t('email_address')}
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@example.com"
            />
            <Input
              label={t('business_name')}
              required
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="e.g. Kumar Agro Traders"
            />
            <Select
              label={t('business_type')}
              required
              options={businessTypes}
              value={formData.businessType}
              onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
            />
            <Select
              label={t('state')}
              required
              options={states}
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />
            <Select
              label={t('district')}
              required
              options={districtOptions}
              value={formData.district}
              onChange={(e) => {
                setFormData({ ...formData, district: e.target.value, city: '' });
              }}
            />
            <Select
              label={t('taluk')}
              required
              options={talukOptions}
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
            <Input
              label={t('password')}
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              helperText={getPasswordStrength(formData.password)}
            />
            <Input
              label={t('confirm_password')}
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              helperText={getPasswordMatch()}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500 text-center sm:text-left">
              {t('already_have_account')}{' '}
              <button type="button" onClick={onLoginClick} className="text-[#1b4d4f] font-bold underline hover:text-[#13383a]">
                {t('login_here')}
              </button>
            </span>
            <Button type="submit" variant="primary">
              {t('next_business_details')}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
