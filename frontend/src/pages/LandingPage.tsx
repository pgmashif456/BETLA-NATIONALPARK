import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { contentApi } from '../api/client';
import heroImgAsset from '../assets/places_hero.jpg';

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

const IconClock = ({ className }: { className?: string }) => (
  <svg className={className} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconActivity = ({ className }: { className?: string }) => (
  <svg className={className} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

const IconUsers = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconLandmark = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="22" x2="21" y2="22"/>
    <line x1="6" y1="18" x2="6" y2="11"/>
    <line x1="10" y1="18" x2="10" y2="11"/>
    <line x1="14" y1="18" x2="14" y2="11"/>
    <line x1="18" y1="18" x2="18" y2="11"/>
    <polygon points="12 2 20 7 4 7"/>
  </svg>
);

const IconMountain = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m8 3 4 8 5-5 5 15H2L8 3z"/>
  </svg>
);

const IconWater = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
  </svg>
);

const IconBinoculars = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 10h4"/>
    <path d="M19 7V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3"/>
    <path d="M7 7V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v3"/>
    <rect x="2" y="7" width="8" height="14" rx="2"/>
    <rect x="14" y="7" width="8" height="14" rx="2"/>
  </svg>
);

const IconCastle = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 20v-9H2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z"/>
    <path d="M18 11V4H6v7"/>
    <path d="M15 4v4"/>
    <path d="M9 4v4"/>
    <path d="M10 20v-4a2 2 0 0 1 4 0v4"/>
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

interface DestinationItem {
  id: string;
  name: string;
  category: string;
  badge: string;
  badgeType: 'popular' | 'scenic' | 'historical' | 'nature' | 'wildlife';
  image: string;
  icon: 'water' | 'binoculars' | 'castle' | 'trees' | 'mountain';
  description: string;
  location: string;
  distanceKm: number;
  duration: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  timings?: string;
  highlights?: string[];
  bestSeason?: string;
}

