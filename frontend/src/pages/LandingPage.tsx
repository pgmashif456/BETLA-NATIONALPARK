import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing">
      {/* Shared Navigation Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-badge">
            🐾 Palamau Tiger Reserve, Jharkhand
          </div>
          <h1>
            Explore <span className="highlight">Betla</span> Like
            <br />Never Before
          </h1>
          <p>
            Your digital companion for discovering Betla & Palamau Tiger Reserve.
            Plan eco-safaris, book certified guides, find authentic homestays, and protect the wild beauty
            of Jharkhand's most iconic forest — responsibly and sustainably.
          </p>
          <div className="landing-hero-actions">
            <Link to="/discover" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: 'var(--text-lg)' }}>
              🧭 Discover Betla Content
            </Link>
            {!isAuthenticated ? (
              <Link to="/register" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: 'var(--text-lg)' }}>
                🌿 Register Account
              </Link>
            ) : (
              <Link to="/dashboard" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: 'var(--text-lg)' }}>
                Go to Dashboard →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Showcase Grid */}
      <section className="features-section">
        <div className="features-header">
          <h2>Everything You Need For An Eco-Safari</h2>
          <p>Explore approved destinations, emergency safety networks, eco-monitoring, and local hospitality.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">🐅</div>
            <h3>Wildlife & Destinations</h3>
            <p>Discover attractions, waterfalls, jungle trekking routes, and historical forts inside Betla National Park.</p>
            <Link to="/discover" style={{ marginTop: 'auto', fontWeight: 600, color: 'var(--color-primary)' }}>Explore Destinations →</Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">🐯</div>
            <h3>Safaris & Experiences</h3>
            <p>Explore forest safaris, night tracking, canopy walks, and cultural village tours.</p>
            <Link to="/experiences" style={{ marginTop: 'auto', fontWeight: 600, color: 'var(--color-primary)' }}>Book Safaris →</Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">🏡</div>
            <h3>Eco-Guides & Stays</h3>
            <p>Book certified forest guides trained in wildlife tracking and stay in verified tribal homestays.</p>
            <Link to="/guides-stays" style={{ marginTop: 'auto', fontWeight: 600, color: 'var(--color-primary)' }}>Find Guides & Stays →</Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">🚨</div>
            <h3>24/7 Safety & SOS Center</h3>
            <p>Real-time emergency dispatch, instant GPS SOS beaconing, and direct forest patrol contacts.</p>
            <Link to="/safety-hub" style={{ marginTop: 'auto', fontWeight: 600, color: 'var(--color-primary)' }}>Open Safety Hub →</Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">🌿</div>
            <h3>Community Eco Portal</h3>
            <p>Report environmental hazards, join tree planting drives, and take the zero-waste tourist pledge.</p>
            <Link to="/eco-portal" style={{ marginTop: 'auto', fontWeight: 600, color: 'var(--color-primary)' }}>Open Eco Portal →</Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">⭐</div>
            <h3>Traveler Reviews Hub</h3>
            <p>Read authentic experiences and ratings left by verified eco-tourists across Betla Reserve.</p>
            <Link to="/reviews-hub" style={{ marginTop: 'auto', fontWeight: 600, color: 'var(--color-primary)' }}>View Reviews →</Link>
          </div>
        </div>
      </section>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}

