import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { contentApi } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import heroImgAsset from '../assets/hero.png';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface Destination {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  status: string;
  isFeatured: boolean;
  distanceKm?: number;
}

interface Attraction {
  id: string;
  destinationId: string;
  categoryId?: string | null;
  name: string;
  description?: string;
  location?: string;
  openingTime?: string;
  closingTime?: string;
}

interface Experience {
  id: string;
  destinationId: string;
  categoryId?: string | null;
  name: string;
  description?: string;
  duration?: string;
  difficulty?: string;
}

interface Activity {
  id: string;
  destinationId: string;
  categoryId?: string | null;
  name: string;
  description?: string;
  duration?: string;
}

// Sample-1 Scenic Nature Image Mappings
const destinationImages: Record<string, string> = {
  'betla-fort': 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=600&q=80',
  'koyel-viewpoint': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  'lodh-falls': 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80',
  'wildlife-safari': 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80',
  'default': 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80',
};

const heroImages = [
  heroImgAsset,
  destinationImages['betla-fort'],
  destinationImages['lodh-falls'],
  destinationImages['koyel-viewpoint'],
];

// Inline SVG Vector Icon Helpers
const IconHome = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconCompass = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>;
const IconCar = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const IconMapPin = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconBed = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>;
const IconShield = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconLeaf = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 7 0 4.4-3.6 8-8 8h-2z"/><path d="M11 20v-7"/></svg>;
const IconChart = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconBell = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const IconFileText = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
const IconPhone = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const IconSun = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const IconCloudSun = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2" stroke="#f59e0b"/><path d="m4.93 4.93 1.41 1.41" stroke="#f59e0b"/><path d="M20 12h2" stroke="#f59e0b"/><path d="m19.07 4.93-1.41 1.41" stroke="#f59e0b"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128" stroke="#f59e0b"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" stroke="#64748b"/></svg>;
const IconCloud = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>;
const IconCloudRain = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>;
const IconCloudSnow = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M8 15h.01"/><path d="M8 19h.01"/><path d="M12 17h.01"/><path d="M12 21h.01"/><path d="M16 15h.01"/><path d="M16 19h.01"/></svg>;
const IconCloudLightning = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"/><path d="m13 12-3 5h4l-3 5"/></svg>;

// Weather Detail Icons
const IconDroplet = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>;
const IconWind = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>;
const IconSunrise = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/></svg>;
const IconSunset = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="9" x2="12" y2="16"/><line x1="4.22" y1="15.78" x2="5.64" y2="14.36"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="14.36" x2="19.78" y2="15.78"/></svg>;


interface WeatherData {
  date: string;
  temperature: number;
  condition: string;
  weatherCode?: number;
  humidity: number;
  windSpeed: number;
  sunrise: string;
  sunset: string;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatBetlaDate(dateStr?: string): string {
  if (!dateStr) return '';
  const dateOnly = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
  const [year, month, day] = dateOnly.split('-').map(Number);
  if (year && month && day) {
    const d = new Date(year, month - 1, day);
    const dayName = DAY_NAMES[d.getDay()];
    const monthName = MONTH_NAMES[month - 1];
    return `${dayName}, ${day} ${monthName} ${year}`;
  }
  return dateStr;
}

function formatBetlaTime(timeStr?: string): string {
  if (!timeStr) return '--:--';
  const parts = timeStr.includes('T') ? timeStr.split('T')[1].split(':') : timeStr.split(':');
  if (parts.length >= 2) {
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const period = hours >= 12 ? 'PM' : 'AM';
    const h12 = hours % 12 || 12;
    return `${h12}:${minutes.toString().padStart(2, '0')} ${period}`;
  }
  return timeStr;
}

function getWeatherDescription(code: number): string {
  switch (code) {
    case 0:
      return 'Clear Sky';
    case 1:
      return 'Mainly Clear';
    case 2:
      return 'Partly Cloudy';
    case 3:
      return 'Overcast';
    case 45:
    case 48:
      return 'Fog';
    case 51:
    case 53:
    case 55:
      return 'Drizzle';
    case 56:
    case 57:
      return 'Freezing Drizzle';
    case 61:
    case 63:
    case 65:
      return 'Rain';
    case 66:
    case 67:
      return 'Freezing Rain';
    case 71:
    case 73:
    case 75:
    case 77:
      return 'Snow';
    case 80:
    case 81:
    case 82:
      return 'Rain Showers';
    case 85:
    case 86:
      return 'Snow Showers';
    case 95:
      return 'Thunderstorm';
    case 96:
    case 99:
      return 'Thunderstorm with Hail';
    default:
      return 'Partly Cloudy';
  }
}
function renderWeatherIcon(code?: number) {
  if (code === undefined || code === null) return <IconSun />;
  if (code === 0 || code === 1) return <IconSun />;
  if (code === 2) return <IconCloudSun />;
  if (code === 3 || code === 45 || code === 48) return <IconCloud />;
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return <IconCloudRain />;
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return <IconCloudSnow />;
  if (code >= 95) return <IconCloudLightning />;
  return <IconCloud />;
}

export const DiscoveryPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  
  // Geolocation simulation for Betla (Lat: 23.8872, Lng: 84.1913)
  const [nearbyLat, setNearbyLat] = useState('23.8872');
  const [nearbyLng, setNearbyLng] = useState('84.1913');
  const [nearbyDestinations, setNearbyDestinations] = useState<Destination[]>([]);
  const [isSearchingNearby, setIsSearchingNearby] = useState(false);

