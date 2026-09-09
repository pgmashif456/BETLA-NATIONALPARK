import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ecoApi } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface EcoActivity {
  id: string;
  title: string;
  description: string;
  activityDate?: string;
  location?: string;
  organizer?: string;
  status?: string;
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

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconCalendar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
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

export function EcoPortalPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<EcoActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pledgeCount, setPledgeCount] = useState<number>(1420);
  const [pledged, setPledged] = useState<boolean>(false);

  // Eco report form
  const [reportForm, setReportForm] = useState({
    description: '',
    location: '',
    priority: 'MEDIUM',
  });
  const [submittingReport, setSubmittingReport] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const loadActivities = async () => {
      setLoading(true);
      try {
        const res = await ecoApi.getActivities();
        if (isMounted) {
          setActivities(res.data?.data || res.data || []);
        }
      } catch {
        // Fallback initiatives
        if (isMounted) {
          setActivities([
            {
              id: 'eco-1',
              title: 'Plastic Free Betla Clean-up Drive',
              description: 'Joint forest guard and tourist drive to collect single-use plastic along safari corridors.',
              activityDate: '2026-09-12',
              location: 'Betla Gate Entry Zone',
              organizer: 'Betla Forest Division',
              status: 'SCHEDULED',
            },
            {
              id: 'eco-2',
              title: 'Indigenous Tree Sapling Plantation',
              description: 'Planting native Sal, Mahua, and Bamboo saplings to restore degraded reserve buffers.',
              activityDate: '2026-09-20',
              location: 'Kechki River Bank Corridor',
              organizer: 'Palamau Conservation Trust',
              status: 'UPCOMING',
            },
          ]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadActivities();
    return () => {
      isMounted = false;
    };
  }, []);

  const handlePledge = () => {
    if (!pledged) {
      setPledgeCount(pledgeCount + 1);
      setPledged(true);
      toast.success('Thank you for signing the Betla Eco Tourist Pledge!');
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportForm.description) {
      toast.error('Please provide a description of the environmental issue');
      return;
    }
    setSubmittingReport(true);
    try {
      await ecoApi.createReport(reportForm);
      toast.success('Eco hazard report logged for environmental review!');
      setReportForm({ description: '', location: '', priority: 'MEDIUM' });
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Failed to submit eco report');
    } finally {
      setSubmittingReport(false);
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
            <Link to="/safety-hub" className="sample1-nav-item">
              <IconShield /> <span>Safety & Emergency</span>
            </Link>
            <Link to="/eco-portal" className="sample1-nav-item active">
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
          <div className="sample1-search-box">
            <IconSearch />
            <input
              type="text"
              placeholder="Search eco initiatives, tree drives..."
              className="sample1-search-input"
              onClick={() => navigate('/discover')}
            />
          </div>

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

        {/* Eco Portal Content Container */}
        <div className="sample1-container">
          {/* Header Banner & Eco Pledge Box */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
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
              background: '#e6f4ea',
              color: '#15803d',
              padding: '4px 14px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '10px'
            }}>
              <IconTrees /> Environmental Protection & Community Eco-Drives
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>
              Community Eco-Management Portal
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', maxWidth: '680px', margin: '0 auto 18px', lineHeight: 1.5 }}>
              Participate in forest conservation, track eco-initiatives, report plastic or waste violations, and take the zero-impact eco pledge.
            </p>

            {/* Eco Pledge Counter Component */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '14px',
              background: '#f9fafb',
              padding: '8px 20px',
              borderRadius: '30px',
              border: '1px solid #e5e7eb',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803d' }}>
                {pledgeCount.toLocaleString()}
              </span>
              <span style={{ fontSize: '0.825rem', color: '#4b5563', fontWeight: 500 }}>
                Eco-Tourists Have Taken the Zero-Waste Pledge
              </span>
              <button
                onClick={handlePledge}
                disabled={pledged}
                className={pledged ? 'sample1-btn-secondary' : 'sample1-hero-btn'}
                style={{
                  fontSize: '0.78rem',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                {pledged ? (
                  <>
                    <IconCheck /> Pledge Signed!
                  </>
                ) : (
                  <>
                    <IconLeaf /> Take the Pledge
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Two-Column Grid: Left (Initiatives), Right (Eco Violation Form) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '20px'
          }}>
            {/* Left Column: Ongoing Eco Initiatives */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ color: '#15803d', display: 'flex' }}><IconTrees /></div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                  Conservation Initiatives & Drives
                </h2>
              </div>

              {loading ? (
                <div style={{ color: '#6b7280', fontSize: '0.875rem', padding: '12px 0' }}>
                  Loading eco drives...
                </div>
              ) : activities.length === 0 ? (
                <div style={{
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  color: '#6b7280',
                  fontSize: '0.85rem'
                }}>
                  No active eco drives scheduled at this moment.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {activities.map((act) => (
                    <div
                      key={act.id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '16px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                          {act.title}
                        </h3>
                        <span style={{
                          background: '#e6f4ea',
                          color: '#15803d',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '12px'
                        }}>
                          {act.status || 'ACTIVE'}
                        </span>
                      </div>

                      {act.location && (
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#15803d',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginBottom: '8px'
                        }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <IconMapPin /> {act.location}
                          </span>
                          {act.activityDate && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#4b5563' }}>
                              | <IconCalendar /> {new Date(act.activityDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      )}

                      <p style={{ color: '#4b5563', fontSize: '0.825rem', lineHeight: 1.5, margin: '0 0 10px' }}>
                        {act.description}
                      </p>

                      {act.organizer && (
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          Organized by: <strong style={{ color: '#374151' }}>{act.organizer}</strong>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Report Eco-Hazard or Waste Form */}
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
                  <div style={{ color: '#15803d', display: 'flex' }}><IconAlertTriangle /></div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                    Report Eco-Hazard or Waste
                  </h2>
                </div>
                <p style={{ fontSize: '0.825rem', color: '#6b7280', margin: '0 0 18px', lineHeight: 1.4 }}>
                  Help keep Palamau Tiger Reserve pristine. Report plastic dumping, illegal littering, or forest degradation.
                </p>

                <form onSubmit={handleSubmitReport} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '5px' }} htmlFor="eco-loc">
                      Location in Reserve
                    </label>
                    <input
                      id="eco-loc"
                      type="text"
                      placeholder="e.g. Near Safari Gate #2, Picnic Spot"
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
                      value={reportForm.location}
                      onChange={(e) => setReportForm({ ...reportForm, location: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '5px' }} htmlFor="eco-priority">
                      Urgency / Severity
                    </label>
                    <select
                      id="eco-priority"
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
                      value={reportForm.priority}
                      onChange={(e) => setReportForm({ ...reportForm, priority: e.target.value })}
                    >
                      <option value="LOW">Low (Minor Litter)</option>
                      <option value="MEDIUM">Medium (Accumulated Waste)</option>
                      <option value="HIGH">High (Hazardous Dumping / Stream Contamination)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '5px' }} htmlFor="eco-desc">
                      Issue Description
                    </label>
                    <textarea
                      id="eco-desc"
                      rows={4}
                      placeholder="Describe the environmental hazard observed..."
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
                      value={reportForm.description}
                      onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReport}
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
                    {submittingReport ? 'Logging Report...' : 'Log Environmental Report'}
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

export default EcoPortalPage;
