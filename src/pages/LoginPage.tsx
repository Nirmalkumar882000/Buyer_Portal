import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useLoading } from '../context/LoadingContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { loginApi } from '../api/auth';
import { ParticlesBackground } from '../components/ParticlesBackground';
import { useNavigate } from 'react-router-dom';

interface LoginPageProps {
  onBack: () => void;
  onLoginSuccess: () => void;
  onRegisterClick: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBack, onLoginSuccess, onRegisterClick }) => {
  const { withLoading } = useLoading();
  const { showToast } = useToast();
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    mobile: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);

  React.useEffect(() => {
    const savedMobile = localStorage.getItem('buyer_remember_mobile');
    const savedPassword = localStorage.getItem('buyer_remember_password');
    if (savedMobile) {
      setFormData(prev => ({ ...prev, mobile: savedMobile }));
      setRememberMe(true);
      if (savedPassword) {
        setFormData(prev => ({ ...prev, password: savedPassword }));
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.mobile || !formData.password) {
      showToast('Please enter both mobile number and password', 'error');
      return;
    }

    try {
      await withLoading(async () => {
        const response = await loginApi({
          mobile_number: formData.mobile,
          password: formData.password
        });

        if (response.success) {
          // Save token and user info
          localStorage.setItem('buyer_token', response.data.token);
          localStorage.setItem('buyer_user', JSON.stringify(response.data.user));

          login({
            fullName: response.data.user?.username || 'User',
            mobile: response.data.user?.mobile_number || formData.mobile,
            sessionStart: Date.now()
          });

          if (rememberMe) {
            localStorage.setItem('buyer_remember_mobile', formData.mobile);
            localStorage.setItem('buyer_remember_password', formData.password);
          } else {
            localStorage.removeItem('buyer_remember_mobile');
            localStorage.removeItem('buyer_remember_password');
          }

          showToast('Logged in successfully!', 'success');
          onLoginSuccess();
        } else {
          showToast(response.message || 'Login failed', 'error');
        }
      });
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Login failed. Please check your credentials.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col py-8 sm:py-12 relative bg-[#2a4d4c] overflow-x-hidden">
      <ParticlesBackground />
      
      <div className="m-auto w-full sm:max-w-lg px-4 sm:px-6 relative z-10">
        <div className="flex justify-between items-start mb-6 w-full">
          <div className="flex items-center gap-2 cursor-pointer w-fit group pt-2" onClick={onBack}>
            <span className="text-white font-bold group-hover:text-slate-200 transition group-hover:-translate-x-1">{t('back')}</span>
          </div>
          <img src="/logo.png" alt="VelaanBay Logo" className="h-24 w-auto object-contain drop-shadow-lg" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-white mt-4 drop-shadow-md">
          {t('welcome_back')}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-200 drop-shadow-sm">
          {t('login_subtitle')}{' '}
          <button onClick={onRegisterClick} className="font-bold text-[#a7f3d0] hover:text-white transition">
            {t('register_here')}
          </button>
        </p>

        <div className="mt-8 bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-slate-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label={t('mobile_number')}
              required
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              placeholder="+91 98765 43210"
            />

            <Input
              label={t('password')}
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#1b4d4f] focus:ring-[#1b4d4f] border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button type="button" onClick={() => navigate('/forgot-password')} className="font-medium text-[#1b4d4f] hover:text-[#13383a] transition">
                  Forgot your password?
                </button>
              </div>
            </div>

            <div>
              <Button type="submit" variant="primary" className="w-full justify-center">
                {t('login')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
