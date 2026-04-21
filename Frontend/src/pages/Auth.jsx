import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { registerUser, loginUser } from '../api/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

export default function Auth() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const cardRef  = useRef(null);
  const logoRef  = useRef(null);
  const blobRef1 = useRef(null);
  const blobRef2 = useRef(null);

  const { login } = useAuth();
  const navigate  = useNavigate();

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(blobRef1.current, { scale: 0 }, { scale: 1, duration: 1.2, ease: 'power3.out' })
      .fromTo(blobRef2.current, { scale: 0 }, { scale: 1, duration: 1.2, ease: 'power3.out' }, '-=1')
      .fromTo(logoRef.current,  { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.7)' }, '-=0.5')
      .fromTo(cardRef.current,  { y: 60,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.4');

    // Floating blobs
    gsap.to(blobRef1.current, { y: 30, repeat: -1, yoyo: true, duration: 4, ease: 'sine.inOut' });
    gsap.to(blobRef2.current, { y: -25, repeat: -1, yoyo: true, duration: 5, ease: 'sine.inOut' });
  }, []);

  const switchMode = () => {
    gsap.to(cardRef.current, { opacity: 0, y: 20, duration: 0.2, onComplete: () => {
      setMode(m => m === 'login' ? 'register' : 'login');
      setForm({ username: '', email: '', password: '' });
      gsap.to(cardRef.current, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' });
    }});
  };

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'register') {
        const res = await registerUser({ username: form.username, email: form.email, password: form.password });
        setToast({ message: res.data.message || 'Registered! Please log in.', type: 'success' });
        setTimeout(() => setMode('login'), 1500);
      } else {
        await loginUser({ email: form.email, password: form.password });
        login({ username: form.email.split('@')[0], email: form.email });
        setToast({ message: 'Welcome back! 🎉', type: 'success' });
        setTimeout(() => navigate('/feed'), 800);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      setToast({ message: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div ref={logoRef} className="text-center mb-4">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>
            Pixora
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {mode === 'login' ? 'Sign in to your world' : 'Join the community'}
          </p>
        </div>

        {/* Card */}
        <div ref={cardRef} className="auth-card">
          <h2 style={{ fontWeight: 700, fontSize: '1.4rem', marginBottom: 8 }}>
            {mode === 'login' ? 'Welcome back 👋' : 'Create account ✨'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 28 }}>
            {mode === 'login'
              ? 'Enter your credentials to continue'
              : 'Fill in the details to get started'}
          </p>

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="mb-3">
                <label className="form-label" style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600 }}>Username</label>
                <input
                  id="register-username"
                  name="username"
                  type="text"
                  className="form-control clean-input"
                  placeholder="your_username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className="mb-3">
              <label className="form-label" style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600 }}>Email</label>
              <input
                id="auth-email"
                name="email"
                type="email"
                className="form-control clean-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label" style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600 }}>Password</label>
              <input
                id="auth-password"
                name="password"
                type="password"
                className="form-control clean-input"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              id="auth-submit"
              type="submit"
              className="btn-primary-clean w-100"
              style={{ width: '100%', fontSize: '0.95rem' }}
              disabled={loading}
            >
              {loading
                ? <span className="spinner-border spinner-border-sm me-2" />
                : null}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <hr className="divider" />

          <p className="text-center" style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              id="auth-switch"
              onClick={switchMode}
              className="border-0"
              style={{ background: 'none', color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}
            >
              {mode === 'login' ? 'Register' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
