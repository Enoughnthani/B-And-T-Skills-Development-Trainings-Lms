import { LogIn, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useTopLoader } from '../../contexts/TopLoaderContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import PasswordInput from '../../components/auth/PasswordInput';
import MessageAlert from '../../components/auth/MessageAlert';

export default function Login() {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const { start, complete } = useTopLoader();
  const { login } = useAuth();

  const [formData, setForm] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  async function handleSubmit(e) {
    setLoading(true);
    e.preventDefault();

    if (e.currentTarget.checkValidity() === false) {
      e.stopPropagation();
      setLoading(false);
      setValidated(true);
      let emptyKey = Object.keys(formData).find(
        (key) => ['email', 'password'].includes(key) && formData[key].trim() === ''
      );
      emptyKey = emptyKey === 'email' ? 'email address' : emptyKey;
      setResponse({ success: false, message: `Please enter your ${emptyKey}` });
      return;
    }

    try {
      start();
      const form = new URLSearchParams();
      form.append('email', formData?.email);
      form.append('password', formData?.password);
      form.append('remember-me', formData?.rememberMe);

      const result = await login({ form });
      setResponse(result);

      if (result?.success) {
        setForm({ email: '', password: '', rememberMe: false });
        setTimeout(() => setResponse(null), 15000);
        const url = getDashboardPath(result?.payload?.role[0]);
        navigate(url);
      }
    } catch (error) {
      setResponse({ success: false, message: 'An error occurred. Please try again later.' });
    } finally {
      setLoading(false);
      complete();
    }
  }

  function getDashboardPath(role) {
    switch (role) {
      case 'ADMIN': return '/user/admin';
      case 'LEARNER': return '/user/learner';
      case 'FACILITATOR': return '/user/facilitator';
      case 'ASSESSOR': return '/user/assessor';
      case 'MODERATOR': return '/user/moderator';
      case 'MENTOR': return '/user/mentor';
      case 'PROGRAM_MANAGER': return '/user/program-manager';
      default: return '/user/intern';
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-zinc-900 mb-1">
              Sign in
            </h1>
            <p className="text-sm text-zinc-500">
              Access your learner or staff account.
            </p>
          </div>

          {/* Alert */}
          <MessageAlert response={response} onClose={() => setResponse(null)} />

          {/* Form */}
          <Form noValidate validated={validated} onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1.5">
                Email
              </label>
              <Form.Control
                id="email"
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-300 rounded-md focus:border-zinc-900 focus:ring-0 outline-none transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <PasswordInput
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                label=""
              />
            </div>

            {/* Remember me */}
            <div>
              <Form.Check
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                label="Remember me"
                checked={formData?.rememberMe}
                onChange={handleChange}
                className="text-sm text-zinc-600 cursor-pointer"
              />
            </div>

            {/* Submit — the only red on the page */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#E30613] hover:bg-[#c00511] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-md transition-colors"
            >
              <LogIn size={16} />
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </Form>

          {/* Footer help */}
          <p className="mt-8 text-center text-xs text-zinc-500">
            Don't have an account?{' '}
            <Link to="/contact" className="font-medium text-zinc-800 hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}