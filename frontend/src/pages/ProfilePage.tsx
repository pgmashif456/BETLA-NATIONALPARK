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

  const roleEmoji: Record<string, string> = {
    TOURIST: '🎒',
    GUIDE: '🧭',
    HOMESTAY: '🏡',
    ADMIN: '👨‍💼',
    FOREST_AUTHORITY: '🌲',
  };

  if (loading) {
    return (
      <div className="dashboard-layout" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="auth-logo-icon spin" style={{ width: 48, height: 48, fontSize: '1.5rem', margin: '0 auto var(--space-md)' }}>🌿</div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading your profile command center...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="dashboard-layout" style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: 500, margin: '40px auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>⚠️</div>
          <h2>Profile Loading Error</h2>
          <p style={{ color: 'var(--text-secondary)', margin: 'var(--space-md) 0' }}>{error || 'Unable to retrieve profile information.'}</p>
          <button className="btn btn-primary" onClick={() => reloadProfile()}>Retry Loading</button>
        </div>
      </div>
    );
  }

  const { profile, stakeholderType } = profileData;
  const completionScore = profile?.profileCompletion ?? 0;
  const verificationStatus = profile?.verificationStatus || 'UNVERIFIED';

  return (
    <div className="dashboard-layout">
      {/* ── Left Navigation Sidebar ────────────────────────────── */}
      <aside className="dashboard-sidebar" style={{
        width: 260,
        background: 'var(--bg-surface-elevated)',
        borderRight: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        padding: 'var(--space-lg) var(--space-md)',
        minHeight: '100vh'
      }}>
        <div className="dashboard-nav-brand" style={{ marginBottom: 'var(--space-xl)', padding: '0 var(--space-sm)' }}>
          <div className="auth-logo-icon" style={{ width: 36, height: 36, fontSize: '1.1rem' }}>🌿</div>
          <span className="auth-logo-text" style={{ fontSize: 'var(--text-lg)' }}>Betla</span>
        </div>

        <div className="sidebar-menu" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)', flex: 1 }}>
          <Link to="/dashboard" className="sidebar-link" style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
            padding: 'var(--space-sm) var(--space-md)', borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)', textDecoration: 'none', transition: 'var(--transition-fast)'
          }}>
            <span>📊</span> Dashboard
          </Link>

          <Link to="/profile" className="sidebar-link active" style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
            padding: 'var(--space-sm) var(--space-md)', borderRadius: 'var(--radius-md)',
            color: 'var(--color-primary)', background: 'var(--color-primary-subtle)',
            fontWeight: 600, textDecoration: 'none'
          }}>
            <span>👤</span> Profile Command Center
          </Link>

          <Link to="/experiences" className="sidebar-link" style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
            padding: 'var(--space-sm) var(--space-md)', borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)', textDecoration: 'none', transition: 'var(--transition-fast)'
          }}>
            <span>🎫</span> Bookings & Permits
          </Link>

          <Link to="/reviews-hub" className="sidebar-link" style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
            padding: 'var(--space-sm) var(--space-md)', borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)', textDecoration: 'none', transition: 'var(--transition-fast)'
          }}>
            <span>⭐</span> Reviews Hub
          </Link>

          <div className="sidebar-link" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: 'var(--space-sm) var(--space-md)', color: 'var(--text-muted)'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}><span>⚙️</span> Settings</span>
            <span className="badge" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>Soon</span>
          </div>

        </div>

        {/* User Footer in Sidebar */}
        <div style={{
          paddingTop: 'var(--space-md)', borderTop: '1px solid var(--border-default)',
          display: 'flex', alignItems: 'center', gap: 'var(--space-md)'
        }}>
          <div className="avatar" style={{ width: 40, height: 40, fontSize: '0.9rem' }}>
            {user?.firstName[0]}{user?.lastName[0]}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.firstName} {user?.lastName}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{stakeholderType}</div>
          </div>
          <button className="btn btn-ghost" onClick={handleLogout} disabled={loggingOut} style={{ padding: '4px 8px' }}>
            🚪
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ──────────────────────────────────── */}
      <main className="dashboard-content" style={{ flex: 1, padding: 'var(--space-xl)' }}>
        {/* Header Bar */}
        <header className="glass-card" style={{ marginBottom: 'var(--space-xl)', padding: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-xs)' }}>
                {getGreeting()}, {user?.firstName}! {roleEmoji[stakeholderType] || '👤'}
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>Manage your Betla profile, credentials and stakeholder status.</p>
            </div>

            {/* Profile Completion Indicator */}
            <div style={{ minWidth: 220 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-xs)' }}>
                <span>Profile Completion</span>
                <span style={{ color: 'var(--color-primary)' }}>{completionScore}%</span>
              </div>
              <div style={{
                height: 8, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 'var(--radius-full)', overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%', width: `${completionScore}%`, background: 'var(--gradient-primary)',
                  transition: 'width 0.5s ease-in-out'
                }} />
              </div>
            </div>
          </div>
        </header>

        {/* Profile Command Center Content */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-xl)' }}>
          
          {/* Main Stakeholder Profile Card */}
          <div className="glass-card" style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
                {profile?.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={profile.fullName || user?.firstName}
                    style={{ width: 80, height: 80, borderRadius: 'var(--radius-full)', objectFit: 'cover', border: '2px solid var(--color-primary)' }}
                  />
                ) : (
                  <div className="avatar" style={{ width: 80, height: 80, fontSize: '2rem', background: 'var(--gradient-primary)' }}>
                    {user?.firstName[0]}{user?.lastName[0]}
                  </div>
                )}

                <div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)' }}>
                    {profile?.fullName || `${user?.firstName} ${user?.lastName}`}
                  </h2>
                  <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-xs)', alignItems: 'center' }}>
                    <span className="badge badge-primary">{roleEmoji[stakeholderType]} {stakeholderType}</span>
                    {stakeholderType !== 'TOURIST' && (
                      <span className={`badge ${verificationStatus === 'VERIFIED' ? 'badge-primary' : verificationStatus === 'PENDING' ? 'badge-accent' : ''}`}>
                        {verificationStatus === 'VERIFIED' ? '✓ Verified' : verificationStatus === 'PENDING' ? '⏳ Verification Pending' : '⚠️ Unverified'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                className="btn btn-secondary"
                onClick={() => {
                  setEditForm(profile || {});
                  setIsEditing(!isEditing);
                }}
              >
                {isEditing ? 'Cancel Edit' : '✏️ Edit Profile'}
              </button>
            </div>

            {/* Profile Information View or Edit Form */}
            {!isEditing ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-lg)', marginTop: 'var(--space-xl)' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</div>
                  <div style={{ fontWeight: 500, marginTop: 'var(--space-xs)' }}>{user?.email}</div>
                </div>

                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone Number</div>
                  <div style={{ fontWeight: 500, marginTop: 'var(--space-xs)' }}>{user?.phone || profile?.contactPhone || 'Not provided'}</div>
                </div>

                {stakeholderType === 'TOURIST' && (
                  <>
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date of Birth</div>
                      <div style={{ fontWeight: 500, marginTop: 'var(--space-xs)' }}>
                        {profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('en-IN') : 'Not set'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gender</div>
                      <div style={{ fontWeight: 500, marginTop: 'var(--space-xs)' }}>{profile?.gender || 'Not set'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</div>
                      <div style={{ fontWeight: 500, marginTop: 'var(--space-xs)' }}>
                        {[profile?.city, profile?.state, profile?.country].filter(Boolean).join(', ') || 'Not set'}
                      </div>
                    </div>
                  </>
                )}

                {stakeholderType === 'GUIDE' && (
                  <>
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Experience</div>
                      <div style={{ fontWeight: 500, marginTop: 'var(--space-xs)' }}>{profile?.experienceYears || 0} Years</div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bio / Overview</div>
                      <div style={{ fontWeight: 500, marginTop: 'var(--space-xs)' }}>{profile?.bio || 'No bio added yet.'}</div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-xs)' }}>Languages</div>
                      <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
                        {(profile?.languages || []).map((l: string) => (
                          <span key={l} className="badge badge-accent">{l}</span>
                        ))}
                        {(!profile?.languages || profile.languages.length === 0) && <span style={{ color: 'var(--text-muted)' }}>None listed</span>}
                      </div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-xs)' }}>Specializations</div>
                      <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
                        {(profile?.specializations || []).map((s: string) => (
                          <span key={s} className="badge badge-primary">{s}</span>
                        ))}
                        {(!profile?.specializations || profile.specializations.length === 0) && <span style={{ color: 'var(--text-muted)' }}>None listed</span>}
                      </div>
                    </div>
                  </>
                )}

                {stakeholderType === 'HOMESTAY' && (
                  <>
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Property Name</div>
                      <div style={{ fontWeight: 500, marginTop: 'var(--space-xs)' }}>{profile?.propertyName}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Owner Name</div>
                      <div style={{ fontWeight: 500, marginTop: 'var(--space-xs)' }}>{profile?.ownerName}</div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</div>
                      <div style={{ fontWeight: 500, marginTop: 'var(--space-xs)' }}>{profile?.description || 'No property description added.'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Coordinates</div>
                      <div style={{ fontWeight: 500, marginTop: 'var(--space-xs)' }}>
                        {profile?.latitude && profile?.longitude ? `${profile.latitude}, ${profile.longitude}` : 'Not set'}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Inline Edit Form */
              <form onSubmit={handleSaveProfile} className="auth-form" style={{ marginTop: 'var(--space-lg)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-md)' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="fullName">Full Name</label>
                    <input
                      id="fullName"
                      type="text"
                      className="form-input"
                      value={editForm.fullName || editForm.ownerName || ''}
                      onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value, ownerName: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="profileImage">Profile Image URL</label>
                    <input
                      id="profileImage"
                      type="text"
                      className="form-input"
                      value={editForm.profileImage || ''}
                      onChange={(e) => setEditForm({ ...editForm, profileImage: e.target.value })}
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>

                  {stakeholderType === 'TOURIST' && (
                    <>
                      <div className="form-group">
                        <label className="form-label" htmlFor="city">City</label>
                        <input
                          id="city"
                          type="text"
                          className="form-input"
                          value={editForm.city || ''}
                          onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="state">State</label>
                        <input
                          id="state"
                          type="text"
                          className="form-input"
                          value={editForm.state || ''}
                          onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="postalCode">Postal Code</label>
                        <input
                          id="postalCode"
                          type="text"
                          className="form-input"
                          value={editForm.postalCode || ''}
                          onChange={(e) => setEditForm({ ...editForm, postalCode: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  {stakeholderType === 'GUIDE' && (
                    <>
                      <div className="form-group">
                        <label className="form-label" htmlFor="experienceYears">Experience Years</label>
                        <input
                          id="experienceYears"
                          type="number"
                          className="form-input"
                          value={editForm.experienceYears || 0}
                          onChange={(e) => setEditForm({ ...editForm, experienceYears: e.target.value })}
                        />
                      </div>
                      <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label" htmlFor="bio">Bio</label>
                        <textarea
                          id="bio"
                          className="form-input"
                          rows={3}
                          value={editForm.bio || ''}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="languages">Languages (comma separated)</label>
                        <input
                          id="languages"
                          type="text"
                          className="form-input"
                          value={Array.isArray(editForm.languages) ? editForm.languages.join(', ') : editForm.languages || ''}
                          onChange={(e) => setEditForm({ ...editForm, languages: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="specializations">Specializations (comma separated)</label>
                        <input
                          id="specializations"
                          type="text"
                          className="form-input"
                          value={Array.isArray(editForm.specializations) ? editForm.specializations.join(', ') : editForm.specializations || ''}
                          onChange={(e) => setEditForm({ ...editForm, specializations: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  {stakeholderType === 'HOMESTAY' && (
                    <>
                      <div className="form-group">
                        <label className="form-label" htmlFor="propertyName">Property Name</label>
                        <input
                          id="propertyName"
                          type="text"
                          className="form-input"
                          value={editForm.propertyName || ''}
                          onChange={(e) => setEditForm({ ...editForm, propertyName: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="contactPhone">Contact Phone</label>
                        <input
                          id="contactPhone"
                          type="text"
                          className="form-input"
                          value={editForm.contactPhone || ''}
                          onChange={(e) => setEditForm({ ...editForm, contactPhone: e.target.value })}
                        />
                      </div>
                      <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label" htmlFor="description">Property Description</label>
                        <textarea
                          id="description"
                          className="form-input"
                          rows={3}
                          value={editForm.description || ''}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="latitude">Latitude</label>
                        <input
                          id="latitude"
                          type="number"
                          step="any"
                          className="form-input"
                          value={editForm.latitude || ''}
                          onChange={(e) => setEditForm({ ...editForm, latitude: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="longitude">Longitude</label>
                        <input
                          id="longitude"
                          type="number"
                          step="any"
                          className="form-input"
                          value={editForm.longitude || ''}
                          onChange={(e) => setEditForm({ ...editForm, longitude: e.target.value })}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
                  <button type="submit" className={`btn btn-primary ${saving ? 'btn-loading' : ''}`} disabled={saving}>
                    Save Changes
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Verification & Profile Documents Card */}
          <div className="glass-card">
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-md)' }}>
              🛡️ Verification Status
            </h3>

            <div style={{
              padding: 'var(--space-md)', borderRadius: 'var(--radius-md)',
              background: verificationStatus === 'VERIFIED' ? 'var(--color-primary-subtle)' : 'rgba(232, 168, 56, 0.08)',
              border: `1px solid ${verificationStatus === 'VERIFIED' ? 'var(--color-primary)' : 'var(--color-accent)'}`,
              marginBottom: 'var(--space-lg)'
            }}>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-base)' }}>
                {verificationStatus === 'VERIFIED' ? '✓ Identity Verified' : verificationStatus === 'PENDING' ? '⏳ Verification in Review' : '⚠️ Unverified Stakeholder'}
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 'var(--space-xs)' }}>
                {verificationStatus === 'VERIFIED'
                  ? 'Your credentials have been verified by the Betla administration.'
                  : 'Submit official identification documents to achieve verified stakeholder status.'}
              </p>
            </div>

            {/* Document Upload Form for Guides and Homestays */}
            {(stakeholderType === 'GUIDE' || stakeholderType === 'HOMESTAY') && (
              <form onSubmit={handleSubmitVerification} style={{ marginBottom: 'var(--space-xl)' }}>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>Submit Verification Document</h4>
                
                <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                  <label className="form-label" htmlFor="docType">Document Type</label>
                  <select
                    id="docType"
                    className="form-input"
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

                <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
                  <label className="form-label" htmlFor="docUrl">Document File URL</label>
                  <input
                    id="docUrl"
                    type="url"
                    className="form-input"
                    placeholder="https://example.com/docs/id.pdf"
                    value={docUrl}
                    onChange={(e) => setDocUrl(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className={`btn btn-primary ${submittingDoc ? 'btn-loading' : ''}`}
                  disabled={submittingDoc}
                  style={{ width: '100%' }}
                >
                  Submit Document
                </button>
              </form>
            )}

            {/* Uploaded Documents List */}
            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>Submitted Documents ({documents.length})</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              {documents.map((doc) => (
                <div key={doc.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: 'var(--space-xs) var(--space-sm)', borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.04)', fontSize: 'var(--text-xs)'
                }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span style={{ fontWeight: 600 }}>{doc.documentType}</span>
                  </div>
                  <span className={`badge ${doc.status === 'APPROVED' ? 'badge-primary' : 'badge-accent'}`}>
                    {doc.status}
                  </span>
                </div>
              ))}
              {documents.length === 0 && (
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>No verification documents uploaded yet.</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
