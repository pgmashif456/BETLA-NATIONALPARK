export interface OverviewAnalyticsResponse {
  overview: {
    totalUsers: number;
    totalDestinations: number;
    totalBookings: number;
    totalRevenue: number;
    activeIncidents: number;
    openEcoReports: number;
  };
}

export interface TourismAnalyticsResponse {
  destinations: {
    total: number;
    published: number;
    draft: number;
    featured: number;
  };
  attractions: {
    total: number;
  };
  experiences: {
    total: number;
  };
  activities: {
    total: number;
  };
}

export interface BookingsAnalyticsResponse {
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    expired: number;
  };
  revenue: {
    totalAmount: number;
    refundAmount: number;
    netAmount: number;
  };
  trips: {
    total: number;
    draft: number;
    upcoming: number;
    active: number;
    completed: number;
  };
}

export interface SafetyAnalyticsResponse {
  incidents: {
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
  };
  emergencyContacts: {
    total: number;
    available: number;
  };
  safetyAlerts: {
    active: number;
    bySeverity: Record<string, number>;
  };
}

export interface EcoAnalyticsResponse {
  ecoReports: {
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
  };
  ecoCategories: {
    total: number;
  };
  ecoActivities: {
    total: number;
    active: number;
  };
}

export interface UsersAnalyticsResponse {
  users: {
    total: number;
    byRole: Record<string, number>;
    byStatus: Record<string, number>;
  };
  profiles: {
    tourists: {
      total: number;
    };
    guides: {
      total: number;
      verified: number;
      pending: number;
    };
    homestays: {
      total: number;
      verified: number;
      pending: number;
    };
  };
}
