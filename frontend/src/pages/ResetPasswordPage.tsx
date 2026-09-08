import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../api/client';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.newPassword) errs.newPassword = 'Password is required';
    else if (form.newPassword.length < 8) errs.newPassword = 'Min 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])/.test(form.newPassword))
      errs.newPassword = 'Needs uppercase, lowercase, number & special char';
    if (form.newPassword !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!token) errs.token = 'Reset token is missing';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await authApi.resetPassword(token, form.newPassword);
      setSuccess(true);
      toast.success('Password reset successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-layout">
        <div className="auth-container">
          <div className="glass-card">
            <div className="auth-message">
              <div className="auth-message-icon">✅</div>
              <h2 className="auth-title" style={{ marginBottom: 'var(--space-md)' }}>Password Reset!</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Redirecting to login...</p>
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
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">Choose a new secure password</p>
        </div>

        <div className="glass-card">
          {!token ? (
            <div className="auth-message">
              <div className="auth-message-icon">⚠️</div>
              <h2 className="auth-title" style={{ marginBottom: 'var(--space-md)' }}>Invalid Link</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
                This reset link is missing or invalid.
              </p>
              <Link to="/forgot-password" className="btn btn-secondary">Request New Link</Link>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="new-password">New Password</label>
                <input
                  id="new-password"
                  name="newPassword"
                  type="password"
                  className={`form-input ${errors.newPassword ? 'error' : ''}`}
                  placeholder="Min 8 chars, uppercase, lowercase, number, special"
                  value={form.newPassword}
                  onChange={handleChange}
                />
                {errors.newPassword && <span className="form-error">{errors.newPassword}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirm-new-password">Confirm New Password</label>
                <input
                  id="confirm-new-password"
                  name="confirmPassword"
                  type="password"
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Re-enter your new password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
              </div>

              <button
                type="submit"
                className={`btn btn-primary btn-full ${loading ? 'btn-loading' : ''}`}
                disabled={loading}
              >
                Reset Password
              </button>
            </form>
          )}
        </div>

        <p className="auth-footer">
          <Link to="/login">← Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
