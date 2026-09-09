import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

// Clean inline SVG Icons matching Sample-1 visual language
const IconLeaf = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);

const IconEye = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconEyeOff = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
    <line x1="2" y1="2" x2="22" y2="22"/>
  </svg>
);

const IconLock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    // Dismiss any lingering toasts from prior registration/verification transitions
    toast.dismiss();
  }, []);

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || 'Login failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f0fdf4 0%, #f4f6f4 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '32px 16px',
      fontFamily: 'var(--font-body, sans-serif)',
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '420px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Brand Header */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '14px',
            background: '#091a10',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(9, 26, 16, 0.25)',
            marginBottom: '10px'
          }}>
            <IconLeaf />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#091a10', letterSpacing: '-0.02em', fontFamily: 'var(--font-heading, sans-serif)' }}>
              Betla
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#15803d', background: '#e6f4ea', padding: '2px 8px', borderRadius: '10px' }}>
              Eco-Companion
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: '2px', fontWeight: 500, letterSpacing: '0.02em' }}>
            Explore • Protect • Preserve
          </div>
        </Link>

        {/* Auth Card */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '14px',
          padding: '32px 28px',
          width: '100%',
          boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.06)',
          boxSizing: 'border-box'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '22px' }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827', margin: '0 0 6px', fontFamily: 'var(--font-heading, sans-serif)' }}>
              Welcome Back
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0 }}>
              Sign in to your Eco-Companion account
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Email Field */}
            <div>
              <label
                htmlFor="login-email"
                style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}
              >
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: errors.email ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#111827',
                  background: '#ffffff',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s ease'
                }}
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoFocus
              />
              {errors.email && (
                <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block', fontWeight: 500 }}>
                  {errors.email}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label
                  htmlFor="login-password"
                  style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151' }}
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 600, textDecoration: 'none' }}
                >
                  Forgot password?
                </Link>
              </div>

              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 14px',
                    border: errors.password ? '1px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    color: '#111827',
                    background: '#ffffff',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s ease'
                  }}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px'
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
              {errors.password && (
                <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block', fontWeight: 500 }}>
                  {errors.password}
                </span>
              )}
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="sample1-hero-btn"
              style={{
                width: '100%',
                padding: '11px',
                fontSize: '0.875rem',
                marginTop: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <IconLock />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Footer Navigation Link */}
        <p style={{ fontSize: '0.85rem', color: '#4b5563', marginTop: '20px', textAlign: 'center' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#15803d', fontWeight: 700, textDecoration: 'none' }}>
            Create one
          </Link>
        </p>

        <Link
          to="/"
          style={{
            fontSize: '0.8rem',
            color: '#6b7280',
            marginTop: '12px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontWeight: 500
          }}
        >
          ← Back to Betla Portal
        </Link>
      </div>
    </div>
  );
}
