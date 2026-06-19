import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useNavigate } from 'react-router-dom';

export const ResetPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    otp: '',
    password: '',
    confirmPassword: ''
  });

  const getPasswordMatch = () => {
    if (!formData.confirmPassword) return null;
    return formData.password === formData.confirmPassword
      ? <span className="text-emerald-500 font-medium">Matched</span>
      : <span className="text-red-500 font-medium">Not Matched</span>;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (formData.otp.length < 4) {
      showToast('Please enter a valid OTP', 'error');
      return;
    }
    
    showToast('Password reset successfully! Please login.', 'success');
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center py-4 w-full space-y-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-start mb-6 w-full">
          <div className="flex items-center gap-2 cursor-pointer w-fit group pt-2" onClick={() => navigate('/forgot-password')}>
            <span className="text-white font-bold group-hover:text-slate-200 transition group-hover:-translate-x-1">{t('back', { defaultValue: 'Back' })}</span>
          </div>
          <img src="/logo.png" alt="VelaanBay Logo" className="h-24 w-auto object-contain drop-shadow-lg" />
        </div>

        <div className="text-center sm:text-left">
          <span className="text-xs font-bold text-[#a7f3d0] uppercase tracking-widest">{t('recovery', { defaultValue: 'Recovery' })}</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 drop-shadow-md">{t('reset_password', { defaultValue: 'Reset Password' })}</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-8 max-w-md w-full shadow-sm text-center space-y-6">
        <div className="w-12 h-12 bg-teal-50 text-[#1b4d4f] border border-teal-100 rounded-full flex items-center justify-center text-xl mx-auto">
          🔑
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-[#1b4d4f]">{t('create_new_password', { defaultValue: 'Create New Password' })}</h3>
          <p className="text-sm text-slate-500">
            {t('enter_otp_and_new_password', { defaultValue: 'Enter the OTP sent to your mobile and your new password.' })}
          </p>
        </div>

        <div className="text-left space-y-4">
          <Input
            label={t('otp', { defaultValue: 'OTP' })}
            required
            value={formData.otp}
            onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
            placeholder="123456"
          />
          <Input
            label={t('new_password', { defaultValue: 'New Password' })}
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••"
          />
          <Input
            label={t('confirm_password', { defaultValue: 'Confirm Password' })}
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            placeholder="••••••••"
            helperText={getPasswordMatch()}
          />
        </div>

        <Button type="submit" variant="primary" fullWidth>
          {t('reset_password', { defaultValue: 'Reset Password' })}
        </Button>
      </form>
    </div>
  );
};
