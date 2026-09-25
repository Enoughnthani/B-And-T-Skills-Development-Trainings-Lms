import { Send, ArrowLeft } from 'lucide-react';
import { useState, useCallback } from 'react';
import { Form } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useTopLoader } from '../../contexts/TopLoaderContext.jsx';
import MessageAlert from '../../components/auth/MessageAlert';
import { apiFetch } from '@/api/api.js';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const { start, complete } = useTopLoader();
  const [formData, setForm] = useState({ email: '' });

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      if (response) setResponse(null);
    },
    [response]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      if (e.currentTarget.checkValidity() === false) {
        e.stopPropagation();
        setValidated(true);
        setResponse({ success: false, message: 'Please enter your email address' });
        setLoading(false);
        return;
      }

      try {
        start();
        const payload = { email: formData.email };
        const data = await apiFetch('/api/auth/forgot_password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (data.success) {
          sessionStorage.setItem('resetEmail', formData.email);
          sessionStorage.setItem('resetTimestamp', Date.now().toString());
          navigate('/verify-otp');
        } else {
          setResponse({ success: false, message: data.message || 'Email not found' });
        }
      } catch (error) {
        setResponse({ success: false, message: 'Network error. Please try again.' });
      } finally {
        setLoading(false);
        complete();
      }
    },
    [formData.email, navigate, start, complete]
  );

  return (
    <div className="flex h-screen items-center bg-zinc-50 justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 sm:p-10">
          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-1.5">
              Forgot your password?
            </h1>
            <p className="text-sm text-slate-500">
              Enter your email and we'll send you a code to reset it.
            </p>
          </div>

          {/* Alert */}
          <MessageAlert response={response} onClose={() => setResponse(null)} />

          {/* Form */}
          <Form noValidate validated={validated} onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Email address
              </label>
              <Form.Control
                id="email"
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                disabled={loading}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white placeholder:text-slate-400 focus:border-slate-900 focus:ring-0 outline-none transition-colors"
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid email address
              </Form.Control.Feedback>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#E30613] hover:bg-[#c00511] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-lg transition-colors"
            >
              <Send size={16} />
              {loading ? 'Sending…' : 'Send code'}
            </button>
          </Form>
        </div>

        {/* Back to login */}
        <p className="mt-6 text-center text-xs text-slate-500">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-slate-900 underline"
          >
            <ArrowLeft size={12} />
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}