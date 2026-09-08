import React, { useState, useEffect, useCallback } from 'react';
import { contentApi } from '../api/client';

interface ContentManagementProps {
  isAdmin: boolean;
  isForestAuthority: boolean;
}

export const ContentManagement: React.FC<ContentManagementProps> = ({ isAdmin }) => {
  const [subTab, setSubTab] = useState<'destinations' | 'attractions' | 'experiences' | 'activities'>('destinations');
  const [categories, setCategories] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [attractions, setAttractions] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeModal, setActiveModal] = useState<'destination' | 'attraction' | 'experience' | 'activity' | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [destForm, setDestForm] = useState({ name: '', slug: '', shortDescription: '', description: '', location: '', latitude: '', longitude: '', status: 'DRAFT', isFeatured: false });
  const [attrForm, setAttrForm] = useState({ destinationId: '', categoryId: '', name: '', description: '', location: '', openingTime: '', closingTime: '', status: 'DRAFT' });
  const [expForm, setExpForm] = useState({ destinationId: '', categoryId: '', name: '', description: '', duration: '', difficulty: '', status: 'DRAFT' });
  const [actForm, setActForm] = useState({ destinationId: '', categoryId: '', name: '', description: '', duration: '', status: 'DRAFT' });

  const loadContentData = useCallback(async () => {
    try {
      setLoading(true);
      const [catRes, destRes, attrRes, expRes, actRes] = await Promise.all([
        contentApi.getCategories().catch(() => ({ data: { data: [] } })),
        contentApi.getDestinations().catch(() => ({ data: { data: [] } })),
        contentApi.getAttractions().catch(() => ({ data: { data: [] } })),
        contentApi.getExperiences().catch(() => ({ data: { data: [] } })),
        contentApi.getActivities().catch(() => ({ data: { data: [] } })),
      ]);
      setCategories(catRes.data.data || []);
      setDestinations(destRes.data.data || []);
      setAttractions(attrRes.data.data || []);
      setExperiences(expRes.data.data || []);
      setActivities(actRes.data.data || []);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to load content' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        const [catRes, destRes, attrRes, expRes, actRes] = await Promise.all([
          contentApi.getCategories().catch(() => ({ data: { data: [] } })),
          contentApi.getDestinations().catch(() => ({ data: { data: [] } })),
          contentApi.getAttractions().catch(() => ({ data: { data: [] } })),
          contentApi.getExperiences().catch(() => ({ data: { data: [] } })),
          contentApi.getActivities().catch(() => ({ data: { data: [] } })),
        ]);
        if (isMounted) {
          setCategories(catRes.data.data || []);
          setDestinations(destRes.data.data || []);
          setAttractions(attrRes.data.data || []);
          setExperiences(expRes.data.data || []);
          setActivities(actRes.data.data || []);
        }
      } catch (err: any) {
        if (isMounted) {
          setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to load content' });
        }
      }
    };
    init();
    return () => { isMounted = false; };
  }, []);

  const handleOpenDestModal = (dest?: any) => {
    if (dest) {
      setEditingItem(dest);
      setDestForm({ name: dest.name || '', slug: dest.slug || '', shortDescription: dest.shortDescription || '', description: dest.description || '', location: dest.location || '', latitude: dest.latitude ? String(dest.latitude) : '', longitude: dest.longitude ? String(dest.longitude) : '', status: dest.status || 'DRAFT', isFeatured: Boolean(dest.isFeatured) });
    } else {
      setEditingItem(null);
      setDestForm({ name: '', slug: '', shortDescription: '', description: '', location: '', latitude: '', longitude: '', status: 'DRAFT', isFeatured: false });
    }
    setActiveModal('destination');
  };

  const handleSubmitDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destForm.name.trim()) return;
    try {
      setLoading(true); setMessage(null);
      const payload: any = { name: destForm.name.trim(), status: destForm.status, isFeatured: destForm.isFeatured };
      if (destForm.slug.trim()) payload.slug = destForm.slug.trim();
      if (destForm.shortDescription.trim()) payload.shortDescription = destForm.shortDescription.trim();
      if (destForm.description.trim()) payload.description = destForm.description.trim();
      if (destForm.location.trim()) payload.location = destForm.location.trim();
      if (destForm.latitude !== '') payload.latitude = parseFloat(destForm.latitude);
      if (destForm.longitude !== '') payload.longitude = parseFloat(destForm.longitude);
      if (editingItem) {
        await contentApi.updateDestination(editingItem.id, payload);
        setMessage({ type: 'success', text: 'Destination updated successfully' });
      } else {
        await contentApi.createDestination(payload);
        setMessage({ type: 'success', text: 'Destination created successfully' });
      }
      setActiveModal(null); await loadContentData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed' });
    } finally { setLoading(false); }
  };

  const handleDeleteDestination = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this destination?')) return;
    try {
      setLoading(true); setMessage(null);
      await contentApi.deleteDestination(id);
      setMessage({ type: 'success', text: 'Destination deleted successfully' });
      await loadContentData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Delete failed' });
    } finally { setLoading(false); }
  };

  const handleToggleDestStatus = async (dest: any) => {
    const nextStatus = dest.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      setLoading(true); setMessage(null);
      await contentApi.updateDestination(dest.id, { status: nextStatus });
      setMessage({ type: 'success', text: `Status updated to ${nextStatus}` });
      await loadContentData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Status update failed' });
    } finally { setLoading(false); }
  };

  const handleOpenAttrModal = (attr?: any) => {
    if (attr) {
      setEditingItem(attr);
      setAttrForm({ destinationId: attr.destinationId || '', categoryId: attr.categoryId || '', name: attr.name || '', description: attr.description || '', location: attr.location || '', openingTime: attr.openingTime || '', closingTime: attr.closingTime || '', status: attr.status || 'DRAFT' });
    } else {
      setEditingItem(null);
      setAttrForm({ destinationId: destinations[0]?.id || '', categoryId: '', name: '', description: '', location: '', openingTime: '', closingTime: '', status: 'DRAFT' });
    }
    setActiveModal('attraction');
  };

  const handleSubmitAttraction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attrForm.name.trim() || !attrForm.destinationId) return;
    try {
      setLoading(true); setMessage(null);
      const payload: any = { destinationId: attrForm.destinationId, name: attrForm.name.trim(), status: attrForm.status };
      if (attrForm.categoryId) payload.categoryId = attrForm.categoryId;
      if (attrForm.description.trim()) payload.description = attrForm.description.trim();
      if (attrForm.location.trim()) payload.location = attrForm.location.trim();
      if (attrForm.openingTime.trim()) payload.openingTime = attrForm.openingTime.trim();
      if (attrForm.closingTime.trim()) payload.closingTime = attrForm.closingTime.trim();
      if (editingItem) {
        await contentApi.updateAttraction(editingItem.id, payload);
        setMessage({ type: 'success', text: 'Attraction updated successfully' });
      } else {
        await contentApi.createAttraction(payload);
        setMessage({ type: 'success', text: 'Attraction created successfully' });
      }
      setActiveModal(null); await loadContentData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed' });
    } finally { setLoading(false); }
  };

  const handleToggleAttrStatus = async (attr: any) => {
    const nextStatus = attr.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      setLoading(true); setMessage(null);
      await contentApi.updateAttraction(attr.id, { status: nextStatus });
      setMessage({ type: 'success', text: `Status updated to ${nextStatus}` });
      await loadContentData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Status update failed' });
    } finally { setLoading(false); }
  };

  const handleOpenExpModal = (exp?: any) => {
    if (exp) {
      setEditingItem(exp);
      setExpForm({ destinationId: exp.destinationId || '', categoryId: exp.categoryId || '', name: exp.name || '', description: exp.description || '', duration: exp.duration || '', difficulty: exp.difficulty || '', status: exp.status || 'DRAFT' });
    } else {
      setEditingItem(null);
      setExpForm({ destinationId: destinations[0]?.id || '', categoryId: '', name: '', description: '', duration: '', difficulty: '', status: 'DRAFT' });
    }
    setActiveModal('experience');
  };

  const handleSubmitExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expForm.name.trim() || !expForm.destinationId) return;
    try {
      setLoading(true); setMessage(null);
      const payload: any = { destinationId: expForm.destinationId, name: expForm.name.trim(), status: expForm.status };
      if (expForm.categoryId) payload.categoryId = expForm.categoryId;
      if (expForm.description.trim()) payload.description = expForm.description.trim();
      if (expForm.duration.trim()) payload.duration = expForm.duration.trim();
      if (expForm.difficulty.trim()) payload.difficulty = expForm.difficulty.trim();
      if (editingItem) {
        await contentApi.updateExperience(editingItem.id, payload);
        setMessage({ type: 'success', text: 'Experience updated successfully' });
      } else {
        await contentApi.createExperience(payload);
        setMessage({ type: 'success', text: 'Experience created successfully' });
      }
      setActiveModal(null); await loadContentData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed' });
    } finally { setLoading(false); }
  };

  const handleToggleExpStatus = async (exp: any) => {
    const nextStatus = exp.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      setLoading(true); setMessage(null);
      await contentApi.updateExperience(exp.id, { status: nextStatus });
      setMessage({ type: 'success', text: `Status updated to ${nextStatus}` });
      await loadContentData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Status update failed' });
    } finally { setLoading(false); }
  };

  const handleOpenActModal = (act?: any) => {
    if (act) {
      setEditingItem(act);
      setActForm({ destinationId: act.destinationId || '', categoryId: act.categoryId || '', name: act.name || '', description: act.description || '', duration: act.duration || '', status: act.status || 'DRAFT' });
    } else {
      setEditingItem(null);
      setActForm({ destinationId: destinations[0]?.id || '', categoryId: '', name: '', description: '', duration: '', status: 'DRAFT' });
    }
    setActiveModal('activity');
  };

  const handleSubmitActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actForm.name.trim() || !actForm.destinationId) return;
    try {
      setLoading(true); setMessage(null);
      const payload: any = { destinationId: actForm.destinationId, name: actForm.name.trim(), status: actForm.status };
      if (actForm.categoryId) payload.categoryId = actForm.categoryId;
      if (actForm.description.trim()) payload.description = actForm.description.trim();
      if (actForm.duration.trim()) payload.duration = actForm.duration.trim();
      if (editingItem) {
        await contentApi.updateActivity(editingItem.id, payload);
        setMessage({ type: 'success', text: 'Activity updated successfully' });
      } else {
        await contentApi.createActivity(payload);
        setMessage({ type: 'success', text: 'Activity created successfully' });
      }
      setActiveModal(null); await loadContentData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed' });
    } finally { setLoading(false); }
  };

  const handleToggleActStatus = async (act: any) => {
    const nextStatus = act.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      setLoading(true); setMessage(null);
      await contentApi.updateActivity(act.id, { status: nextStatus });
      setMessage({ type: 'success', text: `Status updated to ${nextStatus}` });
      await loadContentData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Status update failed' });
    } finally { setLoading(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-primary)', marginBottom: 'var(--space-xs)' }}>
              M3 Content Management
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
              Manage official Betla National Park destinations, attractions, experiences, and activities.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
            <span className="badge badge-primary">Destinations: {destinations.length}</span>
            <span className="badge badge-accent">Attractions: {attractions.length}</span>
          </div>
        </div>
        {message && (
          <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-sm) var(--space-md)', borderRadius: 'var(--radius-md)', backgroundColor: message.type === 'success' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: message.type === 'success' ? '#34d399' : '#f87171', fontSize: 'var(--text-sm)' }}>
            {message.text}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-xs)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-xs)' }}>
        <button className={`btn ${subTab === 'destinations' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSubTab('destinations')} style={{ padding: '8px 16px', fontSize: 'var(--text-sm)' }}>
          Destinations ({destinations.length})
        </button>
        <button className={`btn ${subTab === 'attractions' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSubTab('attractions')} style={{ padding: '8px 16px', fontSize: 'var(--text-sm)' }}>
          Attractions ({attractions.length})
        </button>
        <button className={`btn ${subTab === 'experiences' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSubTab('experiences')} style={{ padding: '8px 16px', fontSize: 'var(--text-sm)' }}>
          Experiences ({experiences.length})
        </button>
        <button className={`btn ${subTab === 'activities' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSubTab('activities')} style={{ padding: '8px 16px', fontSize: 'var(--text-sm)' }}>
          Activities ({activities.length})
        </button>
      </div>

      {subTab === 'destinations' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)' }}>Destinations Directory</h3>
            <button className="btn btn-primary" onClick={() => handleOpenDestModal()}>+ Add Destination</button>
          </div>
          {destinations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--text-muted)' }}>
              No destinations found. Click "+ Add Destination" to create the first destination.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px' }}>Name</th>
                    <th style={{ padding: '12px' }}>Location</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Featured</th>
                    <th style={{ padding: '12px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {destinations.map((dest) => (
                    <tr key={dest.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px', fontWeight: 600 }}>{dest.name}</td>
                      <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{dest.location || '—'}</td>
                      <td style={{ padding: '12px' }}>
                        <span className={`badge ${dest.status === 'PUBLISHED' ? 'badge-primary' : 'badge-accent'}`}>
                          {dest.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>{dest.isFeatured ? '⭐ Yes' : 'No'}</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleOpenDestModal(dest)}>Edit</button>
                          <button className={`btn btn-sm ${dest.status === 'PUBLISHED' ? 'btn-secondary' : 'btn-primary'}`} onClick={() => handleToggleDestStatus(dest)}>
                            {dest.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                          </button>
                          {isAdmin && (
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteDestination(dest.id)}>Delete</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {subTab === 'attractions' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)' }}>Attractions Directory</h3>
            <button className="btn btn-primary" disabled={destinations.length === 0} onClick={() => handleOpenAttrModal()}>+ Add Attraction</button>
          </div>
          {destinations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--text-muted)' }}>
              Please create at least one Destination before creating Attractions.
            </div>
          ) : attractions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--text-muted)' }}>
              No attractions created yet.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px' }}>Name</th>
                    <th style={{ padding: '12px' }}>Destination</th>
                    <th style={{ padding: '12px' }}>Category</th>
                    <th style={{ padding: '12px' }}>Hours</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attractions.map((attr) => {
                    const dest = destinations.find((d) => d.id === attr.destinationId);
                    const cat = categories.find((c) => c.id === attr.categoryId);
                    return (
                      <tr key={attr.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px', fontWeight: 600 }}>{attr.name}</td>
                        <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{dest?.name || attr.destinationId}</td>
                        <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{cat?.name || '—'}</td>
                        <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                          {attr.openingTime || attr.closingTime ? `${attr.openingTime || ''} - ${attr.closingTime || ''}` : '—'}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span className={`badge ${attr.status === 'PUBLISHED' ? 'badge-primary' : 'badge-accent'}`}>
                            {attr.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleOpenAttrModal(attr)}>Edit</button>
                            <button className={`btn btn-sm ${attr.status === 'PUBLISHED' ? 'btn-secondary' : 'btn-primary'}`} onClick={() => handleToggleAttrStatus(attr)}>
                              {attr.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {subTab === 'experiences' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)' }}>Experiences Directory</h3>
            <button className="btn btn-primary" disabled={destinations.length === 0} onClick={() => handleOpenExpModal()}>+ Add Experience</button>
          </div>
          {destinations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--text-muted)' }}>
              Please create at least one Destination before creating Experiences.
            </div>
          ) : experiences.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--text-muted)' }}>
              No experiences created yet.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px' }}>Name</th>
                    <th style={{ padding: '12px' }}>Destination</th>
                    <th style={{ padding: '12px' }}>Category</th>
                    <th style={{ padding: '12px' }}>Duration</th>
                    <th style={{ padding: '12px' }}>Difficulty</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {experiences.map((exp) => {
                    const dest = destinations.find((d) => d.id === exp.destinationId);
                    const cat = categories.find((c) => c.id === exp.categoryId);
                    return (
                      <tr key={exp.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px', fontWeight: 600 }}>{exp.name}</td>
                        <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{dest?.name || exp.destinationId}</td>
                        <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{cat?.name || '—'}</td>
                        <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{exp.duration || '—'}</td>
                        <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{exp.difficulty || '—'}</td>
                        <td style={{ padding: '12px' }}>
                          <span className={`badge ${exp.status === 'PUBLISHED' ? 'badge-primary' : 'badge-accent'}`}>
                            {exp.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleOpenExpModal(exp)}>Edit</button>
                            <button className={`btn btn-sm ${exp.status === 'PUBLISHED' ? 'btn-secondary' : 'btn-primary'}`} onClick={() => handleToggleExpStatus(exp)}>
                              {exp.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {subTab === 'activities' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)' }}>Activities Directory</h3>
            <button className="btn btn-primary" disabled={destinations.length === 0} onClick={() => handleOpenActModal()}>+ Add Activity</button>
          </div>
          {destinations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--text-muted)' }}>
              Please create at least one Destination before creating Activities.
            </div>
          ) : activities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--text-muted)' }}>
              No activities created yet.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px' }}>Name</th>
                    <th style={{ padding: '12px' }}>Destination</th>
                    <th style={{ padding: '12px' }}>Category</th>
                    <th style={{ padding: '12px' }}>Duration</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((act) => {
                    const dest = destinations.find((d) => d.id === act.destinationId);
                    const cat = categories.find((c) => c.id === act.categoryId);
                    return (
                      <tr key={act.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px', fontWeight: 600 }}>{act.name}</td>
                        <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{dest?.name || act.destinationId}</td>
                        <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{cat?.name || '—'}</td>
                        <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{act.duration || '—'}</td>
                        <td style={{ padding: '12px' }}>
                          <span className={`badge ${act.status === 'PUBLISHED' ? 'badge-primary' : 'badge-accent'}`}>
                            {act.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleOpenActModal(act)}>Edit</button>
                            <button className={`btn btn-sm ${act.status === 'PUBLISHED' ? 'btn-secondary' : 'btn-primary'}`} onClick={() => handleToggleActStatus(act)}>
                              {act.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeModal === 'destination' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 'var(--space-md)' }}>
          <div className="glass-card" style={{ maxWidth: 600, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-md)' }}>
              {editingItem ? 'Edit Destination' : 'Create New Destination'}
            </h3>
            <form onSubmit={handleSubmitDestination} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div className="form-group">
                <label className="form-label">Destination Name *</label>
                <input type="text" required value={destForm.name} onChange={(e) => setDestForm({ ...destForm, name: e.target.value })} placeholder="e.g. Betla Fort" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Slug (Optional)</label>
                <input type="text" value={destForm.slug} onChange={(e) => setDestForm({ ...destForm, slug: e.target.value })} placeholder="e.g. betla-fort" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Short Description</label>
                <input type="text" maxLength={500} value={destForm.shortDescription} onChange={(e) => setDestForm({ ...destForm, shortDescription: e.target.value })} placeholder="Brief summary" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Detailed Description</label>
                <textarea rows={3} value={destForm.description} onChange={(e) => setDestForm({ ...destForm, description: e.target.value })} placeholder="Full information..." className="form-input" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-sm)' }}>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input type="text" value={destForm.location} onChange={(e) => setDestForm({ ...destForm, location: e.target.value })} placeholder="e.g. Palamau" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Latitude</label>
                  <input type="number" step="any" value={destForm.latitude} onChange={(e) => setDestForm({ ...destForm, latitude: e.target.value })} placeholder="23.8872" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Longitude</label>
                  <input type="number" step="any" value={destForm.longitude} onChange={(e) => setDestForm({ ...destForm, longitude: e.target.value })} placeholder="84.1913" className="form-input" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Status</label>
                  <select value={destForm.status} onChange={(e) => setDestForm({ ...destForm, status: e.target.value })} className="form-input">
                    <option value="DRAFT">DRAFT (Hidden from Tourists)</option>
                    <option value="PUBLISHED">PUBLISHED (Visible in Discovery)</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1, display: 'flex', alignItems: 'center', paddingTop: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={destForm.isFeatured} onChange={(e) => setDestForm({ ...destForm, isFeatured: e.target.checked })} />
                    Feature on Homepage
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : editingItem ? 'Update Destination' : 'Create Destination'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'attraction' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 'var(--space-md)' }}>
          <div className="glass-card" style={{ maxWidth: 560, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-md)' }}>
              {editingItem ? 'Edit Attraction' : 'Create New Attraction'}
            </h3>
            <form onSubmit={handleSubmitAttraction} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div className="form-group">
                <label className="form-label">Destination *</label>
                <select required value={attrForm.destinationId} onChange={(e) => setAttrForm({ ...attrForm, destinationId: e.target.value })} className="form-input">
                  <option value="">Select Target Destination</option>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Category (Optional)</label>
                <select value={attrForm.categoryId} onChange={(e) => setAttrForm({ ...attrForm, categoryId: e.target.value })} className="form-input">
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Attraction Name *</label>
                <input type="text" required value={attrForm.name} onChange={(e) => setAttrForm({ ...attrForm, name: e.target.value })} placeholder="e.g. Seven Chambers Viewpoint" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea rows={3} value={attrForm.description} onChange={(e) => setAttrForm({ ...attrForm, description: e.target.value })} placeholder="Attraction details..." className="form-input" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
                <div className="form-group">
                  <label className="form-label">Opening Time</label>
                  <input type="text" value={attrForm.openingTime} onChange={(e) => setAttrForm({ ...attrForm, openingTime: e.target.value })} placeholder="06:00 AM" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Closing Time</label>
                  <input type="text" value={attrForm.closingTime} onChange={(e) => setAttrForm({ ...attrForm, closingTime: e.target.value })} placeholder="05:00 PM" className="form-input" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select value={attrForm.status} onChange={(e) => setAttrForm({ ...attrForm, status: e.target.value })} className="form-input">
                  <option value="DRAFT">DRAFT</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : editingItem ? 'Update Attraction' : 'Create Attraction'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'experience' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 'var(--space-md)' }}>
          <div className="glass-card" style={{ maxWidth: 560, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-md)' }}>
              {editingItem ? 'Edit Experience' : 'Create New Experience'}
            </h3>
            <form onSubmit={handleSubmitExperience} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div className="form-group">
                <label className="form-label">Destination *</label>
                <select required value={expForm.destinationId} onChange={(e) => setExpForm({ ...expForm, destinationId: e.target.value })} className="form-input">
                  <option value="">Select Target Destination</option>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Category (Optional)</label>
                <select value={expForm.categoryId} onChange={(e) => setExpForm({ ...expForm, categoryId: e.target.value })} className="form-input">
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Experience Name *</label>
                <input type="text" required value={expForm.name} onChange={(e) => setExpForm({ ...expForm, name: e.target.value })} placeholder="e.g. Sunset Jungle Trek" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea rows={3} value={expForm.description} onChange={(e) => setExpForm({ ...expForm, description: e.target.value })} placeholder="Experience details..." className="form-input" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input type="text" value={expForm.duration} onChange={(e) => setExpForm({ ...expForm, duration: e.target.value })} placeholder="e.g. 2 Hours" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <input type="text" value={expForm.difficulty} onChange={(e) => setExpForm({ ...expForm, difficulty: e.target.value })} placeholder="e.g. Easy / Moderate" className="form-input" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select value={expForm.status} onChange={(e) => setExpForm({ ...expForm, status: e.target.value })} className="form-input">
                  <option value="DRAFT">DRAFT</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : editingItem ? 'Update Experience' : 'Create Experience'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'activity' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 'var(--space-md)' }}>
          <div className="glass-card" style={{ maxWidth: 560, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-md)' }}>
              {editingItem ? 'Edit Activity' : 'Create New Activity'}
            </h3>
            <form onSubmit={handleSubmitActivity} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div className="form-group">
                <label className="form-label">Destination *</label>
                <select required value={actForm.destinationId} onChange={(e) => setActForm({ ...actForm, destinationId: e.target.value })} className="form-input">
                  <option value="">Select Target Destination</option>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Category (Optional)</label>
                <select value={actForm.categoryId} onChange={(e) => setActForm({ ...actForm, categoryId: e.target.value })} className="form-input">
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Activity Name *</label>
                <input type="text" required value={actForm.name} onChange={(e) => setActForm({ ...actForm, name: e.target.value })} placeholder="e.g. Elephant Safari Trail" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea rows={3} value={actForm.description} onChange={(e) => setActForm({ ...actForm, description: e.target.value })} placeholder="Activity details..." className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Duration</label>
                <input type="text" value={actForm.duration} onChange={(e) => setActForm({ ...actForm, duration: e.target.value })} placeholder="e.g. 1.5 Hours" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select value={actForm.status} onChange={(e) => setActForm({ ...actForm, status: e.target.value })} className="form-input">
                  <option value="DRAFT">DRAFT</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : editingItem ? 'Update Activity' : 'Create Activity'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
