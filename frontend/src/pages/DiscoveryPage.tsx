import React, { useState, useEffect } from 'react';
import { contentApi } from '../api/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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

export const DiscoveryPage: React.FC = () => {
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

  return (
    <div className="dashboard-layout">
      {/* Shared Header Navigation */}
      <Navbar />

      {/* Hero Search Section */}
      <div className="landing-hero" style={{ padding: 'var(--space-3xl) var(--space-xl)', minHeight: 'auto' }}>
        <div className="landing-hero-content" style={{ maxWidth: '800px' }}>
          <div className="landing-badge">
            🐾 Explore Natural Wonders & Eco-Safaris
          </div>
          <h1 style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-md)' }}>
            Discover <span className="highlight">Betla National Park</span>
          </h1>
          <p style={{ maxWidth: '640px' }}>
            Find waterfalls, historic forts, elephant reserves, guided treks, and cultural experiences in Palamau Tiger Reserve.
          </p>

          {/* Search Input */}
          <div style={{ maxWidth: '560px', margin: 'var(--space-lg) auto 0', display: 'flex', gap: 'var(--space-sm)' }}>
            <input
              type="text"
              placeholder="Search destinations, waterfalls, safaris..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ fontSize: 'var(--text-lg)', padding: '14px 20px' }}
            />
          </div>

          {/* Category Pills */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-sm)', flexWrap: 'wrap', marginTop: 'var(--space-lg)' }}>
            <button
              onClick={() => setSelectedCategory(null)}
              className={`btn ${selectedCategory === null ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)', padding: '6px 16px', fontSize: 'var(--text-sm)' }}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`btn ${selectedCategory === cat.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)', padding: '6px 16px', fontSize: 'var(--text-sm)' }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="dashboard-content">
        {loading ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--text-secondary)' }}>
            <div className="btn-loading" style={{ margin: '0 auto var(--space-md)' }}></div>
            Loading published destinations and safaris...
          </div>
        ) : (
          <>
            {/* Nearby Geolocation Search Bar */}
            <section className="glass-card" style={{ marginBottom: 'var(--space-2xl)' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-md)', color: 'var(--color-primary)' }}>
                📍 Geolocation Radar — Nearby Destinations
              </h2>
              <form onSubmit={handleSearchNearby} style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ width: 'auto' }}>
                  <label className="form-label">Latitude</label>
                  <input
                    type="text"
                    value={nearbyLat}
                    onChange={(e) => setNearbyLat(e.target.value)}
                    className="form-input"
                    style={{ width: '130px' }}
                  />
                </div>
                <div className="form-group" style={{ width: 'auto' }}>
                  <label className="form-label">Longitude</label>
                  <input
                    type="text"
                    value={nearbyLng}
                    onChange={(e) => setNearbyLng(e.target.value)}
                    className="form-input"
                    style={{ width: '130px' }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearchingNearby}
                  className="btn btn-primary"
                  style={{ marginTop: 'auto' }}
                >
                  {isSearchingNearby ? 'Scanning Radar...' : 'Find Nearby'}
                </button>
              </form>

              {nearbyDestinations.length > 0 && (
                <div style={{ marginTop: 'var(--space-lg)' }}>
                  <h3 style={{ fontSize: 'var(--text-md)', color: 'var(--text-primary)', marginBottom: 'var(--space-md)' }}>
                    Nearby Results (within 100 km):
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-md)' }}>
                    {nearbyDestinations.map((dest) => (
                      <div key={dest.id} className="stat-card-glow" style={{ padding: 'var(--space-md)' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{dest.name}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', marginTop: 'var(--space-xs)' }}>
                          ⚡ {dest.distanceKm} km from radar location
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Destinations Section */}
            <section style={{ marginBottom: 'var(--space-3xl)' }}>
              <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-lg)' }}>Published Destinations</h2>
              {filteredDestinations.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No published destinations match your search.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-lg)' }}>
                  {filteredDestinations.map((dest) => (
                    <div
                      key={dest.id}
                      onClick={() => setSelectedDestination(dest)}
                      className="glass-card feature-card"
                      style={{
                        borderColor: selectedDestination?.id === dest.id ? 'var(--color-primary)' : undefined,
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3 style={{ fontSize: 'var(--text-xl)', color: 'var(--text-primary)' }}>
                          {dest.name}
                        </h3>
                        {dest.isFeatured && (
                          <span className="badge badge-primary">FEATURED</span>
                        )}
                      </div>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {dest.shortDescription || dest.description || 'Explore scenic eco-tourism and natural wonders.'}
                      </p>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'auto' }}>
                        📍 {dest.location || 'Betla Reserve'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Attractions & Experiences Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-xl)' }}>
              {/* Attractions */}
              <section className="glass-card">
                <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-md)', color: 'var(--color-info)' }}>
                  🏰 Key Attractions
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {filteredAttractions.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                      {searchQuery || selectedCategory ? 'No attractions match your search.' : 'No attractions published yet.'}
                    </div>
                  ) : (
                    filteredAttractions.map((att) => (
                      <div key={att.id} style={{ padding: 'var(--space-md)', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{att.name}</div>
                        {att.description && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 'var(--space-xs)' }}>{att.description}</div>}
                        {att.openingTime && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-info)', marginTop: 'var(--space-xs)' }}>⏰ Hours: {att.openingTime} - {att.closingTime}</div>}
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Experiences & Safaris */}
              <section className="glass-card">
                <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-md)', color: 'var(--color-accent)' }}>
                  🌿 Experiences & Safaris
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {filteredExperiences.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                      {searchQuery || selectedCategory ? 'No experiences match your search.' : 'No experiences published yet.'}
                    </div>
                  ) : (
                    filteredExperiences.map((exp) => (
                      <div key={exp.id} style={{ padding: 'var(--space-md)', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{exp.name}</div>
                        {exp.description && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 'var(--space-xs)' }}>{exp.description}</div>}
                        {exp.duration && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent)', marginTop: 'var(--space-xs)' }}>⏱ Duration: {exp.duration} {exp.difficulty && `• ${exp.difficulty}`}</div>}
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Activities */}
              <section className="glass-card">
                <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-md)', color: 'var(--color-primary)' }}>
                  🥾 Eco Activities
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {filteredActivities.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                      {searchQuery || selectedCategory ? 'No activities match your search.' : 'No activities published yet.'}
                    </div>
                  ) : (
                    filteredActivities.map((act) => (
                      <div key={act.id} style={{ padding: 'var(--space-md)', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{act.name}</div>
                        {act.description && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 'var(--space-xs)' }}>{act.description}</div>}
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default DiscoveryPage;
