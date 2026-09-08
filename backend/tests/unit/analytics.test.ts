import { ALLOWED_ANALYTICS_ROLES, ANALYTICS_ERRORS } from '../../src/modules/analytics/analytics.constants';
import { AnalyticsService } from '../../src/modules/analytics/analytics.service';

describe('Module 7 Unit Tests: Analytics & Reporting', () => {
  describe('Constants & Role Access Specifications', () => {
    it('defines allowed analytics roles ADMIN and FOREST_AUTHORITY', () => {
      expect(ALLOWED_ANALYTICS_ROLES).toContain('ADMIN');
      expect(ALLOWED_ANALYTICS_ROLES).toContain('FOREST_AUTHORITY');
      expect(ALLOWED_ANALYTICS_ROLES).not.toContain('TOURIST');
      expect(ALLOWED_ANALYTICS_ROLES).not.toContain('GUIDE');
      expect(ALLOWED_ANALYTICS_ROLES).not.toContain('HOMESTAY');
    });

    it('defines correct error constants for analytics access control', () => {
      expect(ANALYTICS_ERRORS.UNAUTHORIZED.code).toBe('UNAUTHORIZED');
      expect(ANALYTICS_ERRORS.FORBIDDEN.code).toBe('FORBIDDEN');
    });
  });

  describe('Analytics Service Methods', () => {
    let service: AnalyticsService;

    beforeEach(() => {
      service = new AnalyticsService();
    });

    it('formats overview metrics correctly', async () => {
      const mockOverview = {
        totalUsers: 10,
        totalDestinations: 5,
        totalBookings: 8,
        totalRevenue: 12000.5,
        activeIncidents: 2,
        openEcoReports: 3,
      };

      jest.spyOn((service as any).repository, 'getOverviewMetrics').mockResolvedValue(mockOverview);

      const result = await service.getOverviewMetrics();
      expect(result).toHaveProperty('overview');
      expect(result.overview.totalUsers).toBe(10);
      expect(result.overview.totalRevenue).toBe(12000.5);
    });

    it('formats tourism metrics correctly', async () => {
      const mockTourism = {
        destinations: { total: 5, published: 4, draft: 1, featured: 2 },
        attractions: { total: 12 },
        experiences: { total: 6 },
        activities: { total: 8 },
      };

      jest.spyOn((service as any).repository, 'getTourismMetrics').mockResolvedValue(mockTourism);

      const result = await service.getTourismMetrics();
      expect(result.destinations.total).toBe(5);
      expect(result.destinations.published).toBe(4);
      expect(result.attractions.total).toBe(12);
    });
  });
});
