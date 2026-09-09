import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { contentApi } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface ExperienceItem {
  id: string;
  name: string;
  description?: string;
  duration?: string;
  price?: number;
  category?: { name: string; slug: string };
  destination?: { name: string };
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

const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

export function ExperiencesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedExperience, setSelectedExperience] = useState<ExperienceItem | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        const [expRes, catRes] = await Promise.all([
          contentApi.getExperiences(),
          contentApi.getCategories(),
        ]);
        if (isMounted) {
          setExperiences(expRes.data?.data || expRes.data || []);
          setCategories(catRes.data?.data || catRes.data || []);
        }
      } catch {
        toast.error('Failed to load safaris & experiences');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = selectedCategory === 'ALL'
    ? experiences
    : experiences.filter((e) => e.category?.slug === selectedCategory || e.category?.name === selectedCategory);

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
            <Link to="/experiences" className="sample1-nav-item active">
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

        {/* Safaris Content Container */}
        <div className="sample1-container">
          {/* Header Banner */}
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
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '10px'
            }}>
              <IconCar /> Wild Safaris & Eco Treks
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827', margin: '0 0 6px 0' }}>
              Experience Palamau Tiger Reserve
            </h1>
            <p style={{ color: '#4b5563', fontSize: '0.88rem', maxWidth: '680px', margin: '0 auto 16px auto', lineHeight: 1.5 }}>
              Book certified wildlife jeep safaris, elephant trail walks, waterfall treks, and indigenous tribal heritage tours in Betla.
            </p>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={selectedCategory === 'ALL' ? 'sample1-hero-btn' : 'sample1-btn-secondary'}
                style={{ fontSize: '0.78rem', padding: '6px 14px' }}
              >
                All Experiences
              </button>
              {categories.map((cat) => {
                const catKey = cat.slug || cat.name;
                const isActive = selectedCategory === catKey;
                return (
                  <button
                    key={cat.id || cat.slug}
                    onClick={() => setSelectedCategory(catKey)}
                    className={isActive ? 'sample1-hero-btn' : 'sample1-btn-secondary'}
                    style={{ fontSize: '0.78rem', padding: '6px 14px' }}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Section */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280', fontSize: '0.9rem' }}>
              Loading wild experiences...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '48px 24px',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', color: '#10b981' }}>
                <IconTrees />
              </div>
              <h3 style={{ color: '#111827', fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
                No Experiences Published Yet
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                Check back soon for new seasonal safari schedules and guided walks.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '16px', marginBottom: '20px' }}>
              {filtered.map((exp) => (
                <div
                  key={exp.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <span style={{
                        background: '#e6f4ea',
                        color: '#15803d',
                        padding: '3px 10px',
                        borderRadius: '16px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em'
                      }}>
                        {exp.category?.name || 'Wild Safari'}
                      </span>
                      {exp.price && (
                        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#15803d' }}>
                          ₹{exp.price}
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111827', margin: '0 0 6px 0' }}>
                      {exp.name}
                    </h3>

                    {exp.destination && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#15803d', fontWeight: 600, marginBottom: '10px' }}>
                        <IconMapPin /> {exp.destination.name}
                      </div>
                    )}

                    <p style={{ fontSize: '0.84rem', color: '#4b5563', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                      {exp.description || 'Embark on a guided eco-tour through dense sal forests with expert forest guards.'}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '14px',
                    borderTop: '1px solid #f3f4f6',
                    marginTop: 'auto'
                  }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#6b7280', fontWeight: 500 }}>
                      <IconClock /> {exp.duration || '2 - 3 Hours'}
                    </span>
                    <button
                      onClick={() => setSelectedExperience(exp)}
                      className="sample1-hero-btn"
                      style={{ fontSize: '0.78rem', padding: '6px 14px' }}
                    >
                      View Details & Booking
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal Detail View */}
          {selectedExperience && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(4px)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
              }}
            >
              <div style={{
                background: '#ffffff',
                maxWidth: '540px',
                width: '100%',
                borderRadius: '14px',
                padding: '24px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{
                    background: '#e6f4ea',
                    color: '#15803d',
                    padding: '3px 10px',
                    borderRadius: '16px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}>
                    {selectedExperience.category?.name || 'Safari'}
                  </span>
                  <button
                    onClick={() => setSelectedExperience(null)}
                    style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', color: '#6b7280', cursor: 'pointer', padding: '4px' }}
                  >
                    ✕
                  </button>
                </div>

                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#111827', margin: '0 0 6px 0' }}>
                  {selectedExperience.name}
                </h2>

                {selectedExperience.destination && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#15803d', fontSize: '0.82rem', fontWeight: 600, marginBottom: '14px' }}>
                    <IconMapPin /> Location: {selectedExperience.destination.name}
                  </div>
                )}

                <p style={{ color: '#4b5563', lineHeight: 1.6, fontSize: '0.88rem', margin: '0 0 18px 0' }}>
                  {selectedExperience.description || 'Experience the pristine biodiversity of Betla with certified local trackers.'}
                </p>

                <div style={{ background: '#f9fafb', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e5e7eb', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                    <span style={{ color: '#6b7280' }}>Duration:</span>
                    <strong style={{ color: '#111827' }}>{selectedExperience.duration || '2.5 Hours'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: '#6b7280' }}>Eco Permit Fee:</span>
                    <strong style={{ color: '#15803d', fontSize: '0.95rem' }}>₹{selectedExperience.price || '450'} per visitor</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => {
                      toast.success('Redirecting to Eco Booking engine...');
                      setSelectedExperience(null);
                    }}
                    className="sample1-hero-btn"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    Confirm & Reserve Ticket
                  </button>
                  <button
                    onClick={() => setSelectedExperience(null)}
                    className="sample1-btn-secondary"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

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

export default ExperiencesPage;