const DEFAULT_DESTINATIONS: DestinationItem[] = [
  {
    id: 'lodh-falls',
    name: 'Lodh Falls',
    category: 'Waterfalls',
    badge: '🔥 Most Popular',
    badgeType: 'popular',
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=700&q=80',
    icon: 'water',
    description: 'Stunning waterfall surrounded by dense forests, the highest waterfall in Jharkhand plunging from 468 feet.',
    location: 'Latehar, Jharkhand',
    distanceKm: 65,
    duration: '2-3 Hours',
    difficulty: 'Moderate',
    timings: '06:00 AM - 05:30 PM',
    highlights: ['Highest waterfall in Jharkhand (143m)', 'Scenic sal & teak forest gorge', 'Trekking trail to base pool'],
    bestSeason: 'October to March'
  },
  {
    id: 'netarhat-viewpoint',
    name: 'Netarhat Viewpoint',
    category: 'Viewpoints',
    badge: '🏞️ Scenic View',
    badgeType: 'scenic',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80',
    icon: 'binoculars',
    description: 'Panoramic views of forest and hills from the Queen of Chotanagpur, renowned for sunrise and sunset panoramas.',
    location: 'Netarhat Hills',
    distanceKm: 72,
    duration: '1-2 Hours',
    difficulty: 'Easy',
    timings: '05:30 AM - 06:30 PM',
    highlights: ['Magnolia Sunset Point', 'Dense pine and eucalyptus forest', 'Cool plateau climate all year'],
    bestSeason: 'September to April'
  },
  {
    id: 'palamau-fort',
    name: 'Palamau Fort',
    category: 'Historical Sites',
    badge: '🏛️ Historical',
    badgeType: 'historical',
    image: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=700&q=80',
    icon: 'castle',
    description: 'Historic fort with rich cultural heritage built by the Chero Dynasty deep in the wilderness of Auranga River.',
    location: 'Palamau Fort Zone',
    distanceKm: 25,
    duration: '1-2 Hours',
    difficulty: 'Easy',
    timings: '07:00 AM - 05:00 PM',
    highlights: ['Twin ancient forts (Purana Qila & Naya Qila)', 'Intricate Islamic-tribal stonework', 'Overlooks Auranga River'],
    bestSeason: 'October to March'
  },
  {
    id: 'upper-ghaghri-lake',
    name: 'Upper Ghaghri Lake',
    category: 'Lakes',
    badge: '🌲 Nature Trail',
    badgeType: 'nature',
    image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=700&q=80',
    icon: 'trees',
    description: 'Serene lake with wildlife sightings surrounded by dense woods, ideal for calm nature walks and birding.',
    location: 'Netarhat Hills',
    distanceKm: 30,
    duration: '2-3 Hours',
    difficulty: 'Easy',
    timings: '06:00 AM - 06:00 PM',
    highlights: ['Tranquil waters amidst pine forest', 'Rich migratory bird habitat', 'Gentle forested picnic spots'],
    bestSeason: 'October to April'
  },
  {
    id: 'betla-watchtower',
    name: 'Betla Core Watchtower',
    category: 'Wildlife Zones',
    badge: '🐾 Wildlife Zone',
    badgeType: 'wildlife',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=700&q=80',
    icon: 'binoculars',
    description: 'Central forest waterhole watchtower offering high-probability sightings of wild elephants, gaurs, and deer.',
    location: 'Betla Core Area',
    distanceKm: 4,
    duration: '1-2 Hours',
    difficulty: 'Easy',
    timings: '06:00 AM - 05:00 PM',
    highlights: ['Direct waterhole vantage', 'Elephant herd crossing zone', 'Guide-accompanied viewpoint'],
    bestSeason: 'November to May'
  },
  {
    id: 'mirchaiya-falls',
    name: 'Mirchaiya Waterfalls',
    category: 'Waterfalls',
    badge: '🌊 Hidden Gem',
    badgeType: 'scenic',
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=700&q=80',
    icon: 'water',
    description: 'Cascading natural stream forming clear pools amidst pristine Sal forest canopy in Garu range.',
    location: 'Latehar, Jharkhand',
    distanceKm: 18,
    duration: '1-2 Hours',
    difficulty: 'Easy',
    timings: '07:00 AM - 05:00 PM',
    highlights: ['Natural rocky cascade pool', 'Quiet picnic atmosphere', 'Native medicinal flora'],
    bestSeason: 'July to February'
  },
  {
    id: 'suga-bandh',
    name: 'Suga Bandh Waterfall',
    category: 'Waterfalls',
    badge: '🌊 Waterfall',
    badgeType: 'nature',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80',
    icon: 'water',
    description: 'Spectacular geological rock formations on North Koyel River where rapids form emerald natural pools.',
    location: 'Palamau Fort Zone',
    distanceKm: 38,
    duration: '2-3 Hours',
    difficulty: 'Moderate',
    timings: '06:30 AM - 05:30 PM',
    highlights: ['Ancient granite rock canyon', 'Natural swimming basin', 'Sunset reflection over rapids'],
    bestSeason: 'September to March'
  },
  {
    id: 'kamaldah-lake',
    name: 'Kamaldah Lake & Wetland',
    category: 'Lakes',
    badge: '🪷 Wetland',
    badgeType: 'nature',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=700&q=80',
    icon: 'trees',
    description: 'Historical lotus lake built by Chero Kings, attracting thousands of winter waterfowl and resident marsh birds.',
    location: 'Palamau Fort Zone',
    distanceKm: 27,
    duration: '1-2 Hours',
    difficulty: 'Easy',
    timings: '06:00 AM - 06:00 PM',
    highlights: ['Lotus blossom blooms', 'Over 80 species of wetland birds', 'Historical stone embankment'],
    bestSeason: 'November to March'
  }
];