  // Hero auto-rotating carousel state (4-5s interval)
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [currentHeroIndex]);

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchWeather = async () => {
      try {
        setWeatherLoading(true);
        setWeatherError(false);
        const url =
          'https://api.open-meteo.com/v1/forecast?latitude=23.8872&longitude=84.1913&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=sunrise,sunset&timezone=Asia%2FKolkata&forecast_days=1';
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Weather API returned status ${response.status}`);
        }
        const data = await response.json();
        if (isMounted && data.current && data.daily) {
          const condition = getWeatherDescription(data.current.weather_code);
          const date = formatBetlaDate(data.daily.time?.[0] || data.current.time);
          const sunrise = formatBetlaTime(data.daily.sunrise?.[0]);
          const sunset = formatBetlaTime(data.daily.sunset?.[0]);

          setWeatherData({
            date,
            temperature: Math.round(data.current.temperature_2m),
            condition,
            weatherCode: data.current.weather_code,
            humidity: Math.round(data.current.relative_humidity_2m),
            windSpeed: Math.round(data.current.wind_speed_10m),
            sunrise,
            sunset,
          });
        }
      } catch (err) {
        console.error('Failed to fetch weather data:', err);
        if (isMounted) {
          setWeatherError(true);
        }
      } finally {
        if (isMounted) {
          setWeatherLoading(false);
        }
      }
    };

    fetchWeather();

    return () => {
      isMounted = false;
    };
  }, []);


  useEffect(() => {
    let isMounted = true;
    const fetchDiscoverData = async () => {
      try {
        const res = await contentApi.getDiscover();
        if (isMounted) {
          const data = res.data.data;
          setCategories(data.categories || []);
          setDestinations(data.destinations || []);
          setAttractions(data.attractions || []);
          setExperiences(data.experiences || []);
          setActivities(data.activities || []);
        }
      } catch (err) {
        console.error('Error fetching discovery data:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDiscoverData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchNearby = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nearbyLat || !nearbyLng) return;
    try {
      setIsSearchingNearby(true);
      const res = await contentApi.getNearbyDestinations({
        lat: parseFloat(nearbyLat),
        lng: parseFloat(nearbyLng),
        radiusKm: 100,
      });
      setNearbyDestinations(res.data.data || []);
    } catch (err) {
      console.error('Error searching nearby destinations:', err);
    } finally {
      setIsSearchingNearby(false);
    }
  };

  const query = searchQuery.trim().toLowerCase();

  const filteredAttractions = attractions.filter((att) => {
    const matchesCategory = !selectedCategory || att.categoryId === selectedCategory;
    const matchesSearch =
      !query ||
      att.name.toLowerCase().includes(query) ||
      att.description?.toLowerCase().includes(query) ||
      att.location?.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const filteredExperiences = experiences.filter((exp) => {
    const matchesCategory = !selectedCategory || exp.categoryId === selectedCategory;
    const matchesSearch =
      !query ||
      exp.name.toLowerCase().includes(query) ||
      exp.description?.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const filteredActivities = activities.filter((act) => {
    const matchesCategory = !selectedCategory || act.categoryId === selectedCategory;
    const matchesSearch =
      !query ||
      act.name.toLowerCase().includes(query) ||
      act.description?.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSelf =
      !query ||
      dest.name.toLowerCase().includes(query) ||
      dest.shortDescription?.toLowerCase().includes(query) ||
      dest.description?.toLowerCase().includes(query) ||
      dest.location?.toLowerCase().includes(query);

    const matchesChild =
      attractions.some(
        (a) =>
          a.destinationId === dest.id &&
          (!selectedCategory || a.categoryId === selectedCategory) &&
          (!query || a.name.toLowerCase().includes(query) || a.description?.toLowerCase().includes(query) || a.location?.toLowerCase().includes(query))
      ) ||
      experiences.some(
        (e) =>
          e.destinationId === dest.id &&
          (!selectedCategory || e.categoryId === selectedCategory) &&
          (!query || e.name.toLowerCase().includes(query) || e.description?.toLowerCase().includes(query))
      ) ||
      activities.some(
        (act) =>
          act.destinationId === dest.id &&
          (!selectedCategory || act.categoryId === selectedCategory) &&
          (!query || act.name.toLowerCase().includes(query) || act.description?.toLowerCase().includes(query))
      );

    const matchesCategory =
      !selectedCategory ||
      attractions.some((a) => a.destinationId === dest.id && a.categoryId === selectedCategory) ||
      experiences.some((e) => e.destinationId === dest.id && e.categoryId === selectedCategory) ||
      activities.some((act) => act.destinationId === dest.id && act.categoryId === selectedCategory);

    return (matchesSelf || matchesChild) && matchesCategory;
  });

  const getImageForDestination = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('fort')) return destinationImages['betla-fort'];
    if (lower.includes('viewpoint') || lower.includes('koyel')) return destinationImages['koyel-viewpoint'];
    if (lower.includes('fall') || lower.includes('lodh')) return destinationImages['lodh-falls'];
    if (lower.includes('safari')) return destinationImages['wildlife-safari'];
    return destinationImages['default'];
  };

  
  return (
    <div className="sample1-layout">
      {/* --- Left Compact Sidebar --- */}
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
            <Link to="/discover" className="sample1-nav-item active">
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
              <IconLeaf /> <span>Eco Portal</span>
            </Link>
            <Link to="/reviews-hub" className="sample1-nav-item">
              <IconChart /> <span>Reports & Analytics</span>
            </Link>
          </nav>
        </div>

        <div className="sample1-sidebar-footer">
          <div className="sample1-sidebar-graphic">
            <div style={{ fontWeight: 600, color: '#e5e7eb', marginBottom: '2px' }}>For Wildlife</div>
            <div style={{ fontSize: '0.68rem', color: '#79a890' }}>For Future</div>
          </div>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <div className="sample1-main-wrapper">
        {/* Top Header Bar */}
        <header className="sample1-header">
          <div className="sample1-search-box">
            <IconSearch />
            <input
              type="text"
              placeholder="Search places, safaris, attractions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sample1-search-input"
            />
          </div>

          <div className="sample1-user-controls">
            <button className="sample1-icon-btn" title="Notifications" onClick={() => navigate('/safety-hub')}>
              <IconBell />
              <span style={{ position: 'absolute', top: 0, right: 0, width: 7, height: 7, background: '#ef4444', borderRadius: '50%' }}></span>
            </button>

            {user ? (
              <div className="sample1-user-pill" onClick={() => navigate('/profile')}>
                <div className="sample1-avatar">
                  {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'T'}
                </div>
                <div className="sample1-user-info">
                  <span className="sample1-user-name">{user.firstName} {user.lastName}</span>
                  <span className="sample1-user-role">{user.role.name}</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>▼</span>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link to="/login" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#15803d', padding: '5px 12px', borderRadius: '20px', border: '1px solid #15803d' }}>
                  Sign In
                </Link>
                <Link to="/register" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'white', background: '#10b981', padding: '5px 12px', borderRadius: '20px' }}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Main Body */}
        <div className="sample1-container">
          {/* Sample-1 Tiger Forest Hero Banner */}
          <div className="sample1-hero" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* 4 Auto-Rotating Background Crossfade Slides */}
            {heroImages.map((imgSrc, idx) => (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `linear-gradient(to right, rgba(9, 26, 16, 0.92) 0%, rgba(9, 26, 16, 0.65) 55%, rgba(9, 26, 16, 0.3) 100%), url(${imgSrc})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: currentHeroIndex === idx ? 1 : 0,
                  transition: 'opacity 0.85s ease-in-out',
                  pointerEvents: 'none',
                  zIndex: 0
                }}
              />
            ))}

            <div className="sample1-hero-content" style={{ position: 'relative', zIndex: 1 }}>
              <div className="sample1-hero-tag">WELCOME TO</div>
              <h1 className="sample1-hero-title">Betla National Park</h1>
              <div className="sample1-hero-sub">Nature • Adventure • Conservation</div>
              <div style={{ fontSize: '0.8rem', color: '#a7f3d0', marginBottom: '14px' }}>Discover the wild beauty of Jharkhand</div>
              <button className="sample1-hero-btn" onClick={() => {
                const el = document.getElementById('destinations-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}>
                Explore Now →
              </button>
            </div>

            <div className="sample1-hero-quote" style={{ position: 'relative', zIndex: 1 }}>
              "In every walk with nature one receives far more than he seeks."
              <div style={{ marginTop: '4px', fontSize: '0.72rem', color: '#6ee7b7' }}>— John Muir</div>
            </div>

            {/* 4 Dynamic Carousel Indicator Dots */}
            <div className="sample1-hero-dots">
              {heroImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentHeroIndex(idx)}
                  className={`sample1-hero-dot ${currentHeroIndex === idx ? 'active' : ''}`}
                  aria-label={`View slide ${idx + 1}`}
                  title={`View slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Quick Action Cards Row (4 Cards) */}
          <div className="sample1-quick-actions">
            <div className="sample1-quick-card green" onClick={() => navigate('/experiences')}>
              <div className="sample1-quick-card-icon"><IconCar /></div>
              <div>
                <div className="sample1-quick-card-title">Book Safari</div>
                <div className="sample1-quick-card-sub">Explore the wilderness</div>
              </div>
            </div>

            <div className="sample1-quick-card amber" onClick={() => navigate('/discover')}>
              <div className="sample1-quick-card-icon"><IconMapPin /></div>
              <div>
                <div className="sample1-quick-card-title">Explore Places</div>
                <div className="sample1-quick-card-sub">Waterfalls, forts, viewpoints</div>
              </div>
            </div>

            <div className="sample1-quick-card blue" onClick={() => navigate('/guides-stays')}>
              <div className="sample1-quick-card-icon"><IconBed /></div>
              <div>
                <div className="sample1-quick-card-title">Find Stay</div>
                <div className="sample1-quick-card-sub">Resorts, cottages, camps</div>
              </div>
            </div>

            <div className="sample1-quick-card red" onClick={() => navigate('/safety-hub')}>
              <div className="sample1-quick-card-icon"><IconFileText /></div>
              <div>
                <div className="sample1-quick-card-title">Travel Guidelines</div>
                <div className="sample1-quick-card-sub">Plan your safe journey</div>
              </div>
            </div>
          </div>

          {/* Main 2-Column Content Area */}
          <div className="sample1-content-grid">
            {/* Left Main Column */}
            <div>
              {/* Category Pills */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                <button
                  onClick={() => setSelectedCategory(null)}
                  style={{
                    padding: '5px 14px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid #d1d5db',
                    background: selectedCategory === null ? '#10b981' : '#ffffff',
                    color: selectedCategory === null ? '#ffffff' : '#374151',
                  }}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      padding: '5px 14px',
                      borderRadius: '20px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: '1px solid #d1d5db',
                      background: selectedCategory === cat.id ? '#10b981' : '#ffffff',
                      color: selectedCategory === cat.id ? '#ffffff' : '#374151',
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Geolocation Radar Search Box */}
              <div style={{ background: '#ffffff', borderRadius: '10px', padding: '12px 14px', border: '1px solid #e5e7eb', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <IconMapPin /> Geolocation Radar — Nearby Destinations
                </div>
                <form onSubmit={handleSearchNearby} style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.75rem', color: '#6b7280' }}>Lat:</label>
                    <input
                      type="text"
                      value={nearbyLat}
                      onChange={(e) => setNearbyLat(e.target.value)}
                      style={{ width: '85px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.75rem', color: '#6b7280' }}>Lng:</label>
                    <input
                      type="text"
                      value={nearbyLng}
                      onChange={(e) => setNearbyLng(e.target.value)}
                      style={{ width: '85px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.8rem' }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSearchingNearby}
                    style={{ background: '#10b981', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '6px', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}
                  >
                    {isSearchingNearby ? 'Scanning...' : 'Find Nearby'}
                  </button>
                </form>

                {nearbyDestinations.length > 0 && (
                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f3f4f6' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px' }}>Nearby Results (within 100 km):</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px' }}>
                      {nearbyDestinations.map((dest) => (
                        <div key={dest.id} style={{ background: '#f0fdf4', padding: '8px 10px', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{dest.name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#15803d' }}>📡 {dest.distanceKm} km away</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Selected Destination Detail View */}
              {selectedDestination && (
                <div style={{ background: '#ffffff', borderRadius: '10px', padding: '14px 16px', border: '2px solid #10b981', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <h2 style={{ fontSize: '1.1rem', color: '#111827' }}>{selectedDestination.name}</h2>
                    <button onClick={() => setSelectedDestination(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.78rem', color: '#6b7280' }}>
                      ✕ Close
                    </button>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#4b5563', marginBottom: '8px' }}>
                    {selectedDestination.description || selectedDestination.shortDescription}
                  </p>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', gap: '14px' }}>
                    <div>📍 {selectedDestination.location || 'Betla Reserve'}</div>
                    {selectedDestination.latitude && (
                      <div>🌐 Coords: {selectedDestination.latitude.toFixed(4)}, {selectedDestination.longitude?.toFixed(4)}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Popular Destinations Grid Section (4 Cards in a single row on desktop) */}
              <div id="destinations-section" style={{ marginBottom: '18px' }}>
                <div className="sample1-section-header">
                  <div className="sample1-section-title">Popular Destinations</div>
                  <a href="#destinations-section" className="sample1-section-link">View All →</a>
                </div>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '24px', color: '#6b7280', fontSize: '0.85rem' }}>Loading destinations...</div>
                ) : filteredDestinations.length === 0 ? (
                  <div style={{ background: '#ffffff', padding: '20px', borderRadius: '10px', textAlign: 'center', color: '#6b7280', fontSize: '0.85rem' }}>
                    No published destinations match your search.
                  </div>
                ) : (
                  <div className="sample1-dest-grid">
                    {filteredDestinations.map((dest) => (
                      <div
                        key={dest.id}
                        className="sample1-dest-card"
                        onClick={() => setSelectedDestination(dest)}
                      >
                        <img
                          src={getImageForDestination(dest.name)}
                          alt={dest.name}
                          className="sample1-dest-img"
                        />
                        <div className="sample1-dest-body">
                          <div className="sample1-dest-title">{dest.name}</div>
                          <div className="sample1-dest-cat">
                            <span>Historical Site</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Fallback Cards to complete 4-card row when only 1 DB destination exists */}
                    {filteredDestinations.length === 1 && (
                      <>
                        <div className="sample1-dest-card">
                          <img src={destinationImages['koyel-viewpoint']} alt="Koyel Viewpoint" className="sample1-dest-img" />
                          <div className="sample1-dest-body">
                            <div className="sample1-dest-title">Koyel Viewpoint</div>
                            <div className="sample1-dest-cat">Viewpoint</div>
                          </div>
                        </div>

                        <div className="sample1-dest-card">
                          <img src={destinationImages['lodh-falls']} alt="Lodh Falls" className="sample1-dest-img" />
                          <div className="sample1-dest-body">
                            <div className="sample1-dest-title">Lodh Falls</div>
                            <div className="sample1-dest-cat">Waterfall</div>
                          </div>
                        </div>

                        <div className="sample1-dest-card">
                          <img src={destinationImages['wildlife-safari']} alt="Wildlife Safari" className="sample1-dest-img" />
                          <div className="sample1-dest-body">
                            <div className="sample1-dest-title">Wildlife Safari</div>
                            <div className="sample1-dest-cat">Safari Experience</div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Sub-Grids: Key Attractions, Safaris, Activities */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '12px' }}>
                <div style={{ background: '#ffffff', borderRadius: '10px', padding: '12px 14px', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1d4ed8', marginBottom: '6px' }}>Key Attractions</div>
                  {filteredAttractions.length === 0 ? (
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>No attractions listed.</div>
                  ) : (
                    filteredAttractions.map(att => (
                      <div key={att.id} style={{ marginBottom: '6px', paddingBottom: '6px', borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{att.name}</div>
                        {att.description && <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>{att.description}</div>}
                      </div>
                    ))
                  )}
                </div>

                <div style={{ background: '#ffffff', borderRadius: '10px', padding: '12px 14px', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#b45309', marginBottom: '6px' }}>Experiences & Safaris</div>
                  {filteredExperiences.length === 0 ? (
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>No safaris listed.</div>
                  ) : (
                    filteredExperiences.map(exp => (
                      <div key={exp.id} style={{ marginBottom: '6px', paddingBottom: '6px', borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{exp.name}</div>
                        {exp.description && <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>{exp.description}</div>}
                      </div>
                    ))
                  )}
                </div>

                <div style={{ background: '#ffffff', borderRadius: '10px', padding: '12px 14px', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#15803d', marginBottom: '6px' }}>Eco Activities</div>
                  {filteredActivities.length === 0 ? (
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>No activities listed.</div>
                  ) : (
                    filteredActivities.map(act => (
                      <div key={act.id} style={{ marginBottom: '6px', paddingBottom: '6px', borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{act.name}</div>
                        {act.description && <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>{act.description}</div>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Column Widgets Stack */}
            <div>
              {/* Widget 1: Today at Betla Weather Card */}
              <div className="sample1-weather-card">
                <div className="sample1-weather-header">
                  <span className="sample1-weather-title">Today at Betla</span>
                  <span className="sample1-weather-date">
                    {weatherLoading ? 'Loading...' : weatherData ? weatherData.date : 'Betla, Jharkhand'}
                  </span>
                </div>
                {weatherError ? (
                  <div style={{ padding: '12px 0', fontSize: '0.8rem', color: '#9ca3af', textAlign: 'center' }}>
                    Weather unavailable
                  </div>
                ) : (
                  <>
                    <div className="sample1-weather-body">
                      <div className="sample1-weather-icon-wrap">
                        {renderWeatherIcon(weatherData?.weatherCode)}
                      </div>
                      <div>
                        <div className="sample1-weather-temp">
                          {weatherLoading ? '--°C' : `${weatherData?.temperature}°C`}
                        </div>
                        <div className="sample1-weather-condition">
                          {weatherLoading ? 'Updating weather...' : weatherData?.condition}
                        </div>
                      </div>
                    </div>
                    <div className="sample1-weather-grid">
                      <div className="sample1-weather-stat">
                        <IconDroplet />
                        <span className="sample1-weather-stat-label">Humidity:</span>
                        <span className="sample1-weather-stat-val">{weatherLoading ? '--%' : `${weatherData?.humidity}%`}</span>
                      </div>
                      <div className="sample1-weather-stat">
                        <IconWind />
                        <span className="sample1-weather-stat-label">Wind:</span>
                        <span className="sample1-weather-stat-val">{weatherLoading ? '-- km/h' : `${weatherData?.windSpeed} km/h`}</span>
                      </div>
                      <div className="sample1-weather-stat">
                        <IconSunrise />
                        <span className="sample1-weather-stat-label">Sunrise:</span>
                        <span className="sample1-weather-stat-val">{weatherLoading ? '--:--' : weatherData?.sunrise}</span>
                      </div>
                      <div className="sample1-weather-stat">
                        <IconSunset />
                        <span className="sample1-weather-stat-label">Sunset:</span>
                        <span className="sample1-weather-stat-val">{weatherLoading ? '--:--' : weatherData?.sunset}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Widget 2: Be a Responsible Tourist */}
              <div className="sample1-widget" style={{ cursor: 'pointer', background: '#f0fdf4', borderColor: '#bbf7d0' }} onClick={() => navigate('/eco-portal')}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <IconLeaf />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#111827', marginBottom: '2px' }}>Be a Responsible Tourist</div>
                    <div style={{ fontSize: '0.72rem', color: '#4b5563', lineHeight: 1.35 }}>
                      Keep the forest clean, respect wildlife, and follow park guidelines.
                    </div>
                  </div>
                  <span style={{ color: '#15803d', fontWeight: 700, fontSize: '0.9rem' }}>›</span>
                </div>
              </div>

              {/* Widget 3: Emergency Contact Card */}
              <div className="sample1-widget" style={{ cursor: 'pointer', background: '#fef2f2', borderColor: '#fee2e2' }} onClick={() => navigate('/safety-hub')}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#fee2e2', color: '#b91c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <IconPhone />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#991b1b', marginBottom: '2px' }}>Emergency Contact</div>
                    <div style={{ fontSize: '0.72rem', color: '#4b5563' }}>Forest Control Room</div>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#b91c1c', marginTop: '2px' }}>+91 94701 23456</div>
                  </div>
                  <span style={{ color: '#b91c1c', fontWeight: 700, fontSize: '0.9rem' }}>›</span>
                </div>
              </div>

              {/* Widget 4: Banner Card - Let's Protect Betla Together */}
              <div className="sample1-widget-banner">
                <div className="sample1-widget-banner-title">Let's Protect Betla Together</div>
                <div className="sample1-widget-banner-sub">
                  Small actions make a big difference for our wildlife and future generations.
                </div>
                <button
                  onClick={() => navigate('/eco-portal')}
                  style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '16px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Learn More →
                </button>
              </div>

              {/* Latest Updates List Widget */}
              <div className="sample1-widget">
                <div className="sample1-widget-title">
                  <span>Latest Updates</span>
                  <a href="#updates" style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 600 }}>View All →</a>
                </div>
                <div>
                  <div className="sample1-update-item">
                    <div>
                      <span className="sample1-update-dot" style={{ background: '#10b981' }}></span>
                      <span>Park will remain open during normal hours this week.</span>
                    </div>
                    <span style={{ color: '#9ca3af', fontSize: '0.68rem', flexShrink: 0, marginLeft: '6px' }}>8 Sep 2025</span>
                  </div>

                  <div className="sample1-update-item">
                    <div>
                      <span className="sample1-update-dot" style={{ background: '#3b82f6' }}></span>
                      <span>New safari booking slots available for next month.</span>
                    </div>
                    <span style={{ color: '#9ca3af', fontSize: '0.68rem', flexShrink: 0, marginLeft: '6px' }}>7 Sep 2025</span>
                  </div>

                  <div className="sample1-update-item">
                    <div>
                      <span className="sample1-update-dot" style={{ background: '#f59e0b' }}></span>
                      <span>Follow safety guidelines while visiting waterfalls.</span>
                    </div>
                    <span style={{ color: '#9ca3af', fontSize: '0.68rem', flexShrink: 0, marginLeft: '6px' }}>6 Sep 2025</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <footer className="sample1-footer">
            <div>Betla Eco-Companion | Department of Forest, Jharkhand</div>
            <div style={{ color: '#15803d', fontWeight: 600 }}>Explore • Protect • Preserve</div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryPage;
