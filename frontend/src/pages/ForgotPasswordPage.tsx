import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../api/client';

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
      if (response.data.data.resetToken) {
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
              <div className="auth-message-icon">📬</div>
              <h2 className="auth-title" style={{ marginBottom: 'var(--space-md)' }}>Check Your Email</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
                If an account exists for <strong>{email}</strong>, we've sent a password reset link.
              </p>
              {resetToken && (
                <Link to={`/reset-password?token=${resetToken}`} className="btn btn-primary" style={{ marginBottom: 'var(--space-md)' }}>
                  Reset Password (Dev)
                </Link>
              )}
              <br />
              <Link to="/login" className="btn btn-ghost">
                ← Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="auth-logo-icon">🌿</div>
            <span className="auth-logo-text">Betla</span>
          </div>
          <h1 className="auth-title">Forgot Password</h1>
          <p className="auth-subtitle">Enter your email to receive a reset link</p>
        </div>

        <div className="glass-card">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="forgot-email">Email</label>
              <input
                id="forgot-email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </div>

            <button
              type="submit"
              className={`btn btn-primary btn-full ${loading ? 'btn-loading' : ''}`}
              disabled={loading}
            >
              Send Reset Link
            </button>
          </form>
        </div>

        <p className="auth-footer">
          Remember your password? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
