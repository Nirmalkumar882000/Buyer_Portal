import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/Button';
import { useLoading } from '../context/LoadingContext';
import { Skeleton } from '../components/Skeleton';

interface OtpVerifyProps {
  mobile: string;
  onVerify: () => void;
}

export const OtpVerify: React.FC<OtpVerifyProps> = ({ mobile, onVerify }) => {
  const { showToast } = useToast();
  const { withLoading } = useLoading();
  const [internalLoading, setInternalLoading] = useState(false);
  const [digits, setDigits] = useState(['4', '8', '', '', '', '']);
  const [countdown, setCountdown] = useState(42);

  useEffect(() => {
    let timer: number;
    if (countdown > 0) {
      timer = window.setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (val: string, index: number) => {
    const nextDigits = [...digits];
    nextDigits[index] = val.slice(-1);
    setDigits(nextDigits);

    // Auto-focus next field
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
        const nextDigits = [...digits];
        nextDigits[index - 1] = '';
        setDigits(nextDigits);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInternalLoading(true);
    await withLoading(async () => {
      await new Promise((res) => setTimeout(res, 1200));
    });
    setInternalLoading(false);
    onVerify();
  };

  const handleResend = () => {
    setCountdown(60);
    showToast('OTP resent to ' + mobile, 'info');
  };

  return (
    <div className="flex justify-center items-center py-10">
      {internalLoading ? (
        <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-xs max-w-sm w-full">
          <Skeleton type="list" count={3} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-8 max-w-md w-full shadow-sm text-center space-y-6">
          <div className="w-12 h-12 bg-teal-50 text-[#1b4d4f] border border-teal-100 rounded-full flex items-center justify-center text-xl mx-auto">
            📱
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#1b4d4f]">Verify Your Mobile</h3>
            <p className="text-sm text-slate-500">
              We've sent a 6-digit OTP to <strong className="text-slate-800">{mobile}</strong>
            </p>
          </div>

          <div className="flex justify-center gap-3">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className="w-12 h-12 text-center text-xl font-bold text-[#1b4d4f] border border-slate-300 focus:border-[#1b4d4f] focus:ring-1 focus:ring-[#1b4d4f] rounded-lg outline-hidden"
              />
            ))}
          </div>

          <Button type="submit" variant="primary" fullWidth>
            Verify OTP
          </Button>

          <div className="text-xs text-slate-500">
            Didn't receive the code?{' '}
            {countdown > 0 ? (
              <span className="text-red-500 font-semibold">Resend OTP (Wait 00:{countdown < 10 ? `0${countdown}` : countdown})</span>
            ) : (
              <button type="button" onClick={handleResend} className="text-[#1b4d4f] font-bold hover:underline">
                Resend OTP
              </button>
            )}
          </div>

          <p className="text-[10px] text-slate-400 leading-normal">
            OTP expires in 10 minutes. For support:{' '}
            <a href="mailto:admin@skandavelwebtech.com" className="text-[#1b4d4f] underline font-medium">
              admin@skandavelwebtech.com
            </a>
          </p>
        </form>
      )}
    </div>
  );
};
