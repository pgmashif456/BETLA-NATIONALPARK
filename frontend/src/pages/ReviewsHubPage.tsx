import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

// Clean inline SVG Icons matching Sample-1 visual language
const IconLeaf = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);

const IconHome = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const IconCompass = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
);

const IconCar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="8" rx="2"/>
    <path d="M7 11V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4"/>
    <circle cx="7.5" cy="15.5" r="1.5"/>
    <circle cx="16.5" cy="15.5" r="1.5"/>
  </svg>
);

const IconMapPin = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconBed = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4v16"/>
    <path d="M2 8h18a2 2 0 0 1 2 2v10"/>
    <path d="M2 17h20"/>
    <path d="M6 8v9"/>
  </svg>
);

const IconShield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const IconTrees = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 10v.2A3 3 0 0 1 8.9 16v0H5v0a3 3 0 0 1-1.1-5.8V10a3 3 0 0 1 6 0Z"/>
    <path d="M7 16v6"/>
    <path d="M13 19v3"/>
    <path d="M12 19h8.3a3 3 0 0 0 1.7-5.5 3 3 0 0 0-4-4.4 3 3 0 0 0-5.3 2.1 3 3 0 0 0-.7 2.3 3 3 0 0 0 0 5.5Z"/>
  </svg>
);

const IconBarChart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10"/>
    <line x1="18" y1="20" x2="18" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="16"/>
  </svg>
);

const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IconBell = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const IconStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconCalendar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

