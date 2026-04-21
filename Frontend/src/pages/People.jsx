import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import Sidebar from '../components/Sidebar';
import { getAllUsers, getFollowData, toggleFollow, getMe } from '../api/api';
import Toast from '../components/Toast';

export default function People() {
  const [users, setUsers]       = useState([]);
  const [myId, setMyId]         = useState(null);
  const [following, setFollowing] = useState(new Set()); // set of userIds I follow
  const [loading, setLoading]   = useState(true);
  const [toast, setToast]       = useState(null);
  const [search, setSearch]     = useState('');

  const headRef    = useRef(null);
  const listRef    = useRef(null);

  useEffect(() => {
    gsap.fromTo(headRef.current, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
    fetchEverything();
  }, []);

  const fetchEverything = async () => {
    setLoading(true);
    try {
      // 1) Get my id
      const meRes = await getMe();
      const me = meRes.data.user;
      setMyId(me._id);

      // 2) Get all other users
      const usersRes = await getAllUsers();
      const allUsers = usersRes.data.users || [];
      setUsers(allUsers);

      // 3) Get who I already follow
      const followRes = await getFollowData(me._id);
      const alreadyFollowing = followRes.data.data?.following || [];
      setFollowing(new Set(alreadyFollowing.map(u => u._id)));

    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to load users', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Animate cards in once loaded
  useEffect(() => {
    if (!loading && listRef.current) {
      const cards = listRef.current.querySelectorAll('.people-card');
      gsap.fromTo(cards,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.07, ease: 'power3.out' }
      );
    }
  }, [loading, users]);

  const handleToggleFollow = async (userId) => {
    const wasFollowing = following.has(userId);
    // Optimistic update
    setFollowing(prev => {
      const next = new Set(prev);
      wasFollowing ? next.delete(userId) : next.add(userId);
      return next;
    });

    try {
      const res = await toggleFollow(userId);
      const msg = res.data.message || '';
      setToast({ message: msg, type: 'success' });
    } catch (err) {
      // Revert on failure
      setFollowing(prev => {
        const next = new Set(prev);
        wasFollowing ? next.add(userId) : next.delete(userId);
        return next;
      });
      setToast({ message: err.response?.data?.message || 'Action failed', type: 'error' });
    }
  };

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Sidebar />
      <main className="main-content">

        {/* Header */}
        <div ref={headRef} className="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-5">
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '2rem' }}>
              Find People
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
              Discover and connect with other users
            </p>
          </div>
          {/* Search */}
          <div style={{ position: 'relative', minWidth: 240 }}>
            <span style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-muted)', pointerEvents: 'none'
            }}>
              <SearchIcon />
            </span>
            <input
              id="people-search"
              type="text"
              className="form-control clean-input"
              placeholder="Search by name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 44, borderRadius: '100px', backgroundColor: 'var(--bg-card)' }}
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
            <div>
              <div className="spinner-clean mx-auto mb-3" />
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem' }}>Loading people…</p>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-5">
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
            <h5 style={{ fontWeight: 700 }}>No one found</h5>
            <p style={{ color: 'var(--text-muted)' }}>Try a different search or invite friends!</p>
          </div>
        )}

        {/* People grid */}
        {!loading && filtered.length > 0 && (
          <>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>
              {filtered.length} user{filtered.length !== 1 ? 's' : ''} found
            </p>
            <div ref={listRef} className="row g-4">
              {filtered.map(user => (
                <div key={user._id} className="col-12 col-sm-6 col-lg-4">
                  <PersonCard
                    user={user}
                    isFollowing={following.has(user._id)}
                    onToggle={() => handleToggleFollow(user._id)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

/* ── Person Card ── */
function PersonCard({ user, isFollowing, onToggle }) {
  const [busy, setBusy] = useState(false);
  const btnRef = useRef(null);

  const handleClick = async () => {
    if (busy) return;
    setBusy(true);
    // Button pop animation
    gsap.timeline()
      .to(btnRef.current, { scale: 0.92, duration: 0.1 })
      .to(btnRef.current, { scale: 1, duration: 0.25, ease: 'elastic.out(1, 0.5)' });
    await onToggle();
    setBusy(false);
  };

  const initials = user.username ? user.username.slice(0, 2).toUpperCase() : '??';

  return (
    <div className="people-card card-clean" style={{ padding: 24 }}>
      <div className="d-flex align-items-center gap-3 mb-4">
        {/* Avatar */}
        <div className="avatar" style={{
          width: 52, height: 52, fontSize: '1.1rem',
          background: `hsl(${(user.username.charCodeAt(0) * 37) % 360}, 60%, 55%)`
        }}>
          {initials}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            @{user.username}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.email}
          </p>
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <p style={{
          color: 'var(--text-muted)', fontSize: '0.83rem', lineHeight: 1.5,
          marginBottom: 20, borderLeft: '2px solid var(--border-light)', paddingLeft: 10
        }}>
          {user.bio}
        </p>
      )}

      {/* Follow button */}
      <button
        ref={btnRef}
        id={`follow-btn-${user._id}`}
        className={isFollowing ? 'btn-outline-clean w-100' : 'btn-primary-clean w-100'}
        style={{ borderRadius: 10, padding: '10px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        onClick={handleClick}
        disabled={busy}
      >
        {busy
          ? <span className="spinner-border spinner-border-sm" />
          : isFollowing ? <><UnfollowIcon /> Unfollow</> : <><FollowIcon /> Follow</>
        }
      </button>
    </div>
  );
}

/* ── Inline Icons ── */
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}
function FollowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
    </svg>
  );
}
function UnfollowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <line x1="22" y1="11" x2="16" y2="11"/>
    </svg>
  );
}