const CATEGORIES = [
  'All Places',
  'Waterfalls',
  'Viewpoints',
  'Lakes',
  'Historical Sites',
  'Temples',
  'Wildlife Zones',
  'Nature Trails',
  'Nearby Attractions'
];

const HERO_QUOTES = [
  {
    quote: '"In every walk with nature, one receives far more than he seeks."',
    author: 'John Muir'
  },
  {
    quote: '"The forest is not merely trees; it is a living, breathing sanctuary."',
    author: 'Betla Heritage Voice'
  },
  {
    quote: '"To sit in the shade on a fine day, and look upon verdure, is the most perfect refreshment."',
    author: 'Jane Austen'
  },
  {
    quote: '"Preserve the wild, cherish the trails, and let the wilderness guide your spirit."',
    author: 'Palamau Conservation Creed'
  }
];

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedCategory, setSelectedCategory] = useState('All Places');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Difficulty Levels');

  // View switch: Grid vs List
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Favorites state
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Modal Detail State
  const [selectedItem, setSelectedItem] = useState<DestinationItem | null>(null);

  // Hero carousel state
  const [heroQuoteIndex, setHeroQuoteIndex] = useState(0);

  // Auto rotate hero quote
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroQuoteIndex((prev) => (prev + 1) % HERO_QUOTES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Fetch live discover data from contentApi if available to enrich data
  const [apiDestinations, setApiDestinations] = useState<DestinationItem[]>(DEFAULT_DESTINATIONS);

  useEffect(() => {
    let isMounted = true;
    const loadApiData = async () => {
      try {
        const res = await contentApi.getDiscover();
        if (isMounted && res.data?.data?.destinations && res.data.data.destinations.length > 0) {
          const liveItems: DestinationItem[] = res.data.data.destinations.map((d: any, idx: number) => {
            const matchedDefault = DEFAULT_DESTINATIONS.find(
              (def) => def.id === d.slug || def.name.toLowerCase() === d.name.toLowerCase()
            );
            return {
              id: d.slug || d.id || `dest-${idx}`,
              name: d.name,
              category: matchedDefault?.category || 'Nature Trails',
              badge: matchedDefault?.badge || (d.isFeatured ? '🔥 Featured' : '🏞️ Must Visit'),
              badgeType: matchedDefault?.badgeType || 'scenic',
              image: matchedDefault?.image || DEFAULT_DESTINATIONS[idx % DEFAULT_DESTINATIONS.length].image,
              icon: matchedDefault?.icon || 'trees',
              description: d.shortDescription || d.description || matchedDefault?.description || 'Scenic point of interest in Betla National Park.',
              location: d.location || 'Latehar, Jharkhand',
              distanceKm: d.distanceKm || matchedDefault?.distanceKm || 20,
              duration: matchedDefault?.duration || '1-2 Hours',
              difficulty: matchedDefault?.difficulty || 'Easy',
              timings: matchedDefault?.timings || '06:00 AM - 05:30 PM',
              highlights: matchedDefault?.highlights || ['Scenic forest trails', 'Native flora and fauna'],
              bestSeason: matchedDefault?.bestSeason || 'October to April'
            };
          });

          // Merge live items with default destinations without duplicates
          const merged = [...DEFAULT_DESTINATIONS];
          liveItems.forEach((item) => {
            if (!merged.some((m) => m.name.toLowerCase() === item.name.toLowerCase())) {
              merged.push(item);
            }
          });
          setApiDestinations(merged);
        }
      } catch (err) {
        console.error('Using curated Betla destinations:', err);
      }
    };
    loadApiData();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter destinations
  const filteredDestinations = apiDestinations.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);

    const matchesCategory =
      selectedCategory === 'All Places' ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesLocation =
      selectedLocation === 'All Locations' ||
      item.location.toLowerCase().includes(selectedLocation.toLowerCase());

    const matchesDifficulty =
      selectedDifficulty === 'All Difficulty Levels' ||
      item.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    return matchesSearch && matchesCategory && matchesLocation && matchesDifficulty;
  });

  const handleNextQuote = () => {
    setHeroQuoteIndex((prev) => (prev + 1) % HERO_QUOTES.length);
  };

  const renderCardIcon = (iconType: string) => {
    switch (iconType) {
      case 'water':
        return <IconWater />;
      case 'binoculars':
        return <IconBinoculars />;
      case 'castle':
        return <IconCastle />;
      case 'mountain':
        return <IconMountain />;
      case 'trees':
      default:
        return <IconTrees />;
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
            className="places-hero"
            style={{ backgroundImage: `url(${heroImgAsset})` }}
          >
            <div className="places-hero-overlay">
              <div className="places-hero-header-row">
                {/* Left zone */}
                <div>
                  <div className="places-hero-tag">
                    <IconMapPin /> PLACES TO VISIT
                  </div>
                  <h1 className="places-hero-title">
                    Discover the<br />
                    <span className="places-hero-title-accent">Untamed Beauty</span>
                  </h1>
                  <p className="places-hero-desc">
                    Explore breathtaking landscapes, historical sites and natural wonders in and around Betla National Park.
                  </p>
                </div>

                {/* Right zone: Quote & Carousel Controls */}
                <div className="places-hero-quote-wrap">
                  <div className="places-hero-quote">
                    <p>{HERO_QUOTES[heroQuoteIndex].quote}</p>
                    <span>— {HERO_QUOTES[heroQuoteIndex].author}</span>
                  </div>

                  <div className="places-hero-carousel-controls">
                    <button
                      className="places-hero-arrow-btn"
                      onClick={handleNextQuote}
                      title="Next highlight"
                    >
                      &gt;
                    </button>
                    <div className="places-hero-dots">
                      {HERO_QUOTES.map((_, idx) => (
                        <span
                          key={idx}
                          className={`places-hero-dot ${idx === heroQuoteIndex ? 'active' : ''}`}
                          onClick={() => setHeroQuoteIndex(idx)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Feature Badges */}
              <div className="places-hero-badges-row">
                <div className="places-hero-feature-card">
                  <div className="places-hero-feature-icon">
                    <IconLeaf />
                  </div>
                  <div>
                    <div className="places-hero-feature-title">Rich Biodiversity</div>
                    <div className="places-hero-feature-sub">Home to diverse wildlife</div>
                  </div>
                </div>

                <div className="places-hero-feature-card">
                  <div className="places-hero-feature-icon">
                    <IconLandmark />
                  </div>
                  <div>
                    <div className="places-hero-feature-title">Cultural Heritage</div>
                    <div className="places-hero-feature-sub">Tribal history & legacy</div>
                  </div>
                </div>

                <div className="places-hero-feature-card">
                  <div className="places-hero-feature-icon">
                    <IconMountain />
                  </div>
                  <div>
                    <div className="places-hero-feature-title">Scenic Landscapes</div>
                    <div className="places-hero-feature-sub">Lakes, hills & forests</div>
                  </div>
                </div>

                <div className="places-hero-feature-card">
                  <div className="places-hero-feature-icon">
                    <IconShield />
                  </div>
                  <div>
                    <div className="places-hero-feature-title">Responsible Tourism</div>
                    <div className="places-hero-feature-sub">Travel. Respect. Conserve.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- SEARCH + FILTER BAR --- */}
          <div className="places-search-bar">
            {/* Text Search Input */}
            <div className="places-search-input-wrap">
              <IconSearch />
              <input
                type="text"
                placeholder="Search places, attractions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="places-search-input"
              />
            </div>

            {/* Location Select */}
            <div className="places-select-wrap">
              <IconMapPin className="places-select-prefix" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="places-select"
              >
                <option value="All Locations">All Locations</option>
                <option value="Latehar">Latehar, Jharkhand</option>
                <option value="Palamau Fort">Palamau Fort Zone</option>
                <option value="Netarhat">Netarhat Hills</option>
                <option value="Betla Core">Betla Core Area</option>
              </select>
              <IconChevronDown className="places-select-chevron" />
            </div>

            {/* Category Select */}
            <div className="places-select-wrap">
              <IconMountain className="places-select-prefix" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="places-select"
              >
                <option value="All Places">All Categories</option>
                <option value="Waterfalls">Waterfalls</option>
                <option value="Viewpoints">Viewpoints</option>
                <option value="Lakes">Lakes</option>
                <option value="Historical Sites">Historical Sites</option>
                <option value="Temples">Temples</option>
                <option value="Wildlife Zones">Wildlife Zones</option>
                <option value="Nature Trails">Nature Trails</option>
                <option value="Nearby Attractions">Nearby Attractions</option>
              </select>
              <IconChevronDown className="places-select-chevron" />
            </div>

            {/* Difficulty Select */}
            <div className="places-select-wrap">
              <IconActivity className="places-select-prefix" />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="places-select"
              >
                <option value="All Difficulty Levels">All Difficulty Levels</option>
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Challenging">Challenging</option>
              </select>
              <IconChevronDown className="places-select-chevron" />
            </div>
          </div>

          {/* --- CATEGORY PILLS ROW --- */}
          <div className="places-categories-row">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`places-cat-pill ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* --- SECTION HEADER & VIEW CONTROLS --- */}
          <div className="places-section-header">
            <div>
              <h2 className="places-section-title">Popular Places to Visit</h2>
              <p className="places-section-sub">
                Explore the most visited and recommended destinations
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
                  gap: '6px'
                }}
              >
                <span>🌿</span> Explore More, Connect Deeper
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

          {/* --- DESTINATION CARDS (GRID OR LIST) --- */}
          {filteredDestinations.length === 0 ? (
            <div
              style={{
                background: '#ffffff',
                border: '1px dashed #d1d5db',
                borderRadius: '12px',
                padding: '40px 20px',
                textAlign: 'center',
                color: '#6b7280',
                margin: '20px 0'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏞️</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>
                No matching places found
              </h3>
              <p style={{ fontSize: '0.85rem', margin: '0 0 16px' }}>
                Try adjusting your search query, location, or category filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLocation('All Locations');
                  setSelectedCategory('All Places');
                  setSelectedDifficulty('All Difficulty Levels');
                }}
                className="places-btn-action"
                style={{ display: 'inline-flex' }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'places-cards-grid' : 'places-cards-list'}>
              {filteredDestinations.map((dest) => {
                const isFav = !!favorites[dest.id];
                return (
                  <div
                    key={dest.id}
                    className="places-card"
                    onClick={() => setSelectedItem(dest)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Card Image Wrap */}
                    <div className="places-card-img-wrap">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="places-card-img"
                        loading="lazy"
                      />
                      {/* Top-left Badge */}
                      <span className="places-card-badge">
                        {dest.badge}
                      </span>
                      {/* Top-right Favorite Button */}
                      <button
                        className={`places-card-fav ${isFav ? 'active' : ''}`}
                        onClick={(e) => toggleFavorite(dest.id, e)}
                        title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        {isFav ? '❤️' : '🤍'}
                      </button>
                    </div>

                    {/* Card Body */}
                    <div className="places-card-body">
                      <div>
                        <div className="places-card-head">
                          <div className="places-card-icon">
                            {renderCardIcon(dest.icon)}
                          </div>
                          <div>
                            <h3 className="places-card-title">{dest.name}</h3>
                            <p className="places-card-desc">{dest.description}</p>
                          </div>
                        </div>

                        {/* Metadata row */}
                        <div className="places-card-meta-row">
                          <div className="places-card-meta-item">
                            <IconMapPin /> ~ {dest.distanceKm} km
                          </div>
                          <div className="places-card-meta-item">
                            <IconClock /> {dest.duration}
                          </div>
                          <div className="places-card-meta-item">
                            <IconActivity /> {dest.difficulty}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        className="places-card-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(dest);
                        }}
                      >
                        View Details &rarr;
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* --- CONSERVATION / TRUST STRIP (1:1 MATCH WITH REFERENCE) --- */}
          <div className="places-trust-strip">
            <div className="places-trust-item">
              <div className="places-trust-icon">
                <IconLeaf />
              </div>
              <div>
                <div className="places-trust-title">Respect Nature</div>
                <div className="places-trust-desc">Leave no trace behind</div>
              </div>
            </div>

            <div className="places-trust-item">
              <div className="places-trust-icon">
                <IconUsers />
              </div>
              <div>
                <div className="places-trust-title">Support Local Communities</div>
                <div className="places-trust-desc">Responsible tourism helps livelihoods</div>
              </div>
            </div>

            <div className="places-trust-item">
              <div className="places-trust-icon">
                <IconShield />
              </div>
              <div>
                <div className="places-trust-title">Help Conservation</div>
                <div className="places-trust-desc">Your visit makes a difference</div>
              </div>
            </div>

            <div className="places-trust-artwork">
              <IconTrees /> Explore, Preserve, Belong 🌿
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
          4. DESTINATION DETAIL MODAL
          ========================================================= */}
      {selectedItem && (
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
            padding: '20px'
          }}
          onClick={() => setSelectedItem(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '620px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              border: '1px solid #e5e7eb',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div style={{ position: 'relative', width: '100%', height: '220px', background: '#e5e7eb' }}>
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
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
                  color: '#111827'
                }}
              >
                {selectedItem.badge}
              </span>
              <button
                onClick={() => setSelectedItem(null)}
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
                  fontWeight: 700
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '20px 24px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                  {selectedItem.name}
                </h2>
                <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 700, background: '#f0fdf4', padding: '3px 10px', borderRadius: '12px', border: '1px solid #dcfce7' }}>
                  {selectedItem.category}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280', fontSize: '0.8rem', marginBottom: '14px' }}>
                <IconMapPin /> {selectedItem.location} &bull; Approx. {selectedItem.distanceKm} km from Betla Gateway
              </div>

              <p style={{ color: '#374151', fontSize: '0.875rem', lineHeight: 1.6, margin: '0 0 16px' }}>
                {selectedItem.description}
              </p>

              {/* Key Quick Facts Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '10px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  padding: '12px',
                  marginBottom: '16px'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600 }}>TIMINGS</div>
                  <div style={{ fontSize: '0.8rem', color: '#111827', fontWeight: 700 }}>{selectedItem.timings || '06:00 AM - 05:30 PM'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600 }}>DURATION</div>
                  <div style={{ fontSize: '0.8rem', color: '#111827', fontWeight: 700 }}>{selectedItem.duration}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600 }}>DIFFICULTY</div>
                  <div style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 700 }}>{selectedItem.difficulty}</div>
                </div>
              </div>

              {/* Highlights */}
              {selectedItem.highlights && selectedItem.highlights.length > 0 && (
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
                    Key Highlights &amp; Features
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', color: '#4b5563', fontSize: '0.825rem', lineHeight: 1.6 }}>
                    {selectedItem.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Modal Actions */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                <button
                  onClick={() => {
                    setSelectedItem(null);
                    navigate('/experiences');
                  }}
                  className="places-btn-action"
                  style={{ flex: 1, padding: '10px 16px' }}
                >
                  <IconCar /> Book Safari Tour
                </button>
                <button
                  onClick={() => {
                    setSelectedItem(null);
                    navigate('/guides-stays');
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
                    gap: '6px'
                  }}
                >
                  <IconBed /> Find Nearby Stays
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
