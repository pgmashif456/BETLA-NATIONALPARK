import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { contentApi } from '../api/client';
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

export function ExperiencesPage() {
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
    <div className="dashboard-layout">
      <Navbar />

      <main className="dashboard-content" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* Banner Hero */}
        <section
          className="glass-card"
          style={{
            textAlign: 'center',
            padding: 'var(--space-2xl) var(--space-xl)',
            marginBottom: 'var(--space-2xl)',
            background: 'linear-gradient(135deg, rgba(29, 185, 84, 0.15) 0%, rgba(15, 23, 42, 0.6) 100%)',
            border: '1px solid var(--border-default)',
            animation: 'fadeInUp 0.6s ease-out',
          }}
        >
          <span className="badge badge-primary" style={{ marginBottom: 'var(--space-md)' }}>
            🐯 Wild Safaris & Eco Treks
          </span>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: 'var(--space-sm)' }}>
            Experience Palamau Tiger Reserve
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto var(--space-lg)' }}>
            Book certified wildlife jeep safaris, elephant trail walks, waterfall treks, and indigenous tribal heritage tours in Betla.
          </p>

          {/* Category Pills */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`btn ${selectedCategory === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)' }}
            >
              🌟 All Experiences
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id || cat.slug}
                onClick={() => setSelectedCategory(cat.slug || cat.name)}
                className={`btn ${selectedCategory === (cat.slug || cat.name) ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)' }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* Content Section */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--text-muted)' }}>
            Loading wild experiences...
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🌲</div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-xs)' }}>No Experiences Published Yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
              Check back soon for new seasonal safari schedules and guided walks.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-lg)' }}>
            {filtered.map((exp) => (
              <div
                key={exp.id}
                className="glass-card stat-card-glow"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: 'var(--space-lg)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-sm)' }}>
                    <span className="badge badge-accent">
                      {exp.category?.name || 'Wild Safari'}
                    </span>
                    {exp.price && (
                      <span style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--color-primary)' }}>
                        ₹{exp.price}
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-xs)' }}>
                    {exp.name}
                  </h3>
                  {exp.destination && (
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent)', marginBottom: 'var(--space-sm)' }}>
                      📍 {exp.destination.name}
                    </div>
                  )}
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 'var(--space-md)' }}>
                    {exp.description || 'Embark on a guided eco-tour through dense sal forests with expert forest guards.'}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--border-default)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    ⏱️ {exp.duration || '2 - 3 Hours'}
                  </span>
                  <button
                    onClick={() => setSelectedExperience(exp)}
                    className="btn btn-primary"
                    style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-xs) var(--space-md)' }}
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
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--space-md)',
            }}
          >
            <div className="glass-card" style={{ maxWidth: '540px', width: '100%', padding: 'var(--space-xl)', animation: 'fadeInUp 0.3s ease-out' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                <span className="badge badge-primary">{selectedExperience.category?.name || 'Safari'}</span>
                <button
                  onClick={() => setSelectedExperience(null)}
                  className="btn btn-ghost"
                  style={{ fontSize: '1.2rem', padding: 'var(--space-xs)' }}
                >
                  ✕
                </button>
              </div>

              <h2 style={{ fontSize: 'var(--text-2xl)', color: 'var(--text-primary)', marginBottom: 'var(--space-xs)' }}>
                {selectedExperience.name}
              </h2>
              {selectedExperience.destination && (
                <div style={{ color: 'var(--color-accent)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-md)' }}>
                  📍 Location: {selectedExperience.destination.name}
                </div>
              )}

              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-lg)' }}>
                {selectedExperience.description || 'Experience the pristine biodiversity of Betla with certified local trackers.'}
              </p>

              <div style={{ background: 'var(--bg-surface)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)', fontSize: 'var(--text-sm)' }}>
                  <span>Duration:</span>
                  <strong>{selectedExperience.duration || '2.5 Hours'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                  <span>Eco Permit Fee:</span>
                  <strong style={{ color: 'var(--color-primary)' }}>₹{selectedExperience.price || '450'} per visitor</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                <button
                  onClick={() => {
                    toast.success('Redirecting to Eco Booking engine...');
                    setSelectedExperience(null);
                  }}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Confirm & Reserve Ticket
                </button>
                <button
                  onClick={() => setSelectedExperience(null)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default ExperiencesPage;
