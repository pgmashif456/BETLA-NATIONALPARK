import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../api/client';
import heroImgAsset from '../assets/hero.png';

// Clean inline SVG Icons matching Sample-1 visual language
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

const IconBell = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const IconZap = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const IconKey = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7.5" cy="15.5" r="5.5"/>
    <path d="m21 2-9.6 9.6"/>
    <path d="m15.5 7.5 3 3"/>
  </svg>
);

const IconCalendar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const IconLeaf = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [changePw, setChangePw] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changePwLoading, setChangePwLoading] = useState(false);

  const roleEmoji: Record<string, string> = {
    TOURIST: '🧭',
    GUIDE: '🦺',
    HOMESTAY: '🏡',
    ADMIN: '⚡',
    FOREST_AUTHORITY: '🌲',
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

  const heroBackgroundStyle = {
    backgroundImage: `linear-gradient(to right, rgba(9, 26, 16, 0.92) 0%, rgba(9, 26, 16, 0.65) 55%, rgba(9, 26, 16, 0.3) 100%), url(${heroImgAsset})`,
  };

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
          {/* Location Context Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#0f3e28', fontWeight: 600 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#15803d' }}>
              <IconLeaf /> Betla National Park &gt;
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#4b5563', fontWeight: 500, fontSize: '0.8rem' }}>
              <IconMapPin /> Latehar, Jharkhand
            </span>
          </div>
          <div className="sample1-user-controls">
            <button className="sample1-icon-btn" title="Notifications" onClick={() => navigate('/safety-hub')}>
              <IconBell />
              <span style={{ position: 'absolute', top: 0, right: 0, width: 7, height: 7, background: '#ef4444', borderRadius: '50%' }}></span>
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
                  marginLeft: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 6px',
                  borderRadius: '4px',
                  transition: 'color 0.15s ease'
                }}
                title="Logout"
              >
                <IconLogOut /> <span className="sample1-logout-text">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <div className="sample1-container">
          {/* Sample-1 Tiger Forest Hero Banner */}
          <div className="sample1-hero" style={heroBackgroundStyle}>
            <div className="sample1-hero-content">
              <div className="sample1-hero-tag">
                {roleEmoji[roleName]} {roleName.replace('_', ' ')} PORTAL • COMMAND CENTER
              </div>
              <h1 className="sample1-hero-title">Welcome back, {user.firstName}!</h1>
              <div className="sample1-hero-sub">Explore Betla & Palamau Tiger Reserve through your personal dashboard</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                <button className="sample1-hero-btn" onClick={() => navigate('/discover')}>
                  Explore Betla Park →
                </button>
                <button
                  className="sample1-btn-secondary"
                  style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(4px)' }}
                  onClick={() => navigate('/profile')}
                >
                  <IconUser /> Profile Command Center
                </button>
              </div>
            </div>
            <div className="sample1-hero-quote">
              "In every walk with nature one receives far more than he seeks."
              <div style={{ marginTop: '4px', fontSize: '0.72rem', color: '#6ee7b7' }}>— John Muir</div>
            </div>
          </div>

          {/* Quick Stats Row (Sample-1 Quick Action Cards Pattern) */}
          <div className="sample1-quick-actions">
            <div className="sample1-quick-card green">
              <div className="sample1-quick-card-icon"><IconZap /></div>
              <div>
                <div className="sample1-quick-card-title">{user.status}</div>
                <div className="sample1-quick-card-sub">Account Status</div>
              </div>
            </div>

            <div className="sample1-quick-card blue">
              <div className="sample1-quick-card-icon"><IconMail /></div>
              <div>
                <div className="sample1-quick-card-title">{user.emailVerified ? 'Verified ✓' : 'Pending ⏳'}</div>
                <div className="sample1-quick-card-sub">Email Verification</div>
              </div>
            </div>

            <div className="sample1-quick-card amber">
              <div className="sample1-quick-card-icon"><IconKey /></div>
              <div>
                <div className="sample1-quick-card-title">{user.permissions.length} Active</div>
                <div className="sample1-quick-card-sub">Authorized Permissions</div>
              </div>
            </div>

            <div className="sample1-quick-card red">
              <div className="sample1-quick-card-icon"><IconCalendar /></div>
              <div>
                <div className="sample1-quick-card-title">
                  {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                </div>
                <div className="sample1-quick-card-sub">Member Since</div>
              </div>
            </div>
          </div>

          {/* Main 2-Column Content Grid */}
          <div className="sample1-content-grid">
            {/* Left Primary Column */}
            <div>
              {/* Primary Action Console Card */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '22px 24px',
                marginBottom: '20px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: badgeStyle.bg,
                      color: badgeStyle.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '1rem'
                    }}>
                      {roleEmoji[roleName]}
                    </div>
                    <div>
                      <h2 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 700, color: '#111827', fontFamily: 'var(--font-heading, sans-serif)' }}>
                        {roleName.replace('_', ' ')} Command Console
                      </h2>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: '#6b7280' }}>Authorized role-specific operations</p>
                    </div>
                  </div>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    background: badgeStyle.bg,
                    color: badgeStyle.color,
                    border: `1px solid ${badgeStyle.border}`
                  }}>
                    {roleName}
                  </span>
                </div>

                <div style={{ marginTop: '16px' }}>
                  {roleName === 'ADMIN' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <p style={{ fontSize: '0.85rem', color: '#374151', margin: 0 }}>
                        You have full administrative privileges across the Betla eco-platform. Manage accounts, oversee wild safaris, and inspect activity logs.
                      </p>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button className="sample1-hero-btn" onClick={() => navigate('/admin')}>
                          Go to Admin Center →
                        </button>
                        <button className="sample1-btn-secondary" onClick={() => navigate('/reviews-hub')}>
                          Platform Reports
                        </button>
                      </div>
                    </div>
                  )}

                  {roleName === 'TOURIST' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <p style={{ fontSize: '0.85rem', color: '#374151', margin: 0 }}>
                        Welcome to Betla National Park! Book safari experiences, find certified eco-guides, check live weather advisories, and explore scenic flora/fauna spots.
                      </p>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button className="sample1-hero-btn" onClick={() => navigate('/experiences')}>
                          Book Safari Experience
                        </button>
                        <button className="sample1-btn-secondary" onClick={() => navigate('/guides-stays')}>
                          Certified Guides & Homestays
                        </button>
                        <button className="sample1-btn-secondary" onClick={() => navigate('/safety-hub')}>
                          Safety & Alerts
                        </button>
                      </div>
                    </div>
                  )}

                  {roleName === 'FOREST_AUTHORITY' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <p style={{ fontSize: '0.85rem', color: '#374151', margin: 0 }}>
                        Forest Department portal: monitor wildlife zones, review visitor alerts, maintain emergency logs, and oversee reserve conservation rules.
                      </p>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button className="sample1-hero-btn" onClick={() => navigate('/safety-hub')}>
                          Incident Management
                        </button>
                        <button className="sample1-btn-secondary" onClick={() => navigate('/eco-portal')}>
                          Eco Conservation
                        </button>
                      </div>
                    </div>
                  )}

                  {roleName === 'GUIDE' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <p style={{ fontSize: '0.85rem', color: '#374151', margin: 0 }}>
                        Certified Guide operations: manage your tourist safari bookings, respond to tourist itineraries, and update your guide availability.
                      </p>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button className="sample1-hero-btn" onClick={() => navigate('/guides-stays')}>
                          Manage Guide Profile
                        </button>
                        <button className="sample1-btn-secondary" onClick={() => navigate('/experiences')}>
                          Safari Schedules
                        </button>
                      </div>
                    </div>
                  )}

                  {roleName === 'HOMESTAY' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <p style={{ fontSize: '0.85rem', color: '#374151', margin: 0 }}>
                        Eco-Homestay management: view upcoming guest reservations, room availability, and guest satisfaction ratings.
                      </p>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button className="sample1-hero-btn" onClick={() => navigate('/guides-stays')}>
                          Homestay Listings
                        </button>
                        <button className="sample1-btn-secondary" onClick={() => navigate('/reviews-hub')}>
                          Guest Reviews
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Details & Security Card */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '22px 24px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 700, color: '#111827', fontFamily: 'var(--font-heading, sans-serif)' }}>
                    Account Details
                  </h2>
                  <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600 }}>Active Member</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '12px' }}>
                  <div style={{ background: '#f9fafb', padding: '12px 14px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                    <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '0.04em' }}>Full Name</div>
                    <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem' }}>{user.firstName} {user.lastName}</div>
                  </div>
                  <div style={{ background: '#f9fafb', padding: '12px 14px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                    <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '0.04em' }}>Email Address</div>
                    <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem', wordBreak: 'break-all' }}>{user.email}</div>
                  </div>
                  <div style={{ background: '#f9fafb', padding: '12px 14px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                    <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '0.04em' }}>Phone Contact</div>
                    <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem' }}>{user.phone || '—'}</div>
                  </div>
                  <div style={{ background: '#f9fafb', padding: '12px 14px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                    <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '0.04em' }}>Assigned Role</div>
                    <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem' }}>{roleEmoji[user.role.name]} {user.role.name.replace('_', ' ')}</div>
                  </div>
                </div>

                <div style={{ marginTop: '18px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button className="sample1-hero-btn" onClick={() => navigate('/profile')}>
                    <IconUser /> Profile Command Center
                  </button>
                  <button className="sample1-btn-secondary" onClick={() => setShowChangePassword(!showChangePassword)}>
                    <IconLock /> {showChangePassword ? 'Cancel' : 'Change Password'}
                  </button>
                </div>

                {showChangePassword && (
                  <form onSubmit={handleChangePassword} style={{ marginTop: '18px', maxWidth: '420px', background: '#f9fafb', padding: '18px 20px', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Current Password</label>
                      <input
                        type="password"
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          background: '#ffffff',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                        value={changePw.currentPassword}
                        onChange={(e) => setChangePw({ ...changePw, currentPassword: e.target.value })}
                      />
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>New Password</label>
                      <input
                        type="password"
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          background: '#ffffff',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                        value={changePw.newPassword}
                        onChange={(e) => setChangePw({ ...changePw, newPassword: e.target.value })}
                      />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Confirm New Password</label>
                      <input
                        type="password"
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          background: '#ffffff',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                        value={changePw.confirmPassword}
                        onChange={(e) => setChangePw({ ...changePw, confirmPassword: e.target.value })}
                      />
                    </div>
                    <button
                      type="submit"
                      className="sample1-hero-btn"
                      disabled={changePwLoading}
                      style={{ opacity: changePwLoading ? 0.7 : 1 }}
                    >
                      {changePwLoading ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right Column Widgets (Matching Sample-1 Layout) */}
            <div>
              {/* Forest Conservation Widget Banner */}
              <div className="sample1-widget-banner">
                <div className="sample1-widget-banner-title">🌲 Forest & Wildlife Protection</div>
                <div className="sample1-widget-banner-sub">
                  Help preserve Betla's biodiversity. Keep wild animals safe, follow zone rules, and report emergencies instantly.
                </div>
                <button
                  className="sample1-hero-btn"
                  style={{ background: '#10b981', color: 'white', fontSize: '0.78rem', padding: '6px 14px', width: '100%', justifyContent: 'center' }}
                  onClick={() => navigate('/safety-hub')}
                >
                  <IconShield /> Safety & Emergency Hub
                </button>
              </div>

              {/* User Overview Widget */}
              <div className="sample1-widget">
                <div className="sample1-widget-title">
                  <span>Profile Overview</span>
                  <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>Active</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: '#d1fae5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.1rem'
                  }}>
                    {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.firstName} {user.lastName}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.email}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.78rem', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#6b7280' }}>Role Type</span>
                  <span style={{ fontWeight: 700, color: '#111827' }}>{user.role.name.replace('_', ' ')}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.78rem', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#6b7280' }}>Email Status</span>
                  <span style={{ fontWeight: 700, color: user.emailVerified ? '#10b981' : '#ef4444' }}>
                    {user.emailVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.78rem', marginBottom: '10px' }}>
                  <span style={{ color: '#6b7280' }}>Permissions</span>
                  <span style={{ fontWeight: 700, color: '#111827' }}>{user.permissions.length} Assigned</span>
                </div>

                <button
                  className="sample1-btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.78rem', padding: '7px 12px' }}
                  onClick={() => navigate('/profile')}
                >
                  <IconUser /> View Full Profile
                </button>
              </div>
            </div>
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
