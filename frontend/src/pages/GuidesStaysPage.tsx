import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface EcoGuide {
  id: string;
  name: string;
  badge: string;
  rating: number;
  experienceYears: number;
  languages: string[];
  specialties: string[];
  contactPhone: string;
}

interface EcoHomestay {
  id: string;
  name: string;
  location: string;
  rating: number;
  pricePerNight: number;
  amenities: string[];
  description: string;
  verified: boolean;
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

const IconStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const IconPhone = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

export function GuidesStaysPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'guides' | 'homestays'>('guides');

  const demoGuides: EcoGuide[] = [
    {
      id: 'g1',
      name: 'Rameshwar Singh Munda',
      badge: 'Senior Forest Tracker',
      rating: 4.9,
      experienceYears: 14,
      languages: ['Hindi', 'Nagpuri', 'English'],
      specialties: ['Tiger Tracking', 'Bird Watching', 'Jungle Botany'],
      contactPhone: '+91 94311 88201',
    },
    {
      id: 'g2',
      name: 'Sunita Devi',
      badge: 'Certified Eco Guide',
      rating: 4.8,
      experienceYears: 8,
      languages: ['Hindi', 'Santali', 'English'],
      specialties: ['Cultural Heritage', 'Waterfall Treks', 'Medicinal Plants'],
      contactPhone: '+91 94311 77312',
    },
    {
      id: 'g3',
      name: 'Birsa Oraon',
      badge: 'Wildlife Specialist',
      rating: 4.95,
      experienceYears: 18,
      languages: ['Hindi', 'Kurukh', 'English'],
      specialties: ['Night Safari', 'Elephant Movement', 'Camera Traps'],
      contactPhone: '+91 94311 99104',
    },
  ];

  const demoHomestays: EcoHomestay[] = [
    {
      id: 'h1',
      name: 'Betla Canopy Eco Lodge',
      location: 'Near Betla Main Fort Gate, Palamau',
      rating: 4.8,
      pricePerNight: 1800,
      amenities: ['Organic Meals', 'Solar Power', 'Guided Night Walks', 'Free Wi-Fi'],
      description: 'Authentic mud-brick eco cottages surrounded by teak and bamboo groves right on the reserve periphery.',
      verified: true,
    },
    {
      id: 'h2',
      name: 'Koel Riverview Homestay',
      location: 'Kechki Confluence, Palamau',
      rating: 4.7,
      pricePerNight: 1500,
      amenities: ['Riverview Balcony', 'Tribal Dinner', 'Bicycle Rental', 'Parking'],
      description: 'Peaceful stay overlooking the North Koel & Auranga river confluence with traditional Jharkhand cuisine.',
      verified: true,
    },
    {
      id: 'h3',
      name: 'Kechki Forest Residency',
      location: 'Kechki Reserve Zone',
      rating: 4.9,
      pricePerNight: 2200,
      amenities: ['Forest View Deck', '24/7 Security', 'Fireplace', 'Guide Desk'],
      description: 'Historic wooden bungalow atmosphere featuring wildlife viewing decks and campfire story sessions.',
      verified: true,
    },
  ];

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
            <Link to="/guides-stays" className="sample1-nav-item active">
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
              placeholder="Search homestays, eco-guides, facilities..."
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

