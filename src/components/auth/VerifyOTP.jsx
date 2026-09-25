import { KeyRound, ArrowLeft, RefreshCw, Clock } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTopLoader } from '../../contexts/TopLoaderContext.jsx';
import MessageAlert from '../../components/auth/MessageAlert.jsx';
import { apiFetch } from '@/api/api.js';

export default function VerifyOTP() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const { start, complete } = useTopLoader();

  useEffect(() => {
    const email = sessionStorage.getItem('resetEmail');
    const timestamp = sessionStorage.getItem('resetTimestamp');

    if (!email || !timestamp) {
      navigate('/forgot-password');
      return;
    }

    const elapsed = Math.floor((Date.now() - parseInt(timestamp)) / 1000);
    if (elapsed > 300) {
      sessionStorage.removeItem('resetEmail');
      sessionStorage.removeItem('resetTimestamp');
      navigate('/forgot-password');
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleOtpChange = useCallback(
    (index, value) => {
      if (value.length > 1) return;
      if (!/^\d*$/.test(value)) return;

      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }

      if (response) setResponse(null);
    },
    [otp, response]
  );

  const handleKeyDown = useCallback(
    (index, e) => {
      if (e.key === 'Backspace' && !otp[index] && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    },
    [otp]
  );

  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text');
      const digits = pastedData.replace(/\D/g, '').slice(0, 6);

      if (digits.length > 0) {
        const newOtp = [...otp];
        for (let i = 0; i < digits.length; i++) {
          if (i < 6) newOtp[i] = digits[i];
        }
        setOtp(newOtp);

        const lastFilledIndex = Math.min(digits.length - 1, 5);
        if (lastFilledIndex >= 0 && lastFilledIndex < 5) {
          inputRefs.current[lastFilledIndex + 1]?.focus();
        } else if (digits.length === 6) {
          inputRefs.current[5]?.focus();
        }

        if (response) setResponse(null);

        if (digits.length === 6) {
          setTimeout(() => {
            const submitEvent = new Event('submit', { bubbles: true });
            e.target.closest('form')?.dispatchEvent(submitEvent);
          }, 100);
        }
      }
    },
    [otp, response]
  );

  const handleResendOTP = useCallback(async () => {
    const email = sessionStorage.getItem('resetEmail');
    if (!email || !canResend) return;

    setResendLoading(true);
    try {
      const payload = { email };
      const data = await apiFetch('/api/auth/forgot_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (data.success) {
        setResponse({ success: true, message: 'New code sent successfully' });
        setTimer(120);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();

        const interval = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setCanResend(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setResponse({ success: false, message: data.message || 'Failed to resend code' });
      }
    } catch (error) {
      setResponse({ success: false, message: 'Network error. Please try again.' });
    } finally {
      setResendLoading(false);
    }
  }, [canResend]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const otpValue = otp.join('');

      if (otpValue.length !== 6) {
        setResponse({ success: false, message: 'Please enter the complete 6-digit code' });
        return;
      }

      setLoading(true);
      try {
        start();
        const email = sessionStorage.getItem('resetEmail');
        const payload = { email, otp: otpValue };

        const data = await apiFetch('/api/auth/verify_otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (data.success) {
          navigate('/reset-password');
        } else {
          setResponse({ success: false, message: data.message || 'Invalid code. Please try again.' });
          setOtp(['', '', '', '', '', '']);
          inputRefs.current[0]?.focus();
        }
      } catch (error) {
        setResponse({ success: false, message: 'Network error. Please try again.' });
      } finally {
        setLoading(false);
        complete();
      }
    },
    [otp, navigate, start, complete]
  );

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return (
    <div className="flex items-center bg-zinc-50 justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 sm:p-10">
          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-1.5">
              Enter verification code
            </h1>
            <p className="text-sm text-slate-500">
              We sent a 6-digit code to your email
            </p>
          </div>

          {/* Alert */}
          <MessageAlert response={response} onClose={() => setResponse(null)} />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP inputs */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3 text-center">
                Verification code
              </label>
              <div
                className="flex justify-center gap-2 sm:gap-3"
                onPaste={handlePaste}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-11 h-11 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-bold bg-white border border-slate-300 rounded-lg text-slate-900 focus:border-slate-900 focus:ring-0 outline-none transition-colors disabled:opacity-50"
                    disabled={loading}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 text-center mt-3">
                Tip: you can paste the entire code
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#E30613] hover:bg-[#c00511] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-lg transition-colors"
            >
              <KeyRound size={16} />
              {loading ? 'Verifying…' : 'Verify code'}
            </button>

            {/* Footer links */}
            <div className="flex items-center justify-between text-sm pt-1">
              <Link
                to="/forgot-password"
                className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft size={14} />
                Back
              </Link>

              <div className="flex items-center gap-2">
                {timer > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-slate-500">
                    <Clock size={14} />
                    {formatTime(timer)}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendLoading || !canResend}
                    className="inline-flex items-center gap-1.5 text-[#E30613] hover:text-[#c00511] disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                  >
                    <RefreshCw
                      size={14}
                      className={resendLoading ? 'animate-spin' : ''}
                    />
                    {resendLoading ? 'Sending…' : 'Resend code'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}