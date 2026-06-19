import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useNavigate } from 'react-router-dom';

export const ForgotPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [mobile, setMobile] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length >= 10) {
      showToast('OTP sent to your mobile number', 'success');
      navigate('/reset-password');
    } else {
      showToast('Please enter a valid mobile number', 'error');
    }
  };

  return (
    <div className="flex flex-col items-center py-4 w-full space-y-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-start mb-6 w-full">
          <div className="flex items-center gap-2 cursor-pointer w-fit group pt-2" onClick={() => navigate('/login')}>
            <span className="text-white font-bold group-hover:text-slate-200 transition group-hover:-translate-x-1">{t('back', { defaultValue: 'Back' })}</span>
          </div>
          <img src="/logo.png" alt="VelaanBay Logo" className="h-24 w-auto object-contain drop-shadow-lg" />
        </div>

        <div className="text-center sm:text-left">
          <span className="text-xs font-bold text-[#a7f3d0] uppercase tracking-widest">{t('recovery', { defaultValue: 'Recovery' })}</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 drop-shadow-md">{t('forgot_password', { defaultValue: 'Forgot Password' })}</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-8 max-w-md w-full shadow-sm text-center space-y-6">
        <div className="w-12 h-12 bg-teal-50 text-[#1b4d4f] border border-teal-100 rounded-full flex items-center justify-center text-xl mx-auto">
          🔒
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-[#1b4d4f]">{t('reset_your_password', { defaultValue: 'Reset your password' })}</h3>
          <p className="text-sm text-slate-500">
            {t('enter_mobile_to_reset', { defaultValue: 'Enter your registered mobile number to receive an OTP.' })}
          </p>
        </div>

        <div className="text-left">
          <Input
            label={t('mobile_number', { defaultValue: 'Mobile Number' })}
            required
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="+91 98765 43210"
          />
        </div>

        <Button type="submit" variant="primary" fullWidth>
          {t('send_otp', { defaultValue: 'Send OTP' })}
        </Button>
      </form>
    </div>
  );
};
