import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../api/client';
import Navbar from '../components/Navbar';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [changePw, setChangePw] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changePwLoading, setChangePwLoading] = useState(false);

  const roleEmoji: Record<string, string> = {
    TOURIST: '🎒',
    GUIDE: '🧭',
    HOMESTAY: '🏡',
    ADMIN: '👨‍💼',
    FOREST_AUTHORITY: '🌲',
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (changePw.newPassword !== changePw.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setChangePwLoading(true);
    try {
      await authApi.changePassword(changePw.currentPassword, changePw.newPassword);
      toast.success('Password changed!');
      setShowChangePassword(false);
      setChangePw({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Failed to change password');
    } finally {
      setChangePwLoading(false);
    }
  };

  if (!user) return null;

  const roleName = user.role.name;

  return (
    <div className="dashboard-layout">
      <Navbar />

      <div className="dashboard-content" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div className="dashboard-welcome" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
          <h1>Welcome back, {user.firstName}! 🌿</h1>
          <p>Explore Betla & Palamau Tiger Reserve through your {roleName.replace('_', ' ')} dashboard.</p>
        </div>

        <div className="dashboard-grid">
          <div className="glass-card stat-card" style={{ animation: 'fadeInUp 0.6s ease-out 0.1s both' }}>
            <div className="stat-card-icon">👤</div>
            <div className="stat-card-label">Account Status</div>
            <div className="stat-card-value" style={{ color: user.status === 'ACTIVE' ? 'var(--color-primary)' : 'var(--color-accent)' }}>
              {user.status}
            </div>
          </div>

          <div className="glass-card stat-card" style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}>
            <div className="stat-card-icon">🔐</div>
            <div className="stat-card-label">Email Verified</div>
            <div className="stat-card-value" style={{ color: user.emailVerified ? 'var(--color-primary)' : 'var(--color-danger)' }}>
              {user.emailVerified ? 'Yes ✓' : 'No ✗'}
            </div>
          </div>

          <div className="glass-card stat-card" style={{ animation: 'fadeInUp 0.6s ease-out 0.3s both' }}>
            <div className="stat-card-icon">🛡️</div>
            <div className="stat-card-label">Permissions</div>
            <div className="stat-card-value">{user.permissions.length}</div>
          </div>

          <div className="glass-card stat-card" style={{ animation: 'fadeInUp 0.6s ease-out 0.4s both' }}>
            <div className="stat-card-icon">📅</div>
            <div className="stat-card-label">Member Since</div>
            <div className="stat-card-value" style={{ fontSize: 'var(--text-lg)' }}>
              {new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>

        {/* ── Role-Specific Actions Console Card ────────────────── */}
        <div className="glass-card stat-card-glow" style={{ marginTop: 'var(--space-xl)', padding: 'var(--space-xl)', animation: 'fadeInUp 0.6s ease-out 0.45s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
            <span style={{ fontSize: '1.5rem' }}>{roleEmoji[roleName] || '⚙️'}</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', color: 'var(--text-primary)' }}>
              {roleName.replace('_', ' ')} Primary Action Console
            </h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-lg)' }}>
            Quick access navigation to your authorized role features and operations.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
            {roleName === 'ADMIN' && (
              <>
                <button className="btn btn-primary" onClick={() => navigate('/admin')}>
                  ⚙️ Open Admin Control Center
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/admin')}>
                  📜 System Audit Logs & Users
                </button>
              </>
            )}

            {roleName === 'TOURIST' && (
              <>
                <button className="btn btn-primary" onClick={() => navigate('/experiences')}>
                  🐯 Browse Available Safaris
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/experiences')}>
                  🎫 View My Permits
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/safety-hub')}>
                  🚨 Emergency & Safety Hub
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/reviews-hub')}>
                  ⭐ Traveler Reviews
                </button>
              </>
            )}

            {roleName === 'FOREST_AUTHORITY' && (
              <>
                <button className="btn btn-primary" onClick={() => navigate('/safety-hub')}>
                  🚨 Launch Patrol Console
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/eco-portal')}>
                  🌱 Forest Conservation Portal
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/admin')}>
                  📊 Governance Analytics Overview
                </button>
              </>
            )}

            {roleName === 'GUIDE' && (
              <>
                <button className="btn btn-primary" onClick={() => navigate('/guides-stays')}>
                  🧭 Check Today's Assignments
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/profile')}>
                  👤 Guide Credentials & Verification
                </button>
              </>
            )}

            {roleName === 'HOMESTAY' && (
              <>
                <button className="btn btn-primary" onClick={() => navigate('/guides-stays')}>
                  🏡 Manage Homestay & Stays
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/profile')}>
                  👤 Homestay Credentials & Verification
                </button>
              </>
            )}
          </div>
        </div>

        {/* Account Details */}
        <div className="glass-card" style={{ marginTop: 'var(--space-xl)', animation: 'fadeInUp 0.6s ease-out 0.5s both' }}>
          <h2 style={{ marginBottom: 'var(--space-lg)', fontFamily: 'var(--font-heading)' }}>Account Details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--space-lg)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-xs)' }}>Full Name</div>
              <div style={{ fontWeight: 600 }}>{user.firstName} {user.lastName}</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-xs)' }}>Email</div>
              <div style={{ fontWeight: 600 }}>{user.email}</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-xs)' }}>Phone</div>
              <div style={{ fontWeight: 600 }}>{user.phone || '—'}</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-xs)' }}>Role</div>
              <div style={{ fontWeight: 600 }}>{roleEmoji[user.role.name]} {user.role.name.replace('_', ' ')}</div>
            </div>
          </div>
          <div style={{ marginTop: 'var(--space-lg)', display: 'flex', gap: 'var(--space-md)' }}>
            <button className="btn btn-primary" onClick={() => navigate('/profile')}>
              👤 Profile Command Center
            </button>
            <button className="btn btn-secondary" onClick={() => setShowChangePassword(!showChangePassword)}>
              {showChangePassword ? 'Cancel' : '🔑 Change Password'}
            </button>
          </div>

          {showChangePassword && (
            <form
              className="auth-form"
              onSubmit={handleChangePassword}
              style={{ marginTop: 'var(--space-lg)', maxWidth: 400, animation: 'fadeInUp 0.3s ease-out' }}
            >
              <div className="form-group">
                <label className="form-label" htmlFor="current-pw">Current Password</label>
                <input
                  id="current-pw"
                  type="password"
                  className="form-input"
                  value={changePw.currentPassword}
                  onChange={(e) => setChangePw({ ...changePw, currentPassword: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="new-pw">New Password</label>
                <input
                  id="new-pw"
                  type="password"
                  className="form-input"
                  value={changePw.newPassword}
                  onChange={(e) => setChangePw({ ...changePw, newPassword: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="confirm-pw">Confirm New Password</label>
                <input
                  id="confirm-pw"
                  type="password"
                  className="form-input"
                  value={changePw.confirmPassword}
                  onChange={(e) => setChangePw({ ...changePw, confirmPassword: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className={`btn btn-primary ${changePwLoading ? 'btn-loading' : ''}`}
                disabled={changePwLoading}
              >
                Update Password
              </button>
            </form>
          )}
        </div>

        {/* Permissions */}
        <div className="glass-card" style={{ marginTop: 'var(--space-lg)', animation: 'fadeInUp 0.6s ease-out 0.6s both' }}>
          <h2 style={{ marginBottom: 'var(--space-md)', fontFamily: 'var(--font-heading)' }}>Your Permissions</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
            {user.permissions.map((perm) => (
              <span key={perm} className="badge badge-accent">{perm}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

