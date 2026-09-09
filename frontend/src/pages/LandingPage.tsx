import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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

const IconStar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

export default function LandingPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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

          {/* Navigation Items - Places to Visit active on root / */}
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
            <Link to="/" className="sample1-nav-item active">
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

      {/* --- Main Content Area --- */}
      <div className="sample1-main-wrapper">
        {/* Header Bar */}
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

        {/* Places to Visit Content Container */}
        <div className="sample1-container">
          {/* Hero / Introduction Banner */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '28px 24px',
            marginBottom: '24px',
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
              marginBottom: '12px'
            }}>
              <IconMapPin /> Palamau Tiger Reserve, Jharkhand
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
              Explore <span style={{ color: '#15803d' }}>Betla</span> Like Never Before
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', maxWidth: '700px', margin: '0 auto 20px', lineHeight: 1.6 }}>
              Your digital companion for discovering Betla & Palamau Tiger Reserve.
              Plan eco-safaris, book certified guides, find authentic homestays, and protect the wild beauty
              of Jharkhand's most iconic forest — responsibly and sustainably.
            </p>

            <div style={{ display: 'inline-flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link
                to="/discover"
                className="sample1-hero-btn"
                style={{ padding: '10px 22px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
              >
                <IconCompass /> Discover Betla Content
              </Link>
              {!isAuthenticated ? (
                <Link
                  to="/register"
                  className="sample1-btn-secondary"
                  style={{ padding: '10px 22px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                >
                  <IconLeaf /> Register Account
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="sample1-btn-secondary"
                  style={{ padding: '10px 22px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                >
                  <IconHome /> Go to Dashboard →
                </Link>
              )}
            </div>
          </div>

          {/* Features Showcase Section Header */}
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>
              Everything You Need For An Eco-Safari
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
              Explore approved destinations, emergency safety networks, eco-monitoring, and local hospitality.
            </p>
          </div>

          {/* Features Grid (6 Showcase Cards) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '18px',
            marginBottom: '24px'
          }}>
            {/* Card 1: Wildlife & Destinations */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '22px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}>
              <div>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '10px',
                  background: '#e6f4ea',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px'
                }}>
                  <IconMapPin />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>
                  Wildlife & Destinations
                </h3>
                <p style={{ fontSize: '0.825rem', color: '#4b5563', lineHeight: 1.5, margin: '0 0 16px' }}>
                  Discover attractions, waterfalls, jungle trekking routes, and historical forts inside Betla National Park.
                </p>
              </div>
              <Link
                to="/discover"
                style={{
                  fontWeight: 600,
                  fontSize: '0.825rem',
                  color: '#15803d',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Explore Destinations →
              </Link>
            </div>

            {/* Card 2: Safaris & Experiences */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '22px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}>
              <div>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '10px',
                  background: '#e6f4ea',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px'
                }}>
                  <IconCar />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>
                  Safaris & Experiences
                </h3>
                <p style={{ fontSize: '0.825rem', color: '#4b5563', lineHeight: 1.5, margin: '0 0 16px' }}>
                  Explore forest safaris, night tracking, canopy walks, and cultural village tours.
                </p>
              </div>
              <Link
                to="/experiences"
                style={{
                  fontWeight: 600,
                  fontSize: '0.825rem',
                  color: '#15803d',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Book Safaris →
              </Link>
            </div>

            {/* Card 3: Eco-Guides & Stays */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '22px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}>
              <div>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '10px',
                  background: '#e6f4ea',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px'
                }}>
                  <IconBed />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>
                  Eco-Guides & Stays
                </h3>
                <p style={{ fontSize: '0.825rem', color: '#4b5563', lineHeight: 1.5, margin: '0 0 16px' }}>
                  Book certified forest guides trained in wildlife tracking and stay in verified tribal homestays.
                </p>
              </div>
              <Link
                to="/guides-stays"
                style={{
                  fontWeight: 600,
                  fontSize: '0.825rem',
                  color: '#15803d',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Find Guides & Stays →
              </Link>
            </div>

            {/* Card 4: 24/7 Safety & SOS Center */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '22px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}>
              <div>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '10px',
                  background: '#fef2f2',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px'
                }}>
                  <IconShield />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>
                  24/7 Safety & SOS Center
                </h3>
                <p style={{ fontSize: '0.825rem', color: '#4b5563', lineHeight: 1.5, margin: '0 0 16px' }}>
                  Real-time emergency dispatch, instant GPS SOS beaconing, and direct forest patrol contacts.
                </p>
              </div>
              <Link
                to="/safety-hub"
                style={{
                  fontWeight: 600,
                  fontSize: '0.825rem',
                  color: '#dc2626',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Open Safety Hub →
              </Link>
            </div>

            {/* Card 5: Community Eco Portal */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '22px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}>
              <div>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '10px',
                  background: '#e6f4ea',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px'
                }}>
                  <IconTrees />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>
                  Community Eco Portal
                </h3>
                <p style={{ fontSize: '0.825rem', color: '#4b5563', lineHeight: 1.5, margin: '0 0 16px' }}>
                  Report environmental hazards, join tree planting drives, and take the zero-waste tourist pledge.
                </p>
              </div>
              <Link
                to="/eco-portal"
                style={{
                  fontWeight: 600,
                  fontSize: '0.825rem',
                  color: '#15803d',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Open Eco Portal →
              </Link>
            </div>

            {/* Card 6: Traveler Reviews Hub */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '22px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}>
              <div>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '10px',
                  background: '#fef3c7',
                  color: '#b45309',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px'
                }}>
                  <IconStar />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>
                  Traveler Reviews Hub
                </h3>
                <p style={{ fontSize: '0.825rem', color: '#4b5563', lineHeight: 1.5, margin: '0 0 16px' }}>
                  Read authentic experiences and ratings left by verified eco-tourists across Betla Reserve.
                </p>
              </div>
              <Link
                to="/reviews-hub"
                style={{
                  fontWeight: 600,
                  fontSize: '0.825rem',
                  color: '#b45309',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                View Reviews →
              </Link>
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
  );
}
