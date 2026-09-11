import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import staysHeroAsset from '../assets/stays_hero.jpg';

// Inline clean SVG Icons matching the master Betla Eco-Companion design system
const IconLeaf = ({ className }: { className?: string }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);

const IconHome = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const IconCompass = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
);

const IconCar = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="8" rx="2"/>
    <path d="M7 11V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4"/>
    <circle cx="7.5" cy="15.5" r="1.5"/>
    <circle cx="16.5" cy="15.5" r="1.5"/>
  </svg>
);

const IconMapPin = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconBed = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4v16"/>
    <path d="M2 8h18a2 2 0 0 1 2 2v10"/>
    <path d="M2 17h20"/>
    <path d="M6 8v9"/>
  </svg>
);

const IconShield = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const IconTrees = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 10v.2A3 3 0 0 1 8.9 16v0H5v0a3 3 0 0 1-1.1-5.8V10a3 3 0 0 1 6 0Z"/>
    <path d="M7 16v6"/>
    <path d="M13 19v3"/>
    <path d="M12 19h8.3a3 3 0 0 0 1.7-5.5 3 3 0 0 0-4-4.4 3 3 0 0 0-5.3 2.1 3 3 0 0 0-.7 2.3 3 3 0 0 0 0 5.5Z"/>
  </svg>
);

const IconChart = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10"/>
    <line x1="18" y1="20" x2="18" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="16"/>
  </svg>
);

