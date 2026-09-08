import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { label: 'Discover', path: '/discover', icon: '🗺️' },
    { label: 'Safaris & Treks', path: '/experiences', icon: '🐯' },
    { label: 'Guides & Stays', path: '/guides-stays', icon: '🏡' },
    { label: 'Safety Hub', path: '/safety-hub', icon: '🚨' },
    { label: 'Eco Portal', path: '/eco-portal', icon: '🌱' },
    { label: 'Reviews', path: '/reviews-hub', icon: '⭐' },
  ];

  return (
    <nav className="dashboard-nav" style={{ position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(16px)', background: 'rgba(11, 20, 15, 0.85)' }}>
      <div className="dashboard-nav-brand">
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <div className="auth-logo-icon" style={{ width: 38, height: 38, fontSize: '1.2rem' }}>🌿</div>
          <span className="auth-logo-text" style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }}>Betla</span>
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', overflowX: 'auto' }}>
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              style={{
                textDecoration: 'none',
                color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: 'var(--text-sm)',
                padding: 'var(--space-xs) var(--space-sm)',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'rgba(29, 185, 84, 0.1)' : 'transparent',
                border: isActive ? '1px solid rgba(29, 185, 84, 0.3)' : '1px solid transparent',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="dashboard-nav-actions" style={{ gap: 'var(--space-sm)' }}>
        <button
          onClick={() => navigate('/safety-hub')}
          className="btn"
          style={{
            background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 'var(--text-xs)',
            padding: 'var(--space-xs) var(--space-md)',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 0 12px rgba(231, 76, 60, 0.4)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          🆘 SOS Emergency
        </button>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
              style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-xs) var(--space-sm)' }}
            >
              Dashboard ({user.role.name})
            </button>
            {user.role.name === 'ADMIN' && (
              <button
                onClick={() => navigate('/admin')}
                className="btn btn-primary"
                style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-xs) var(--space-sm)' }}
              >
                Admin
              </button>
            )}
            <button
              onClick={handleLogout}
              className="btn btn-ghost"
              style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-xs) var(--space-sm)' }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
            <Link to="/login" className="btn btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-xs) var(--space-md)' }}>
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-xs) var(--space-md)' }}>
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
