import React from 'react';
import { useAuth } from '../context/AuthContext';
import { RoleBadge } from '../components/RoleBadge';
import { Compass, ShieldAlert, Users, Trees, Calendar, Activity, CheckCircle, Bell } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '2rem' }}>Welcome, {user.fullName}</h1>
              <RoleBadge role={user.role} />
            </div>
            <p style={{ color: 'var(--text-muted)' }}>
              Logged in as <strong style={{ color: '#34d399' }}>{user.email}</strong> • Session Status: Secure JWT Authenticated
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#34d399', background: 'rgba(52, 211, 153, 0.1)', padding: '8px 14px', borderRadius: '20px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
              <CheckCircle size={14} /> Identity Verified (Module 1)
            </span>
          </div>
        </div>
      </div>

      {/* Role Specific Views */}
      {user.role === 'TOURIST' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#10b981' }}>
              <Compass size={24} />
              <h3 style={{ fontSize: '1.2rem' }}>Safari & Pass Booking</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '16px' }}>
              Book Jeep Safaris, Elephant rides, and entry passes for Betla National Park & Palamau Reserve.
            </p>
            <button className="btn-emerald" style={{ width: '100%', justifyContent: 'center' }}>
              Browse Available Safaris
            </button>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#f59e0b' }}>
              <Calendar size={24} />
              <h3 style={{ fontSize: '1.2rem' }}>Active Trips & Permits</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '16px' }}>
              View upcoming permits, eco-guide assignments, and QR code access passes.
            </p>
            <button className="btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              View My Permits
            </button>
          </div>
        </div>
      )} 

      {user.role === 'GUIDE' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#f59e0b' }}>
              <Users size={24} />
              <h3 style={{ fontSize: '1.2rem' }}>Eco-Guide Roster</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '16px' }}>
              View assigned tourist groups, safari shift times, and safari zone allocations.
            </p>
            <button className="btn-emerald" style={{ width: '100%', justifyContent: 'center' }}>
              Check Today's Assignments
            </button>
          </div>
        </div>
      )}

      {user.role === 'FOREST_OFFICER' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#ef4444' }}>
              <ShieldAlert size={24} />
              <h3 style={{ fontSize: '1.2rem' }}>Reserve Operations & Patrol</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '16px' }}>
              Monitor wildlife sightings, eco-checkpost logs, patrol team signals, and emergency SOS alerts.
            </p>
            <button className="btn-emerald" style={{ width: '100%', justifyContent: 'center' }}>
              Launch Patrol Console
            </button>
          </div>
        </div>
      )}

      {user.role === 'ADMIN' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#3b82f6' }}>
              <Activity size={24} />
              <h3 style={{ fontSize: '1.2rem' }}>System Administration</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '16px' }}>
              Manage user roles, audit security logs, configure platform parameters, and system infrastructure.
            </p>
            <button className="btn-emerald" style={{ width: '100%', justifyContent: 'center' }}>
              Open Admin Control Center
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
