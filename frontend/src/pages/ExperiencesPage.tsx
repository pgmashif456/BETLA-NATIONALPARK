import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { contentApi } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import safariHeroAsset from '../assets/safari_hero.jpg';

interface ExperienceItem {
  id: string;
  name: string;
  description?: string;
  duration?: string;
  price?: number;
  category?: { name: string; slug: string };
  destination?: { name: string };
}

// Exactly 4 Curated Betla Forest / Safari Hero Images (Matching Master Visual Reference)
const safariHeroImages = [
  safariHeroAsset, // 1. Reference Scene: Bengal Tiger on sunlit dirt trail with safari jeep in background
  'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1600&q=80', // 2. Forest + Wildlife: Asian elephants in sunlit sal forest glade
  'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=80', // 3. Forest Safari: Open jeep navigating jungle trail under morning sunbeams
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80', // 4. Nature Experience: Misty forest river valley and green Betla hill ranges
];

// Clean inline SVG Vector Icons matching the Master Visual Language
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
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconUsers = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IconGrid = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const IconList = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

const IconHeart = ({ filled }: { filled: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? '#ef4444' : 'none'} stroke={filled ? '#ef4444' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  </svg>
);

// High-definition Safari Image Mappings matching Reference
const safariImageMap: Record<string, string> = {
  'jeep': 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80',
  'tiger': 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80',
  'elephant': 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80',
  'nature': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  'walk': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  'bird': 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=800&q=80',
  'night': 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80',
  'default': 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
};

const getSafariImage = (name: string, catName?: string): string => {
  const text = (name + ' ' + (catName || '')).toLowerCase();
  if (text.includes('jeep') || text.includes('tiger') || text.includes('wildlife')) return safariImageMap['jeep'];
  if (text.includes('elephant')) return safariImageMap['elephant'];
  if (text.includes('walk') || text.includes('trek') || text.includes('nature')) return safariImageMap['nature'];
  if (text.includes('bird')) return safariImageMap['bird'];
  if (text.includes('night')) return safariImageMap['night'];
  return safariImageMap['default'];
};

const getBadgeForExperience = (index: number, name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('jeep') || lower.includes('tiger') || index === 0) {
    return { label: '🔥 Most Popular', className: 'popular' };
  }
  if (lower.includes('elephant') || index === 1) {
    return { label: '⭐ Unique Experience', className: 'unique' };
  }
  if (lower.includes('walk') || lower.includes('nature') || index === 2) {
    return { label: '🏞️ Scenic Views', className: 'scenic' };
  }
  if (lower.includes('bird') || index === 3) {
    return { label: '🦜 For Bird Lovers', className: 'birds' };
  }
  return { label: '🌲 Guided Tour', className: 'scenic' };
};

const getIconForExperience = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('jeep') || lower.includes('tiger')) return '🚙';
  if (lower.includes('elephant')) return '🐘';
  if (lower.includes('walk') || lower.includes('trail') || lower.includes('nature')) return '🥾';
  if (lower.includes('bird')) return '🔭';
  if (lower.includes('night')) return '🌙';
  return '🐾';
};

