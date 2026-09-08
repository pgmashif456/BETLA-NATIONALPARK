import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// ── Request Interceptor: Attach access token ────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: Handle 401 + auto-refresh ─────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await api.post('/auth/refresh', { refreshToken });
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;

        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ── Auth API methods ────────────────────────────────────────
export const authApi = {
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: string;
  }) => api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  logout: () => {
    const refreshToken = localStorage.getItem('refreshToken');
    return api.post('/auth/logout', { refreshToken });
  },

  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),

  verify: (token: string) =>
    api.post('/auth/verify', { token }),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, newPassword: string) =>
    api.post('/auth/reset-password', { token, newPassword }),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),

  me: () => api.get('/auth/me'),
};

// ── Profile API methods ───────────────────────────────────────
export const profileApi = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data: any) => api.patch('/profile', data),

  getTouristProfile: () => api.get('/tourist/profile'),
  updateTouristProfile: (data: any) => api.patch('/tourist/profile', data),

  getGuideProfile: () => api.get('/guide/profile'),
  updateGuideProfile: (data: any) => api.patch('/guide/profile', data),
  submitGuideVerification: (data: { documentType: string; documentUrl: string }) =>
    api.post('/guide/profile/verification', data),
  getGuideVerification: () => api.get('/guide/profile/verification'),

  getHomestayProfile: () => api.get('/homestay/profile'),
  updateHomestayProfile: (data: any) => api.patch('/homestay/profile', data),
  submitHomestayVerification: (data: { documentType: string; documentUrl: string }) =>
    api.post('/homestay/profile/verification', data),
  getHomestayVerification: () => api.get('/homestay/profile/verification'),
};

// ── Content API methods ───────────────────────────────────────
export const contentApi = {
  getDiscover: () => api.get('/discover'),
  getDestinations: (params?: any) => api.get('/destinations', { params }),
  getDestinationById: (id: string) => api.get(`/destinations/${id}`),
  getNearbyDestinations: (params: { lat: number; lng: number; radiusKm?: number }) =>
    api.get('/destinations/nearby', { params }),
  getAttractions: (params?: any) => api.get('/attractions', { params }),
  getExperiences: (params?: any) => api.get('/experiences', { params }),
  getActivities: (params?: any) => api.get('/activities', { params }),
  getCategories: () => api.get('/categories'),
  createDestination: (data: any) => api.post('/destinations', data),
  updateDestination: (id: string, data: any) => api.patch('/destinations/' + id, data),
  deleteDestination: (id: string) => api.delete('/destinations/' + id),
  getAttractionById: (id: string) => api.get('/attractions/' + id),
  createAttraction: (data: any) => api.post('/attractions', data),
  updateAttraction: (id: string, data: any) => api.patch('/attractions/' + id, data),
  getExperienceById: (id: string) => api.get('/experiences/' + id),
  createExperience: (data: any) => api.post('/experiences', data),
  updateExperience: (id: string, data: any) => api.patch('/experiences/' + id, data),
  getActivityById: (id: string) => api.get('/activities/' + id),
  createActivity: (data: any) => api.post('/activities', data),
  updateActivity: (id: string, data: any) => api.patch('/activities/' + id, data),
};

// ── Safety API methods ────────────────────────────────────────
export const safetyApi = {
  createEmergency: (data: { type?: string; description?: string; location?: string; latitude?: number; longitude?: number }) =>
    api.post('/safety/emergency', data),
  createIncident: (data: { type: string; description: string; location?: string; latitude?: number; longitude?: number; priority?: string }) =>
    api.post('/incidents', data),
  getIncidents: (params?: { status?: string; priority?: string; reportedById?: string; assignedToId?: string }) =>
    api.get('/incidents', { params }),
  getIncidentById: (id: string) => api.get(`/incidents/${id}`),
  updateIncidentStatus: (id: string, data: { status: string; notes?: string }) =>
    api.patch(`/incidents/${id}/status`, data),
  assignIncident: (id: string, data: { assignedToId: string; notes?: string }) =>
    api.patch(`/incidents/${id}/assign`, data),
  addIncidentUpdate: (id: string, data: { notes: string }) =>
    api.post(`/incidents/${id}/update`, data),
  getSafetyAlerts: () => api.get('/safety/alerts'),
  createSafetyAlert: (data: { title: string; message: string; severity?: string; area?: string; expiresAt?: string }) =>
    api.post('/safety/alerts', data),
};

// ── Eco API methods ───────────────────────────────────────────
export const ecoApi = {
  createReport: (data: { categoryId?: string; description: string; location?: string; priority?: string }) =>
    api.post('/eco/reports', data),
  getReports: (params?: { status?: string; priority?: string; categoryId?: string; reportedById?: string; assignedToId?: string }) =>
    api.get('/eco/reports', { params }),
  getReportById: (id: string) => api.get(`/eco/reports/${id}`),
  updateReportStatus: (id: string, data: { status: string; notes?: string }) =>
    api.patch(`/eco/reports/${id}/status`, data),
  assignReport: (id: string, data: { assignedToId: string; notes?: string }) =>
    api.patch(`/eco/reports/${id}/assign`, data),
  getActivities: () => api.get('/eco/activities'),
  createActivity: (data: { title: string; description: string; activityDate: string; location?: string; organizer?: string; status?: string }) =>
    api.post('/eco/activities', data),
  updateActivity: (id: string, data: { title?: string; description?: string; activityDate?: string; location?: string; organizer?: string; status?: string }) =>
    api.put(`/eco/activities/${id}`, data),
};

