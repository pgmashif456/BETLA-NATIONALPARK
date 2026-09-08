import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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

export function GuidesStaysPage() {
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
    <div className="dashboard-layout">
      <Navbar />

      <main className="dashboard-content" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* Hero Section */}
        <section
          className="glass-card"
          style={{
            textAlign: 'center',
            padding: 'var(--space-2xl) var(--space-xl)',
            marginBottom: 'var(--space-2xl)',
            background: 'linear-gradient(135deg, rgba(230, 180, 50, 0.12) 0%, rgba(15, 23, 42, 0.7) 100%)',
            border: '1px solid var(--border-default)',
            animation: 'fadeInUp 0.6s ease-out',
          }}
        >
          <span className="badge badge-accent" style={{ marginBottom: 'var(--space-md)' }}>
            🏡 Community Tourism Network
          </span>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: 'var(--space-sm)' }}>
            Eco-Guides & Verified Homestays
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto var(--space-lg)' }}>
            Connect directly with government-certified indigenous forest guides and stay at eco-friendly homestays that support the local tribal economy.
          </p>

          {/* Toggle Tabs */}
          <div className="nav-tabs-container" style={{ maxWidth: 360, margin: '0 auto' }}>
            <button
              onClick={() => setActiveTab('guides')}
              className={`nav-tab-btn ${activeTab === 'guides' ? 'active' : ''}`}
            >
              🧭 Eco-Guides ({demoGuides.length})
            </button>
            <button
              onClick={() => setActiveTab('homestays')}
              className={`nav-tab-btn ${activeTab === 'homestays' ? 'active' : ''}`}
            >
              🏡 Homestays ({demoHomestays.length})
            </button>
          </div>
        </section>

        {/* GUIDES TAB */}
        {activeTab === 'guides' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-lg)' }}>
            {demoGuides.map((guide) => (
              <div key={guide.id} className="glass-card stat-card-glow" style={{ padding: 'var(--space-xl)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                  <div className="avatar" style={{ width: 56, height: 56, fontSize: '1.4rem' }}>
                    {guide.name[0]}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {guide.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginTop: '2px' }}>
                      <span className="badge badge-primary">{guide.badge}</span>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent)', fontWeight: 700 }}>
                        ⭐ {guide.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)', marginBottom: 'var(--space-md)' }}>
                  <div><strong>Experience:</strong> {guide.experienceYears} Years in Palamau Reserve</div>
                  <div><strong>Languages:</strong> {guide.languages.join(', ')}</div>
                </div>

                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-xs)' }}>Specializations:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {guide.specialties.map((spec) => (
                      <span key={spec} className="badge badge-accent" style={{ fontSize: '11px' }}>
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => toast.success(`Guide Request sent to ${guide.name}! Contact: ${guide.contactPhone}`)}
                  className="btn btn-primary"
                  style={{ width: '100%', fontSize: 'var(--text-sm)' }}
                >
                  📞 Request Guide Booking
                </button>
              </div>
            ))}
          </div>
        )}

        {/* HOMESTAYS TAB */}
        {activeTab === 'homestays' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-lg)' }}>
            {demoHomestays.map((stay) => (
              <div key={stay.id} className="glass-card stat-card-glow" style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-xs)' }}>
                    <span className="badge badge-primary">✓ Certified Eco Stay</span>
                    <span style={{ color: 'var(--color-accent)', fontWeight: 800 }}>⭐ {stay.rating}</span>
                  </div>

                  <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-xs)' }}>
                    {stay.name}
                  </h3>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                    📍 {stay.location}
                  </div>

                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 'var(--space-md)' }}>
                    {stay.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: 'var(--space-md)' }}>
                    {stay.amenities.map((am) => (
                      <span key={am} style={{ fontSize: 'var(--text-xs)', padding: '2px 8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', border: '1px solid var(--border-default)' }}>
                        {am}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ paddingTop: 'var(--space-md)', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-primary)' }}>
                      ₹{stay.pricePerNight}
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}> / night</span>
                  </div>
                  <button
                    onClick={() => toast.success(`Reservation inquiry sent for ${stay.name}`)}
                    className="btn btn-primary"
                    style={{ fontSize: 'var(--text-xs)' }}
                  >
                    Check Availability
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default GuidesStaysPage;