export function ExperiencesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedExperience, setSelectedExperience] = useState<ExperienceItem | null>(null);

  // Hero auto-rotating carousel state (4-5s interval)
  const [currentHeroIndex, setCurrentHeroIndex] = useState<number>(0);

  // Filter Bar state
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedPeople, setSelectedPeople] = useState<string>('1');
  const [selectedSafariType, setSelectedSafariType] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % safariHeroImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [currentHeroIndex]);

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

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
    toast.success(favorites[id] ? 'Removed from saved experiences' : 'Saved to wishlist!');
  };

  const handleSearchSafaris = () => {
    if (selectedSafariType !== 'ALL') {
      setSelectedCategory(selectedSafariType);
    }
    const el = document.getElementById('safaris-grid-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    toast.success('Showing available safaris for selected criteria');
  };

  const filtered = experiences.filter((e) => {
    if (selectedCategory !== 'ALL') {
      const match = e.category?.slug === selectedCategory || e.category?.name === selectedCategory || e.name.toLowerCase().includes(selectedCategory.toLowerCase());
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="sample1-layout">
      {/* --- Left Sidebar (1:1 Approved Design) --- */}
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
        {/* Top Header matching reference */}
        <header className="sample1-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#111827', fontWeight: 600 }}>
            <span>🐾 Betla National Park</span>
            <span style={{ color: '#9ca3af' }}>&gt;</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#059669', fontSize: '0.78rem' }}>
              <IconMapPin /> Latehar, Jharkhand
            </span>
          </div>

          <div className="sample1-user-controls">
            <button className="sample1-icon-btn" title="Notifications" onClick={() => navigate('/safety-hub')}>
              <IconBell />
              <span style={{ position: 'absolute', top: 0, right: 0, width: 7, height: 7, background: '#ef4444', borderRadius: '50%' }}></span>
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
          {/* --- Master Safari Hero Banner with 4 Auto-Rotating Crossfade Slides --- */}
          <div className="safari-hero" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* 4 Background Crossfade Slides */}
            {safariHeroImages.map((imgSrc, idx) => (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `linear-gradient(to right, rgba(9, 26, 16, 0.94) 0%, rgba(9, 26, 16, 0.70) 52%, rgba(9, 26, 16, 0.32) 100%), url(${imgSrc})`,
                  backgroundSize: 'cover',
                  backgroundPosition: idx === 0 ? 'center right' : 'center',
                  opacity: currentHeroIndex === idx ? 1 : 0,
                  transition: 'opacity 0.85s ease-in-out',
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />
            ))}

            <div className="safari-hero-content" style={{ position: 'relative', zIndex: 1 }}>
              <div className="safari-hero-tag">SAFARIS & BOOKING</div>
              <h1 className="safari-hero-title">
                Into the Wild <br />
                With <span>a Purpose</span>
              </h1>
              <div className="safari-hero-sub">
                Guided safaris, nature trails and unique forest experiences in the heart of Betla National Park.
              </div>

              {/* 3 Trust / Feature Badges */}
              <div className="safari-hero-badges">
                <div className="safari-hero-badge">
                  <div className="safari-hero-badge-icon"><IconLeaf /></div>
                  <div>
                    <div className="safari-hero-badge-title">Authentic Experiences</div>
                    <div className="safari-hero-badge-sub">Led by experts</div>
                  </div>
                </div>

                <div className="safari-hero-badge">
                  <div className="safari-hero-badge-icon"><IconShield /></div>
                  <div>
                    <div className="safari-hero-badge-title">Safe & Secure</div>
                    <div className="safari-hero-badge-sub">Your safety first</div>
                  </div>
                </div>

                <div className="safari-hero-badge">
                  <div className="safari-hero-badge-icon"><IconUsers /></div>
                  <div>
                    <div className="safari-hero-badge-title">Support Conservation</div>
                    <div className="safari-hero-badge-sub">Tourism for a greener future</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Quote & Clickable Carousel Dots */}
            <div className="safari-hero-right" style={{ position: 'relative', zIndex: 1 }}>
              <div className="safari-hero-quote">
                "The forest is not a place to visit, it is a home to respect."
                <div className="safari-hero-quote-author">— Betla National Park</div>
              </div>
              <div className="safari-hero-dots">
                {safariHeroImages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentHeroIndex(idx)}
                    className={`safari-hero-dot ${currentHeroIndex === idx ? 'active' : ''}`}
                    aria-label={`View slide ${idx + 1}`}
                    title={`View slide ${idx + 1}`}
                    style={{ border: 'none', padding: 0, cursor: 'pointer' }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* --- Horizontal Search & Filter Bar --- */}
          <div className="safari-search-bar">
            {/* Field 1: Select Date */}
            <div className="safari-search-field">
              <div className="safari-search-icon"><IconCalendar /></div>
              <div className="safari-search-input-group">
                <span className="safari-search-label">Select Date</span>
                <input
                  type="date"
                  className="safari-search-input"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>

            {/* Field 2: No. of People */}
            <div className="safari-search-field">
              <div className="safari-search-icon"><IconUsers /></div>
              <div className="safari-search-input-group">
                <span className="safari-search-label">No. of People</span>
                <select
                  className="safari-search-select"
                  value={selectedPeople}
                  onChange={(e) => setSelectedPeople(e.target.value)}
                >
                  <option value="1">1 Person</option>
                  <option value="2">2 People</option>
                  <option value="3-4">3-4 People</option>
                  <option value="5-8">5-8 People (Group)</option>
                  <option value="9+">9+ People (Large Tour)</option>
                </select>
              </div>
            </div>

            {/* Field 3: Safari Type */}
            <div className="safari-search-field">
              <div className="safari-search-icon"><IconCar /></div>
              <div className="safari-search-input-group">
                <span className="safari-search-label">Safari Type</span>
                <select
                  className="safari-search-select"
                  value={selectedSafariType}
                  onChange={(e) => setSelectedSafariType(e.target.value)}
                >
                  <option value="ALL">All Safaris</option>
                  <option value="jeep">Jeep Safari</option>
                  <option value="elephant">Elephant Safari</option>
                  <option value="nature">Nature Walk</option>
                  <option value="bird">Bird Watching</option>
                  <option value="night">Night Safari</option>
                </select>
              </div>
            </div>

            {/* Primary Action Button */}
            <button className="safari-search-btn" onClick={handleSearchSafaris}>
              <IconSearch /> Find Safaris →
            </button>
          </div>

          {/* --- Category Filter Tabs & Header Row --- */}
          <div className="safari-filter-row">
            <div className="safari-pills">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`safari-pill ${selectedCategory === 'ALL' ? 'active' : ''}`}
              >
                All Safaris
              </button>
              <button
                onClick={() => setSelectedCategory('jeep')}
                className={`safari-pill ${selectedCategory === 'jeep' ? 'active' : ''}`}
              >
                Jeep Safari
              </button>
              <button
                onClick={() => setSelectedCategory('elephant')}
                className={`safari-pill ${selectedCategory === 'elephant' ? 'active' : ''}`}
              >
                Elephant Safari
              </button>
              <button
                onClick={() => setSelectedCategory('nature')}
                className={`safari-pill ${selectedCategory === 'nature' ? 'active' : ''}`}
              >
                Nature Walk
              </button>
              <button
                onClick={() => setSelectedCategory('bird')}
                className={`safari-pill ${selectedCategory === 'bird' ? 'active' : ''}`}
              >
                Bird Watching
              </button>
              <button
                onClick={() => setSelectedCategory('night')}
                className={`safari-pill ${selectedCategory === 'night' ? 'active' : ''}`}
              >
                Night Safari
              </button>

              {/* Dynamic Categories from API */}
              {categories.map((cat) => {
                const catKey = cat.slug || cat.name;
                const standardKeys = ['all', 'jeep', 'elephant', 'nature', 'bird', 'night'];
                if (standardKeys.includes(catKey.toLowerCase())) return null;
                const isActive = selectedCategory === catKey;
                return (
                  <button
                    key={cat.id || cat.slug}
                    onClick={() => setSelectedCategory(catKey)}
                    className={`safari-pill ${isActive ? 'active' : ''}`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* Right: View Switcher */}
            <div className="safari-view-toggle">
              <button
                className={`safari-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <IconGrid /> Grid View
              </button>
              <button
                className={`safari-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <IconList /> List View
              </button>
            </div>
          </div>

          {/* Section Heading with Handwritten Doodle */}
          <div className="safari-section-header" id="safaris-grid-section">
            <div>
              <h2 className="safari-section-title">Popular Safaris & Experiences</h2>
              <p className="safari-section-sub">Choose from our curated safari experiences</p>
            </div>
            <div className="safari-doodle-text">
              ✨ Same Forest, A Deeper Experience 🌿
            </div>
          </div>

          {/* --- Experience Cards Grid / List --- */}
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
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', color: '#10b981' }}>
                <IconTrees />
              </div>
              <h3 style={{ color: '#111827', fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
                No Safaris Found for Selected Category
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '14px' }}>
                Try selecting "All Safaris" to explore all available experiences in Betla.
              </p>
              <button className="safari-pill active" onClick={() => setSelectedCategory('ALL')}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'safari-grid' : ''} style={viewMode === 'list' ? { display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' } : {}}>
              {filtered.map((exp, index) => {
                const badge = getBadgeForExperience(index, exp.name);
                const icon = getIconForExperience(exp.name);
                const imgSrc = getSafariImage(exp.name, exp.category?.name);
                const isFavorite = !!favorites[exp.id];

                return (
                  <div key={exp.id} className="safari-card" style={viewMode === 'list' ? { flexDirection: 'row', flexWrap: 'wrap' } : {}}>
                    {/* Card Image Area with Badge & Heart */}
                    <div className="safari-card-img-wrap" style={viewMode === 'list' ? { width: '240px', height: '180px' } : {}}>
                      <img src={imgSrc} alt={exp.name} className="safari-card-img" />
                      <div className={`safari-card-badge ${badge.className}`}>
                        {badge.label}
                      </div>
                      <button
                        className={`safari-card-heart ${isFavorite ? 'liked' : ''}`}
                        onClick={(e) => toggleFavorite(exp.id, e)}
                        title={isFavorite ? 'Remove from wishlist' : 'Save to wishlist'}
                      >
                        <IconHeart filled={isFavorite} />
                      </button>
                    </div>

                    {/* Card Body */}
                    <div className="safari-card-body" style={viewMode === 'list' ? { flex: 1, minWidth: '260px' } : {}}>
                      <div className="safari-card-header">
                        <div className="safari-card-icon">{icon}</div>
                        <h3 className="safari-card-title">{exp.name}</h3>
                      </div>

                      <p className="safari-card-desc">
                        {exp.description || 'Explore deep into the forest with expert guides and certified naturalists.'}
                      </p>

                      {/* Metadata Row */}
                      <div className="safari-card-meta">
                        <div className="safari-card-meta-item">
                          <IconClock /> <span>{exp.duration || '2-3 Hours'}</span>
                        </div>
                        <div className="safari-card-meta-item">
                          <IconUsers /> <span>{exp.name.toLowerCase().includes('jeep') ? '1-6 People' : '1-4 People'}</span>
                        </div>
                      </div>

                      {/* Card Pricing & Booking Action */}
                      <div className="safari-card-footer">
                        <div className="safari-card-price-group">
                          <span className="safari-card-price">
                            ₹{exp.price ? exp.price.toLocaleString('en-IN') : (exp.name.toLowerCase().includes('jeep') ? '2,500' : '1,200')}
                          </span>
                          <span className="safari-card-price-unit">
                            {exp.name.toLowerCase().includes('jeep') ? 'per vehicle' : 'per person'}
                          </span>
                        </div>

                        <button
                          className="safari-card-btn"
                          onClick={() => setSelectedExperience(exp)}
                        >
                          Book Now →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* --- Bottom Trust & Conservation Banner (1:1 from Reference) --- */}
          <div className="safari-trust-banner">
            <div className="safari-trust-items">
              <div className="safari-trust-item">
                <div className="safari-trust-icon-box"><IconLeaf /></div>
                <div>
                  <div className="safari-trust-title">Trusted by Thousands</div>
                  <div className="safari-trust-sub">Memorable & safe experiences</div>
                </div>
              </div>

              <div className="safari-trust-item">
                <div className="safari-trust-icon-box"><IconTrees /></div>
                <div>
                  <div className="safari-trust-title">Support Local Communities</div>
                  <div className="safari-trust-sub">Responsible tourism</div>
                </div>
              </div>

              <div className="safari-trust-item">
                <div className="safari-trust-icon-box"><IconShield /></div>
                <div>
                  <div className="safari-trust-title">Contribute to Conservation</div>
                  <div className="safari-trust-sub">Every visit makes a difference</div>
                </div>
              </div>
            </div>

            <div className="safari-trust-tagline">
              Explore Today, Preserve Tomorrow 🌿
            </div>
          </div>

          {/* Modal Detail & Booking Reservation Dialog */}
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
              onClick={() => setSelectedExperience(null)}
            >
              <div
                style={{
                  background: '#ffffff',
                  maxWidth: '520px',
                  width: '100%',
                  borderRadius: '16px',
                  padding: '26px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  border: '1px solid #e5e7eb',
                  position: 'relative'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{
                    background: '#e6f4ea',
                    color: '#15803d',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}>
                    {selectedExperience.category?.name || 'Safari Experience'}
                  </span>
                  <button
                    onClick={() => setSelectedExperience(null)}
                    style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', color: '#6b7280', cursor: 'pointer', padding: '4px' }}
                    title="Close"
                  >
                    ✕
                  </button>
                </div>

                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827', margin: '0 0 6px 0', fontFamily: 'var(--font-heading, sans-serif)' }}>
                  {selectedExperience.name}
                </h2>

                {selectedExperience.destination && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#15803d', fontSize: '0.82rem', fontWeight: 600, marginBottom: '14px' }}>
                    <IconMapPin /> Location: {selectedExperience.destination.name}
                  </div>
                )}

                <p style={{ color: '#4b5563', lineHeight: 1.6, fontSize: '0.86rem', margin: '0 0 18px 0' }}>
                  {selectedExperience.description || 'Experience the pristine biodiversity of Betla National Park with certified forest guides, naturalists, and authorized eco-vehicles.'}
                </p>

                <div style={{ background: '#f9fafb', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e5e7eb', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                    <span style={{ color: '#6b7280' }}>Duration:</span>
                    <strong style={{ color: '#111827' }}>{selectedExperience.duration || '2 - 3 Hours'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                    <span style={{ color: '#6b7280' }}>Selected Guests:</span>
                    <strong style={{ color: '#111827' }}>{selectedPeople} Person(s)</strong>
                  </div>
                  {selectedDate && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                      <span style={{ color: '#6b7280' }}>Date of Safari:</span>
                      <strong style={{ color: '#111827' }}>{selectedDate}</strong>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', borderTop: '1px solid #e5e7eb', paddingTop: '8px', marginTop: '4px' }}>
                    <span style={{ color: '#374151', fontWeight: 600 }}>Total Permit & Vehicle Fee:</span>
                    <strong style={{ color: '#059669', fontSize: '1.05rem', fontWeight: 800 }}>
                      ₹{selectedExperience.price ? selectedExperience.price.toLocaleString('en-IN') : '2,500'}
                    </strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => {
                      toast.success(`Booking request confirmed for ${selectedExperience.name}! Check your email.`);
                      setSelectedExperience(null);
                    }}
                    className="safari-search-btn"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    Confirm & Reserve Ticket →
                  </button>
                  <button
                    onClick={() => setSelectedExperience(null)}
                    className="sample1-btn-secondary"
                    style={{ borderRadius: '8px' }}
                  >
                    Cancel
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
