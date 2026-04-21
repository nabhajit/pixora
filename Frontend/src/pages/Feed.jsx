import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import { getFeed } from '../api/api';
import Toast from '../components/Toast';

export default function Feed() {
  const [posts, setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]   = useState(null);

  const headRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    if (headRef.current) tl.fromTo(headRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const res = await getFeed();
      setPosts(res.data.posts || []);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to load feed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Stagger animate cards once loaded
  useEffect(() => {
    if (!loading && posts.length > 0) {
      const cards = document.querySelectorAll('.feed-post-card');
      gsap.fromTo(cards,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: 'power3.out' }
      );
    }
  }, [loading]);

  return (
    <div>
      <Sidebar />
      <main className="main-content">

        {/* Header */}
        <div ref={headRef} className="mb-5">
          <h2 style={{ fontWeight: 800, fontSize: '2rem' }}>
            Global Feed
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
            Showing posts from everyone · {!loading && `${posts.length} post${posts.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
            <div className="text-center">
              <div className="spinner-clean mx-auto mb-3" />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading feed…</p>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && posts.length === 0 && <EmptyState />}

        {/* Posts grid */}
        {!loading && posts.length > 0 && (
          <div className="row g-4">
            {posts.map(post => (
              <div key={post._id} className="col-12 col-sm-6 col-lg-4 feed-post-card">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )}
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

function EmptyState() {
  const ref = useRef(null);
  useEffect(() => {
    gsap.fromTo(ref.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' });
  }, []);

  return (
    <div ref={ref} className="text-center" style={{ padding: '80px 24px' }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'var(--bg-secondary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 24px', fontSize: '2rem'
      }}>
        📷
      </div>
      <h4 style={{ fontWeight: 700, marginBottom: 8 }}>Nothing here yet</h4>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Be the first to post something!</p>
      <a href="/create" className="btn-primary-clean" style={{ padding: '12px 28px', borderRadius: 12, textDecoration: 'none' }}>
        + Create Post
      </a>
    </div>
  );
}
