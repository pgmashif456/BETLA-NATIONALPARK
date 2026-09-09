import { ContentManagement } from '../components/ContentManagement';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { adminApi } from '../api/client';
import { useAuth } from '../contexts/AuthContext';

// Sample-1 Inline SVG Icons
function IconLeaf({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

function IconHome({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}

function IconCompass({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
    </svg>
  );
}

function IconCar({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2"/>
      <circle cx="7" cy="17" r="2"/>
      <path d="M9 17h6"/>
      <circle cx="17" cy="17" r="2"/>
    </svg>
  );
}

function IconMapPin({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 10.993 4 10a8 8 0 0 1 16 0"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function IconBed({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>
    </svg>
  );
}

function IconShield({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

function IconTrees({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/>
      <path d="M7 16v6"/>
      <path d="M13 19v3"/>
      <path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.4"/>
    </svg>
  );
}

function IconBarChart({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>
    </svg>
  );
}

function IconSearch({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

function IconBell({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </svg>
  );
}

function IconSettings({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );
}

function IconUsers({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

function IconKey({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>
    </svg>
  );
}

function IconFileText({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
    </svg>
  );
}

function IconActivity({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  );
}

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
        parsedValue = settingValue;
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

  // Canonical navigation items for Betla Eco-Companion
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <IconHome size={18} /> },
    { label: 'Tourist Discovery', path: '/discover', icon: <IconCompass size={18} /> },
    { label: 'Safaris & Booking', path: '/experiences', icon: <IconCar size={18} /> },
    { label: 'Places to Visit', path: '/', icon: <IconMapPin size={18} /> },
    { label: 'Stay & Facilities', path: '/guides-stays', icon: <IconBed size={18} /> },
    { label: 'Safety & Emergency', path: '/safety-hub', icon: <IconShield size={18} /> },
    { label: 'Eco Portal', path: '/eco-portal', icon: <IconTrees size={18} /> },
    { label: 'Reports & Analytics', path: '/reviews-hub', icon: <IconBarChart size={18} /> },
  ];

  if (user && !isAdmin && !isForestAuthority) {
    return (
      <div className="sample1-app-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: 480, width: '100%', margin: '0 20px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 32, textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24 }}>
            <IconShield size={28} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Access Denied</h2>
          <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>
            You do not have administrative permission to access the Governance & Control Center.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ padding: '10px 20px', backgroundColor: '#15803d', color: '#ffffff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sample1-app-container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* 220px Deep Forest-Green Sidebar */}
      <aside className="sample1-sidebar" style={{ backgroundColor: '#091a10', color: '#ffffff', display: 'flex', flexDirection: 'column', padding: '18px 0', zIndex: 50, borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        {/* Brand Header */}
        <div style={{ padding: '0 18px 18px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', flexShrink: 0 }}>
            <IconLeaf size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', letterSpacing: 0.2 }}>Betla Eco-Companion</div>
            <div style={{ fontSize: 11, color: '#86efac', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>National Park</div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="sample1-nav-group" style={{ flex: 1, padding: '14px 10px', gap: 4, overflowY: 'auto' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#ffffff' : '#9ca3af',
                  backgroundColor: isActive ? '#15803d' : 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#9ca3af';
                  }
                }}
              >
                <span style={{ color: isActive ? '#ffffff' : '#9ca3af' }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Active Admin Section Indicator */}
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#6b7280', padding: '0 12px 6px', fontWeight: 600, letterSpacing: 0.5 }}>
              Control Center
            </div>
            <button
              onClick={() => navigate('/admin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: 'rgba(21, 128, 61, 0.35)',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <IconSettings size={18} />
              <span>Admin Governance</span>
            </button>
          </div>
        </nav>

        {/* User Profile Pill at Sidebar Bottom */}
        <div style={{ padding: '12px 14px', margin: '0 10px', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: 13, fontWeight: 700 }}>
            {user?.firstName?.[0] || 'A'}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Administrator'}
            </div>
            <div style={{ fontSize: 11, color: '#86efac', textTransform: 'uppercase', fontWeight: 600 }}>
              {userRoleName || 'ADMIN'}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <header style={{ height: 64, backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>Admin Governance & Control Center</h1>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 12, backgroundColor: isAdmin ? '#dcfce7' : '#e0e7ff', color: isAdmin ? '#166534' : '#3730a3', fontWeight: 600 }}>
                {userRoleName} {isForestAuthority && '(Read-Only)'}
              </span>
            </div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>
              System Oversight, Platform Management & Auditing
            </div>
          </div>

          {/* Right Header Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ position: 'relative', width: 220 }}>
              <input
                type="text"
                placeholder="Search admin metrics..."
                style={{ width: '100%', height: 34, padding: '0 10px 0 32px', borderRadius: 8, border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', fontSize: 12, outline: 'none' }}
              />
              <span style={{ position: 'absolute', left: 10, top: 9, color: '#9ca3af' }}>
                <IconSearch size={14} />
              </span>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6, border: '1px solid #e5e7eb', backgroundColor: '#ffffff', color: '#374151', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
            >
              ← Dashboard
            </button>

            <button style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid #e5e7eb', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563', cursor: 'pointer' }}>
              <IconBell size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderLeft: '1px solid #e5e7eb', paddingLeft: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: 12, fontWeight: 700 }}>
                {user?.firstName?.[0] || 'A'}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Administrator'}
                </div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>{user?.email || 'admin@betlapark.gov.in'}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Navigation Tabs Pill Bar */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 6, display: 'flex', gap: 6, flexWrap: 'wrap', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            <button
              onClick={() => setActiveTab('dashboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                backgroundColor: activeTab === 'dashboard' ? '#15803d' : 'transparent',
                color: activeTab === 'dashboard' ? '#ffffff' : '#4b5563',
                transition: 'all 0.15s ease',
              }}
            >
              <IconActivity size={16} />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                backgroundColor: activeTab === 'reports' ? '#15803d' : 'transparent',
                color: activeTab === 'reports' ? '#ffffff' : '#4b5563',
                transition: 'all 0.15s ease',
              }}
            >
              <IconFileText size={16} />
              <span>Reports</span>
            </button>

            <button
              onClick={() => setActiveTab('content')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                backgroundColor: activeTab === 'content' ? '#15803d' : 'transparent',
                color: activeTab === 'content' ? '#ffffff' : '#4b5563',
                transition: 'all 0.15s ease',
              }}
            >
              <IconTrees size={16} />
              <span>M3 Content Management</span>
            </button>

            {isAdmin && (
              <>
                <button
                  onClick={() => setActiveTab('users')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 14px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    backgroundColor: activeTab === 'users' ? '#15803d' : 'transparent',
                    color: activeTab === 'users' ? '#ffffff' : '#4b5563',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <IconUsers size={16} />
                  <span>Users Management</span>
                </button>

                <button
                  onClick={() => setActiveTab('roles')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 14px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    backgroundColor: activeTab === 'roles' ? '#15803d' : 'transparent',
                    color: activeTab === 'roles' ? '#ffffff' : '#4b5563',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <IconKey size={16} />
                  <span>Roles & Permissions</span>
                </button>

                <button
                  onClick={() => setActiveTab('audit')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 14px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    backgroundColor: activeTab === 'audit' ? '#15803d' : 'transparent',
                    color: activeTab === 'audit' ? '#ffffff' : '#4b5563',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <IconFileText size={16} />
                  <span>Audit Logs</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 14px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    backgroundColor: activeTab === 'settings' ? '#15803d' : 'transparent',
                    color: activeTab === 'settings' ? '#ffffff' : '#4b5563',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <IconSettings size={16} />
                  <span>System Settings</span>
                </button>
              </>
            )}
          </div>

          {loading ? (
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 48, textAlign: 'center', color: '#6b7280' }}>
              <div style={{ width: 36, height: 36, border: '3px solid #e5e7eb', borderTopColor: '#15803d', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
              <div style={{ fontSize: 14, fontWeight: 500 }}>Loading governance & administration metrics...</div>
            </div>
          ) : (
            <>
              {/* TAB: CONTENT MANAGEMENT */}
              {activeTab === 'content' && (
                <ContentManagement isAdmin={isAdmin} isForestAuthority={isForestAuthority} />
              )}

              {/* TAB: DASHBOARD */}
              {activeTab === 'dashboard' && dashboardData && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Registered Users</div>
                      <div style={{ fontSize: 28, fontWeight: 700, color: '#15803d', marginTop: 8 }}>
                        {dashboardData.summary.totalUsers}
                      </div>
                    </div>
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>Confirmed Bookings</div>
                      <div style={{ fontSize: 28, fontWeight: 700, color: '#0284c7', marginTop: 8 }}>
                        {dashboardData.summary.activeBookings}
                      </div>
                    </div>
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>Open Safety Incidents</div>
                      <div style={{ fontSize: 28, fontWeight: 700, color: '#dc2626', marginTop: 8 }}>
                        {dashboardData.summary.openIncidents}
                      </div>
                    </div>
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Eco Reports</div>
                      <div style={{ fontSize: 28, fontWeight: 700, color: '#d97706', marginTop: 8 }}>
                        {dashboardData.summary.totalEcoReports}
                      </div>
                    </div>
                  </div>

                  {dashboardData.recentActivities && dashboardData.recentActivities.length > 0 && (
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#111827' }}>
                        Recent Administrative Activities
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {dashboardData.recentActivities.map((act: any) => (
                          <div
                            key={act.id}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '12px 16px',
                              backgroundColor: '#f9fafb',
                              borderRadius: 8,
                              border: '1px solid #e5e7eb',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontWeight: 600, color: '#111827', fontSize: 13 }}>{act.action}</span>
                              <span style={{ color: '#9ca3af' }}>•</span>
                              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, backgroundColor: '#dcfce7', color: '#166534', fontWeight: 600 }}>{act.module}</span>
                            </div>
                            <div style={{ fontSize: 12, color: '#6b7280' }}>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>System Reports Generator</h3>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <select
                          value={reportType}
                          onChange={(e) => {
                            setReportType(e.target.value);
                            loadReport(e.target.value);
                          }}
                          style={{ height: 36, padding: '0 12px', borderRadius: 8, border: '1px solid #d1d5db', backgroundColor: '#ffffff', fontSize: 13, color: '#111827', outline: 'none' }}
                        >
                          <option value="USERS">Users Report</option>
                          <option value="BOOKINGS">Bookings Report</option>
                          <option value="SAFETY">Safety Report</option>
                          <option value="ECO_REPORTS">Eco Reports</option>
                        </select>
                        <button
                          onClick={() => loadReport(reportType)}
                          style={{ height: 36, padding: '0 16px', backgroundColor: '#15803d', color: '#ffffff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                        >
                          Refresh
                        </button>
                      </div>
                    </div>

                    {reportData ? (
                      <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, overflowX: 'auto' }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase' }}>
                          Report Data ({reportType}) — Generated: {reportData.generatedAt ? new Date(reportData.generatedAt).toLocaleString() : new Date().toLocaleString()}
                        </div>
                        <pre style={{ margin: 0, fontSize: 12, color: '#1f2937', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                          {JSON.stringify(reportData, null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <div style={{ color: '#6b7280', fontSize: 13 }}>No report data loaded.</div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: USERS (ADMIN ONLY) */}
              {activeTab === 'users' && isAdmin && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                      <div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Platform Users Management</h3>
                        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Search, inspect, and moderate registered user accounts.</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          type="text"
                          placeholder="Search users by name, email..."
                          value={userSearch}
                          onChange={(e) => setUserSearch(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
                          style={{ width: 260, height: 36, padding: '0 12px', borderRadius: 8, border: '1px solid #d1d5db', backgroundColor: '#ffffff', fontSize: 13, outline: 'none' }}
                        />
                        <button
                          onClick={loadUsers}
                          style={{ height: 36, padding: '0 16px', backgroundColor: '#15803d', color: '#ffffff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                        >
                          Search
                        </button>
                      </div>
                    </div>

                    {/* Users Table */}
                    <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: 8 }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#4b5563', fontWeight: 600 }}>
                            <th style={{ padding: '12px 16px' }}>User</th>
                            <th style={{ padding: '12px 16px' }}>Role</th>
                            <th style={{ padding: '12px 16px' }}>Status</th>
                            <th style={{ padding: '12px 16px' }}>Created</th>
                            <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {usersList.length === 0 ? (
                            <tr>
                              <td colSpan={5} style={{ padding: '24px 16px', textAlign: 'center', color: '#6b7280' }}>
                                No users found matching search criteria.
                              </td>
                            </tr>
                          ) : (
                            usersList.map((u) => {
                              const roleBadgeColor = u.role?.name === 'ADMIN' ? '#dcfce7' : u.role?.name === 'GUIDE' ? '#e0e7ff' : '#f3f4f6';
                              const roleTextColor = u.role?.name === 'ADMIN' ? '#166534' : u.role?.name === 'GUIDE' ? '#3730a3' : '#374151';
                              const statusBg = u.status === 'ACTIVE' ? '#dcfce7' : u.status === 'SUSPENDED' ? '#fef3c7' : '#fee2e2';
                              const statusColor = u.status === 'ACTIVE' ? '#166534' : u.status === 'SUSPENDED' ? '#92400e' : '#991b1b';

                              return (
                                <tr key={u.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                  <td style={{ padding: '12px 16px' }}>
                                    <div style={{ fontWeight: 600, color: '#111827' }}>{u.firstName} {u.lastName}</div>
                                    <div style={{ fontSize: 12, color: '#6b7280' }}>{u.email}</div>
                                  </td>
                                  <td style={{ padding: '12px 16px' }}>
                                    <span style={{ padding: '3px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600, backgroundColor: roleBadgeColor, color: roleTextColor }}>
                                      {u.role?.name || 'USER'}
                                    </span>
                                  </td>
                                  <td style={{ padding: '12px 16px' }}>
                                    <span style={{ padding: '3px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600, backgroundColor: statusBg, color: statusColor }}>
                                      {u.status}
                                    </span>
                                  </td>
                                  <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: 12 }}>
                                    {new Date(u.createdAt).toLocaleDateString()}
                                  </td>
                                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                    <button
                                      onClick={() => {
                                        setSelectedUser(u);
                                        setNewStatus(u.status);
                                      }}
                                      style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid #d1d5db', backgroundColor: '#ffffff', color: '#374151', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                                    >
                                      Edit Status
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Status Modal / Form */}
                  {selectedUser && (
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', maxWidth: 520 }}>
                      <h4 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 12 }}>
                        Update User Status: {selectedUser.firstName} {selectedUser.lastName}
                      </h4>
                      <form onSubmit={handleUpdateStatus} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Account Status</label>
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            style={{ width: '100%', height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #d1d5db', backgroundColor: '#ffffff', fontSize: 13, color: '#111827' }}
                          >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="SUSPENDED">SUSPENDED</option>
                            <option value="BLOCKED">BLOCKED</option>
                            <option value="DEACTIVATED">DEACTIVATED</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Reason for status change (optional)</label>
                          <input
                            type="text"
                            value={statusReason}
                            onChange={(e) => setStatusReason(e.target.value)}
                            placeholder="e.g. Terms violation or user request..."
                            style={{ width: '100%', height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #d1d5db', backgroundColor: '#ffffff', fontSize: 13, color: '#111827' }}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                          <button
                            type="submit"
                            style={{ padding: '8px 16px', backgroundColor: '#15803d', color: '#ffffff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                          >
                            Save Status
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedUser(null)}
                            style={{ padding: '8px 16px', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                          >
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>Platform Roles & Assigned Permissions</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                      {rolesList.map((rl) => (
                        <div key={rl.id} style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: 18 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <div style={{ fontWeight: 700, fontSize: 15, color: '#15803d' }}>
                              {rl.name}
                            </div>
                            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 12, backgroundColor: '#e0e7ff', color: '#3730a3', fontWeight: 600 }}>
                              {rl.rolePermissions?.length || 0} Perms
                            </span>
                          </div>
                          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 14 }}>
                            {rl.description || 'System role definition'}
                          </div>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {rl.rolePermissions?.map((rp: any) => (
                              <span key={rp.id} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, backgroundColor: '#ffffff', border: '1px solid #e5e7eb', color: '#374151', fontWeight: 500 }}>
                                🔑 {rp.permission?.name || rp.permissionId}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: AUDIT LOGS (ADMIN ONLY) */}
              {activeTab === 'audit' && isAdmin && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>System Audit Trail & Security Logs</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {auditLogsList.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 24, color: '#6b7280' }}>
                          No audit logs recorded yet.
                        </div>
                      ) : (
                        auditLogsList.map((log) => (
                          <div key={log.id} style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 14 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                              <span style={{ fontWeight: 600, color: '#111827', fontSize: 14 }}>
                                {log.action}
                              </span>
                              <span style={{ fontSize: 11, color: '#9ca3af' }}>
                                {new Date(log.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <div style={{ fontSize: 12, color: '#4b5563', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                              <span>Module: <strong style={{ color: '#15803d' }}>{log.module}</strong></span>
                              <span>•</span>
                              <span>Entity: {log.entityType} ({log.entityId || 'N/A'})</span>
                            </div>
                            {log.user && (
                              <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>
                                Actor: {log.user.firstName} {log.user.lastName} ({log.user.email})
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: SETTINGS (ADMIN ONLY) */}
              {activeTab === 'settings' && isAdmin && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>System Settings Management</h3>

                    {/* Form */}
                    <form onSubmit={handleUpdateSetting} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 520, marginBottom: 24, backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: 18 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Setting Key</label>
                        <input
                          type="text"
                          value={settingKey}
                          onChange={(e) => setSettingKey(e.target.value)}
                          placeholder="e.g. PLATFORM_MAINTENANCE"
                          style={{ width: '100%', height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #d1d5db', backgroundColor: '#ffffff', fontSize: 13, color: '#111827' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Setting Value (JSON or string)</label>
                        <input
                          type="text"
                          value={settingValue}
                          onChange={(e) => setSettingValue(e.target.value)}
                          placeholder='e.g. true or {"enabled": true}'
                          style={{ width: '100%', height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #d1d5db', backgroundColor: '#ffffff', fontSize: 13, color: '#111827' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Description (optional)</label>
                        <input
                          type="text"
                          value={settingDesc}
                          onChange={(e) => setSettingDesc(e.target.value)}
                          placeholder="Description of setting purpose..."
                          style={{ width: '100%', height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #d1d5db', backgroundColor: '#ffffff', fontSize: 13, color: '#111827' }}
                        />
                      </div>
                      <button
                        type="submit"
                        style={{ alignSelf: 'flex-start', padding: '8px 18px', backgroundColor: '#15803d', color: '#ffffff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                      >
                        Save Setting
                      </button>
                    </form>

                    {/* Settings List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {settingsList.map((st) => (
                        <div key={st.id} style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: '#15803d' }}>
                            {st.key}
                          </div>
                          {st.description && (
                            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                              {st.description}
                            </div>
                          )}
                          <pre style={{ marginTop: 8, padding: 10, backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 12, color: '#1f2937', fontFamily: 'monospace', margin: 0, overflowX: 'auto' }}>
                            {JSON.stringify(st.value, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        {/* Sample-1 Standard Footer */}
        <footer className="sample1-footer" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#6b7280' }}>
          <div>Betla Eco-Companion | Department of Forest, Jharkhand</div>
          <div style={{ color: '#15803d', fontWeight: 600 }}>Explore • Protect • Preserve</div>
        </footer>
      </div>
    </div>
  );
};