// ── Booking API methods ───────────────────────────────────────
export const bookingApi = {
  createBooking: (data: {
    items: Array<{ itemType: string; itemId: string; quantity: number }>;
    guests: Array<{ fullName: string; age: number; idProofType: string; idProofNumber: string }>;
  }) => api.post('/bookings', data),

  getBookings: (params?: { status?: string; userId?: string }) =>
    api.get('/bookings', { params }),

  getBookingById: (id: string) => api.get(`/bookings/${id}`),

  cancelBooking: (id: string, data: { reason: string }) =>
    api.post(`/bookings/${id}/cancel`, data),

  initiatePayment: (data: { bookingId: string; paymentMethod: string }) =>
    api.post('/payments/initiate', data),

  processPaymentWebhook: (data: { gatewayTransactionId: string; bookingId: string; status: string; paymentMethod?: string }) =>
    api.post('/payments/webhook', data),
};

// ── Trip API methods ──────────────────────────────────────────
export const tripApi = {
  createTrip: (data: { title: string; startDate: string; endDate: string; status?: string }) =>
    api.post('/trips', data),

  getTrips: (params?: { status?: string }) =>
    api.get('/trips', { params }),

  getTripById: (id: string) => api.get(`/trips/${id}`),

  createTripItem: (tripId: string, data: { bookingId?: string; itemType: string; itemId: string; notes?: string }) =>
    api.post(`/trips/${tripId}/items`, data),
};

// ── Notification API methods ──────────────────────────────────
export const notificationApi = {
  getNotifications: (params?: { unreadOnly?: boolean; status?: string; type?: string; page?: number; limit?: number }) =>
    api.get('/notifications', { params }),

  markRead: (id: string) =>
    api.patch(`/notifications/${id}/read`),

  markAllRead: () =>
    api.patch('/notifications/read-all'),

  getPreferences: () =>
    api.get('/notifications/preferences'),

  updatePreferences: (data: { inAppEnabled?: boolean; pushEnabled?: boolean; emailEnabled?: boolean; smsEnabled?: boolean }) =>
    api.patch('/notifications/preferences', data),
};

// ── Review API methods ────────────────────────────────────────
export const reviewApi = {
  createReview: (data: { bookingId: string; targetType: string; targetId: string; rating: number; title?: string; comment: string }) =>
    api.post('/reviews', data),

  getPublicReviews: (params?: { targetType?: string; targetId?: string; status?: string; page?: number; limit?: number }) =>
    api.get('/reviews', { params }),

  getUserReviews: () =>
    api.get('/reviews/me'),

  updateReview: (id: string, data: { rating?: number; title?: string; comment?: string }) =>
    api.patch(`/reviews/${id}`, data),

  deleteReview: (id: string) =>
    api.delete(`/reviews/${id}`),

  createResponse: (id: string, data: { responseText: string }) =>
    api.post(`/reviews/${id}/responses`, data),
};

// ── Analytics API methods ─────────────────────────────────────
export const analyticsApi = {
  getOverview: () => api.get('/analytics/overview'),
  getTourism: () => api.get('/analytics/tourism'),
  getBookings: () => api.get('/analytics/bookings'),
  getSafety: () => api.get('/analytics/safety'),
  getEco: () => api.get('/analytics/eco'),
  getUsers: () => api.get('/analytics/users'),
};

// ── Admin API methods ─────────────────────────────────────────
export const adminApi = {
  getUsers: (params?: { page?: number; limit?: number; role?: string; status?: string; search?: string }) =>
    api.get('/admin/users', { params }),

  updateUserStatus: (id: string, data: { status: string; reason?: string }) =>
    api.patch(`/admin/users/${id}/status`, data),

  getRoles: () =>
    api.get('/admin/roles'),

  createRole: (data: { name: string; description?: string; permissionIds?: string[] }) =>
    api.post('/admin/roles', data),

  updateRole: (id: string, data: { name?: string; description?: string; permissionIds?: string[] }) =>
    api.put(`/admin/roles/${id}`, data),

  getAuditLogs: (params?: { page?: number; limit?: number; userId?: string; module?: string; action?: string; startDate?: string; endDate?: string }) =>
    api.get('/admin/audit-logs', { params }),

  getSettings: () =>
    api.get('/admin/settings'),

  updateSetting: (key: string, data: { value: any; description?: string }) =>
    api.put(`/admin/settings/${key}`, data),

  getDashboard: () =>
    api.get('/admin/dashboard'),

  getReports: (params: { reportType: string; startDate?: string; endDate?: string }) =>
    api.get('/admin/reports', { params }),
};

export default api;



