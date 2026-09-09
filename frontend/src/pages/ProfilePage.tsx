import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { profileApi } from '../api/client';

interface ProfileData {
  user: {
    id: string;
    email: string;
    phone: string | null;
    firstName: string;
    lastName: string;
    role: string;
  };
  stakeholderType: 'TOURIST' | 'GUIDE' | 'HOMESTAY' | 'ADMIN' | 'FOREST_AUTHORITY';
  profile: any;
}

interface VerificationDocument {
  id: string;
  documentType: string;
  documentUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
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

const IconBell = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconLogOut = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  // Verification submission state
  const [docType, setDocType] = useState('GOVT_ID');
  const [docUrl, setDocUrl] = useState('');
  const [submittingDoc, setSubmittingDoc] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const reloadProfile = useCallback(async () => {
    try {
      const res = await profileApi.getProfile();
      const data: ProfileData = res.data.data;
      setProfileData(data);
      setEditForm(data.profile || {});

      if (data.stakeholderType === 'GUIDE') {
        const vRes = await profileApi.getGuideVerification();
        setDocuments(vRes.data.data.documents || []);
      } else if (data.stakeholderType === 'HOMESTAY') {
        const vRes = await profileApi.getHomestayVerification();
        setDocuments(vRes.data.data.documents || []);
      }
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || 'Failed to reload profile';
      setError(msg);
      toast.error(msg);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    profileApi.getProfile()
      .then((res) => {
        if (!isMounted) return;
        const data: ProfileData = res.data.data;
        setProfileData(data);
        setEditForm(data.profile || {});

        if (data.stakeholderType === 'GUIDE') {
          profileApi.getGuideVerification().then((vRes) => {
            if (isMounted) setDocuments(vRes.data.data.documents || []);
          }).catch(() => {});
        } else if (data.stakeholderType === 'HOMESTAY') {
          profileApi.getHomestayVerification().then((vRes) => {
            if (isMounted) setDocuments(vRes.data.data.documents || []);
          }).catch(() => {});
        }
      })
      .catch((err: any) => {
        if (!isMounted) return;
        const msg = err.response?.data?.error?.message || 'Failed to load profile';
        setError(msg);
        toast.error(msg);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileData) return;

    setSaving(true);
    try {
      if (profileData.stakeholderType === 'TOURIST') {
        await profileApi.updateTouristProfile(editForm);
      } else if (profileData.stakeholderType === 'GUIDE') {
        const formatted = {
          ...editForm,
          experienceYears: Number(editForm.experienceYears) || 0,
          languages: Array.isArray(editForm.languages)
            ? editForm.languages
            : (editForm.languages || '').split(',').map((s: string) => s.trim()).filter(Boolean),
          specializations: Array.isArray(editForm.specializations)
            ? editForm.specializations
            : (editForm.specializations || '').split(',').map((s: string) => s.trim()).filter(Boolean),
        };
        await profileApi.updateGuideProfile(formatted);
      } else if (profileData.stakeholderType === 'HOMESTAY') {
        const formatted = {
          ...editForm,
          latitude: editForm.latitude ? Number(editForm.latitude) : null,
          longitude: editForm.longitude ? Number(editForm.longitude) : null,
        };
        await profileApi.updateHomestayProfile(formatted);
      } else {
        await profileApi.updateProfile(editForm);
      }

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      reloadProfile();
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || 'Failed to update profile';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docUrl.trim()) {
      toast.error('Please provide a valid document URL');
      return;
    }

    setSubmittingDoc(true);
    try {
      let res: any;
      if (profileData?.stakeholderType === 'GUIDE') {
        res = await profileApi.submitGuideVerification({ documentType: docType, documentUrl: docUrl });
      } else if (profileData?.stakeholderType === 'HOMESTAY') {
        res = await profileApi.submitHomestayVerification({ documentType: docType, documentUrl: docUrl });
      }

      toast.success('Verification document submitted!');
      setDocUrl('');
      if (res?.data?.data?.documents) {
        setDocuments(res.data.data.documents);
      }
      reloadProfile();
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Failed to submit document');
    } finally {
      setSubmittingDoc(false);
    }
  };

  if (loading) {
    return (
      <div className="sample1-layout" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#15803d', display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            <IconLeaf />
          </div>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Loading your profile command center...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="sample1-layout" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '32px', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>Profile Loading Error</h2>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '20px' }}>{error || 'Unable to retrieve profile information.'}</p>
          <button className="sample1-hero-btn" onClick={() => reloadProfile()} style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  const { profile, stakeholderType } = profileData;
  const completionScore = profile?.profileCompletion ?? 0;
  const verificationStatus = profile?.verificationStatus || 'UNVERIFIED';

  return (
    <div className="sample1-layout">
      {/* ── Left Compact Sidebar (Sample-1 1:1 Match) ────────────── */}
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
            <Link to="/reviews-hub" className="sample1-nav-item">
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

      {/* ── Main Content Area ──────────────────────────────────── */}
      <div className="sample1-main-wrapper">
        {/* Top Header Bar */}
        <header className="sample1-header">
          <div className="sample1-user-controls">
            <button className="sample1-icon-btn" title="Notifications" onClick={() => navigate('/safety-hub')}>
              <IconBell />
            </button>

            <div className="sample1-user-pill" style={{ background: '#e6f4ea', border: '1px solid #bbf7d0' }}>
              <div className="sample1-avatar" style={{ background: '#15803d' }}>
                {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="sample1-user-info">
                <span className="sample1-user-name" style={{ color: '#111827' }}>{user?.firstName} {user?.lastName}</span>
                <span className="sample1-user-role" style={{ color: '#15803d' }}>{stakeholderType}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="sample1-btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              title="Log out"
            >
              <IconLogOut /> Sign Out
            </button>
          </div>
        </header>

        {/* Profile Content Container */}
        <div className="sample1-container">
          {/* Header Banner Card with Profile Completion */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#e6f4ea',
                color: '#15803d',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                marginBottom: '8px'
              }}>
                <IconUser /> Profile Command Center
              </div>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>
                {getGreeting()}, {user?.firstName}!
              </h1>
              <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
                Manage your Betla profile, credentials and stakeholder status.
              </p>
            </div>

            {/* Profile Completion Indicator */}
            <div style={{ minWidth: '220px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                <span style={{ color: '#374151' }}>Profile Completion</span>
                <span style={{ color: '#15803d' }}>{completionScore}%</span>
              </div>
              <div style={{
                height: 8,
                background: '#f3f4f6',
                borderRadius: '10px',
                overflow: 'hidden',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{
                  height: '100%',
                  width: `${completionScore}%`,
                  background: '#10b981',
                  transition: 'width 0.5s ease-in-out'
                }} />
              </div>
            </div>
          </div>

          {/* Main 2-Column Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '20px'
          }}>
            {/* Left Column: Stakeholder Profile Card */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              {/* Profile Top Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {profile?.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt={profile.fullName || user?.firstName}
                      style={{ width: 68, height: 68, borderRadius: '50%', objectFit: 'cover', border: '2px solid #10b981' }}
                    />
                  ) : (
                    <div style={{
                      width: 68,
                      height: 68,
                      borderRadius: '50%',
                      background: '#e6f4ea',
                      color: '#15803d',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                  )}

                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>
                      {profile?.fullName || `${user?.firstName} ${user?.lastName}`}
                    </h2>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{
                        background: '#e6f4ea',
                        color: '#15803d',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '12px'
                      }}>
                        {stakeholderType}
                      </span>
                      {stakeholderType !== 'TOURIST' && (
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: verificationStatus === 'VERIFIED' ? '#e6f4ea' : verificationStatus === 'PENDING' ? '#fef3c7' : '#fef2f2',
                          color: verificationStatus === 'VERIFIED' ? '#15803d' : verificationStatus === 'PENDING' ? '#d97706' : '#dc2626'
                        }}>
                          {verificationStatus === 'VERIFIED' ? '✓ Verified' : verificationStatus === 'PENDING' ? '⏳ Verification Pending' : '⚠️ Unverified'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  className="sample1-btn-secondary"
                  onClick={() => {
                    setEditForm(profile || {});
                    setIsEditing(!isEditing);
                  }}
                  style={{ fontSize: '0.78rem', padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <IconEdit /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
              </div>

              {!isEditing ? (
                /* Profile View Mode */
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '14px',
                  background: '#f9fafb',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid #f3f4f6'
                }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Email</div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#111827', marginTop: '2px' }}>{profileData.user.email}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Phone</div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#111827', marginTop: '2px' }}>{profileData.user.phone || 'Not set'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Account ID</div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#111827', marginTop: '2px', fontFamily: 'monospace' }}>
                      {profileData.user.id.slice(0, 8)}...
                    </div>
                  </div>

                  {stakeholderType === 'TOURIST' && (
                    <>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Date of Birth</div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#111827', marginTop: '2px' }}>
                          {profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('en-IN') : 'Not set'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Gender</div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#111827', marginTop: '2px' }}>{profile?.gender || 'Not set'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Location</div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#111827', marginTop: '2px' }}>
                          {[profile?.city, profile?.state, profile?.country].filter(Boolean).join(', ') || 'Not set'}
                        </div>
                      </div>
                    </>
                  )}

                  {stakeholderType === 'GUIDE' && (
                    <>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Experience</div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#111827', marginTop: '2px' }}>{profile?.experienceYears || 0} Years</div>
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <div style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Bio / Overview</div>
                        <div style={{ fontWeight: 500, fontSize: '0.825rem', color: '#374151', marginTop: '2px' }}>{profile?.bio || 'No bio added yet.'}</div>
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <div style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Languages</div>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {(profile?.languages || []).map((l: string) => (
                            <span key={l} style={{ fontSize: '0.7rem', padding: '2px 8px', background: '#f3f4f6', borderRadius: '4px', border: '1px solid #e5e7eb', color: '#374151' }}>{l}</span>
                          ))}
                          {(!profile?.languages || profile.languages.length === 0) && <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>None listed</span>}
                        </div>
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <div style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Specializations</div>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {(profile?.specializations || []).map((s: string) => (
                            <span key={s} style={{ fontSize: '0.7rem', padding: '2px 8px', background: '#e6f4ea', color: '#15803d', borderRadius: '4px', fontWeight: 600 }}>{s}</span>
                          ))}
                          {(!profile?.specializations || profile.specializations.length === 0) && <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>None listed</span>}
                        </div>
                      </div>
                    </>
                  )}

                  {stakeholderType === 'HOMESTAY' && (
                    <>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Property Name</div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#111827', marginTop: '2px' }}>{profile?.propertyName}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Owner Name</div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#111827', marginTop: '2px' }}>{profile?.ownerName}</div>
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <div style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Description</div>
                        <div style={{ fontWeight: 500, fontSize: '0.825rem', color: '#374151', marginTop: '2px' }}>{profile?.description || 'No property description added.'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Coordinates</div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#111827', marginTop: '2px' }}>
                          {profile?.latitude && profile?.longitude ? `${profile.latitude}, ${profile.longitude}` : 'Not set'}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* Inline Edit Form Mode */
                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }} htmlFor="fullName">Full Name</label>
                      <input
                        id="fullName"
                        type="text"
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.85rem', boxSizing: 'border-box' }}
                        value={editForm.fullName || editForm.ownerName || ''}
                        onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value, ownerName: e.target.value })}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }} htmlFor="profileImage">Profile Image URL</label>
                      <input
                        id="profileImage"
                        type="text"
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.85rem', boxSizing: 'border-box' }}
                        value={editForm.profileImage || ''}
                        onChange={(e) => setEditForm({ ...editForm, profileImage: e.target.value })}
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>

                    {stakeholderType === 'TOURIST' && (
                      <>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }} htmlFor="city">City</label>
                          <input
                            id="city"
                            type="text"
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.85rem', boxSizing: 'border-box' }}
                            value={editForm.city || ''}
                            onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }} htmlFor="state">State</label>
                          <input
                            id="state"
                            type="text"
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.85rem', boxSizing: 'border-box' }}
                            value={editForm.state || ''}
                            onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }} htmlFor="postalCode">Postal Code</label>
                          <input
                            id="postalCode"
                            type="text"
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.85rem', boxSizing: 'border-box' }}
                            value={editForm.postalCode || ''}
                            onChange={(e) => setEditForm({ ...editForm, postalCode: e.target.value })}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }} htmlFor="country">Country</label>
                          <input
                            id="country"
                            type="text"
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.85rem', boxSizing: 'border-box' }}
                            value={editForm.country || ''}
                            onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                          />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }} htmlFor="bio">Bio</label>
                          <textarea
                            id="bio"
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.85rem', boxSizing: 'border-box' }}
                            rows={3}
                            value={editForm.bio || ''}
                            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          />
                        </div>
                      </>
                    )}

                    {stakeholderType === 'GUIDE' && (
                      <>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }} htmlFor="experienceYears">Experience (Years)</label>
                          <input
                            id="experienceYears"
                            type="number"
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.85rem', boxSizing: 'border-box' }}
                            value={editForm.experienceYears || ''}
                            onChange={(e) => setEditForm({ ...editForm, experienceYears: e.target.value })}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }} htmlFor="contactPhone">Contact Phone</label>
                          <input
                            id="contactPhone"
                            type="text"
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.85rem', boxSizing: 'border-box' }}
                            value={editForm.contactPhone || ''}
                            onChange={(e) => setEditForm({ ...editForm, contactPhone: e.target.value })}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }} htmlFor="hourlyRate">Daily Rate (INR)</label>
                          <input
                            id="hourlyRate"
                            type="number"
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.85rem', boxSizing: 'border-box' }}
                            value={editForm.hourlyRate || ''}
                            onChange={(e) => setEditForm({ ...editForm, hourlyRate: e.target.value })}
                          />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }} htmlFor="languages">Languages (comma-separated)</label>
                          <input
                            id="languages"
                            type="text"
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.85rem', boxSizing: 'border-box' }}
                            value={Array.isArray(editForm.languages) ? editForm.languages.join(', ') : editForm.languages || ''}
                            onChange={(e) => setEditForm({ ...editForm, languages: e.target.value })}
                            placeholder="Hindi, Nagpuri, English"
                          />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }} htmlFor="specializations">Specializations (comma-separated)</label>
                          <input
                            id="specializations"
                            type="text"
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.85rem', boxSizing: 'border-box' }}
                            value={Array.isArray(editForm.specializations) ? editForm.specializations.join(', ') : editForm.specializations || ''}
                            onChange={(e) => setEditForm({ ...editForm, specializations: e.target.value })}
                            placeholder="Tiger Tracking, Bird Watching"
                          />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }} htmlFor="bio">Bio</label>
                          <textarea
                            id="bio"
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.85rem', boxSizing: 'border-box' }}
                            rows={3}
                            value={editForm.bio || ''}
                            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          />
                        </div>
                      </>
                    )}

                    {stakeholderType === 'HOMESTAY' && (
                      <>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }} htmlFor="propertyName">Property Name</label>
                          <input
                            id="propertyName"
                            type="text"
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.85rem', boxSizing: 'border-box' }}
                            value={editForm.propertyName || ''}
                            onChange={(e) => setEditForm({ ...editForm, propertyName: e.target.value })}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }} htmlFor="contactPhone">Contact Phone</label>
                          <input
                            id="contactPhone"
                            type="text"
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.85rem', boxSizing: 'border-box' }}
                            value={editForm.contactPhone || ''}
                            onChange={(e) => setEditForm({ ...editForm, contactPhone: e.target.value })}
                          />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }} htmlFor="description">Property Description</label>
                          <textarea
                            id="description"
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.85rem', boxSizing: 'border-box' }}
                            rows={3}
                            value={editForm.description || ''}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }} htmlFor="latitude">Latitude</label>
                          <input
                            id="latitude"
                            type="number"
                            step="any"
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.85rem', boxSizing: 'border-box' }}
                            value={editForm.latitude || ''}
                            onChange={(e) => setEditForm({ ...editForm, latitude: e.target.value })}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }} htmlFor="longitude">Longitude</label>
                          <input
                            id="longitude"
                            type="number"
                            step="any"
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.85rem', boxSizing: 'border-box' }}
                            value={editForm.longitude || ''}
                            onChange={(e) => setEditForm({ ...editForm, longitude: e.target.value })}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    <button type="submit" className="sample1-hero-btn" disabled={saving} style={{ padding: '8px 18px', fontSize: '0.82rem' }}>
                      {saving ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                    <button type="button" className="sample1-btn-secondary" onClick={() => setIsEditing(false)} style={{ padding: '8px 18px', fontSize: '0.82rem' }}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right Column: Verification & Profile Documents Card */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                  <div style={{ color: '#15803d', display: 'flex' }}><IconShield /></div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                    Verification Status
                  </h3>
                </div>

                <div style={{
                  padding: '14px',
                  borderRadius: '8px',
                  background: verificationStatus === 'VERIFIED' ? '#f0fdf4' : verificationStatus === 'PENDING' ? '#fefce8' : '#fef2f2',
                  border: `1px solid ${verificationStatus === 'VERIFIED' ? '#bbf7d0' : verificationStatus === 'PENDING' ? '#fef08a' : '#fecaca'}`,
                  marginBottom: '18px'
                }}>
                  <div style={{
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    color: verificationStatus === 'VERIFIED' ? '#15803d' : verificationStatus === 'PENDING' ? '#d97706' : '#dc2626'
                  }}>
                    {verificationStatus === 'VERIFIED' ? '✓ Identity Verified' : verificationStatus === 'PENDING' ? '⏳ Verification in Review' : '⚠️ Unverified Stakeholder'}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#4b5563', margin: '4px 0 0', lineHeight: 1.4 }}>
                    {verificationStatus === 'VERIFIED'
                      ? 'Your credentials have been verified by the Betla administration.'
                      : 'Submit official identification documents to achieve verified stakeholder status.'}
                  </p>
                </div>

                {/* Document Upload Form for Guides and Homestays */}
                {(stakeholderType === 'GUIDE' || stakeholderType === 'HOMESTAY') && (
                  <form onSubmit={handleSubmitVerification} style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827', margin: '0 0 10px' }}>
                      Submit Verification Document
                    </h4>
                    
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }} htmlFor="docType">Document Type</label>
                      <select
                        id="docType"
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.82rem', boxSizing: 'border-box' }}
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                      >
                        <option value="GOVT_ID">Government ID</option>
                        <option value="GUIDE_LICENSE">Guide License</option>
                        <option value="PROPERTY_DEED">Property Deed / Registration</option>
                        <option value="TAX_REGISTRATION">Tax Registration</option>
                        <option value="AADHAAR">Aadhaar Card</option>
                        <option value="PASSPORT">Passport</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }} htmlFor="docUrl">Document File URL</label>
                      <input
                        id="docUrl"
                        type="url"
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.82rem', boxSizing: 'border-box' }}
                        placeholder="https://example.com/docs/id.pdf"
                        value={docUrl}
                        onChange={(e) => setDocUrl(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingDoc}
                      className="sample1-hero-btn"
                      style={{ width: '100%', padding: '9px', fontSize: '0.82rem' }}
                    >
                      {submittingDoc ? 'Submitting Document...' : 'Submit Document'}
                    </button>
                  </form>
                )}

                {/* Uploaded Documents List */}
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
                  Submitted Documents ({documents.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {documents.map((doc) => (
                    <div key={doc.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      fontSize: '0.78rem'
                    }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600, color: '#374151' }}>
                        {doc.documentType}
                      </div>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '10px',
                        background: doc.status === 'APPROVED' ? '#e6f4ea' : '#fef3c7',
                        color: doc.status === 'APPROVED' ? '#15803d' : '#d97706'
                      }}>
                        {doc.status}
                      </span>
                    </div>
                  ))}
                  {documents.length === 0 && (
                    <div style={{ fontSize: '0.78rem', color: '#9ca3af', padding: '8px 0' }}>
                      No verification documents uploaded yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="sample1-footer">
          <div>Betla Eco-Companion | Department of Forest, Jharkhand</div>
          <div style={{ color: '#15803d', fontWeight: 600 }}>Explore • Protect • Preserve</div>
        </footer>
      </div>
    </div>
  );
}
