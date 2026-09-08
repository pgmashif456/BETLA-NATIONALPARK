import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../api/client';

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
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="auth-logo-icon">🌿</div>
            <span className="auth-logo-text">Betla</span>
          </div>
        </div>

        <div className="glass-card">
          <div className="auth-message">
            {status === 'waiting' && (
              <>
                <div className="auth-message-icon">📧</div>
                <h2 className="auth-title" style={{ marginBottom: 'var(--space-md)' }}>Check Your Email</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
                  We've sent a verification link to your email address. Click the link to verify your account.
                </p>
                <Link to="/login" className="btn btn-secondary">
                  Go to Login
                </Link>
              </>
            )}

            {status === 'verifying' && (
              <>
                <div className="auth-message-icon" style={{ animation: 'spin 1s linear infinite' }}>⏳</div>
                <h2 className="auth-title">Verifying...</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Please wait while we verify your email.</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="auth-message-icon">✅</div>
                <h2 className="auth-title" style={{ marginBottom: 'var(--space-md)' }}>Email Verified!</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
                  {message}
                </p>
                <Link to="/login" className="btn btn-primary">
                  Sign In Now
                </Link>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="auth-message-icon">❌</div>
                <h2 className="auth-title" style={{ marginBottom: 'var(--space-md)' }}>Verification Failed</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
                  {message}
                </p>
                <Link to="/register" className="btn btn-secondary">
                  Register Again
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
