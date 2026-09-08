import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ecoApi } from '../api/client';
import toast from 'react-hot-toast';

interface EcoActivity {
  id: string;
  title: string;
  description: string;
  activityDate?: string;
  location?: string;
  organizer?: string;
  status?: string;
}

export function EcoPortalPage() {
  const [activities, setActivities] = useState<EcoActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pledgeCount, setPledgeCount] = useState<number>(1420);
  const [pledged, setPledged] = useState<boolean>(false);

  // Eco report form
  const [reportForm, setReportForm] = useState({
    description: '',
    location: '',
    priority: 'MEDIUM',
  });
  const [submittingReport, setSubmittingReport] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const loadActivities = async () => {
      setLoading(true);
      try {
        const res = await ecoApi.getActivities();
        if (isMounted) {
          setActivities(res.data?.data || res.data || []);
        }
      } catch {
        // Fallback initiatives
        if (isMounted) {
          setActivities([
            {
              id: 'eco-1',
              title: 'Plastic Free Betla Clean-up Drive',
              description: 'Joint forest guard and tourist drive to collect single-use plastic along safari corridors.',
              activityDate: '2026-09-12',
              location: 'Betla Gate Entry Zone',
              organizer: 'Betla Forest Division',
              status: 'SCHEDULED',
            },
            {
              id: 'eco-2',
              title: 'Indigenous Tree Sapling Plantation',
              description: 'Planting native Sal, Mahua, and Bamboo saplings to restore degraded reserve buffers.',
              activityDate: '2026-09-20',
              location: 'Kechki River Bank Corridor',
              organizer: 'Palamau Conservation Trust',
              status: 'UPCOMING',
            },
          ]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadActivities();
    return () => {
      isMounted = false;
    };
  }, []);

  const handlePledge = () => {
    if (!pledged) {
      setPledgeCount(pledgeCount + 1);
      setPledged(true);
      toast.success('🌿 Thank you for signing the Betla Eco Tourist Pledge!');
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportForm.description) {
      toast.error('Please provide a description of the environmental issue');
      return;
    }
    setSubmittingReport(true);
    try {
      await ecoApi.createReport(reportForm);
      toast.success('Eco hazard report logged for environmental review!');
      setReportForm({ description: '', location: '', priority: 'MEDIUM' });
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Failed to submit eco report');
    } finally {
      setSubmittingReport(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Navbar />

      <main className="dashboard-content" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* Hero Section */}
        <section
          className="glass-card"
          style={{
            textAlign: 'center',
            padding: 'var(--space-2xl) var(--space-xl)',
            marginBottom: 'var(--space-2xl)',
            background: 'linear-gradient(135deg, rgba(39, 174, 96, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: '1px solid rgba(39, 174, 96, 0.3)',
            animation: 'fadeInUp 0.6s ease-out',
          }}
        >
          <span className="badge badge-primary" style={{ marginBottom: 'var(--space-md)' }}>
            🌱 Environmental Protection & Community Eco-Drives
          </span>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: 'var(--space-sm)' }}>
            Community Eco-Management Portal
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto var(--space-lg)' }}>
            Participate in forest conservation, track eco-initiatives, report plastic or waste violations, and take the zero-impact eco pledge.
          </p>

          {/* Eco Pledge Counter */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-md)',
              background: 'var(--bg-surface)',
              padding: 'var(--space-md) var(--space-xl)',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-default)',
            }}
          >
            <span style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-primary)' }}>
              {pledgeCount.toLocaleString()}
            </span>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              Eco-Tourists Have Taken the Zero-Waste Pledge
            </span>
            <button
              onClick={handlePledge}
              disabled={pledged}
              className="btn btn-primary"
              style={{ fontSize: 'var(--text-xs)', borderRadius: 'var(--radius-full)' }}
            >
              {pledged ? '✓ Pledge Signed!' : '✍️ Take the Pledge'}
            </button>
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-2xl)' }}>
          {/* Ongoing Initiatives */}
          <div>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: 'var(--space-lg)' }}>
              🌲 Conservation Initiatives & Drives
            </h2>

            {loading ? (
              <div style={{ color: 'var(--text-muted)' }}>Loading eco drives...</div>
            ) : activities.length === 0 ? (
              <div className="glass-card" style={{ padding: 'var(--space-lg)', color: 'var(--text-muted)' }}>
                No active eco drives scheduled at this moment.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {activities.map((act) => (
                  <div key={act.id} className="glass-card stat-card-glow" style={{ padding: 'var(--space-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-xs)' }}>
                      <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {act.title}
                      </h3>
                      <span className="badge badge-primary">{act.status || 'ACTIVE'}</span>
                    </div>

                    {act.location && (
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent)', marginBottom: 'var(--space-xs)' }}>
                        📍 {act.location} {act.activityDate ? `| 📅 ${new Date(act.activityDate).toLocaleDateString()}` : ''}
                      </div>
                    )}

                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 'var(--space-md)' }}>
                      {act.description}
                    </p>

                    {act.organizer && (
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                        Organized by: <strong>{act.organizer}</strong>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Report Plastic / Waste Violation */}
          <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: 'var(--space-sm)' }}>
              ♻️ Report Eco-Hazard or Waste
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-lg)' }}>
              Help keep Palamau Tiger Reserve pristine. Report plastic dumping, illegal littering, or forest degradation.
            </p>

            <form onSubmit={handleSubmitReport} className="auth-form">
              <div className="form-group">
                <label className="form-label" htmlFor="eco-loc">Location in Reserve</label>
                <input
                  id="eco-loc"
                  type="text"
                  placeholder="e.g. Near Safari Gate #2, Picnic Spot"
                  className="form-input"
                  value={reportForm.location}
                  onChange={(e) => setReportForm({ ...reportForm, location: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="eco-priority">Urgency / Severity</label>
                <select
                  id="eco-priority"
                  className="form-input"
                  value={reportForm.priority}
                  onChange={(e) => setReportForm({ ...reportForm, priority: e.target.value })}
                >
                  <option value="LOW">Low (Minor Litter)</option>
                  <option value="MEDIUM">Medium (Accumulated Waste)</option>
                  <option value="HIGH">High (Hazardous Dumping / Stream Contamination)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="eco-desc">Issue Description</label>
                <textarea
                  id="eco-desc"
                  rows={4}
                  placeholder="Describe the environmental hazard observed..."
                  className="form-input"
                  value={reportForm.description}
                  onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={submittingReport}
                className={`btn btn-primary ${submittingReport ? 'btn-loading' : ''}`}
                style={{ width: '100%' }}
              >
                {submittingReport ? 'Logging Report...' : 'Log Environmental Report'}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default EcoPortalPage;
