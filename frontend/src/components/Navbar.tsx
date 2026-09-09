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
    { label: 'Safaris & Treks', path: '/experiences', icon: '🐅' },
    { label: 'Guides & Stays', path: '/guides-stays', icon: '🏡' },
    { label: 'Safety Hub', path: '/safety-hub', icon: '🛡️' },
    { label: 'Eco Portal', path: '/eco-portal', icon: '🌿' },
    { label: 'Reviews', path: '/reviews-hub', icon: '⭐' },
  ];

  return (
    <nav className="dashboard-nav">
      <div className="dashboard-nav-brand">
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <div className="auth-logo-icon" style={{ width: 38, height: 38, fontSize: '1.2rem', background: 'var(--gradient-primary)' }}>🌲</div>
          <span className="auth-logo-text" style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: '#f0fdf4' }}>Betla Eco-Companion</span>
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflowX: 'auto' }}>
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              style={{
                textDecoration: 'none',
                color: isActive ? '#4ade80' : '#a7f3d0',
                fontWeight: isActive ? 700 : 500,
                fontSize: 'var(--text-sm)',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'rgba(34, 197, 94, 0.16)' : 'transparent',
                border: isActive ? '1px solid rgba(34, 197, 94, 0.35)' : '1px solid transparent',
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
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 'var(--text-xs)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
          }}
        >
          🚨 SOS Emergency
        </button>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
              style={{ fontSize: 'var(--text-xs)', padding: '6px 12px' }}
            >
              Dashboard ({user.role.name})
            </button>
            {user.role.name === 'ADMIN' && (
              <button
                onClick={() => navigate('/admin')}
                className="btn btn-primary"
                style={{ fontSize: 'var(--text-xs)', padding: '6px 12px' }}
              >
                Admin
              </button>
            )}
            <button
              onClick={handleLogout}
              className="btn btn-ghost"
              style={{ fontSize: 'var(--text-xs)', padding: '6px 12px' }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
            <Link to="/login" className="btn btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: '6px 14px' }}>
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ fontSize: 'var(--text-xs)', padding: '6px 14px' }}>
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