        {/* Stay & Facilities Content Container */}
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
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '10px'
            }}>
              <IconBed /> Community Tourism Network
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>
              Eco-Guides & Verified Homestays
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', maxWidth: '680px', margin: '0 auto 18px', lineHeight: 1.5 }}>
              Connect directly with government-certified indigenous forest guides and stay at eco-friendly homestays that support the local tribal economy.
            </p>

            {/* Toggle Tabs */}
            <div style={{ display: 'inline-flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => setActiveTab('guides')}
                className={activeTab === 'guides' ? 'sample1-hero-btn' : 'sample1-btn-secondary'}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', padding: '8px 18px' }}
              >
                <IconCompass /> Eco-Guides ({demoGuides.length})
              </button>
              <button
                onClick={() => setActiveTab('homestays')}
                className={activeTab === 'homestays' ? 'sample1-hero-btn' : 'sample1-btn-secondary'}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', padding: '8px 18px' }}
              >
                <IconBed /> Homestays ({demoHomestays.length})
              </button>
            </div>
          </div>

          {/* GUIDES TAB */}
          {activeTab === 'guides' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '18px'
            }}>
              {demoGuides.map((guide) => (
                <div
                  key={guide.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                  }}
                >
                  <div>
                    {/* Top Guide Info */}
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '14px' }}>
                      <div style={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        background: '#e6f4ea',
                        color: '#15803d',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        flexShrink: 0
                      }}>
                        {guide.name[0]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
                          {guide.name}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{
                            background: '#e6f4ea',
                            color: '#15803d',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: '12px'
                          }}>
                            {guide.badge}
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', color: '#b45309', fontWeight: 700 }}>
                            <IconStar /> {guide.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div style={{
                      fontSize: '0.82rem',
                      color: '#4b5563',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      marginBottom: '14px',
                      background: '#f9fafb',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #f3f4f6'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <IconCalendar />
                        <span><strong>Experience:</strong> {guide.experienceYears} Years in Palamau Reserve</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <IconCompass />
                        <span><strong>Languages:</strong> {guide.languages.join(', ')}</span>
                      </div>
                    </div>

                    {/* Specializations */}
                    <div style={{ marginBottom: '18px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '6px' }}>Specializations:</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {guide.specialties.map((spec) => (
                          <span
                            key={spec}
                            style={{
                              fontSize: '0.72rem',
                              padding: '3px 8px',
                              background: '#f3f4f6',
                              color: '#374151',
                              borderRadius: '6px',
                              border: '1px solid #e5e7eb',
                              fontWeight: 500
                            }}
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Booking Action */}
                  <button
                    onClick={() => toast.success(`Guide Request sent to ${guide.name}! Contact: ${guide.contactPhone}`)}
                    className="sample1-hero-btn"
                    style={{ width: '100%', fontSize: '0.82rem', padding: '9px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <IconPhone /> Request Guide Booking
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* HOMESTAYS TAB */}
          {activeTab === 'homestays' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '18px'
            }}>
              {demoHomestays.map((stay) => (
                <div
                  key={stay.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                  }}
                >
                  <div>
                    {/* Badge & Rating Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: '#e6f4ea',
                        color: '#15803d',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '12px'
                      }}>
                        <IconCheck /> Certified Eco Stay
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#b45309', fontWeight: 700, fontSize: '0.82rem' }}>
                        <IconStar /> {stay.rating}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
                      {stay.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#6b7280', marginBottom: '10px' }}>
                      <IconMapPin /> {stay.location}
                    </div>

                    <p style={{ fontSize: '0.82rem', color: '#4b5563', lineHeight: 1.5, margin: '0 0 14px' }}>
                      {stay.description}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                      {stay.amenities.map((am) => (
                        <span
                          key={am}
                          style={{
                            fontSize: '0.72rem',
                            padding: '3px 8px',
                            background: '#f9fafb',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb',
                            color: '#4b5563',
                            fontWeight: 500
                          }}
                        >
                          {am}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action Row */}
                  <div style={{
                    paddingTop: '14px',
                    borderTop: '1px solid #f3f4f6',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803d' }}>
                        ₹{stay.pricePerNight}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}> / night</span>
                    </div>
                    <button
                      onClick={() => toast.success(`Reservation inquiry sent for ${stay.name}`)}
                      className="sample1-hero-btn"
                      style={{ fontSize: '0.8rem', padding: '8px 16px' }}
                    >
                      Check Availability
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="sample1-footer">
          Betla Eco-Companion | Department of Forest, Jharkhand
        </footer>
      </div>
    </div>
  );
}

export default GuidesStaysPage;
