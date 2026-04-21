import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { likePost } from '../api/api';

export default function PostCard({ post, onLike }) {
  const cardRef = useRef(null);
  const heartRef = useRef(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }
    );
  }, []);

  const handleLike = async () => {
    if (liked || loading) return;
    setLoading(true);
    // Animate heart burst
    gsap.timeline()
      .to(heartRef.current, { scale: 1.5, duration: 0.15, ease: 'power2.out' })
      .to(heartRef.current, { scale: 1,   duration: 0.2,  ease: 'elastic.out(1, 0.5)' });

    try {
      await likePost(post._id);
      setLiked(true);
      if (onLike) onLike(post._id);
    } catch (err) {
      // already liked or error — still animate
    } finally {
      setLoading(false);
    }
  };

  const ownerName = post.owner?.username || 'Unknown';
  const initials  = ownerName.slice(0, 2).toUpperCase();
  const time      = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    : '';

  return (
    <div ref={cardRef} className="card-clean" style={{overflow:'hidden'}}>
      {/* Image */}
      {post.image && (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src={post.image}
            alt={post.caption}
            className="post-image"
            loading="lazy"
          />
        </div>
      )}

      {/* Card body */}
      <div style={{ padding: '16px' }}>
        {/* Owner row */}
        <div className="d-flex align-items-center gap-2 mb-3">
          <div className="avatar avatar-sm">{initials}</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, fontSize: '0.88rem', margin: 0, color: 'var(--text-primary)' }}>
              {ownerName}
            </p>
            {time && (
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>{time}</p>
            )}
          </div>
          <span className="badge-clean">Post</span>
        </div>

        {/* Caption */}
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: 16 }}>
          {post.caption}
        </p>

        <div className="divider" style={{ margin: '12px 0' }} />

        {/* Actions */}
        <div className="d-flex gap-2">
          <button
            ref={heartRef}
            className={`like-btn ${liked ? 'liked' : ''}`}
            onClick={handleLike}
            disabled={loading}
            title={liked ? 'Liked!' : 'Like this post'}
          >
            <HeartIcon liked={liked} />
            <span>{liked ? 'Liked' : 'Like'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function HeartIcon({ liked }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? '#E11D48' : 'none'} stroke={liked ? '#E11D48' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}