const IconBell = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const IconSearch = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IconChevronDown = ({ className }: { className?: string }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const IconGrid = ({ className }: { className?: string }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const IconList = ({ className }: { className?: string }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

const IconUsers = ({ className }: { className?: string }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconCalendar = ({ className }: { className?: string }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const IconPaw = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="2"/>
    <circle cx="6.5" cy="8.5" r="1.8"/>
    <circle cx="17.5" cy="8.5" r="1.8"/>
    <circle cx="4.5" cy="14" r="1.5"/>
    <circle cx="19.5" cy="14" r="1.5"/>
    <path d="M12 11c-3 0-5.5 2-5.5 5 0 2 1.5 4 5.5 4s5.5-2 5.5-4c0-3-2.5-5-5-5z"/>
  </svg>
);

const IconStar = ({ className }: { className?: string }) => (
  <svg className={className} width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const IconPhone = ({ className }: { className?: string }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

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

interface StayItem {
  id: string;
  name: string;
  category: string;
  badge: string;
  badgeType: 'popular' | 'eco' | 'family' | 'budget' | 'luxury';
  image: string;
  icon: 'house' | 'camp' | 'resort' | 'guesthouse' | 'bed';
  description: string;
  location: string;
  capacity: string;
  pricePerNight: number;
  rating: number;
  amenities: string[];
  verified: boolean;
  contactPhone?: string;
  roomTypes?: string[];
}

const DEFAULT_STAYS: StayItem[] = [
  {
    id: 'betla-forest-rest-house',
    name: 'Betla Forest Rest House',
    category: 'Forest Rest House',
    badge: '🔥 Most Popular',
    badgeType: 'popular',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=700&q=80',
    icon: 'house',
    description: 'Govt. forest rest house inside the park area surrounded by ancient sal forests and wildlife viewing lawns.',
    location: 'Near Main Gate',
    capacity: '2-4 Guests',
    pricePerNight: 2500,
    rating: 4.8,
    amenities: ['Forest View Deck', 'Solar Power', 'Authentic Dining', 'Guide Assistance'],
    verified: true,
    roomTypes: ['Standard Suite', 'Deluxe Timber Cottage'],
  },
  {
    id: 'jungle-camp',
    name: 'Jungle Camp',
    category: 'Camps & Tents',
    badge: '🍃 Eco Friendly',
    badgeType: 'eco',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=700&q=80',
    icon: 'camp',
    description: 'Eco-friendly tent stay with nature experience, stargazing, and evening campfires on the edge of the forest.',
    location: 'Near Safari Zone',
    capacity: '2-5 Guests',
    pricePerNight: 1800,
    rating: 4.7,
    amenities: ['Safari Tents', 'Campfire Circle', 'Solar Lanterns', 'Night Safari Support'],
    verified: true,
    roomTypes: ['Luxury Safari Tent', 'Family Canopy Tent'],
  },
  {
    id: 'betla-nature-resort',
    name: 'Betla Nature Resort',
    category: 'Eco Resort',
    badge: '👥 Best for Families',
    badgeType: 'family',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=700&q=80',
    icon: 'resort',
    description: 'Comfortable cottages with modern amenities, organic dining, and direct safari booking desk.',
    location: 'Lodhwah Road',
    capacity: '2-5 Guests',
    pricePerNight: 3500,
    rating: 4.9,
    amenities: ['Swimming Pool', 'Multi-Cuisine Restaurant', 'Free Wi-Fi', 'Nature Walk Trails'],
    verified: true,
    roomTypes: ['Family Eco Cottage', 'Executive Forest Villa'],
  },
  {
    id: 'forest-guest-house',
    name: 'Forest Guest House',
    category: 'Guest House',
    badge: '🏷️ Budget Friendly',
    badgeType: 'budget',
    image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=700&q=80',
    icon: 'guesthouse',
    description: 'Clean and comfortable stay near the park with secure parking and welcoming tribal hospitality.',
    location: 'Latehar Town',
    capacity: '1-4 Guests',
    pricePerNight: 1200,
    rating: 4.6,
    amenities: ['Hot Water', 'Home-cooked Meals', 'Free Parking', 'Travel Desk'],
    verified: true,
    roomTypes: ['Standard Double Room', 'Family Quad Room'],
  },
  {
    id: 'h1',
    name: 'Betla Canopy Eco Lodge',
    category: 'Homestay',
    badge: '🏡 Verified Homestay',
    badgeType: 'eco',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=700&q=80',
    icon: 'house',
    description: 'Authentic mud-brick eco cottages surrounded by teak and bamboo groves right on the reserve periphery.',
    location: 'Near Main Gate',
    capacity: '2-4 Guests',
    pricePerNight: 1800,
    rating: 4.8,
    amenities: ['Organic Meals', 'Solar Power', 'Guided Night Walks', 'Free Wi-Fi'],
    verified: true,
    roomTypes: ['Bamboo Mud Cottage', 'Teakwood Suite'],
  },
  {
    id: 'h2',
    name: 'Koel Riverview Homestay',
    category: 'Homestay',
    badge: '🌊 River View',
    badgeType: 'eco',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=700&q=80',
    icon: 'house',
    description: 'Peaceful stay overlooking the North Koel & Auranga river confluence with traditional Jharkhand cuisine.',
    location: 'Kechki Confluence',
    capacity: '2-4 Guests',
    pricePerNight: 1500,
    rating: 4.7,
    amenities: ['Riverview Balcony', 'Tribal Dinner', 'Bicycle Rental', 'Parking'],
    verified: true,
    roomTypes: ['Confluence View Room', 'Rustic River Cabin'],
  },
  {
    id: 'h3',
    name: 'Kechki Forest Residency',
    category: 'Budget Stay',
    badge: '🌲 Forest Heritage',
    badgeType: 'popular',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=700&q=80',
    icon: 'house',
    description: 'Historic wooden bungalow atmosphere featuring wildlife viewing decks and campfire story sessions.',
    location: 'Kechki Reserve Zone',
    capacity: '2-5 Guests',
    pricePerNight: 2200,
    rating: 4.9,
    amenities: ['Forest View Deck', '24/7 Security', 'Fireplace', 'Guide Desk'],
    verified: true,
    roomTypes: ['Heritage Bungalow Suite', 'Pine Wood Room'],
  },
];

const DEMO_GUIDES: EcoGuide[] = [
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

const STAY_CATEGORIES = [
  'All Stays',
  'Forest Rest House',
  'Eco Resort',
  'Guest House',
  'Budget Stay',
  'Luxury Stay',
  'Camps & Tents',
  'Homestay',
  'Dormitory',
  'Eco-Guides',
];

const HERO_QUOTES = [
  {
    quote: '"A good stay in nature refreshes not just the body, but also the soul."',
    author: 'Betla Eco-Companion',
  },
  {
    quote: '"Sleep under the star-lit canopy, wake up to the morning symphony of the wild."',
    author: 'Palamau Forest Echoes',
  },
  {
    quote: '"Every homestay visit directly empowers indigenous tribal conservation guardians."',
    author: 'Jharkhand Forest Tourism',
  },
  {
    quote: '"Quiet forest retreats that bring you closer to peaceful wilderness."',
    author: 'Betla Sanctuary Voice',
  },
];

export function GuidesStaysPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedCategory, setSelectedCategory] = useState('All Stays');
  const [selectedGuests, setSelectedGuests] = useState('No. of Guests');
  const [dateRange, setDateRange] = useState('');

  // View switch: Grid vs List
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Favorites state
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Modal Detail State
  const [selectedStay, setSelectedStay] = useState<StayItem | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<EcoGuide | null>(null);

  // Hero carousel state
  const [heroQuoteIndex, setHeroQuoteIndex] = useState(0);

  // Auto rotate hero quote
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroQuoteIndex((prev) => (prev + 1) % HERO_QUOTES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isGuideTab = selectedCategory === 'Eco-Guides';

  // Filter Stays
  const filteredStays = DEFAULT_STAYS.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);

    const matchesCategory =
      selectedCategory === 'All Stays' ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesLocation =
      selectedLocation === 'All Locations' ||
      item.location.toLowerCase().includes(selectedLocation.toLowerCase());

    const matchesGuests =
      selectedGuests === 'No. of Guests' ||
      item.capacity.includes(selectedGuests.replace(' Guests', ''));

    return matchesSearch && matchesCategory && matchesLocation && matchesGuests;
  });

  // Filter Guides
  const filteredGuides = DEMO_GUIDES.filter((guide) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      guide.name.toLowerCase().includes(q) ||
      guide.badge.toLowerCase().includes(q) ||
      guide.languages.some((l) => l.toLowerCase().includes(q)) ||
      guide.specialties.some((s) => s.toLowerCase().includes(q))
    );
  });

  const renderStayIcon = (iconType: string) => {
    switch (iconType) {
      case 'camp':
        return <IconCompass />;
      case 'resort':
      case 'guesthouse':
      case 'bed':
      case 'house':
      default:
        return <IconHome />;
    }
  };

  return (
    <div className="sample1-layout">
      {/* =========================================================
          1. SIDEBAR (MASTER APPROVED BETLA THEME)
          ========================================================= */}
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
              <IconChart /> <span>Reports & Analytics</span>
            </Link>
          </nav>
        </div>

        <div className="sample1-sidebar-footer">
          <div className="sample1-sidebar-graphic">
            <div style={{ fontWeight: 600, color: '#e5e7eb', marginBottom: '2px', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>
              For Wildlife
            </div>
            <div style={{ fontSize: '0.75rem', color: '#79a890', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>
              For Future 🌿
            </div>
          </div>
        </div>
      </aside>

      {/* =========================================================
          2. MAIN WRAPPER & HEADER
          ========================================================= */}
      <div className="sample1-main-wrapper">
        <header className="sample1-header">
          {/* Location Context Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#0f3e28', fontWeight: 600 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#15803d' }}>
              <IconPaw /> Betla National Park &gt;
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#4b5563', fontWeight: 500 }}>
              <IconMapPin /> Latehar, Jharkhand
            </span>
          </div>

          {/* User Profile / Notifications */}
          <div className="sample1-user-controls">
            <button
              className="sample1-icon-btn"
              title="Notifications"
              onClick={() => navigate('/safety-hub')}
              style={{ position: 'relative' }}
            >
              <IconBell />
              <span
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  border: '1px solid #ffffff'
                }}
              />
            </button>

            {user ? (
              <div className="sample1-user-pill" onClick={() => navigate('/profile')} title="My Profile">
                <div className="sample1-avatar">
                  {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="sample1-user-info">
                  <span className="sample1-user-name">{user.firstName} {user.lastName}</span>
                  <span className="sample1-user-role">{user.role?.name || 'TOURIST'}</span>
                </div>
                <IconChevronDown />
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link
                  to="/login"
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#15803d',
                    padding: '5px 14px',
                    borderRadius: '20px',
                    border: '1px solid #15803d',
                    textDecoration: 'none'
                  }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    background: '#10b981',
                    padding: '5px 14px',
                    borderRadius: '20px',
                    textDecoration: 'none'
                  }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* =========================================================
            3. PAGE CONTENT CONTAINER
            ========================================================= */}
        <div className="sample1-container">

          {/* --- HERO SECTION (1:1 MATCH WITH REFERENCE) --- */}
          <div
            className="stays-hero"
            style={{ backgroundImage: `url(${staysHeroAsset})` }}
          >
            <div className="stays-hero-overlay">
              <div className="stays-hero-header-row">
                {/* Left zone */}
                <div>
                  <div className="stays-hero-tag">
                    <IconBed /> STAY &amp; FACILITIES
                  </div>
                  <h1 className="stays-hero-title">
                    Rest Closer<br />
                    <span className="stays-hero-title-accent">to Nature</span>
                  </h1>
                  <p className="stays-hero-desc">
                    Comfortable stays, essential facilities and authentic forest experiences near Betla National Park.
                  </p>
                </div>

                {/* Right zone: Quote & Carousel Controls */}
                <div className="stays-hero-quote-wrap">
                  <div className="stays-hero-quote">
                    <p>{HERO_QUOTES[heroQuoteIndex].quote}</p>
                    <span>— {HERO_QUOTES[heroQuoteIndex].author}</span>
                  </div>

                  <div className="stays-hero-carousel-controls">
                    <div className="stays-hero-dots">
                      {HERO_QUOTES.map((_, idx) => (
                        <span
                          key={idx}
                          className={`stays-hero-dot ${idx === heroQuoteIndex ? 'active' : ''}`}
                          onClick={() => setHeroQuoteIndex(idx)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Feature Badges */}
              <div className="stays-hero-badges-row">
                <div className="stays-hero-feature-card">
                  <div className="stays-hero-feature-icon">
                    <IconBed />
                  </div>
                  <div>
                    <div className="stays-hero-feature-title">Comfortable &amp; Safe</div>
                    <div className="stays-hero-feature-sub">Verified stays</div>
                  </div>
                </div>

                <div className="stays-hero-feature-card">
                  <div className="stays-hero-feature-icon">
                    <IconMapPin />
                  </div>
                  <div>
                    <div className="stays-hero-feature-title">Near Key Attractions</div>
                    <div className="stays-hero-feature-sub">Close to safari zones</div>
                  </div>
                </div>

                <div className="stays-hero-feature-card">
                  <div className="stays-hero-feature-icon">
                    <IconLeaf />
                  </div>
                  <div>
                    <div className="stays-hero-feature-title">Support Local</div>
                    <div className="stays-hero-feature-sub">Community-based tourism</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- SEARCH + STAY FILTER BAR --- */}
          <div className="stays-search-bar">
            {/* Text Search Input */}
            <div className="stays-search-input-wrap">
              <IconSearch />
              <input
                type="text"
                placeholder="Search stays, resorts, guest houses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="stays-search-input"
              />
            </div>

            {/* Location Select */}
            <div className="stays-select-wrap">
              <IconMapPin className="stays-select-prefix" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="stays-select"
              >
                <option value="All Locations">All Locations</option>
                <option value="Main Gate">Near Main Gate</option>
                <option value="Safari Zone">Near Safari Zone</option>
                <option value="Lodhwah">Lodhwah Road</option>
                <option value="Latehar">Latehar Town</option>
                <option value="Kechki">Kechki Confluence</option>
              </select>
              <IconChevronDown className="stays-select-chevron" />
            </div>

            {/* Stay Type Select */}
            <div className="stays-select-wrap">
              <IconHome className="stays-select-prefix" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="stays-select"
              >
                <option value="All Stays">All Stay Types</option>
                <option value="Forest Rest House">Forest Rest House</option>
                <option value="Eco Resort">Eco Resort</option>
                <option value="Guest House">Guest House</option>
                <option value="Budget Stay">Budget Stay</option>
                <option value="Luxury Stay">Luxury Stay</option>
                <option value="Camps & Tents">Camps &amp; Tents</option>
                <option value="Homestay">Homestay</option>
                <option value="Dormitory">Dormitory</option>
                <option value="Eco-Guides">Certified Eco-Guides</option>
              </select>
              <IconChevronDown className="stays-select-chevron" />
            </div>

            {/* Guests Select */}
            <div className="stays-select-wrap">
              <IconUsers className="stays-select-prefix" />
              <select
                value={selectedGuests}
                onChange={(e) => setSelectedGuests(e.target.value)}
                className="stays-select"
              >
                <option value="No. of Guests">No. of Guests</option>
                <option value="1-2 Guests">1-2 Guests</option>
                <option value="2-4 Guests">2-4 Guests</option>
                <option value="2-5 Guests">2-5 Guests</option>
              </select>
              <IconChevronDown className="stays-select-chevron" />
            </div>

            {/* Date Input */}
            <div className="stays-date-input-wrap">
              <IconCalendar />
              <input
                type="text"
                placeholder="Check-in → Check-out"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="stays-date-input"
              />
            </div>

            {/* Search Button */}
            <button
              onClick={() => toast.success('Filtering stays for selected criteria...')}
              className="stays-search-btn"
            >
              <IconSearch /> Search
            </button>
          </div>

          {/* --- STAY CATEGORY PILLS ROW --- */}
          <div className="stays-categories-row">
            {STAY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`stays-cat-pill ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* --- SECTION HEADER & VIEW CONTROLS --- */}
          <div className="places-section-header">
            <div>
              <h2 className="places-section-title">
                {isGuideTab ? 'Certified Forest Eco-Guides' : 'Popular Stays & Facilities'}
              </h2>
              <p className="places-section-sub">
                {isGuideTab
                  ? 'Connect with verified indigenous trackers and cultural guides'
                  : 'Find the perfect stay for your Betla experience'}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Decorative Tagline */}
              <div
                style={{
                  color: '#15803d',
                  fontFamily: 'Georgia, cursive, serif',
                  fontStyle: 'italic',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>🌿</span> Stay Responsible, Travel Better
              </div>

              {/* Grid / List View Toggle */}
              <div className="places-view-toggle">
                <button
                  className={`places-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <IconGrid /> Grid View
                </button>
                <button
                  className={`places-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  <IconList /> List View
                </button>
              </div>
            </div>
          </div>

          {/* --- MAIN ACCOMMODATION CARDS VIEW --- */}
          {!isGuideTab ? (
            filteredStays.length === 0 ? (
              <div
                style={{
                  background: '#ffffff',
                  border: '1px dashed #d1d5db',
                  borderRadius: '12px',
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: '#6b7280',
                  margin: '20px 0',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏡</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>
                  No matching stays found
                </h3>
                <p style={{ fontSize: '0.85rem', margin: '0 0 16px' }}>
                  Try adjusting your search query, location, or stay type filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedLocation('All Locations');
                    setSelectedCategory('All Stays');
                    setSelectedGuests('No. of Guests');
                    setDateRange('');
                  }}
                  className="stays-card-action-btn"
                  style={{ display: 'inline-flex' }}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'stays-cards-grid' : 'stays-cards-list'}>
                {filteredStays.map((stay) => {
                  const isFav = !!favorites[stay.id];
                  return (
                    <div
                      key={stay.id}
                      className="stays-card"
                      onClick={() => setSelectedStay(stay)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Card Image Wrap */}
                      <div className="stays-card-img-wrap">
                        <img
                          src={stay.image}
                          alt={stay.name}
                          className="stays-card-img"
                          loading="lazy"
                        />
                        {/* Top-left Badge */}
                        <span className="stays-card-badge">
                          {stay.badge}
                        </span>
                        {/* Top-right Favorite Button */}
                        <button
                          className={`stays-card-fav ${isFav ? 'active' : ''}`}
                          onClick={(e) => toggleFavorite(stay.id, e)}
                          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          {isFav ? '❤️' : '🤍'}
                        </button>
                      </div>

                      {/* Card Body */}
                      <div className="stays-card-body">
                        <div>
                          <div className="stays-card-head">
                            <div className="stays-card-icon">
                              {renderStayIcon(stay.icon)}
                            </div>
                            <div>
                              <h3 className="stays-card-title">{stay.name}</h3>
                              <p className="stays-card-desc">{stay.description}</p>
                            </div>
                          </div>

                          {/* Metadata row */}
                          <div className="stays-card-meta-row">
                            <div className="stays-card-meta-item">
                              <IconMapPin /> {stay.location}
                            </div>
                            <div className="stays-card-meta-item">
                              <IconUsers /> {stay.capacity}
                            </div>
                          </div>
                        </div>

                        {/* Footer Price & Action */}
                        <div className="stays-card-footer">
                          <div className="stays-card-price-wrap">
                            <span className="stays-card-price-val">
                              ₹{stay.pricePerNight.toLocaleString()}
                            </span>
                            <span className="stays-card-price-unit">per night</span>
                          </div>
                          <button
                            className="stays-card-action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStay(stay);
                            }}
                          >
                            View Details &rarr;
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* --- ECO-GUIDES VIEW (PRESERVING 100% OF EXISTING GUIDES DATA) --- */
            <div className={viewMode === 'grid' ? 'stays-cards-grid' : 'stays-cards-list'}>
              {filteredGuides.map((guide) => (
                <div
                  key={guide.id}
                  className="stays-card"
                  onClick={() => setSelectedGuide(guide)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="stays-card-body" style={{ padding: '18px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#e6f4ea',
                            color: '#15803d',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '12px'
                          }}>
                            {guide.badge}
                          </span>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', margin: '8px 0 2px' }}>
                            {guide.name}
                          </h3>
                        </div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#b45309', fontWeight: 700, fontSize: '0.82rem' }}>
                          <IconStar /> {guide.rating}
                        </span>
                      </div>

                      <div style={{
                        fontSize: '0.78rem',
                        color: '#4b5563',
                        background: '#f9fafb',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1px solid #f3f4f6',
                        marginBottom: '12px'
                      }}>
                        <div style={{ marginBottom: '4px' }}>
                          <strong>Experience:</strong> {guide.experienceYears} Years in Palamau
                        </div>
                        <div>
                          <strong>Languages:</strong> {guide.languages.join(', ')}
                        </div>
                      </div>

                      <div style={{ marginBottom: '14px' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6b7280', marginBottom: '4px' }}>
                          Specialties:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {guide.specialties.map((spec) => (
                            <span
                              key={spec}
                              style={{
                                fontSize: '0.68rem',
                                padding: '2px 7px',
                                background: '#f0fdf4',
                                color: '#15803d',
                                borderRadius: '6px',
                                border: '1px solid #dcfce7',
                                fontWeight: 500
                              }}
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success(`Booking request sent to ${guide.name}! Phone: ${guide.contactPhone}`);
                      }}
                      className="stays-card-action-btn"
                      style={{ width: '100%', marginTop: '8px' }}
                    >
                      <IconPhone /> Request Guide Booking
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* --- SUSTAINABILITY & TRUST STRIP (1:1 MATCH WITH REFERENCE) --- */}
          <div className="stays-trust-strip">
            <div className="stays-trust-item">
              <div className="stays-trust-icon">
                <IconLeaf />
              </div>
              <div>
                <div className="stays-trust-title">Choose Eco-Friendly</div>
                <div className="stays-trust-desc">Support sustainable tourism</div>
              </div>
            </div>

            <div className="stays-trust-item">
              <div className="stays-trust-icon">
                <IconUsers />
              </div>
              <div>
                <div className="stays-trust-title">Empower Local Communities</div>
                <div className="stays-trust-desc">Your stay helps local livelihoods</div>
              </div>
            </div>

            <div className="stays-trust-item">
              <div className="stays-trust-icon">
                <IconShield />
              </div>
              <div>
                <div className="stays-trust-title">Travel Responsibly</div>
                <div className="stays-trust-desc">Keep Betla clean and green</div>
              </div>
            </div>

            <div className="stays-trust-artwork">
              <IconTrees /> Explore Today, Preserve Tomorrow 🌿
            </div>
          </div>
        </div>

        {/* --- FOOTER --- */}
        <footer className="sample1-footer">
          <div>Betla Eco-Companion | Department of Forest, Jharkhand</div>
          <div style={{ color: '#15803d', fontWeight: 600 }}>Explore • Protect • Preserve</div>
        </footer>
      </div>

      {/* =========================================================
          4. ACCOMMODATION DETAIL MODAL
          ========================================================= */}
      {selectedStay && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(7, 26, 17, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setSelectedStay(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              border: '1px solid #e5e7eb',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image */}
            <div style={{ position: 'relative', width: '100%', height: '220px', background: '#e5e7eb' }}>
              <img
                src={selectedStay.image}
                alt={selectedStay.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: '14px',
                  left: '14px',
                  background: 'rgba(255,255,255,0.92)',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#111827',
                }}
              >
                {selectedStay.badge}
              </span>
              <button
                onClick={() => setSelectedStay(null)}
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.5)',
                  color: '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 700,
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '20px 24px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                  {selectedStay.name}
                </h2>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803d' }}>
                  ₹{selectedStay.pricePerNight.toLocaleString()}
                  <span style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 500 }}> / night</span>
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280', fontSize: '0.8rem', marginBottom: '12px' }}>
                <IconMapPin /> {selectedStay.location} &bull; Capacity: {selectedStay.capacity}
              </div>

              <p style={{ color: '#374151', fontSize: '0.85rem', lineHeight: 1.5, margin: '0 0 16px' }}>
                {selectedStay.description}
              </p>

              {/* Amenities */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
                  Available Amenities &amp; Eco Facilities
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedStay.amenities.map((am) => (
                    <span
                      key={am}
                      style={{
                        fontSize: '0.75rem',
                        padding: '4px 10px',
                        background: '#f0fdf4',
                        color: '#15803d',
                        borderRadius: '6px',
                        border: '1px solid #dcfce7',
                        fontWeight: 600,
                      }}
                    >
                      ✓ {am}
                    </span>
                  ))}
                </div>
              </div>

              {/* Room Types */}
              {selectedStay.roomTypes && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
                    Available Accommodation Types
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selectedStay.roomTypes.map((rt) => (
                      <span
                        key={rt}
                        style={{
                          fontSize: '0.75rem',
                          padding: '4px 10px',
                          background: '#f9fafb',
                          color: '#374151',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb',
                          fontWeight: 500,
                        }}
                      >
                        🛏️ {rt}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                <button
                  onClick={() => {
                    toast.success(`Booking inquiry submitted for ${selectedStay.name}!`);
                    setSelectedStay(null);
                  }}
                  className="stays-card-action-btn"
                  style={{ flex: 1, padding: '10px 16px' }}
                >
                  Book This Stay Now
                </button>
                <button
                  onClick={() => {
                    setSelectedStay(null);
                    navigate('/experiences');
                  }}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    background: '#ffffff',
                    color: '#374151',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <IconCar /> Book Associated Safari
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guide Detail Modal */}
      {selectedGuide && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(7, 26, 17, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setSelectedGuide(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              border: '1px solid #e5e7eb',
              padding: '24px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 700, background: '#f0fdf4', padding: '3px 8px', borderRadius: '12px' }}>
                  {selectedGuide.badge}
                </span>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', margin: '6px 0 2px' }}>
                  {selectedGuide.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedGuide(null)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#f3f4f6',
                  color: '#4b5563',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.5, marginBottom: '16px' }}>
              Certified indigenous forest tracker with {selectedGuide.experienceYears} years of experience in the core and buffer zones of Betla National Park.
            </p>

            <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '16px', fontSize: '0.8rem' }}>
              <div style={{ marginBottom: '6px' }}><strong>Languages Spoken:</strong> {selectedGuide.languages.join(', ')}</div>
              <div><strong>Specializations:</strong> {selectedGuide.specialties.join(', ')}</div>
            </div>

            <button
              onClick={() => {
                toast.success(`Booking request sent to ${selectedGuide.name}! Phone: ${selectedGuide.contactPhone}`);
                setSelectedGuide(null);
              }}
              className="stays-card-action-btn"
              style={{ width: '100%', padding: '10px 16px' }}
            >
              <IconPhone /> Connect &amp; Confirm Booking ({selectedGuide.contactPhone})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GuidesStaysPage;
