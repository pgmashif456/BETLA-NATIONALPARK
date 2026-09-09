import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../api/client';

// Clean inline SVG Icons matching Sample-1 visual language
const IconLeaf = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);

const IconCheckCircle = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const IconMail = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const IconAlertCircle = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'waiting'>(
    token ? 'verifying' : 'waiting'
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async (t: string) => {
      try {
        const response = await authApi.verify(t);
        setMessage(response.data.data.message);
        setStatus('success');
        toast.success('Email verified!');
      } catch (err: any) {
        setMessage(err.response?.data?.error?.message || 'Verification failed');
        setStatus('error');
        toast.error('Verification failed');
      }
    };

    if (token) {
      verifyEmail(token);
    }
  }, [token]);

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

        {/* Verification Card */}
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
          {status === 'waiting' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px'
              }}>
                <IconMail />
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827', margin: '0 0 10px', fontFamily: 'var(--font-heading, sans-serif)' }}>
                Check Your Email
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 24px', lineHeight: 1.55 }}>
                We've sent a verification link to your email address. Click the link to verify your account.
              </p>
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
                Go to Login
              </Link>
            </div>
          )}

          {status === 'verifying' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0' }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: '3px solid #e5e7eb',
                borderTopColor: '#15803d',
                animation: 'spin 1s linear infinite',
                marginBottom: '20px'
              }} />
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827', margin: '0 0 8px', fontFamily: 'var(--font-heading, sans-serif)' }}>
                Verifying...
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                Please wait while we verify your email.
              </p>
            </div>
          )}

          {status === 'success' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px'
              }}>
                <IconCheckCircle />
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827', margin: '0 0 10px', fontFamily: 'var(--font-heading, sans-serif)' }}>
                Email Verified!
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 24px', lineHeight: 1.55 }}>
                {message || 'Your email has been successfully verified. You can now sign in to your account.'}
              </p>
              <Link
                to="/login"
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
                  boxSizing: 'border-box'
                }}
              >
                Sign In Now
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px'
              }}>
                <IconAlertCircle />
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827', margin: '0 0 10px', fontFamily: 'var(--font-heading, sans-serif)' }}>
                Verification Failed
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 24px', lineHeight: 1.55 }}>
                {message || 'The verification link is invalid or has expired.'}
              </p>
              <Link
                to="/register"
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
                Register Again
              </Link>
            </div>
          )}
        </div>

        {/* Back link */}
        <Link
          to="/"
          style={{
            fontSize: '0.8rem',
            color: '#6b7280',
            marginTop: '20px',
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
