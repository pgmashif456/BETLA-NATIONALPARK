import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { safetyApi } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import heroImg from '../assets/safari_hero.jpg';

interface SafetyAlert {
  id: string;
  title: string;
  message: string;
  severity: string;
  area?: string;
  createdAt?: string;
}

// Clean inline SVG Icons matching Sample-1 visual language
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
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const IconPhone = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const IconAlertTriangle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const IconFileText = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

export function SafetyHubPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<SafetyAlert[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState<boolean>(true);
  const [sosLoading, setSosLoading] = useState<boolean>(false);
  const [sosTriggered, setSosTriggered] = useState<boolean>(false);

  // Incident form
  const [incidentForm, setIncidentForm] = useState({
    type: 'WILDLIFE_SIGHTING',
    description: '',
    location: '',
    priority: 'MEDIUM',
  });
  const [submittingIncident, setSubmittingIncident] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const loadAlerts = async () => {
      setLoadingAlerts(true);
      try {
        const res = await safetyApi.getSafetyAlerts();
        if (isMounted) {
          setAlerts(res.data?.data || res.data || []);
        }
      } catch {
        // Fallback alerts if empty
        if (isMounted) {
          setAlerts([
            {
              id: 'alt-1',
              title: 'Heavy Rain Warning',
              message: 'Heavy rainfall expected in West zone. Safaris delayed. Avoid river crossings and low-lying areas.',
              severity: 'WARNING',
              area: 'West Zone',
            },
            {
              id: 'alt-2',
              title: 'Elephant Movement Reported',
              message: 'Elephant herd movement detected. Maintain safe distance and avoid night travel.',
              severity: 'ADVISORY',
              area: 'Core Area (North)',
            },
            {
              id: 'alt-3',
              title: 'Fallen Tree on Access Road',
              message: 'Road cleared. Movement normal.',
              severity: 'RESOLVED',
              area: 'Netarhat Road',
            },
          ]);
        }
      } finally {
        if (isMounted) setLoadingAlerts(false);
      }
    };
    loadAlerts();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSOS = async () => {
    setSosLoading(true);
    try {
      let lat: number | undefined;
      let lng: number | undefined;

      if (navigator.geolocation) {
        try {
          const pos: any = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
        } catch {
          // default coordinates fallback
        }
      }

      await safetyApi.createEmergency({
        type: 'DISTRESS_BEACON',
        description: 'Emergency SOS signal broadcast from public safety hub.',
        location: lat && lng ? `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}` : 'Betla Core Area',
        latitude: lat,
        longitude: lng,
      });

      setSosTriggered(true);
      toast.success('SOS Emergency Signal Dispatched to Betla Control Room!');
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Failed to dispatch SOS beacon. Call Forest Patrol directly!');
    } finally {
      setSosLoading(false);
    }
  };

  const handleSubmitIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentForm.description) {
      toast.error('Please enter incident details');
      return;
    }
    setSubmittingIncident(true);
    try {
      await safetyApi.createIncident(incidentForm);
      toast.success('Incident Report submitted to Forest Authority!');
      setIncidentForm({ type: 'WILDLIFE_SIGHTING', description: '', location: '', priority: 'MEDIUM' });
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Failed to report incident');
    } finally {
      setSubmittingIncident(false);
    }
  };

  return (
    <div className="sample1-layout">
      {/* --- Left Compact Sidebar (Sample-1 1:1 Match) --- */}
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

          {/* Navigation Items */}
          <nav className="sample1-nav-group">
            <Link to="/dashboard" className="sample1-nav-item">
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
            <Link to="/safety-hub" className="sample1-nav-item active">
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

      {/* --- Main Content Area --- */}
      <div className="sample1-main-wrapper">
        {/* Header Bar */}
        <header className="sample1-header">
          <div className="sample1-user-controls">
            <button className="sample1-icon-btn" title="Notifications" onClick={() => navigate('/safety-hub')}>
              <IconBell />
            </button>

            {user ? (
              <div className="sample1-user-pill" onClick={() => navigate('/profile')}>
                <div className="sample1-avatar">
                  {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="sample1-user-info">
                  <span className="sample1-user-name">{user.firstName} {user.lastName}</span>
                  <span className="sample1-user-role">{user.role.name}</span>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link to="/login" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#15803d', padding: '5px 12px', borderRadius: '20px', border: '1px solid #15803d', textDecoration: 'none' }}>
                  Sign In
                </Link>
                <Link to="/register" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'white', background: '#10b981', padding: '5px 12px', borderRadius: '20px', textDecoration: 'none' }}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Safety Content Container */}
        <div className="sample1-container">
          
          {/* Hero Section */}
          <div style={{
            position: 'relative',
            background: `#064e3b url(${heroImg}) center/cover no-repeat`,
            borderRadius: '16px',
            padding: '48px 40px',
            marginBottom: '24px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            {/* Dark gradient overlay */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(to right, rgba(6, 78, 59, 0.95) 0%, rgba(6, 78, 59, 0.8) 50%, rgba(6, 78, 59, 0.3) 100%)',
              zIndex: 1
            }} />

            <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ maxWidth: '600px' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#6ee7b7',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '12px'
                }}>
                  <IconShield /> Safe Today, Wilder Tomorrow
                </div>
                
                <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#ffffff', margin: '0 0 16px', lineHeight: 1.1 }}>
                  Your Safety<br/><span style={{ color: '#34d399' }}>Our Priority</span>
                </h1>
                
                <p style={{ color: '#d1fae5', fontSize: '0.95rem', margin: '0 0 28px', lineHeight: 1.6, maxWidth: '500px' }}>
                  Real-time forest hazard advisories, instant GPS SOS distress dispatch, and direct incident reporting to Palamau Reserve Control.
                </p>

                {/* Big Prominent SOS Button */}
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <button
                    onClick={handleSOS}
                    disabled={sosLoading}
                    style={{
                      background: sosTriggered ? '#16a34a' : '#ef4444',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      letterSpacing: '0.03em',
                      padding: '14px 28px',
                      borderRadius: '30px',
                      boxShadow: sosTriggered ? '0 4px 14px rgba(22, 163, 74, 0.35)' : '0 4px 14px rgba(239, 68, 68, 0.4)',
                      border: 'none',
                      cursor: sosLoading ? 'wait' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <IconAlertTriangle />
                    {sosLoading ? 'Sending GPS...' : sosTriggered ? 'SOS SENT & ACKNOWLEDGED' : 'DISPATCH INSTANT SOS BEACON'}
                  </button>
                  <button
                    style={{
                      background: 'transparent',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      padding: '12px 24px',
                      borderRadius: '30px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <IconFileText /> View Safety Guidelines
                  </button>
                </div>
              </div>

              {/* Right side quote */}
              <div style={{ maxWidth: '280px', marginTop: '40px', paddingRight: '20px' }}>
                <div style={{ fontSize: '1.2rem', fontStyle: 'italic', fontWeight: 600, color: '#ffffff', lineHeight: 1.4, marginBottom: '8px' }}>
                  "Safe Visitors<br/>Help Wilder Forests."
                </div>
                <div style={{ color: '#a7f3d0', fontSize: '0.8rem', fontWeight: 500 }}>
                  — Betla Eco-Companion
                </div>
              </div>
            </div>
          </div>

          {/* Summary Cards Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {/* Active Alerts Card */}
            <div style={{
              background: alerts.length > 0 ? '#fef2f2' : '#f0fdf4',
              border: '1px solid',
              borderColor: alerts.length > 0 ? '#fecaca' : '#bbf7d0',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: alerts.length > 0 ? '#fee2e2' : '#dcfce7',
                  color: alerts.length > 0 ? '#dc2626' : '#16a34a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <IconAlertTriangle />
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', lineHeight: 1, marginBottom: '4px' }}>
                    {alerts.length}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: alerts.length > 0 ? '#dc2626' : '#16a34a' }}>
                    Active Alerts
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
                    In Reserve Zones
                  </div>
                </div>
              </div>
              <div style={{ color: alerts.length > 0 ? '#dc2626' : '#16a34a' }}>→</div>
            </div>

            {/* Helpline Card */}
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: '#dcfce7',
                  color: '#16a34a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <IconPhone />
                </div>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', lineHeight: 1, marginBottom: '6px' }}>
                    24/7
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>
                    Forest Helpline
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#16a34a', marginTop: '2px' }}>
                    +91 6562 222 019
                  </div>
                </div>
              </div>
              <div style={{ color: '#16a34a' }}>→</div>
            </div>
          </div>

          {/* Main Layout Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Alerts List Box */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ color: '#ef4444', display: 'flex' }}><IconBell /></div>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                      Live Reserve Safety Alerts
                    </h2>
                  </div>
                  <Link to="#" style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>View All →</Link>
                </div>

                {loadingAlerts ? (
                  <div style={{ color: '#6b7280', fontSize: '0.875rem', padding: '12px 0' }}>Checking advisories...</div>
                ) : alerts.length === 0 ? (
                  <div style={{ color: '#6b7280', fontSize: '0.85rem', padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
                    No active safety alerts. All zones clear.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {alerts.map((alt) => {
                      // Determine visual styling based on severity logic matched to reference
                      let colorMap = {
                        bg: '#ffffff', border: '#e5e7eb', leftBorder: '#10b981',
                        badgeBg: '#e6f4ea', badgeText: '#15803d', iconColor: '#15803d'
                      };
                      if (alt.severity === 'DANGER' || alt.severity === 'HIGH' || alt.severity === 'WARNING') {
                        colorMap = {
                          bg: '#ffffff', border: '#e5e7eb', leftBorder: '#ef4444',
                          badgeBg: '#fef2f2', badgeText: '#dc2626', iconColor: '#3b82f6' // using blue for icon matching reference
                        };
                      } else if (alt.severity === 'ADVISORY' || alt.severity === 'INFO') {
                        colorMap = {
                          bg: '#ffffff', border: '#e5e7eb', leftBorder: '#f59e0b',
                          badgeBg: '#fef3c7', badgeText: '#d97706', iconColor: '#4b5563'
                        };
                      }

                      return (
                        <div key={alt.id} style={{
                          background: colorMap.bg,
                          border: `1px solid ${colorMap.border}`,
                          borderLeft: `4px solid ${colorMap.leftBorder}`,
                          borderRadius: '8px',
                          padding: '16px',
                          display: 'flex',
                          gap: '16px',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                        }}>
                          <div style={{ color: colorMap.iconColor, flexShrink: 0, marginTop: '2px' }}>
                            {alt.severity === 'RESOLVED' ? <IconTrees /> : <IconAlertTriangle />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                              <h4 style={{ color: '#111827', fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                                {alt.title}
                              </h4>
                              <span style={{
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                padding: '4px 10px',
                                borderRadius: '12px',
                                background: colorMap.badgeBg,
                                color: colorMap.badgeText,
                                letterSpacing: '0.02em',
                                textTransform: 'uppercase'
                              }}>
                                {alt.severity}
                              </span>
                            </div>
                            
                            {alt.area && (
                              <div style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                                <IconMapPin /> Zone: {alt.area}
                              </div>
                            )}
                            
                            <p style={{ color: '#4b5563', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                              {alt.message}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Forest Authority Helplines Box */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ color: '#15803d', display: 'flex' }}><IconPhone /></div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                      Forest Authority Helplines
                    </h3>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>24/7 Support</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
                  <div style={{ borderRight: '1px solid #f3f4f6', paddingRight: '16px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>Betla Range Control Desk</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#15803d', marginBottom: '4px' }}>+91 6562 222 019</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>(24/7)</div>
                  </div>
                  <div style={{ borderRight: '1px solid #f3f4f6', paddingRight: '16px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>Forest Emergency</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#15803d', marginBottom: '4px' }}>+91 94311 08842</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>(24/7)</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>Medical & Rescue</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#15803d', marginBottom: '4px' }}>108 / 112</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>(24/7)</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Incident Report Form */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ color: '#15803d', display: 'flex' }}><IconFileText /></div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                  Report a Forest Incident
                </h2>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#4b5563', margin: '0 0 24px', lineHeight: 1.5 }}>
                Report wildlife sightings, road obstructions, fallen trees, or safety hazards directly to forest officers.
              </p>

              <form onSubmit={handleSubmitIncident} style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 min-content', minWidth: '160px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }} htmlFor="inc-type">
                      Incident Category
                    </label>
                    <select
                      id="inc-type"
                      style={{
                        width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px',
                        fontSize: '0.85rem', color: '#111827', background: '#ffffff', outline: 'none'
                      }}
                      value={incidentForm.type}
                      onChange={(e) => setIncidentForm({ ...incidentForm, type: e.target.value })}
                    >
                      <option value="WILDLIFE_SIGHTING">Wildlife Sighting / Animal Crossing</option>
                      <option value="ROAD_BLOCK">Fallen Tree / Road Blockade</option>
                      <option value="MEDICAL_EMERGENCY">Medical Issue / Injury</option>
                      <option value="VEHICLE_BREAKDOWN">Jeep Breakdown</option>
                      <option value="POACHING_SUSPICION">Suspicious Activity / Poaching Risk</option>
                    </select>
                  </div>

                  <div style={{ flex: '1 1 min-content', minWidth: '160px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }} htmlFor="inc-priority">
                      Priority Level
                    </label>
                    <select
                      id="inc-priority"
                      style={{
                        width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px',
                        fontSize: '0.85rem', color: '#111827', background: '#ffffff', outline: 'none'
                      }}
                      value={incidentForm.priority}
                      onChange={(e) => setIncidentForm({ ...incidentForm, priority: e.target.value })}
                    >
                      <option value="LOW">Low (Routine Information)</option>
                      <option value="MEDIUM">Medium (Requires Inspection)</option>
                      <option value="HIGH">High (Urgent Response Needed)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }} htmlFor="inc-loc">
                    Location / Landmark
                  </label>
                  <input
                    id="inc-loc"
                    type="text"
                    placeholder="e.g. Near Jhirna Zone, Watch Tower Road, etc."
                    style={{
                      width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px',
                      fontSize: '0.85rem', color: '#111827', background: '#ffffff', outline: 'none', boxSizing: 'border-box'
                    }}
                    value={incidentForm.location}
                    onChange={(e) => setIncidentForm({ ...incidentForm, location: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }} htmlFor="inc-desc">
                    Short Description
                  </label>
                  <textarea
                    id="inc-desc"
                    rows={4}
                    placeholder="Describe what you saw or experienced..."
                    style={{
                      width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px',
                      fontSize: '0.85rem', color: '#111827', background: '#ffffff', outline: 'none', resize: 'vertical', boxSizing: 'border-box'
                    }}
                    value={incidentForm.description}
                    onChange={(e) => setIncidentForm({ ...incidentForm, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '10px' }}>
                  <button
                    type="submit"
                    disabled={submittingIncident}
                    style={{
                      background: '#064e3b', color: '#ffffff', fontSize: '0.9rem', fontWeight: 600,
                      padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: submittingIncident ? 'wait' : 'pointer',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flex: 1
                    }}
                  >
                    <IconFileText />
                    {submittingIncident ? 'Submitting...' : 'Submit Incident Report'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Conservation Footer Banner */}
        <div style={{
          background: '#064e3b',
          color: '#ffffff',
          padding: '24px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ color: '#10b981', display: 'flex' }}><IconLeaf /></div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px' }}>Together for a Safer Betla</div>
              <div style={{ fontSize: '0.8rem', color: '#a7f3d0' }}>Betla Eco-Companion | Department of Forest, Jharkhand</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', color: '#a7f3d0', fontStyle: 'italic', fontWeight: 600 }}>Explore Responsibly</div>
            <div style={{ fontSize: '0.85rem', color: '#a7f3d0', fontStyle: 'italic', fontWeight: 600 }}>Preserve Eternally</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SafetyHubPage;
