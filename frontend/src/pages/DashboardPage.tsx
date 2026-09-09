import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../api/client';

// Clean SVG Icons matching Sample-1 visual system
const IconLeaf = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);

const IconHome = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const IconCompass = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
);

const IconCar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="8" rx="2"/>
    <path d="M7 11V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4"/>
    <circle cx="7.5" cy="15.5" r="1.5"/>
    <circle cx="16.5" cy="15.5" r="1.5"/>
  </svg>
);

const IconMapPin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconBed = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4v16"/>
    <path d="M2 8h18a2 2 0 0 1 2 2v10"/>
    <path d="M2 17h20"/>
    <path d="M6 8v9"/>
  </svg>
);

const IconShield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const IconTrees = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 10v.2A3 3 0 0 1 8.9 16v0H5v0a3 3 0 0 1-1.1-5.8V10a3 3 0 0 1 6 0Z"/>
    <path d="M7 16v6"/>
    <path d="M13 19v3"/>
    <path d="M12 19h8.3a3 3 0 0 0 1.7-5.5 3 3 0 0 0-4-4.4 3 3 0 0 0-5.3 2.1 3 3 0 0 0-.7 2.3 3 3 0 0 0 0 5.5Z"/>
  </svg>
);

const IconBarChart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10"/>
    <line x1="18" y1="20" x2="18" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="16"/>
  </svg>
);

const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IconBell = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const IconZap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const IconKey = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7.5" cy="15.5" r="5.5"/>
    <path d="m21 2-9.6 9.6"/>
    <path d="m15.5 7.5 3 3"/>
  </svg>
);

