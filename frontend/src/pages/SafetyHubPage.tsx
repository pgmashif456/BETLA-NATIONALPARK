import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { safetyApi } from '../api/client';
import toast from 'react-hot-toast';

interface SafetyAlert {
  id: string;
  title: string;
  message: string;
  severity: string;
  area?: string;
  createdAt?: string;
}

export function SafetyHubPage() {
  const [alerts, setAlerts] = useState<SafetyAlert[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState<boolean>(true);
  const [sosLoading, setSosLoading] = useState<boolean>(false);
  const [sosTriggered, setSosTriggered] = useState<boolean>(false);

  // Incident form
  const [incidentForm, setIncidentForm] = useState({
    type: 'WILDLIFE_SIGHTING',
    description: '',
    location: '',
    priority: 'MEDIUM',
  });
  const [submittingIncident, setSubmittingIncident] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const loadAlerts = async () => {
      setLoadingAlerts(true);
      try {
        const res = await safetyApi.getSafetyAlerts();
        if (isMounted) {
          setAlerts(res.data?.data || res.data || []);
        }
      } catch {
        // Fallback alerts if empty
        if (isMounted) {
          setAlerts([
            {
              id: 'alt-1',
              title: 'Monsoon Stream Elevation Watch',
              message: 'Kechki river crossing water levels elevated. Proceed only with certified forest vehicles.',
              severity: 'WARNING',
              area: 'North Koel River Sector',
            },
            {
              id: 'alt-2',
              title: 'Elephant Herd Movement Notice',
              message: 'Herd of 12 wild elephants sighted near Zone 3 road between 05:00 - 08:00 AM. Maintain 100m distance.',
              severity: 'INFO',
              area: 'Betla Range Zone 3',
            },
          ]);
        }
      } finally {
        if (isMounted) setLoadingAlerts(false);
      }
    };
    loadAlerts();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSOS = async () => {
    setSosLoading(true);
    try {
      let lat: number | undefined;
      let lng: number | undefined;

      if (navigator.geolocation) {
        try {
          const pos: any = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
        } catch {
          // default coordinates fallback
        }
      }

      await safetyApi.createEmergency({
        type: 'DISTRESS_BEACON',
        description: 'Emergency SOS signal broadcast from public safety hub.',
        location: lat && lng ? `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}` : 'Betla Core Area',
        latitude: lat,
        longitude: lng,
      });

      setSosTriggered(true);
      toast.success('🚨 SOS Emergency Signal Dispatched to Betla Control Room!');
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Failed to dispatch SOS beacon. Call Forest Patrol directly!');
    } finally {
      setSosLoading(false);
    }
  };

  const handleSubmitIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentForm.description) {
      toast.error('Please enter incident details');
      return;
    }
    setSubmittingIncident(true);
    try {
      await safetyApi.createIncident(incidentForm);
      toast.success('Incident Report submitted to Forest Authority!');
      setIncidentForm({ type: 'WILDLIFE_SIGHTING', description: '', location: '', priority: 'MEDIUM' });
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Failed to report incident');
    } finally {
      setSubmittingIncident(false);
    }
  };

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
            background: 'linear-gradient(135deg, rgba(231, 76, 60, 0.18) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: '1px solid rgba(231, 76, 60, 0.3)',
            animation: 'fadeInUp 0.6s ease-out',
          }}
        >
          <span className="badge badge-danger" style={{ marginBottom: 'var(--space-md)' }}>
            🚨 24/7 Tourist Emergency & Incident Response
          </span>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: 'var(--space-sm)' }}>
            Tourist Safety & Emergency Hub
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto var(--space-lg)' }}>
            Real-time forest hazard advisories, instant 1-click GPS SOS distress dispatch, and direct incident reporting to Palamau Reserve Control.
          </p>

          {/* Big SOS Button */}
          <div style={{ margin: 'var(--space-lg) 0' }}>
            <button
              onClick={handleSOS}
              disabled={sosLoading}
              className="btn"
              style={{
                background: sosTriggered ? '#27ae60' : 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                color: '#fff',
                fontSize: 'var(--text-xl)',
                fontWeight: 800,
                padding: 'var(--space-md) var(--space-2xl)',
                borderRadius: 'var(--radius-full)',
                boxShadow: sosTriggered ? '0 0 20px rgba(39, 174, 96, 0.6)' : '0 0 30px rgba(231, 76, 60, 0.6)',
                border: '2px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {sosLoading ? '⌛ Sending GPS Location...' : sosTriggered ? '✓ SOS SIGNAL ACTIVE & ACKNOWLEDGED' : '🚨 DISPATCH INSTANT SOS BEACON'}
            </button>
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-2xl)' }}>
          {/* Active Safety Alerts List */}
          <div>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: 'var(--space-lg)' }}>
              📢 Live Reserve Safety Alerts
            </h2>

            {loadingAlerts ? (
              <div style={{ color: 'var(--text-muted)' }}>Checking forest advisories...</div>
            ) : alerts.length === 0 ? (
              <div className="glass-card" style={{ padding: 'var(--space-lg)', color: 'var(--text-muted)' }}>
                No active safety alerts. All forest zones clear.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {alerts.map((alt) => (
                  <div
                    key={alt.id}
                    className="glass-card"
                    style={{
                      borderLeft: alt.severity === 'DANGER' || alt.severity === 'HIGH' ? '4px solid #e74c3c' : '4px solid #f39c12',
                      padding: 'var(--space-lg)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-xs)' }}>
                      <h4 style={{ color: 'var(--text-primary)', fontSize: 'var(--text-lg)', fontWeight: 700 }}>
                        {alt.title}
                      </h4>
                      <span className={`badge ${alt.severity === 'DANGER' ? 'badge-danger' : 'badge-accent'}`}>
                        {alt.severity || 'NOTICE'}
                      </span>
                    </div>

                    {alt.area && (
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent)', marginBottom: 'var(--space-xs)' }}>
                        📍 Zone: {alt.area}
                      </div>
                    )}

                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
                      {alt.message}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Emergency Contacts */}
            <div className="glass-card" style={{ marginTop: 'var(--space-xl)', padding: 'var(--space-xl)' }}>
              <h3 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-primary)', marginBottom: 'var(--space-md)' }}>
                ☎️ Forest Authority Helplines
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--space-xs)', borderBottom: '1px solid var(--border-default)' }}>
                  <span>Betla Range Control Desk</span>
                  <strong style={{ color: 'var(--color-accent)' }}>+91 (6562) 222-019</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--space-xs)', borderBottom: '1px solid var(--border-default)' }}>
                  <span>Palamau Tiger Reserve Ranger</span>
                  <strong style={{ color: 'var(--color-accent)' }}>+91 94311 08842</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Medical & Ambulance SOS</span>
                  <strong style={{ color: 'var(--color-danger)' }}>108 / 112</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Incident Report Form */}
          <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: 'var(--space-sm)' }}>
              📝 Report a Forest Incident
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-lg)' }}>
              Report wildlife sightings, road obstructions, fallen trees, or safety hazards directly to forest officers.
            </p>

            <form onSubmit={handleSubmitIncident} className="auth-form">
              <div className="form-group">
                <label className="form-label" htmlFor="inc-type">Incident Category</label>
                <select
                  id="inc-type"
                  className="form-input"
                  value={incidentForm.type}
                  onChange={(e) => setIncidentForm({ ...incidentForm, type: e.target.value })}
                >
                  <option value="WILDLIFE_SIGHTING">🐯 Wildlife Sighting / Animal Crossing</option>
                  <option value="ROAD_BLOCK">🚧 Fallen Tree / Road Blockade</option>
                  <option value="MEDICAL_EMERGENCY">🏥 Medical Issue / Injury</option>
                  <option value="VEHICLE_BREAKDOWN">🚜 Jeep Breakdown</option>
                  <option value="POACHING_SUSPICION">⚠️ Suspicious Activity / Poaching Risk</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="inc-priority">Priority Level</label>
                <select
                  id="inc-priority"
                  className="form-input"
                  value={incidentForm.priority}
                  onChange={(e) => setIncidentForm({ ...incidentForm, priority: e.target.value })}
                >
                  <option value="LOW">Low (Routine Information)</option>
                  <option value="MEDIUM">Medium (Requires Inspection)</option>
                  <option value="HIGH">High (Urgent Response Needed)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="inc-loc">Forest Location / Landmark</label>
                <input
                  id="inc-loc"
                  type="text"
                  placeholder="e.g. Near Kechki Bridge, Km 4 Watchtower"
                  className="form-input"
                  value={incidentForm.location}
                  onChange={(e) => setIncidentForm({ ...incidentForm, location: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="inc-desc">Detailed Description</label>
                <textarea
                  id="inc-desc"
                  rows={4}
                  placeholder="Describe what you observed..."
                  className="form-input"
                  value={incidentForm.description}
                  onChange={(e) => setIncidentForm({ ...incidentForm, description: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={submittingIncident}
                className={`btn btn-primary ${submittingIncident ? 'btn-loading' : ''}`}
                style={{ width: '100%' }}
              >
                {submittingIncident ? 'Submitting Report...' : 'Submit Incident Report'}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default SafetyHubPage;
