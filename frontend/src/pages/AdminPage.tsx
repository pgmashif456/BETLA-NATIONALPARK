import { ContentManagement } from '../components/ContentManagement';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../api/client';
import { useAuth } from '../contexts/AuthContext';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userRoleName = user?.role?.name || (typeof user?.role === 'string' ? user.role : '');
  const isForestAuthority = userRoleName === 'FOREST_AUTHORITY';
  const isAdmin = userRoleName === 'ADMIN';

  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports' | 'users' | 'roles' | 'audit' | 'settings' | 'content'>('dashboard');

  // State
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [reportType, setReportType] = useState<string>('USERS');
  const [reportData, setReportData] = useState<any>(null);

  // Users state
  const [usersList, setUsersList] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<string>('ACTIVE');
  const [statusReason, setStatusReason] = useState<string>('');

  // Roles state
  const [rolesList, setRolesList] = useState<any[]>([]);

  // Audit logs state
  const [auditLogsList, setAuditLogsList] = useState<any[]>([]);

  // Settings state
  const [settingsList, setSettingsList] = useState<any[]>([]);
  const [settingKey, setSettingKey] = useState('');
  const [settingValue, setSettingValue] = useState('');
  const [settingDesc, setSettingDesc] = useState('');

  // Load Dashboard
  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminApi.getDashboard();
      setDashboardData(res.data.data);
    } catch (err) {
      console.error('Failed to load dashboard', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load Report
  const loadReport = useCallback(async (type: string) => {
    try {
      setLoading(true);
      const res = await adminApi.getReports({ reportType: type });
      setReportData(res.data.data);
    } catch (err) {
      console.error('Failed to load report', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load Users
  const loadUsers = useCallback(async () => {
    if (!isAdmin) return;
    try {
      setLoading(true);
      const res = await adminApi.getUsers({ search: userSearch || undefined });
      setUsersList(res.data.data.users || []);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, userSearch]);

  // Update User Status
  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !isAdmin) return;
    try {
      setLoading(true);
      await adminApi.updateUserStatus(selectedUser.id, {
        status: newStatus,
        reason: statusReason || undefined,
      });
      setSelectedUser(null);
      setStatusReason('');
      loadUsers();
    } catch (err) {
      console.error('Failed to update user status', err);
    } finally {
      setLoading(false);
    }
  };

  // Load Roles
  const loadRoles = useCallback(async () => {
    if (!isAdmin) return;
    try {
      setLoading(true);
      const res = await adminApi.getRoles();
      setRolesList(res.data.data.roles || []);
    } catch (err) {
      console.error('Failed to load roles', err);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  // Load Audit Logs
  const loadAuditLogs = useCallback(async () => {
    if (!isAdmin) return;
    try {
      setLoading(true);
      const res = await adminApi.getAuditLogs();
      setAuditLogsList(res.data.data.auditLogs || []);
    } catch (err) {
      console.error('Failed to load audit logs', err);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  // Load Settings
  const loadSettings = useCallback(async () => {
    if (!isAdmin) return;
    try {
      setLoading(true);
      const res = await adminApi.getSettings();
      setSettingsList(res.data.data.settings || []);
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  // Update Setting
  const handleUpdateSetting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingKey || !isAdmin) return;
    try {
      setLoading(true);
      let parsedValue: any = settingValue;
      try {
        parsedValue = JSON.parse(settingValue);
      } catch {
        // Keep string if not valid JSON
      }
      await adminApi.updateSetting(settingKey, {
        value: parsedValue,
        description: settingDesc || undefined,
      });
      setSettingKey('');
      setSettingValue('');
      setSettingDesc('');
      loadSettings();
    } catch (err) {
      console.error('Failed to update setting', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (activeTab === 'dashboard') await loadDashboard();
      else if (activeTab === 'reports') await loadReport(reportType);
      else if (activeTab === 'users' && isAdmin) await loadUsers();
      else if (activeTab === 'roles' && isAdmin) await loadRoles();
      else if (activeTab === 'audit' && isAdmin) await loadAuditLogs();
      else if (activeTab === 'settings' && isAdmin) await loadSettings();
    };
    fetchData();
  }, [activeTab, reportType, isAdmin, loadDashboard, loadReport, loadUsers, loadRoles, loadAuditLogs, loadSettings]);

  if (user && !isAdmin && !isForestAuthority) {
    return (
      <div className="dashboard-layout" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-card" style={{ maxWidth: 480, textAlign: 'center', padding: 'var(--space-2xl)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>⛔</div>
          <h2 style={{ color: 'var(--color-danger)', marginBottom: 'var(--space-sm)' }}>Access Denied</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
            You do not have permission to access Admin Governance.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">

      {/* Header / Nav */}
      <nav className="dashboard-nav">
        <div className="dashboard-nav-brand">
          <div className="auth-logo-icon">⚙️</div>
          <div>
            <span className="auth-logo-text">Admin Governance</span>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              System Oversight & Control
            </div>
          </div>
          <span className={`badge ${isAdmin ? 'badge-primary' : 'badge-accent'}`} style={{ marginLeft: 'var(--space-md)' }}>
            {userRoleName} {isForestAuthority && '(Read-Only)'}
          </span>
        </div>
        <div className="dashboard-nav-actions">
          <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
            ← Dashboard
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Navigation Tabs */}
        <div className="nav-tabs-container">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            📊 Dashboard Overview
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`nav-tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
          >
            📈 Reports
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`nav-tab-btn ${activeTab === 'content' ? 'active' : ''}`}
          >
            🌴 M3 Content Management
          </button>

          {isAdmin && (
            <>
              <button
                onClick={() => setActiveTab('users')}
                className={`nav-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
              >
                👥 Users Management
              </button>
              <button
                onClick={() => setActiveTab('roles')}
                className={`nav-tab-btn ${activeTab === 'roles' ? 'active' : ''}`}
              >
                🛡️ Roles & Permissions
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className={`nav-tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
              >
                📜 Audit Logs
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`nav-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
              >
                ⚙️ System Settings
              </button>
            </>
          )}
        </div>

        {loading ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--text-secondary)' }}>
            <div className="btn-loading" style={{ margin: '0 auto var(--space-md)' }}></div>
            Loading governance & administration metrics...
          </div>
        ) : (
          <>
            {/* TAB: CONTENT MANAGEMENT */}
            {activeTab === 'content' && (
              <ContentManagement isAdmin={isAdmin} isForestAuthority={isForestAuthority} />
            )}

            {/* TAB: DASHBOARD */}
            {activeTab === 'dashboard' && dashboardData && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
                <div className="dashboard-grid">
                  <div className="stat-card-glow">
                    <div className="stat-card-label">Total Registered Users</div>
                    <div className="stat-card-value" style={{ color: 'var(--color-primary)' }}>
                      {dashboardData.summary.totalUsers}
                    </div>
                  </div>
                  <div className="stat-card-glow">
                    <div className="stat-card-label">Confirmed Bookings</div>
                    <div className="stat-card-value" style={{ color: '#34d399' }}>
                      {dashboardData.summary.activeBookings}
                    </div>
                  </div>
                  <div className="stat-card-glow">
                    <div className="stat-card-label">Open Safety Incidents</div>
                    <div className="stat-card-value" style={{ color: 'var(--color-danger)' }}>
                      {dashboardData.summary.openIncidents}
                    </div>
                  </div>
                  <div className="stat-card-glow">
                    <div className="stat-card-label">Total Eco Reports</div>
                    <div className="stat-card-value" style={{ color: 'var(--color-accent)' }}>
                      {dashboardData.summary.totalEcoReports}
                    </div>
                  </div>
                </div>

                {dashboardData.recentActivities && dashboardData.recentActivities.length > 0 && (
                  <div className="glass-card">
                    <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-md)', color: 'var(--color-primary)' }}>
                      ⚡ Recent Administrative Activities
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                      {dashboardData.recentActivities.map((act: any) => (
                        <div
                          key={act.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 'var(--space-md)',
                            background: 'var(--bg-surface)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-default)',
                          }}
                        >
                          <div>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{act.action}</span>
                            <span style={{ color: 'var(--text-muted)', margin: '0 var(--space-xs)' }}>•</span>
                            <span className="badge badge-primary">{act.module}</span>
                          </div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                            {new Date(act.createdAt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: REPORTS */}
            {activeTab === 'reports' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                <div className="glass-card" style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', flexWrap: 'wrap' }}>
                  <label className="form-label" style={{ margin: 0 }}>Report Module:</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="form-select"
                    style={{ maxWidth: '300px' }}
                  >
                    <option value="USERS">👥 Users Report</option>
                    <option value="BOOKINGS">📅 Bookings Report</option>
                    <option value="REVENUE">💰 Revenue Report</option>
                    <option value="INCIDENTS">🚨 Safety Incidents Report</option>
                    <option value="ECO">🌿 Eco Reports Report</option>
                  </select>
                </div>

                {reportData && (
                  <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                      <h3 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-primary)' }}>
                        {reportData.reportType} REPORT
                      </h3>
                      <span className="badge badge-primary">Generated: {new Date(reportData.generatedAt).toLocaleString()}</span>
                    </div>
                    <pre className="json-view-block">
                      {JSON.stringify(reportData.metrics, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* TAB: USERS (ADMIN ONLY) */}
            {activeTab === 'users' && isAdmin && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                <div className="glass-card" style={{ display: 'flex', gap: 'var(--space-md)' }}>
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="form-input"
                  />
                  <button onClick={loadUsers} className="btn btn-primary">
                    Search
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {usersList.map((usr) => (
                    <div
                      key={usr.id}
                      className="glass-card"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 'var(--space-lg)',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 'var(--text-lg)', color: 'var(--text-primary)' }}>
                          {usr.firstName} {usr.lastName}
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginLeft: 'var(--space-sm)' }}>
                            ({usr.email})
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-xs)', alignItems: 'center' }}>
                          <span className="badge badge-primary">Role: {usr.role?.name}</span>
                          <span className={`badge-status badge-${usr.status?.toLowerCase()}`}>
                            {usr.status}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => { setSelectedUser(usr); setNewStatus(usr.status); }}
                        className="btn btn-secondary"
                      >
                        ✏️ Change Status
                      </button>
                    </div>
                  ))}
                </div>

                {/* Change Status Modal */}
                {selectedUser && (
                  <div className="glass-card" style={{ border: '2px solid var(--color-primary)', animation: 'fadeInUp 0.3s ease-out' }}>
                    <h4 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-md)', color: 'var(--color-primary)' }}>
                      Update Status for {selectedUser.email}
                    </h4>
                    <form onSubmit={handleUpdateStatus} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', maxWidth: '440px' }}>
                      <div className="form-group">
                        <label className="form-label">Target Status</label>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="form-select"
                        >
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="SUSPENDED">SUSPENDED</option>
                          <option value="BLOCKED">BLOCKED</option>
                          <option value="DEACTIVATED">DEACTIVATED</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Reason (optional)</label>
                        <input
                          type="text"
                          value={statusReason}
                          onChange={(e) => setStatusReason(e.target.value)}
                          placeholder="Reason for status change..."
                          className="form-input"
                        />
                      </div>
                      <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                        <button type="submit" className="btn btn-primary">
                          Save Status
                        </button>
                        <button type="button" onClick={() => setSelectedUser(null)} className="btn btn-secondary">
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* TAB: ROLES (ADMIN ONLY) */}
            {activeTab === 'roles' && isAdmin && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                <h3 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-primary)' }}>Platform Roles & Permissions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {rolesList.map((rl) => (
                    <div key={rl.id} className="glass-card">
                      <div style={{ fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--color-accent)' }}>
                        {rl.name}
                      </div>
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-xs)' }}>
                        {rl.description || 'System role definition'}
                      </div>
                      <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
                        {rl.rolePermissions?.map((rp: any) => (
                          <span key={rp.id} className="badge badge-primary">
                            🔑 {rp.permission?.name || rp.permissionId}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: AUDIT LOGS (ADMIN ONLY) */}
            {activeTab === 'audit' && isAdmin && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                <h3 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-primary)' }}>Audit Trail Logs</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {auditLogsList.length === 0 ? (
                    <div className="glass-card" style={{ color: 'var(--text-secondary)' }}>
                      No audit logs recorded yet.
                    </div>
                  ) : (
                    auditLogsList.map((log) => (
                      <div key={log.id} className="glass-card" style={{ padding: 'var(--space-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 'var(--text-base)' }}>
                            {log.action}
                          </span>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                            {new Date(log.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                          Module: <span className="badge badge-primary">{log.module}</span> • Entity: {log.entityType} ({log.entityId || 'N/A'})
                        </div>
                        {log.user && (
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', marginTop: 'var(--space-xs)' }}>
                            Actor: {log.user.firstName} {log.user.lastName} ({log.user.email})
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: SETTINGS (ADMIN ONLY) */}
            {activeTab === 'settings' && isAdmin && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                <h3 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-primary)' }}>System Settings Management</h3>

                {/* Form */}
                <form onSubmit={handleUpdateSetting} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', maxWidth: '500px' }}>
                  <div className="form-group">
                    <label className="form-label">Setting Key</label>
                    <input
                      type="text"
                      value={settingKey}
                      onChange={(e) => setSettingKey(e.target.value)}
                      placeholder="e.g. PLATFORM_MAINTENANCE"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Setting Value (JSON or string)</label>
                    <input
                      type="text"
                      value={settingValue}
                      onChange={(e) => setSettingValue(e.target.value)}
                      placeholder='e.g. true or {"enabled": true}'
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description (optional)</label>
                    <input
                      type="text"
                      value={settingDesc}
                      onChange={(e) => setSettingDesc(e.target.value)}
                      placeholder="Description of setting..."
                      className="form-input"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Save Setting
                  </button>
                </form>

                {/* List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {settingsList.map((st) => (
                    <div key={st.id} className="glass-card">
                      <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--color-primary)' }}>
                        {st.key}
                      </div>
                      {st.description && (
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-xs)' }}>
                          {st.description}
                        </div>
                      )}
                      <pre className="json-view-block" style={{ marginTop: 'var(--space-md)' }}>
                        {JSON.stringify(st.value, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
