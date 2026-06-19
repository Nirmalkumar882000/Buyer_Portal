import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { useLoading } from '../context/LoadingContext';
import { useToast } from '../context/ToastContext';
import { Skeleton } from '../components/Skeleton';
import { registerApi } from '../api/auth';

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
  const { t } = useTranslation();

  const turnovers = [
    { value: '10L - 50L', label: '₹10L – ₹50L' },
    { value: '50L - 2Cr', label: '₹50L – ₹2Cr' },
    { value: 'Above 2Cr', label: 'Above ₹2Cr' },
  ];

  const { showToast } = useToast();

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

    try {
      await withLoading(async () => {
        const payload = {
          username: formData.fullName,
          mobile_number: formData.mobile.replace(/[^0-9]/g, '').slice(-10),
          email: formData.email,
          business_name: formData.businessName,
          business_type: formData.businessType,
          state: formData.state,
          district: formData.district,
          taluk: formData.city,
          password: formData.password,
          gst_no: formData.gstin,
          annual_turnover: formData.turnover,
          address: formData.address,
          lan: 'en'
        };

        const response = await registerApi(payload);

        if (response.success) {
          showToast('OTP sent successfully to your mobile number', 'success');
          onSubmit();
        } else {
          showToast(response.message || 'Registration failed', 'error');
        }
      });
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setInternalLoading(false);
    }
  };

  const commodityList = [
    { id: 'paddyRice', label: t('commodity_paddy_rice') },
    { id: 'wheat', label: t('commodity_wheat') },
    { id: 'onion', label: t('commodity_onion') },
    { id: 'tomato', label: t('commodity_tomato') },
    { id: 'groundnut', label: t('commodity_groundnut') },
    { id: 'cotton', label: t('commodity_cotton') },
    { id: 'turmeric', label: t('commodity_turmeric') },
    { id: 'chilli', label: t('commodity_chilli') },
    { id: 'coconut', label: t('commodity_coconut') },
    { id: 'banana', label: t('commodity_banana') },
    { id: 'maize', label: t('commodity_maize') },
    { id: 'otherPulses', label: t('commodity_other_pulses') },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="w-full">
        <div className="flex justify-between items-start mb-6 w-full">
          <div className="flex items-center gap-2 cursor-pointer w-fit group pt-2" onClick={onBack}>
            <span className="text-white font-bold group-hover:text-slate-200 transition group-hover:-translate-x-1">{t('back')}</span>
          </div>
          <img src="/logo.png" alt="VelaanBay Logo" className="h-24 w-auto object-contain drop-shadow-lg" />
        </div>

        <div className="text-center sm:text-left">
          <span className="text-xs font-bold text-[#a7f3d0] uppercase tracking-widest">{t('registration')}</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 drop-shadow-md">{t('create_buyer_account')}</h2>
          <p className="text-sm text-slate-200 mt-1 drop-shadow-sm">{t('step_2_desc')}</p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="flex gap-2 mt-4">
          <div className="h-1.5 flex-1 bg-[#a7f3d0] rounded-full"></div>
          <div className="h-1.5 flex-1 bg-[#a7f3d0] rounded-full shadow-[0_0_8px_rgba(167,243,208,0.5)]"></div>
        </div>
      </div>

      {internalLoading ? (
        <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-xs">
          <h3 className="text-base font-bold text-slate-800 mb-6">{t('business_gst_details')}</h3>
          <Skeleton type="card" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-800">{t('business_gst_details')}</h3>
          <hr className="border-slate-100" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label={t('gstin')}
              value={formData.gstin}
              onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
              placeholder="e.g. 33AABCT1332L1ZT"
              helperText={t('gstin_optional')}
            />
            <Select
              label={t('annual_turnover')}
              required
              options={turnovers}
              value={formData.turnover}
              onChange={(e) => setFormData({ ...formData, turnover: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              {t('business_address')} <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-md text-sm text-slate-800 outline-hidden transition-all duration-200 focus:border-[#1b4d4f] focus:ring-1 focus:ring-[#1b4d4f]"
            />
          </div>
          {/* 
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              {t('commodity_types')} <span className="text-red-500">*</span>
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
          </div> */}

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={onBack}>
              {t('back')}
            </Button>
            <Button type="submit" variant="primary">
              {t('submit_registration')}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
