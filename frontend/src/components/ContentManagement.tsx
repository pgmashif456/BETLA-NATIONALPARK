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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header Banner */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>
              M3 Content Management
            </h2>
            <p style={{ color: '#6b7280', fontSize: 13, marginTop: 4, marginBottom: 0 }}>
              Manage official Betla National Park destinations, attractions, experiences, and activities.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 12, backgroundColor: '#dcfce7', color: '#166534', fontWeight: 600 }}>
              Destinations: {destinations.length}
            </span>
            <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 12, backgroundColor: '#e0e7ff', color: '#3730a3', fontWeight: 600 }}>
              Attractions: {attractions.length}
            </span>
          </div>
        </div>
        {message && (
          <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 8, backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2', color: message.type === 'success' ? '#166534' : '#991b1b', fontSize: 13, fontWeight: 500 }}>
            {message.text}
          </div>
        )}
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #e5e7eb', paddingBottom: 10 }}>
        {(['destinations', 'attractions', 'experiences', 'activities'] as const).map((tab) => {
          const count = tab === 'destinations' ? destinations.length : tab === 'attractions' ? attractions.length : tab === 'experiences' ? experiences.length : activities.length;
          const label = tab.charAt(0).toUpperCase() + tab.slice(1);
          const isSelected = subTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setSubTab(tab)}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#15803d' : '#ffffff',
                color: isSelected ? '#ffffff' : '#4b5563',
                boxShadow: isSelected ? 'none' : '0 1px 2px rgba(0,0,0,0.03)',
                borderWidth: isSelected ? 0 : 1,
                borderStyle: 'solid',
                borderColor: '#e5e7eb',
              }}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* DESTINATIONS SUBTAB */}
      {subTab === 'destinations' && (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Destinations Directory</h3>
            <button
              onClick={() => handleOpenDestModal()}
              style={{ padding: '8px 16px', backgroundColor: '#15803d', color: '#ffffff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              + Add Destination
            </button>
          </div>
          {destinations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 32, color: '#6b7280', fontSize: 13 }}>
              No destinations found. Click "+ Add Destination" to create the first destination.
            </div>
          ) : (
            <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: 8 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#4b5563', fontWeight: 600 }}>
                    <th style={{ padding: '12px 16px' }}>Name</th>
                    <th style={{ padding: '12px 16px' }}>Location</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px' }}>Featured</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {destinations.map((dest) => (
                    <tr key={dest.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#111827' }}>{dest.name}</td>
                      <td style={{ padding: '12px 16px', color: '#6b7280' }}>{dest.location || '—'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '3px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600, backgroundColor: dest.status === 'PUBLISHED' ? '#dcfce7' : '#fef3c7', color: dest.status === 'PUBLISHED' ? '#166534' : '#92400e' }}>
                          {dest.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#4b5563' }}>{dest.isFeatured ? '⭐ Yes' : 'No'}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          <button onClick={() => handleOpenDestModal(dest)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #d1d5db', backgroundColor: '#ffffff', color: '#374151', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                          <button onClick={() => handleToggleDestStatus(dest)} style={{ padding: '4px 10px', borderRadius: 6, border: 'none', backgroundColor: dest.status === 'PUBLISHED' ? '#f3f4f6' : '#15803d', color: dest.status === 'PUBLISHED' ? '#374151' : '#ffffff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                            {dest.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                          </button>
                          {isAdmin && (
                            <button onClick={() => handleDeleteDestination(dest.id)} style={{ padding: '4px 10px', borderRadius: 6, border: 'none', backgroundColor: '#fee2e2', color: '#dc2626', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Delete</button>
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

      {/* ATTRACTIONS SUBTAB */}
      {subTab === 'attractions' && (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Attractions Directory</h3>
            <button
              disabled={destinations.length === 0}
              onClick={() => handleOpenAttrModal()}
              style={{ padding: '8px 16px', backgroundColor: '#15803d', color: '#ffffff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: destinations.length === 0 ? 'not-allowed' : 'pointer', opacity: destinations.length === 0 ? 0.6 : 1 }}
            >
              + Add Attraction
            </button>
          </div>
          {destinations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 24, color: '#6b7280', fontSize: 13 }}>
              Please create at least one Destination before creating Attractions.
            </div>
          ) : attractions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 32, color: '#6b7280', fontSize: 13 }}>
              No attractions created yet.
            </div>
          ) : (
            <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: 8 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#4b5563', fontWeight: 600 }}>
                    <th style={{ padding: '12px 16px' }}>Name</th>
                    <th style={{ padding: '12px 16px' }}>Destination</th>
                    <th style={{ padding: '12px 16px' }}>Category</th>
                    <th style={{ padding: '12px 16px' }}>Hours</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attractions.map((attr) => {
                    const dest = destinations.find((d) => d.id === attr.destinationId);
                    const cat = categories.find((c) => c.id === attr.categoryId);
                    return (
                      <tr key={attr.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: '#111827' }}>{attr.name}</td>
                        <td style={{ padding: '12px 16px', color: '#6b7280' }}>{dest?.name || attr.destinationId}</td>
                        <td style={{ padding: '12px 16px', color: '#6b7280' }}>{cat?.name || '—'}</td>
                        <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: 12 }}>{attr.openingTime ? `${attr.openingTime} - ${attr.closingTime}` : '—'}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ padding: '3px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600, backgroundColor: attr.status === 'PUBLISHED' ? '#dcfce7' : '#fef3c7', color: attr.status === 'PUBLISHED' ? '#166534' : '#92400e' }}>
                            {attr.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: 6 }}>
                            <button onClick={() => handleOpenAttrModal(attr)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #d1d5db', backgroundColor: '#ffffff', color: '#374151', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                            <button onClick={() => handleToggleAttrStatus(attr)} style={{ padding: '4px 10px', borderRadius: 6, border: 'none', backgroundColor: attr.status === 'PUBLISHED' ? '#f3f4f6' : '#15803d', color: attr.status === 'PUBLISHED' ? '#374151' : '#ffffff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
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

      {/* EXPERIENCES SUBTAB */}
      {subTab === 'experiences' && (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Experiences Directory</h3>
            <button
              disabled={destinations.length === 0}
              onClick={() => handleOpenExpModal()}
              style={{ padding: '8px 16px', backgroundColor: '#15803d', color: '#ffffff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: destinations.length === 0 ? 'not-allowed' : 'pointer', opacity: destinations.length === 0 ? 0.6 : 1 }}
            >
              + Add Experience
            </button>
          </div>
          {destinations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 24, color: '#6b7280', fontSize: 13 }}>
              Please create at least one Destination before creating Experiences.
            </div>
          ) : experiences.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 32, color: '#6b7280', fontSize: 13 }}>
              No experiences created yet.
            </div>
          ) : (
            <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: 8 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#4b5563', fontWeight: 600 }}>
                    <th style={{ padding: '12px 16px' }}>Name</th>
                    <th style={{ padding: '12px 16px' }}>Destination</th>
                    <th style={{ padding: '12px 16px' }}>Duration</th>
                    <th style={{ padding: '12px 16px' }}>Difficulty</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {experiences.map((exp) => {
                    const dest = destinations.find((d) => d.id === exp.destinationId);
                    return (
                      <tr key={exp.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: '#111827' }}>{exp.name}</td>
                        <td style={{ padding: '12px 16px', color: '#6b7280' }}>{dest?.name || exp.destinationId}</td>
                        <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: 12 }}>{exp.duration || '—'}</td>
                        <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: 12 }}>{exp.difficulty || '—'}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ padding: '3px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600, backgroundColor: exp.status === 'PUBLISHED' ? '#dcfce7' : '#fef3c7', color: exp.status === 'PUBLISHED' ? '#166534' : '#92400e' }}>
                            {exp.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: 6 }}>
                            <button onClick={() => handleOpenExpModal(exp)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #d1d5db', backgroundColor: '#ffffff', color: '#374151', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                            <button onClick={() => handleToggleExpStatus(exp)} style={{ padding: '4px 10px', borderRadius: 6, border: 'none', backgroundColor: exp.status === 'PUBLISHED' ? '#f3f4f6' : '#15803d', color: exp.status === 'PUBLISHED' ? '#374151' : '#ffffff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
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

      {/* ACTIVITIES SUBTAB */}
      {subTab === 'activities' && (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Activities Directory</h3>
            <button
              disabled={destinations.length === 0}
              onClick={() => handleOpenActModal()}
              style={{ padding: '8px 16px', backgroundColor: '#15803d', color: '#ffffff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: destinations.length === 0 ? 'not-allowed' : 'pointer', opacity: destinations.length === 0 ? 0.6 : 1 }}
            >
              + Add Activity
            </button>
          </div>
          {destinations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 24, color: '#6b7280', fontSize: 13 }}>
              Please create at least one Destination before creating Activities.
            </div>
          ) : activities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 32, color: '#6b7280', fontSize: 13 }}>
              No activities created yet.
            </div>
          ) : (
            <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: 8 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#4b5563', fontWeight: 600 }}>
                    <th style={{ padding: '12px 16px' }}>Name</th>
                    <th style={{ padding: '12px 16px' }}>Destination</th>
                    <th style={{ padding: '12px 16px' }}>Duration</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((act) => {
                    const dest = destinations.find((d) => d.id === act.destinationId);
                    return (
                      <tr key={act.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: '#111827' }}>{act.name}</td>
                        <td style={{ padding: '12px 16px', color: '#6b7280' }}>{dest?.name || act.destinationId}</td>
                        <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: 12 }}>{act.duration || '—'}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ padding: '3px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600, backgroundColor: act.status === 'PUBLISHED' ? '#dcfce7' : '#fef3c7', color: act.status === 'PUBLISHED' ? '#166534' : '#92400e' }}>
                            {act.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: 6 }}>
                            <button onClick={() => handleOpenActModal(act)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #d1d5db', backgroundColor: '#ffffff', color: '#374151', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                            <button onClick={() => handleToggleActStatus(act)} style={{ padding: '4px 10px', borderRadius: 6, border: 'none', backgroundColor: act.status === 'PUBLISHED' ? '#f3f4f6' : '#15803d', color: act.status === 'PUBLISHED' ? '#374151' : '#ffffff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
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

      {/* MODAL: DESTINATION */}
      {activeModal === 'destination' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: 12, border: '1px solid #e5e7eb', width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto', padding: 24, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>
              {editingItem ? 'Edit Destination' : 'Create New Destination'}
            </h3>
            <form onSubmit={handleSubmitDestination} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Name *</label>
                <input required type="text" value={destForm.name} onChange={(e) => setDestForm({ ...destForm, name: e.target.value })} style={{ width: '100%', height: 36, padding: '0 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Slug</label>
                <input type="text" value={destForm.slug} onChange={(e) => setDestForm({ ...destForm, slug: e.target.value })} style={{ width: '100%', height: 36, padding: '0 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Short Description</label>
                <input type="text" value={destForm.shortDescription} onChange={(e) => setDestForm({ ...destForm, shortDescription: e.target.value })} style={{ width: '100%', height: 36, padding: '0 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Full Description</label>
                <textarea rows={3} value={destForm.description} onChange={(e) => setDestForm({ ...destForm, description: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Latitude</label>
                  <input type="number" step="any" value={destForm.latitude} onChange={(e) => setDestForm({ ...destForm, latitude: e.target.value })} style={{ width: '100%', height: 36, padding: '0 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Longitude</label>
                  <input type="number" step="any" value={destForm.longitude} onChange={(e) => setDestForm({ ...destForm, longitude: e.target.value })} style={{ width: '100%', height: 36, padding: '0 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13 }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Status</label>
                  <select value={destForm.status} onChange={(e) => setDestForm({ ...destForm, status: e.target.value })} style={{ width: '100%', height: 36, padding: '0 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13 }}>
                    <option value="DRAFT">DRAFT</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 20 }}>
                  <input type="checkbox" id="destFeatured" checked={destForm.isFeatured} onChange={(e) => setDestForm({ ...destForm, isFeatured: e.target.checked })} />
                  <label htmlFor="destFeatured" style={{ fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Featured Destination</label>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setActiveModal(null)} style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #d1d5db', backgroundColor: '#ffffff', color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ padding: '8px 18px', borderRadius: 6, border: 'none', backgroundColor: '#15803d', color: '#ffffff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {editingItem ? 'Save Changes' : 'Create Destination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ATTRACTION */}
      {activeModal === 'attraction' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: 12, border: '1px solid #e5e7eb', width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto', padding: 24, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>
              {editingItem ? 'Edit Attraction' : 'Create New Attraction'}
            </h3>
            <form onSubmit={handleSubmitAttraction} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Destination *</label>
                <select required value={attrForm.destinationId} onChange={(e) => setAttrForm({ ...attrForm, destinationId: e.target.value })} style={{ width: '100%', height: 36, padding: '0 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13 }}>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Attraction Name *</label>
                <input required type="text" value={attrForm.name} onChange={(e) => setAttrForm({ ...attrForm, name: e.target.value })} style={{ width: '100%', height: 36, padding: '0 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Category</label>
                <select value={attrForm.categoryId} onChange={(e) => setAttrForm({ ...attrForm, categoryId: e.target.value })} style={{ width: '100%', height: 36, padding: '0 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13 }}>
                  <option value="">No Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Description</label>
                <textarea rows={3} value={attrForm.description} onChange={(e) => setAttrForm({ ...attrForm, description: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Opening Time</label>
                  <input type="text" placeholder="06:00 AM" value={attrForm.openingTime} onChange={(e) => setAttrForm({ ...attrForm, openingTime: e.target.value })} style={{ width: '100%', height: 36, padding: '0 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Closing Time</label>
                  <input type="text" placeholder="06:00 PM" value={attrForm.closingTime} onChange={(e) => setAttrForm({ ...attrForm, closingTime: e.target.value })} style={{ width: '100%', height: 36, padding: '0 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13 }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Status</label>
                <select value={attrForm.status} onChange={(e) => setAttrForm({ ...attrForm, status: e.target.value })} style={{ width: '100%', height: 36, padding: '0 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13 }}>
                  <option value="DRAFT">DRAFT</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setActiveModal(null)} style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #d1d5db', backgroundColor: '#ffffff', color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ padding: '8px 18px', borderRadius: 6, border: 'none', backgroundColor: '#15803d', color: '#ffffff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {editingItem ? 'Save Changes' : 'Create Attraction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EXPERIENCE */}
      {activeModal === 'experience' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: 12, border: '1px solid #e5e7eb', width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto', padding: 24, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>
              {editingItem ? 'Edit Experience' : 'Create New Experience'}
            </h3>
            <form onSubmit={handleSubmitExperience} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Destination *</label>
                <select required value={expForm.destinationId} onChange={(e) => setExpForm({ ...expForm, destinationId: e.target.value })} style={{ width: '100%', height: 36, padding: '0 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13 }}>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Experience Name *</label>
                <input required type="text" value={expForm.name} onChange={(e) => setExpForm({ ...expForm, name: e.target.value })} style={{ width: '100%', height: 36, padding: '0 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Duration</label>
                <input type="text" placeholder="3 Hours" value={expForm.duration} onChange={(e) => setExpForm({ ...expForm, duration: e.target.value })} style={{ width: '100%', height: 36, padding: '0 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Difficulty</label>
                <input type="text" placeholder="Moderate" value={expForm.difficulty} onChange={(e) => setExpForm({ ...expForm, difficulty: e.target.value })} style={{ width: '100%', height: 36, padding: '0 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Description</label>
                <textarea rows={3} value={expForm.description} onChange={(e) => setExpForm({ ...expForm, description: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Status</label>
                <select value={expForm.status} onChange={(e) => setExpForm({ ...expForm, status: e.target.value })} style={{ width: '100%', height: 36, padding: '0 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13 }}>
                  <option value="DRAFT">DRAFT</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setActiveModal(null)} style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #d1d5db', backgroundColor: '#ffffff', color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ padding: '8px 18px', borderRadius: 6, border: 'none', backgroundColor: '#15803d', color: '#ffffff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {editingItem ? 'Save Changes' : 'Create Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ACTIVITY */}
      {activeModal === 'activity' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: 12, border: '1px solid #e5e7eb', width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto', padding: 24, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>
              {editingItem ? 'Edit Activity' : 'Create New Activity'}
            </h3>
            <form onSubmit={handleSubmitActivity} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Destination *</label>
                <select required value={actForm.destinationId} onChange={(e) => setActForm({ ...actForm, destinationId: e.target.value })} style={{ width: '100%', height: 36, padding: '0 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13 }}>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Activity Name *</label>
                <input required type="text" value={actForm.name} onChange={(e) => setActForm({ ...actForm, name: e.target.value })} style={{ width: '100%', height: 36, padding: '0 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Duration</label>
                <input type="text" placeholder="1 Hour" value={actForm.duration} onChange={(e) => setActForm({ ...actForm, duration: e.target.value })} style={{ width: '100%', height: 36, padding: '0 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Description</label>
                <textarea rows={3} value={actForm.description} onChange={(e) => setActForm({ ...actForm, description: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Status</label>
                <select value={actForm.status} onChange={(e) => setActForm({ ...actForm, status: e.target.value })} style={{ width: '100%', height: 36, padding: '0 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13 }}>
                  <option value="DRAFT">DRAFT</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setActiveModal(null)} style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #d1d5db', backgroundColor: '#ffffff', color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ padding: '8px 18px', borderRadius: 6, border: 'none', backgroundColor: '#15803d', color: '#ffffff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {editingItem ? 'Save Changes' : 'Create Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
