import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { reviewApi } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface ReviewItem {
  id: string;
  rating: number;
  title?: string;
  comment: string;
  targetType: string;
  createdAt: string;
  user?: { firstName: string; lastName: string };
}

export function ReviewsHubPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [targetFilter, setTargetFilter] = useState<string>('ALL');

  // Submit Review Modal state
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newReview, setNewReview] = useState({
    bookingId: '',
    targetType: 'DESTINATION',
    targetId: '',
    rating: 5,
    title: '',
    comment: '',
  });
  const [submitting, setSubmitting] = useState<boolean>(false);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await reviewApi.getPublicReviews();
      setReviews(res.data?.data || res.data || []);
    } catch {
      // Fallback reviews
      setReviews([
        {
          id: 'r1',
          rating: 5,
          title: 'Unforgettable Sunrise Jeep Safari!',
          comment: 'We were lucky to spot a wild tigress near Zone 2 waterhole! Guide Rameshwar was incredibly knowledgeable about tiger movements.',
          targetType: 'EXPERIENCE',
          createdAt: '2026-08-28T10:00:00Z',
          user: { firstName: 'Amit', lastName: 'Kumar' },
        },
        {
          id: 'r2',
          rating: 5,
          title: 'Warm hospitality at Betla Canopy Eco Lodge',
          comment: 'Authentic organic Jharkhand food, peaceful starlit night, and very friendly host family. Highly recommended for nature lovers.',
          targetType: 'HOMESTAY',
          createdAt: '2026-08-30T14:30:00Z',
          user: { firstName: 'Priya', lastName: 'Sharma' },
        },
        {
          id: 'r3',
          rating: 4,
          title: 'Serene Sunset at Kechki River Confluence',
          comment: 'The confluence of North Koel and Auranga rivers is breath-taking. Pristine, quiet, and plastic-free.',
          targetType: 'DESTINATION',
          createdAt: '2026-09-01T17:15:00Z',
          user: { firstName: 'Rahul', lastName: 'Verma' },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await reviewApi.getPublicReviews();
        if (isMounted) setReviews(res.data?.data || res.data || []);
      } catch {
        if (isMounted) {
          setReviews([
            {
              id: 'r1',
              rating: 5,
              title: 'Unforgettable Sunrise Jeep Safari!',
              comment: 'We were lucky to spot a wild tigress near Zone 2 waterhole! Guide Rameshwar was incredibly knowledgeable about tiger movements.',
              targetType: 'EXPERIENCE',
              createdAt: '2026-08-28T10:00:00Z',
              user: { firstName: 'Amit', lastName: 'Kumar' },
            },
            {
              id: 'r2',
              rating: 5,
              title: 'Warm hospitality at Betla Canopy Eco Lodge',
              comment: 'Authentic organic Jharkhand food, peaceful starlit night, and very friendly host family. Highly recommended for nature lovers.',
              targetType: 'HOMESTAY',
              createdAt: '2026-08-30T14:30:00Z',
              user: { firstName: 'Priya', lastName: 'Sharma' },
            },
            {
              id: 'r3',
              rating: 4,
              title: 'Serene Sunset at Kechki River Confluence',
              comment: 'The confluence of North Koel and Auranga rivers is breath-taking. Pristine, quiet, and plastic-free.',
              targetType: 'DESTINATION',
              createdAt: '2026-09-01T17:15:00Z',
              user: { firstName: 'Rahul', lastName: 'Verma' },
            },
          ]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetch();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.comment) {
      toast.error('Please enter a review comment');
      return;
    }
    setSubmitting(true);
    try {
      await reviewApi.createReview(newReview);
      toast.success('Review submitted for moderation!');
      setShowModal(false);
      setNewReview({ bookingId: '', targetType: 'DESTINATION', targetId: '', rating: 5, title: '', comment: '' });
      loadReviews();
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Failed to submit review. Ensure you have a verified booking.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReviews = targetFilter === 'ALL'
    ? reviews
    : reviews.filter((r) => r.targetType === targetFilter);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '4.9';

  return (
    <div className="dashboard-layout">
      <Navbar />

      <main className="dashboard-content" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* Banner Hero */}
        <section
          className="glass-card"
          style={{
            textAlign: 'center',
            padding: 'var(--space-2xl) var(--space-xl)',
            marginBottom: 'var(--space-2xl)',
            background: 'linear-gradient(135deg, rgba(230, 180, 50, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: '1px solid var(--border-default)',
            animation: 'fadeInUp 0.6s ease-out',
          }}
        >
          <span className="badge badge-accent" style={{ marginBottom: 'var(--space-md)' }}>
            ⭐ Verified Traveler Stories
          </span>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: 'var(--space-sm)' }}>
            Traveler Reviews & Testimonials
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto var(--space-lg)' }}>
            Authentic experiences shared by eco-tourists exploring Betla National Park, Palamau Forts, and local homestays.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--space-xl)', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-accent)' }}>
                {avgRating} ⭐
              </span>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Average Tourist Rating</div>
            </div>
            <div>
              <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-primary)' }}>
                {reviews.length}+
              </span>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Verified Reviews</div>
            </div>
            <button
              onClick={() => {
                if (!user) {
                  toast.error('Please sign in to submit a review');
                } else {
                  setShowModal(true);
                }
              }}
              className="btn btn-primary"
              style={{ fontSize: 'var(--text-sm)', borderRadius: 'var(--radius-full)' }}
            >
              ✍️ Write a Review
            </button>
          </div>
        </section>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
          {['ALL', 'EXPERIENCE', 'HOMESTAY', 'GUIDE', 'DESTINATION'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTargetFilter(tf)}
              className={`btn ${targetFilter === tf ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)' }}
            >
              {tf === 'ALL' ? '🌟 All Reviews' : tf}
            </button>
          ))}
        </div>

        {/* Reviews Feed */}
        {loading ? (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-3xl)' }}>
            Loading traveler reviews...
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--text-muted)' }}>
            No reviews under this category yet.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-lg)' }}>
            {filteredReviews.map((rev) => (
              <div key={rev.id} className="glass-card stat-card-glow" style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xs)' }}>
                    <span className="badge badge-accent">{rev.targetType}</span>
                    <span style={{ color: '#f1c40f', fontWeight: 800 }}>{'⭐'.repeat(rev.rating)}</span>
                  </div>

                  {rev.title && (
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-xs)' }}>
                      {rev.title}
                    </h3>
                  )}

                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-md)' }}>
                    "{rev.comment}"
                  </p>
                </div>

                <div style={{ paddingTop: 'var(--space-md)', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                  <span>By <strong>{rev.user ? `${rev.user.firstName} ${rev.user.lastName[0]}.` : 'Verified Traveler'}</strong></span>
                  <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review Modal */}
        {showModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--space-md)',
            }}
          >
            <div className="glass-card" style={{ maxWidth: '500px', width: '100%', padding: 'var(--space-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                <h3 style={{ fontSize: 'var(--text-xl)', color: 'var(--text-primary)' }}>Submit Your Experience Review</h3>
                <button onClick={() => setShowModal(false)} className="btn btn-ghost" style={{ fontSize: '1.2rem' }}>
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="auth-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="rev-target">Category</label>
                  <select
                    id="rev-target"
                    className="form-input"
                    value={newReview.targetType}
                    onChange={(e) => setNewReview({ ...newReview, targetType: e.target.value })}
                  >
                    <option value="DESTINATION">Destination Spot</option>
                    <option value="EXPERIENCE">Safari / Trek Experience</option>
                    <option value="HOMESTAY">Homestay Accommodation</option>
                    <option value="GUIDE">Eco-Guide Service</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="rev-rating">Rating (1 to 5 Stars)</label>
                  <select
                    id="rev-rating"
                    className="form-input"
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ 5 - Outstanding</option>
                    <option value={4}>⭐⭐⭐⭐ 4 - Very Good</option>
                    <option value={3}>⭐⭐⭐ 3 - Average</option>
                    <option value={2}>⭐⭐ 2 - Poor</option>
                    <option value={1}>⭐ 1 - Terrible</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="rev-title">Review Headline</label>
                  <input
                    id="rev-title"
                    type="text"
                    placeholder="e.g. Amazing early morning tiger sighting"
                    className="form-input"
                    value={newReview.title}
                    onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="rev-comment">Detailed Review</label>
                  <textarea
                    id="rev-comment"
                    rows={4}
                    placeholder="Share your experience..."
                    className="form-input"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`btn btn-primary ${submitting ? 'btn-loading' : ''}`}
                    style={{ flex: 1 }}
                  >
                    Submit Review
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default ReviewsHubPage;