const IconCalendar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const IconUser = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconLock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconLogOut = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [changePw, setChangePw] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changePwLoading, setChangePwLoading] = useState(false);

  const roleEmoji: Record<string, string> = {
    TOURIST: '🌴',
    GUIDE: '🧭',
    HOMESTAY: '🏡',
    ADMIN: '🛡️',
    FOREST_AUTHORITY: '🚓',
  };

  const roleBadgeColor: Record<string, { bg: string; color: string; border: string }> = {
    TOURIST: { bg: '#e6f4ea', color: '#137333', border: 'rgba(19, 115, 51, 0.2)' },
    GUIDE: { bg: '#e8f0fe', color: '#1a73e8', border: 'rgba(26, 115, 232, 0.2)' },
    HOMESTAY: { bg: '#fef7e0', color: '#b06000', border: 'rgba(176, 96, 0, 0.2)' },
    ADMIN: { bg: '#fce8e6', color: '#c5221f', border: 'rgba(197, 34, 31, 0.2)' },
    FOREST_AUTHORITY: { bg: '#e6f4ea', color: '#137333', border: 'rgba(19, 115, 51, 0.2)' },
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
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
  const badgeStyle = roleBadgeColor[roleName] || { bg: '#f3f4f6', color: '#374151', border: '#e5e7eb' };

  return (
    <div className="sample1-layout">
      {/* --- Left Sidebar (Sample-1 1:1 Match) --- */}
      <aside className="sample1-sidebar">
        <div>
          <div className="sample1-brand">
            <div className="sample1-brand-icon"><IconLeaf /></div>
            <div>
              <div className="sample1-brand-text">Betla</div>
              <div style={{ fontSize: '0.68rem', color: '#6ee7b7', fontWeight: 600 }}>Eco-Companion</div>
            </div>
          </div>
          <div className="sample1-brand-sub">Explore • Protect • Preserve</div>

          <nav className="sample1-nav-group">
            <Link to="/dashboard" className="sample1-nav-item active">
              <IconHome /> <span>Dashboard</span>
            </Link>
            <Link to="/discover" className="sample1-nav-item">
              <IconCompass /> <span>Tourist Discovery</span>
            </Link>
            <Link to="/experiences" className="sample1-nav-item">
              <IconCar /> <span>Safaris & Booking</span>
            </Link>
            <Link to="/" className="sample1-nav-item">
              <IconMapPin /> <span>Places to Visit</span>
            </Link>
            <Link to="/guides-stays" className="sample1-nav-item">
              <IconBed /> <span>Stay & Facilities</span>
            </Link>
            <Link to="/safety-hub" className="sample1-nav-item">
              <IconShield /> <span>Safety & Emergency</span>
            </Link>
            <Link to="/eco-portal" className="sample1-nav-item">
              <IconTrees /> <span>Eco Portal</span>
            </Link>
            <Link to="/reviews-hub" className="sample1-nav-item">
              <IconBarChart /> <span>Reports & Analytics</span>
            </Link>
          </nav>
        </div>

        <div className="sample1-sidebar-footer">
          <div className="sample1-sidebar-graphic">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px', color: '#10b981' }}>
              <IconTrees />
            </div>
            <div style={{ fontWeight: 600, color: '#e5e7eb', marginBottom: '2px' }}>For Wildlife</div>
            <div style={{ fontSize: '0.68rem', color: '#79a890' }}>For Future</div>
          </div>
        </div>
      </aside>

      {/* --- Main Area --- */}
      <div className="sample1-main-wrapper">
        <header className="sample1-header">
          <div className="sample1-search-box">
            <IconSearch />
            <input
              type="text"
              placeholder="Search places, safaris, attractions..."
              className="sample1-search-input"
              onClick={() => navigate('/discover')}
            />
          </div>

          <div className="sample1-user-controls">
            <button className="sample1-icon-btn" title="Notifications" onClick={() => navigate('/safety-hub')}>
              <IconBell />
            </button>

            <div className="sample1-user-pill" onClick={() => navigate('/profile')}>
              <div className="sample1-avatar">
                {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="sample1-user-info">
                <span className="sample1-user-name">{user.firstName} {user.lastName}</span>
                <span className="sample1-user-role">{user.role.name}</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  marginLeft: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <IconLogOut /> Logout
              </button>
            </div>
          </div>
        </header>

        <div className="sample1-container">
          {/* Welcome Card Header */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '20px 24px',
            marginBottom: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: '0 0 4px 0' }}>
                Welcome back, {user.firstName}! 👋
              </h1>
              <p style={{ color: '#4b5563', fontSize: '0.88rem', margin: 0 }}>
                Explore Betla & Palamau Tiger Reserve through your {roleName.replace('_', ' ')} dashboard.
              </p>
            </div>
            <div style={{
              background: badgeStyle.bg,
              color: badgeStyle.color,
              border: `1px solid ${badgeStyle.border}`,
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.03em',
              textTransform: 'uppercase'
            }}>
              {roleName.replace('_', ' ')}
            </div>
          </div>

          {/* Statistics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#e6f4ea', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconZap />
                </div>
                <div style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account Status</div>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: user.status === 'ACTIVE' ? '#10b981' : '#f59e0b' }}>
                {user.status}
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: user.emailVerified ? '#e6f4ea' : '#fee2e2', color: user.emailVerified ? '#15803d' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconMail />
                </div>
                <div style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Verified</div>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: user.emailVerified ? '#10b981' : '#ef4444' }}>
                {user.emailVerified ? 'Yes ✓' : 'No ✕'}
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#e8f0fe', color: '#1a73e8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconKey />
                </div>
                <div style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Permissions</div>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>
                {user.permissions.length}
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#fef7e0', color: '#b06000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconCalendar />
                </div>
                <div style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Member Since</div>
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>
                {new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Action Console */}
          <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.5rem' }}>{roleEmoji[roleName] || '📋'}</span>
              <h2 style={{ fontSize: '1.25rem', color: '#111827', margin: 0, fontWeight: 700 }}>
                {roleName.replace('_', ' ')} Primary Action Console
              </h2>
            </div>
            <p style={{ color: '#4b5563', fontSize: '0.88rem', marginBottom: '18px', marginTop: '4px' }}>
              Quick access navigation to your authorized role features and operations.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {roleName === 'ADMIN' && (
                <>
                  <button className="sample1-hero-btn" onClick={() => navigate('/admin')}>
                    <IconKey /> Open Admin Control Center
                  </button>
                  <button className="sample1-btn-secondary" onClick={() => navigate('/admin')}>
                    <IconSearch /> System Audit Logs & Users
                  </button>
                </>
              )}

              {roleName === 'TOURIST' && (
                <>
                  <button className="sample1-hero-btn" onClick={() => navigate('/experiences')}>
                    <IconCompass /> Browse Available Safaris
                  </button>
                  <button className="sample1-btn-secondary" onClick={() => navigate('/experiences')}>
                    <IconCar /> View My Permits
                  </button>
                  <button className="sample1-btn-secondary" onClick={() => navigate('/safety-hub')}>
                    <IconShield /> Emergency & Safety Hub
                  </button>
                  <button className="sample1-btn-secondary" onClick={() => navigate('/reviews-hub')}>
                    <IconBarChart /> Traveler Reviews
                  </button>
                </>
              )}

              {roleName === 'FOREST_AUTHORITY' && (
                <>
                  <button className="sample1-hero-btn" onClick={() => navigate('/safety-hub')}>
                    <IconShield /> Launch Patrol Console
                  </button>
                  <button className="sample1-btn-secondary" onClick={() => navigate('/eco-portal')}>
                    <IconTrees /> Forest Conservation Portal
                  </button>
                  <button className="sample1-btn-secondary" onClick={() => navigate('/admin')}>
                    <IconBarChart /> Governance Analytics Overview
                  </button>
                </>
              )}

              {roleName === 'GUIDE' && (
                <>
                  <button className="sample1-hero-btn" onClick={() => navigate('/guides-stays')}>
                    <IconCompass /> Check Today's Assignments
                  </button>
                  <button className="sample1-btn-secondary" onClick={() => navigate('/profile')}>
                    <IconUser /> Guide Credentials & Verification
                  </button>
                </>
              )}

              {roleName === 'HOMESTAY' && (
                <>
                  <button className="sample1-hero-btn" onClick={() => navigate('/guides-stays')}>
                    <IconBed /> Manage Homestay & Stays
                  </button>
                  <button className="sample1-btn-secondary" onClick={() => navigate('/profile')}>
                    <IconUser /> Homestay Credentials & Verification
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Account Details */}
          <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.2rem', margin: '0 0 16px 0', fontWeight: 700, color: '#111827' }}>Account Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ background: '#f9fafb', padding: '12px 14px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>Full Name</div>
                <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.92rem' }}>{user.firstName} {user.lastName}</div>
              </div>
              <div style={{ background: '#f9fafb', padding: '12px 14px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>Email</div>
                <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.92rem', wordBreak: 'break-all' }}>{user.email}</div>
              </div>
              <div style={{ background: '#f9fafb', padding: '12px 14px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>Phone</div>
                <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.92rem' }}>{user.phone || '-'}</div>
              </div>
              <div style={{ background: '#f9fafb', padding: '12px 14px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>Role</div>
                <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.92rem' }}>{roleEmoji[user.role.name]} {user.role.name.replace('_', ' ')}</div>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button className="sample1-hero-btn" onClick={() => navigate('/profile')}>
                <IconUser /> Profile Command Center
              </button>
              <button className="sample1-btn-secondary" onClick={() => setShowChangePassword(!showChangePassword)}>
                <IconLock /> {showChangePassword ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {showChangePassword && (
              <form onSubmit={handleChangePassword} style={{ marginTop: '20px', maxWidth: '400px', background: '#f9fafb', padding: '20px', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={changePw.currentPassword}
                    onChange={(e) => setChangePw({ ...changePw, currentPassword: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={changePw.newPassword}
                    onChange={(e) => setChangePw({ ...changePw, newPassword: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={changePw.confirmPassword}
                    onChange={(e) => setChangePw({ ...changePw, confirmPassword: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  className={`sample1-hero-btn ${changePwLoading ? 'btn-loading' : ''}`}
                  disabled={changePwLoading}
                >
                  Update Password
                </button>
              </form>
            )}
          </div>

          {/* Footer */}
          <footer className="sample1-footer">
            <div>Betla Eco-Companion | Department of Forest, Jharkhand</div>
            <div style={{ color: '#15803d', fontWeight: 600 }}>Explore • Protect • Preserve</div>
          </footer>
        </div>
      </div>
    </div>
  );
}
