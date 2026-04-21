import { useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/feed',    label: 'Feed',    icon: HomeIcon    },
  { to: '/people',  label: 'People',  icon: UsersIcon   },
  { to: '/create',  label: 'Create',  icon: PlusIcon    },
  { to: '/profile', label: 'Profile', icon: UserIcon    },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(sidebarRef.current,
      { x: -240, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
    );
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : '??';

  return (
    <>
      {/* Desktop Sidebar */}
      <nav ref={sidebarRef} className="sidebar d-none d-md-flex flex-column">
        {/* Logo */}
        <div className="px-6 mb-8" style={{ padding: '0 24px', marginBottom: 32 }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Pixora
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 2 }}>Social Platform</p>
        </div>

        {/* Nav links */}
        <div style={{ flex: 1 }}>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </div>

        {/* User + Logout */}
        <div style={{ padding: '0 16px' }}>
          <div className="card-clean" style={{ padding: '16px', borderRadius: 12 }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="avatar avatar-sm">{initials}</div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.85rem', margin: 0 }}>{user?.username || 'User'}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', margin: 0 }}>{user?.email || ''}</p>
              </div>
            </div>
            <button
              className="btn-outline-clean w-100"
              style={{ fontSize: '0.82rem', padding: '8px' }}
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-nav">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={22} />
            {label}
          </NavLink>
        ))}
        <button
          className="mobile-nav-item border-0"
          style={{ background: 'none', cursor: 'pointer' }}
          onClick={handleLogout}
        >
          <LogoutIcon size={22} />
          <span>Out</span>
        </button>
      </nav>
    </>
  );
}

/* ── Inline SVG Icons ── */
function HomeIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}
function PlusIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  );
}
function UserIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
}
function UsersIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  );
}
function LogoutIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}
