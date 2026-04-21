import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Sidebar from '../components/Sidebar';
import { getAllPosts, getFollowData, getMe } from '../api/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import bannerImg from '../assets/banner.png';

export default function Profile() {
  const { user: authUser } = useAuth();
  const [myId, setMyId]          = useState(null);
  const [posts, setPosts]         = useState([]);
  const [followData, setFollowData] = useState({ followersCount: 0, followingCount: 0, followers: [], following: [] });
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(null); // 'followers' | 'following' | null
  const [toast, setToast]         = useState(null);

  const bannerRef = useRef(null);
  const statsRef  = useRef(null);
  const gridRef   = useRef(null);

  const initials = authUser?.username ? authUser.username.slice(0, 2).toUpperCase() : '??';

  useEffect(() => {
    const tl = gsap.timeline();
    if (bannerRef.current) tl.fromTo(bannerRef.current, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' });
    if (statsRef.current)  tl.fromTo(statsRef.current,  { y: 20,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.3');
    if (gridRef.current)   tl.fromTo(gridRef.current,   { y: 30,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.2');
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const meRes = await getMe();
      const me = meRes.data.user;
      setMyId(me._id);

      const [postsRes, followRes] = await Promise.all([
        getAllPosts(),
        getFollowData(me._id),
      ]);
      setPosts(postsRes.data.posts || []);
      setFollowData(followRes.data.data || { followersCount: 0, followingCount: 0, followers: [], following: [] });
    } catch (err) {
      setToast({ message: 'Failed to load profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Posts',     value: posts.length,               icon: '📷', color: '#8b5cf6', onClick: null },
    { label: 'Followers', value: followData.followersCount,  icon: '👥', color: '#ec4899', onClick: () => setModal('followers') },
    { label: 'Following', value: followData.followingCount,  icon: '✨', color: '#06b6d4', onClick: () => setModal('following') },
  ];

  return (
    <div>
      <Sidebar />
      <main className="main-content">

        {/* Banner */}
        <div ref={bannerRef}>
          <div style={{
            height: 180, borderRadius: 20,
            backgroundImage: `url(${bannerImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
          </div>

          <div className="card-clean" style={{ borderRadius: '0 0 20px 20px', borderTop: 'none', padding: '0 28px 24px', marginTop: '-1px' }}>
            <div className="d-flex align-items-end gap-4" style={{ transform: 'translateY(-32px)', marginBottom: -32 }}>
              <div className="avatar" style={{ width: 80, height: 80, fontSize: '1.8rem', border: '4px solid var(--bg-primary)', flexShrink: 0 }}>
                {initials}
              </div>
              <div style={{ flex: 1, paddingBottom: 4 }}>
                <h3 style={{ fontWeight: 800, fontSize: '1.4rem', margin: 0 }}>@{authUser?.username || 'Profile'}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>{authUser?.email}</p>
              </div>
              <span className="badge-clean" style={{ alignSelf: 'flex-end' }}>Public</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="row g-3 mt-4 mb-5">
          {stats.map(s => (
            <div key={s.label} className="col-4">
              <StatCard {...s} />
            </div>
          ))}
        </div>

        {/* Posts grid */}
        <div ref={gridRef}>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h4 style={{ fontWeight: 700, margin: 0 }}>
              My Posts
            </h4>
            <a href="/create" className="btn-primary-clean" style={{ padding: '8px 20px', borderRadius: 10, fontSize: '0.85rem', textDecoration: 'none' }}>
              + New Post
            </a>
          </div>

          {loading && <div className="d-flex justify-content-center py-5"><div className="spinner-clean" /></div>}

          {!loading && posts.length === 0 && (
            <div className="text-center py-5">
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>📭</div>
              <p style={{ color: 'var(--text-muted)' }}>No posts yet. Start sharing!</p>
            </div>
          )}

          {!loading && posts.length > 0 && (
            <div className="row g-3">
              {posts.map(post => (
                <div key={post._id} className="col-6 col-md-4 col-lg-3">
                  <ProfilePostThumb post={post} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Followers / Following modal */}
      {modal && (
        <UserListModal
          title={modal === 'followers' ? 'Followers' : 'Following'}
          users={modal === 'followers' ? followData.followers : followData.following}
          onClose={() => setModal(null)}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({ label, value, icon, color, onClick }) {
  const ref = useRef(null);
  useEffect(() => {
    gsap.fromTo(ref.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)', delay: Math.random() * 0.25 });
  }, []);

  return (
    <div
      ref={ref}
      className="card-clean text-center"
      style={{ padding: '20px 12px', cursor: onClick ? 'pointer' : 'default', userSelect: 'none' }}
      onClick={onClick}
      title={onClick ? `View ${label}` : ''}
    >
      <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{icon}</div>
      <div style={{ fontWeight: 800, fontSize: '1.6rem', color }}>{value}</div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 500 }}>
        {label} {onClick && <span style={{ opacity: 0.5 }}>↗</span>}
      </div>
    </div>
  );
}

/* ── Post Thumbnail ── */
function ProfilePostThumb({ post }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        aspectRatio: '1/1', borderRadius: 12, overflow: 'hidden', position: 'relative', cursor: 'pointer',
        border: '1px solid var(--border-light)', transition: 'transform 0.25s ease',
        transform: hovered ? 'scale(1.04)' : 'scale(1)'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img src={post.image} alt={post.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      {hovered && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(37,99,235,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 600, fontSize: '0.82rem', color: 'white', padding: 8, textAlign: 'center'
        }}>
          {post.caption?.slice(0, 40)}{post.caption?.length > 40 ? '…' : ''}
        </div>
      )}
    </div>
  );
}

/* ── User List Modal ── */
function UserListModal({ title, users, onClose }) {
  const overlayRef = useRef(null);
  const boxRef     = useRef(null);

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
    gsap.fromTo(boxRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' });
  }, []);

  const handleClose = () => {
    gsap.to(boxRef.current, { y: 40, opacity: 0, duration: 0.25, onComplete: onClose });
  };

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
      }}
      onClick={handleClose}
    >
      <div
        ref={boxRef}
        className="card-clean"
        style={{ width: '100%', maxWidth: 420, maxHeight: '70vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', borderRadius: 20 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between" style={{ padding: '20px 24px 16px' }}>
          <h5 style={{ fontWeight: 700, margin: 0 }}>{title}</h5>
          <button
            onClick={handleClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}
          >✕</button>
        </div>
        <div className="divider" style={{ margin: '0 24px' }} />

        {/* List */}
        <div style={{ overflowY: 'auto', padding: '8px 24px 24px' }}>
          {users.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '32px 0' }}>
              {title === 'Followers' ? 'No followers yet' : 'Not following anyone yet'}
            </p>
          ) : (
            users.map(u => (
              <UserRow key={u._id} user={u} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function UserRow({ user }) {
  const initials = user.username ? user.username.slice(0, 2).toUpperCase() : '??';
  return (
    <div className="d-flex align-items-center gap-3" style={{ padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
      <div className="avatar avatar-sm" style={{ background: `hsl(${(user.username?.charCodeAt(0) * 37) % 360}, 60%, 55%)` }}>
        {initials}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 600, margin: 0, fontSize: '0.9rem' }}>@{user.username}</p>
        {user.bio && <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.bio}</p>}
      </div>
    </div>
  );
}
