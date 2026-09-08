import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer
      style={{
        background: 'rgba(7, 13, 10, 0.95)',
        borderTop: '1px solid var(--border-default)',
        padding: 'var(--space-2xl) var(--space-xl) var(--space-xl)',
        marginTop: 'var(--space-3xl)',
        color: 'var(--text-secondary)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'var(--space-2xl)',
          marginBottom: 'var(--space-2xl)',
        }}
      >
        {/* Brand & Mission */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
            <div className="auth-logo-icon" style={{ width: 36, height: 36, fontSize: '1.1rem' }}>🌿</div>
            <span style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text-primary)' }}>
              Betla Eco-Companion
            </span>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.6, color: 'var(--text-muted)' }}>
            Empowering sustainable wildlife tourism, emergency safety, local guide ecosystems, and forest conservation across Betla National Park and Palamau Tiger Reserve.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: 'var(--color-primary)', fontSize: 'var(--text-md)', marginBottom: 'var(--space-md)' }}>
            Public Portal
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)', fontSize: 'var(--text-sm)' }}>
            <li><Link to="/discover" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>🗺️ Tourism Discovery</Link></li>
            <li><Link to="/experiences" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>🐯 Safaris & Treks</Link></li>
            <li><Link to="/guides-stays" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>🏡 Eco-Guides & Stays</Link></li>
            <li><Link to="/safety-hub" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>🚨 Tourist Safety Hub</Link></li>
            <li><Link to="/eco-portal" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>🌱 Community Eco Portal</Link></li>
            <li><Link to="/reviews-hub" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>⭐ Traveler Reviews</Link></li>
          </ul>
        </div>

        {/* Emergency & Helplines */}
        <div>
          <h4 style={{ color: 'var(--color-accent)', fontSize: 'var(--text-md)', marginBottom: 'var(--space-md)' }}>
            🚨 Forest Emergency
          </h4>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            <div><strong>Betla Control Room:</strong> +91 (6562) 222-019</div>
            <div><strong>Forest Patrol SOS:</strong> 1800-BETLA-PATROL</div>
            <div><strong>Wildlife Incident SOS:</strong> +91 94311 08842</div>
            <div><strong>Medical Response:</strong> 108 / +91 (6562) 222-108</div>
          </div>
        </div>

        {/* Eco Rules */}
        <div>
          <h4 style={{ color: 'var(--color-primary)', fontSize: 'var(--text-md)', marginBottom: 'var(--space-md)' }}>
            🌲 Eco Rules
          </h4>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Single-use plastics are strictly prohibited inside Palamau Tiger Reserve. Respect wildlife boundaries and maintain silence during forest drives.
          </p>
          <div style={{ marginTop: 'var(--space-md)', fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 600 }}>
            ✓ Verified Sustainable Partner
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          paddingTop: 'var(--space-lg)',
          borderTop: '1px solid var(--border-default)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-md)',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)',
        }}
      >
        <div>© {new Date().getFullYear()} Betla National Park & Palamau Tiger Reserve Eco-Companion System.</div>
        <div style={{ display: 'flex', gap: 'var(--space-lg)' }}>
          <span>Privacy & Conservation</span>
          <span>Forest Authority Regulations</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
