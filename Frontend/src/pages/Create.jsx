import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import Sidebar from '../components/Sidebar';
import { createPost } from '../api/api';
import Toast from '../components/Toast';

export default function Create() {
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const headRef   = useRef(null);
  const formRef   = useRef(null);
  const previewRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(headRef.current, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
    gsap.fromTo(formRef.current, { y: 40,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.15 });
  }, []);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    // Animate preview in
    if (previewRef.current) {
      gsap.fromTo(previewRef.current, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setToast({ message: 'Please select an image', type: 'warning' }); return; }
    setLoading(true);
    const fd = new FormData();
    fd.append('caption', caption);
    fd.append('image', file);

    try {
      const res = await createPost(fd);
      setToast({ message: res.data.message || 'Post created! 🎉', type: 'success' });
      setCaption('');
      setFile(null);
      setPreview(null);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to create post', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Sidebar />
      <main className="main-content">
        <div ref={headRef} className="mb-5">
          <h2 style={{ fontWeight: 800, fontSize: '2rem' }}>
            Create Post
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Share something beautiful with your world</p>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 col-md-9 col-lg-7">
            <div className="card-clean" style={{ padding: '40px', background: 'var(--bg-card)' }}>
              <form ref={formRef} onSubmit={handleSubmit}>
                {/* Image Upload */}
                <div className="mb-4">
                  <label
                    className="upload-area d-block"
                    htmlFor="image-upload"
                    onDragOver={e => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    {preview ? (
                      <div ref={previewRef}>
                        <img
                          src={preview}
                          alt="Preview"
                          style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: '12px' }}
                        />
                        <p style={{ color: 'var(--text-primary)', marginTop: 16, fontSize: '0.85rem', fontWeight: 600 }}>
                          ✓ Image selected — click to change
                        </p>
                      </div>
                    ) : (
                      <div style={{ padding: '20px 0' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🖼️</div>
                        <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1.05rem', marginBottom: 6 }}>
                          Drop your image here
                        </p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 0 }}>
                          or click to browse — JPG, PNG, WebP
                        </p>
                      </div>
                    )}
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="d-none"
                    onChange={handleFileChange}
                  />
                </div>

                {/* Caption */}
                <div className="mb-5">
                  <label className="form-label" style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600, marginBottom: 12 }}>
                    Caption
                  </label>
                  <textarea
                    id="post-caption"
                    className="form-control clean-input"
                    rows={4}
                    placeholder="Write something meaningful…"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    required
                    style={{ resize: 'none' }}
                  />
                  <div className="d-flex justify-content-end mt-2">
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>{caption.length}/500</span>
                  </div>
                </div>

                <button
                  id="create-post-submit"
                  type="submit"
                  className="btn-primary-clean w-100"
                  style={{ padding: '16px', fontSize: '1rem' }}
                  disabled={loading}
                >
                  {loading
                    ? <><span className="spinner-border spinner-border-sm me-2" />Publishing…</>
                    : 'Publish Post'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
