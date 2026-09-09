import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const IconUserPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <line x1="19" y1="8" x2="19" y2="14"/>
    <line x1="22" y1="11" x2="16" y2="11"/>
  </svg>
);

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'TOURIST',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Min 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])/.test(form.password))
      errs.password = 'Needs uppercase, lowercase, number & special char';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await register({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone || undefined,
        role: form.role,
      });

      // In dev mode, auto-navigate with token directly to verification without stale toast
      if (result.verificationToken) {
        toast.dismiss();
        navigate(`/verify?token=${result.verificationToken}`);
      } else {
        toast.success('Account created! Please check your email to verify.');
        navigate('/verify');
      }
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || 'Registration failed';
      toast.error(msg);
      if (err.response?.data?.error?.details) {
        const apiErrors: Record<string, string> = {};
        for (const [key, messages] of Object.entries(err.response.data.error.details)) {
          apiErrors[key] = (messages as string[])[0];
        }
        setErrors(apiErrors);
      }
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
        maxWidth: '480px',
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
              Create Account
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0 }}>
              Join the Betla Eco-Companion community
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Name Row (2 columns on desktop) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <div>
                <label
                  htmlFor="firstName"
                  style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '5px' }}
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    border: errors.firstName ? '1px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    color: '#111827',
                    background: '#ffffff',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="John"
                  value={form.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block', fontWeight: 500 }}>
                    {errors.firstName}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '5px' }}
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    border: errors.lastName ? '1px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    color: '#111827',
                    background: '#ffffff',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Doe"
                  value={form.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && (
                  <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block', fontWeight: 500 }}>
                    {errors.lastName}
                  </span>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '5px' }}
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  border: errors.email ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#111827',
                  background: '#ffffff',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && (
                <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block', fontWeight: 500 }}>
                  {errors.email}
                </span>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label
                htmlFor="phone"
                style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '5px' }}
              >
                Phone (optional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#111827',
                  background: '#ffffff',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            {/* Role Selector */}
            <div>
              <label
                htmlFor="role"
                style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '5px' }}
              >
                I am a
              </label>
              <select
                id="role"
                name="role"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#111827',
                  background: '#ffffff',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                value={form.role}
                onChange={handleChange}
              >
                <option value="TOURIST">Tourist / Traveler</option>
                <option value="GUIDE">Local Guide</option>
                <option value="HOMESTAY">Homestay Owner</option>
              </select>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '5px' }}
              >
                Password
              </label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  style={{
                    width: '100%',
                    padding: '9px 40px 9px 12px',
                    border: errors.password ? '1px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    color: '#111827',
                    background: '#ffffff',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Min 8 chars, uppercase, lowercase, number, special"
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

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '5px' }}
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  border: errors.confirmPassword ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#111827',
                  background: '#ffffff',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block', fontWeight: 500 }}>
                  {errors.confirmPassword}
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
              <IconUserPlus />
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Footer Navigation Link */}
        <p style={{ fontSize: '0.85rem', color: '#4b5563', marginTop: '20px', textAlign: 'center' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#15803d', fontWeight: 700, textDecoration: 'none' }}>
            Sign in
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
