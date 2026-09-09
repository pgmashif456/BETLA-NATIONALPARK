import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { safetyApi } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

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
              title: 'Monsoon Stream Elevation Watch',
              message: 'Kechki river crossing water levels elevated. Proceed only with certified forest vehicles.',
              severity: 'WARNING',
              area: 'North Koel River Sector',
            },
            {
              id: 'alt-2',
              title: 'Elephant Herd Movement Notice',
              message: 'Herd of 12 wild elephants sighted near Zone 3 road between 05:00 - 08:00 AM. Maintain 100m distance.',
              severity: 'INFO',
              area: 'Betla Range Zone 3',
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
          {/* Emergency SOS Banner Card */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #fee2e2',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#fef2f2',
              color: '#dc2626',
              padding: '4px 14px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '10px'
            }}>
              <IconShield /> 24/7 Tourist Emergency & Incident Response
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>
              Tourist Safety & Emergency Hub
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', maxWidth: '680px', margin: '0 auto 20px', lineHeight: 1.5 }}>
              Real-time forest hazard advisories, instant 1-click GPS SOS distress dispatch, and direct incident reporting to Palamau Reserve Control.
            </p>

            {/* Big Prominent SOS Button */}
            <div>
              <button
                onClick={handleSOS}
                disabled={sosLoading}
                style={{
                  background: sosTriggered ? '#16a34a' : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  letterSpacing: '0.03em',
                  padding: '12px 28px',
                  borderRadius: '30px',
                  boxShadow: sosTriggered ? '0 4px 14px rgba(22, 163, 74, 0.35)' : '0 4px 14px rgba(220, 38, 38, 0.35)',
                  border: 'none',
                  cursor: sosLoading ? 'wait' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <IconAlertTriangle />
                {sosLoading ? 'Sending GPS Location...' : sosTriggered ? 'SOS SIGNAL ACTIVE & ACKNOWLEDGED' : 'DISPATCH INSTANT SOS BEACON'}
              </button>
            </div>
          </div>

          {/* Two Column Layout: Left (Alerts & Contacts), Right (Incident Form) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '20px'
          }}>
            {/* Left Column: Live Safety Alerts & Emergency Helplines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Active Safety Alerts Card Container */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ color: '#15803d', display: 'flex' }}><IconBell /></div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                    Live Reserve Safety Alerts
                  </h2>
                </div>

                {loadingAlerts ? (
                  <div style={{ color: '#6b7280', fontSize: '0.875rem', padding: '12px 0' }}>
                    Checking forest advisories...
                  </div>
                ) : alerts.length === 0 ? (
                  <div style={{
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '16px',
                    color: '#6b7280',
                    fontSize: '0.85rem'
                  }}>
                    No active safety alerts. All forest zones clear.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {alerts.map((alt) => (
                      <div
                        key={alt.id}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #e5e7eb',
                          borderLeft: alt.severity === 'DANGER' || alt.severity === 'HIGH' ? '4px solid #ef4444' : alt.severity === 'WARNING' ? '4px solid #f59e0b' : '4px solid #10b981',
                          borderRadius: '8px',
                          padding: '14px',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                          <h4 style={{ color: '#111827', fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                            {alt.title}
                          </h4>
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '12px',
                            background: alt.severity === 'DANGER' || alt.severity === 'HIGH' ? '#fef2f2' : alt.severity === 'WARNING' ? '#fef3c7' : '#e6f4ea',
                            color: alt.severity === 'DANGER' || alt.severity === 'HIGH' ? '#dc2626' : alt.severity === 'WARNING' ? '#d97706' : '#15803d'
                          }}>
                            {alt.severity || 'NOTICE'}
                          </span>
                        </div>

                        {alt.area && (
                          <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                            <IconMapPin /> Zone: {alt.area}
                          </div>
                        )}

                        <p style={{ color: '#4b5563', fontSize: '0.825rem', lineHeight: 1.5, margin: 0 }}>
                          {alt.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Emergency Contacts Card */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <div style={{ color: '#15803d', display: 'flex' }}><IconPhone /></div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                    Forest Authority Helplines
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ color: '#374151' }}>Betla Range Control Desk</span>
                    <strong style={{ color: '#15803d', fontFamily: 'monospace', fontSize: '0.9rem' }}>+91 (6562) 222-019</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ color: '#374151' }}>Palamau Tiger Reserve Ranger</span>
                    <strong style={{ color: '#15803d', fontFamily: 'monospace', fontSize: '0.9rem' }}>+91 94311 08842</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#374151' }}>Medical & Ambulance SOS</span>
                    <strong style={{ color: '#dc2626', fontFamily: 'monospace', fontSize: '0.95rem' }}>108 / 112</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Incident Report Form */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ color: '#15803d', display: 'flex' }}><IconFileText /></div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                    Report a Forest Incident
                  </h2>
                </div>
                <p style={{ fontSize: '0.825rem', color: '#6b7280', margin: '0 0 18px', lineHeight: 1.4 }}>
                  Report wildlife sightings, road obstructions, fallen trees, or safety hazards directly to forest officers.
                </p>

                <form onSubmit={handleSubmitIncident} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '5px' }} htmlFor="inc-type">
                      Incident Category
                    </label>
                    <select
                      id="inc-type"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        color: '#111827',
                        background: '#ffffff',
                        outline: 'none'
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

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '5px' }} htmlFor="inc-priority">
                      Priority Level
                    </label>
                    <select
                      id="inc-priority"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        color: '#111827',
                        background: '#ffffff',
                        outline: 'none'
                      }}
                      value={incidentForm.priority}
                      onChange={(e) => setIncidentForm({ ...incidentForm, priority: e.target.value })}
                    >
                      <option value="LOW">Low (Routine Information)</option>
                      <option value="MEDIUM">Medium (Requires Inspection)</option>
                      <option value="HIGH">High (Urgent Response Needed)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '5px' }} htmlFor="inc-loc">
                      Forest Location / Landmark
                    </label>
                    <input
                      id="inc-loc"
                      type="text"
                      placeholder="e.g. Near Kechki Bridge, Km 4 Watchtower"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        color: '#111827',
                        background: '#ffffff',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      value={incidentForm.location}
                      onChange={(e) => setIncidentForm({ ...incidentForm, location: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '5px' }} htmlFor="inc-desc">
                      Detailed Description
                    </label>
                    <textarea
                      id="inc-desc"
                      rows={4}
                      placeholder="Describe what you observed..."
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        color: '#111827',
                        background: '#ffffff',
                        outline: 'none',
                        resize: 'vertical',
                        boxSizing: 'border-box'
                      }}
                      value={incidentForm.description}
                      onChange={(e) => setIncidentForm({ ...incidentForm, description: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingIncident}
                    className="sample1-hero-btn"
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: '0.85rem',
                      marginTop: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <IconFileText />
                    {submittingIncident ? 'Submitting Report...' : 'Submit Incident Report'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="sample1-footer">
          Betla Eco-Companion | Department of Forest, Jharkhand
        </footer>
      </div>
    </div>
  );
}

export default SafetyHubPage;
