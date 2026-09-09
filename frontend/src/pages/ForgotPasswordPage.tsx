import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../api/client';

// Clean inline SVG Icons matching Sample-1 visual language
const IconLeaf = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);

const IconMail = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const IconSend = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { toast.error('Enter your email'); return; }

    setLoading(true);
    try {
      const response = await authApi.forgotPassword(email);
      setSent(true);
      // In dev mode, the API returns the reset token
      if (response.data.data?.resetToken) {
        setResetToken(response.data.data.resetToken);
      }
      toast.success('Check your email for the reset link');
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top, #e6f4ea 0%, #f4fbf7 30%, #f9fafb 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '32px 16px',
        fontFamily: 'var(--font-body, sans-serif)',
        boxSizing: 'border-box'
      }}>
        <div style={{
          maxWidth: '440px',
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

          {/* Card */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '14px',
            padding: '36px 30px',
            width: '100%',
            boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.06)',
            boxSizing: 'border-box',
            textAlign: 'center'
          }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px'
            }}>
              <IconMail />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827', margin: '0 0 10px', fontFamily: 'var(--font-heading, sans-serif)' }}>
              Check Your Email
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 24px', lineHeight: 1.55 }}>
              If an account exists for <strong style={{ color: '#111827' }}>{email}</strong>, we've sent a password reset link.
            </p>
            {resetToken && (
              <Link
                to={`/reset-password?token=${resetToken}`}
                className="sample1-hero-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  padding: '11px',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxSizing: 'border-box',
                  marginBottom: '12px'
                }}
              >
                Reset Password (Dev)
              </Link>
            )}
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: '11px',
                borderRadius: '8px',
                background: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                fontSize: '0.875rem',
                fontWeight: 600,
                textDecoration: 'none',
                boxSizing: 'border-box'
              }}
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top, #e6f4ea 0%, #f4fbf7 30%, #f9fafb 100%)',
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
              Forgot Password
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0 }}>
              Enter your email to receive a reset link
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label
                htmlFor="forgot-email"
                style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}
              >
                Email
              </label>
              <input
                id="forgot-email"
                type="email"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#111827',
                  background: '#ffffff',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s ease'
                }}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </div>

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
              <IconSend />
              {loading ? 'Sending link...' : 'Send Reset Link'}
            </button>
          </form>
        </div>

        {/* Footer Navigation Links */}
        <p style={{ fontSize: '0.85rem', color: '#4b5563', marginTop: '20px', textAlign: 'center' }}>
          Remember your password?{' '}
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