export function ReviewsHubPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
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
    <div className="sample1-layout">
      {/* --- Left Compact Sidebar (Sample-1 1:1 Match) --- */}
      <aside className="sample1-sidebar">
        <div>
          <div className="sample1-brand">
            <div className="sample1-brand-icon"><IconLeaf /></div>
            <div>
              <div className="sample1-brand-text">Betla</div>
              <div style={{ fontSize: '0.68rem', color: '#6ee7b7', fontWeight: 600 }}>Eco-Companion</div>
            </div>
          </div>
          <div className="sample1-brand-sub">Explore • Protect • Preserve</div>

          {/* Navigation Items */}
          <nav className="sample1-nav-group">
            <Link to="/dashboard" className="sample1-nav-item">
              <IconHome /> <span>Dashboard</span>
            </Link>
            <Link to="/discover" className="sample1-nav-item">
              <IconCompass /> <span>Tourist Discovery</span>
            </Link>
            <Link to="/experiences" className="sample1-nav-item">
              <IconCar /> <span>Safaris & Booking</span>
            </Link>
            <Link to="/" className="sample1-nav-item">
              <IconMapPin /> <span>Places to Visit</span>
            </Link>
            <Link to="/guides-stays" className="sample1-nav-item">
              <IconBed /> <span>Stay & Facilities</span>
            </Link>
            <Link to="/safety-hub" className="sample1-nav-item">
              <IconShield /> <span>Safety & Emergency</span>
            </Link>
            <Link to="/eco-portal" className="sample1-nav-item">
              <IconTrees /> <span>Eco Portal</span>
            </Link>
            <Link to="/reviews-hub" className="sample1-nav-item active">
              <IconBarChart /> <span>Reports & Analytics</span>
            </Link>
          </nav>
        </div>

        <div className="sample1-sidebar-footer">
          <div className="sample1-sidebar-graphic">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px', color: '#10b981' }}>
              <IconTrees />
            </div>
            <div style={{ fontWeight: 600, color: '#e5e7eb', marginBottom: '2px' }}>For Wildlife</div>
            <div style={{ fontSize: '0.68rem', color: '#79a890' }}>For Future</div>
          </div>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <div className="sample1-main-wrapper">
        {/* Header Bar */}
        <header className="sample1-header">
          <div className="sample1-search-box">
            <IconSearch />
            <input
              type="text"
              placeholder="Search reviews, visitor feedback..."
              className="sample1-search-input"
              onClick={() => navigate('/discover')}
            />
          </div>

          <div className="sample1-user-controls">
            <button className="sample1-icon-btn" title="Notifications" onClick={() => navigate('/safety-hub')}>
              <IconBell />
            </button>

            {user ? (
              <div className="sample1-user-pill" onClick={() => navigate('/profile')}>
                <div className="sample1-avatar">
                  {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="sample1-user-info">
                  <span className="sample1-user-name">{user.firstName} {user.lastName}</span>
                  <span className="sample1-user-role">{user.role.name}</span>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link to="/login" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#15803d', padding: '5px 12px', borderRadius: '20px', border: '1px solid #15803d', textDecoration: 'none' }}>
                  Sign In
                </Link>
                <Link to="/register" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'white', background: '#10b981', padding: '5px 12px', borderRadius: '20px', textDecoration: 'none' }}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Reviews Hub Content Container */}
        <div className="sample1-container">
          {/* Header Banner */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#fef3c7',
              color: '#b45309',
              padding: '4px 14px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '10px'
            }}>
              <IconStar /> Verified Traveler Stories
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>
              Traveler Reviews & Testimonials
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', maxWidth: '680px', margin: '0 auto 20px', lineHeight: 1.5 }}>
              Authentic experiences shared by eco-tourists exploring Betla National Park, Palamau Forts, and local homestays.
            </p>

            {/* Metrics and Action Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '32px',
              flexWrap: 'wrap'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  {avgRating} <IconStar />
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>Average Tourist Rating</div>
              </div>

              <div style={{ width: '1px', height: '36px', background: '#e5e7eb' }} />

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#15803d' }}>
                  {reviews.length}+
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>Verified Reviews</div>
              </div>

              <div style={{ width: '1px', height: '36px', background: '#e5e7eb' }} />

              <div>
                <button
                  onClick={() => {
                    if (!user) {
                      toast.error('Please sign in to submit a review');
                    } else {
                      setShowModal(true);
                    }
                  }}
                  className="sample1-hero-btn"
                  style={{
                    fontSize: '0.82rem',
                    padding: '9px 20px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <IconEdit /> Write a Review
                </button>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {['ALL', 'EXPERIENCE', 'HOMESTAY', 'GUIDE', 'DESTINATION'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTargetFilter(tf)}
                className={targetFilter === tf ? 'sample1-hero-btn' : 'sample1-btn-secondary'}
                style={{
                  fontSize: '0.78rem',
                  padding: '6px 16px',
                  borderRadius: '20px'
                }}
              >
                {tf === 'ALL' ? 'All Reviews' : tf}
              </button>
            ))}
          </div>

          {/* Reviews Feed */}
          {loading ? (
            <div style={{ color: '#6b7280', textAlign: 'center', padding: '40px 0', fontSize: '0.875rem' }}>
              Loading traveler reviews...
            </div>
          ) : filteredReviews.length === 0 ? (
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              textAlign: 'center',
              padding: '40px 20px',
              color: '#6b7280',
              fontSize: '0.875rem'
            }}>
              No reviews under this category yet.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '18px'
            }}>
              {filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                  }}
                >
                  <div>
                    {/* Badge & Rating Stars */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{
                        background: '#e6f4ea',
                        color: '#15803d',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '12px'
                      }}>
                        {rev.targetType}
                      </span>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <IconStar key={i} />
                        ))}
                      </div>
                    </div>

                    {rev.title && (
                      <h3 style={{ fontSize: '1.02rem', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
                        {rev.title}
                      </h3>
                    )}

                    <p style={{ fontSize: '0.825rem', color: '#4b5563', lineHeight: 1.6, margin: '0 0 16px', fontStyle: 'italic' }}>
                      "{rev.comment}"
                    </p>
                  </div>

                  <div style={{
                    paddingTop: '12px',
                    borderTop: '1px solid #f3f4f6',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    <span>
                      By <strong style={{ color: '#374151' }}>{rev.user ? `${rev.user.firstName} ${rev.user.lastName ? rev.user.lastName[0] + '.' : ''}` : 'Verified Traveler'}</strong>
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <IconCalendar /> {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Review Submission Modal */}
          {showModal && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(4px)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
              }}
            >
              <div style={{
                background: '#ffffff',
                borderRadius: '12px',
                maxWidth: '500px',
                width: '100%',
                padding: '24px',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                    Submit Your Experience Review
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#6b7280' }}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '5px' }} htmlFor="rev-target">
                      Category
                    </label>
                    <select
                      id="rev-target"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        color: '#111827',
                        background: '#ffffff',
                        outline: 'none'
                      }}
                      value={newReview.targetType}
                      onChange={(e) => setNewReview({ ...newReview, targetType: e.target.value })}
                    >
                      <option value="DESTINATION">Destination Spot</option>
                      <option value="EXPERIENCE">Safari / Trek Experience</option>
                      <option value="HOMESTAY">Homestay Accommodation</option>
                      <option value="GUIDE">Eco-Guide Service</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '5px' }} htmlFor="rev-rating">
                      Rating (1 to 5 Stars)
                    </label>
                    <select
                      id="rev-rating"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        color: '#111827',
                        background: '#ffffff',
                        outline: 'none'
                      }}
                      value={newReview.rating}
                      onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                    >
                      <option value={5}>5 - Outstanding</option>
                      <option value={4}>4 - Very Good</option>
                      <option value={3}>3 - Average</option>
                      <option value={2}>2 - Poor</option>
                      <option value={1}>1 - Terrible</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '5px' }} htmlFor="rev-title">
                      Review Headline
                    </label>
                    <input
                      id="rev-title"
                      type="text"
                      placeholder="e.g. Amazing early morning tiger sighting"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        color: '#111827',
                        background: '#ffffff',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      value={newReview.title}
                      onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '5px' }} htmlFor="rev-comment">
                      Detailed Review
                    </label>
                    <textarea
                      id="rev-comment"
                      rows={4}
                      placeholder="Share your experience..."
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        color: '#111827',
                        background: '#ffffff',
                        outline: 'none',
                        resize: 'vertical',
                        boxSizing: 'border-box'
                      }}
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="sample1-hero-btn"
                      style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
                    >
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="sample1-btn-secondary"
                      style={{ padding: '10px 18px', fontSize: '0.85rem' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="sample1-footer">
          Betla Eco-Companion | Department of Forest, Jharkhand
        </footer>
      </div>
    </div>
  );
}

export default ReviewsHubPage;
