import { PrismaClient, BookingStatus, TripStatus, VerificationStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class AnalyticsRepository {
  // ── Overview Metrics Aggregations ───────────────────────────
  async getOverviewMetrics() {
    const [
      totalUsers,
      totalDestinations,
      totalBookings,
      revenueResult,
      activeIncidents,
      openEcoReports,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.destination.count(),
      prisma.booking.count(),
      prisma.booking.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          status: {
            in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
          },
        },
      }),
      prisma.incident.count({
        where: {
          status: {
            in: ['REPORTED', 'ASSIGNED', 'IN_PROGRESS'],
          },
        },
      }),
      prisma.ecoReport.count({
        where: {
          status: {
            in: ['SUBMITTED', 'REVIEWED', 'ASSIGNED', 'IN_PROGRESS'],
          },
        },
      }),
    ]);

    const totalRevenue = Number(revenueResult._sum.totalAmount || 0);

    return {
      totalUsers,
      totalDestinations,
      totalBookings,
      totalRevenue,
      activeIncidents,
      openEcoReports,
    };
  }

  // ── Tourism Metrics Aggregations ────────────────────────────
  async getTourismMetrics() {
    const [
      totalDestinations,
      publishedDestinations,
      draftDestinations,
      featuredDestinations,
      totalAttractions,
      totalExperiences,
      totalActivities,
    ] = await Promise.all([
      prisma.destination.count(),
      prisma.destination.count({ where: { status: 'PUBLISHED' } }),
      prisma.destination.count({ where: { status: 'DRAFT' } }),
      prisma.destination.count({ where: { isFeatured: true } }),
      prisma.attraction.count(),
      prisma.experience.count(),
      prisma.activity.count(),
    ]);

    return {
      destinations: {
        total: totalDestinations,
        published: publishedDestinations,
        draft: draftDestinations,
        featured: featuredDestinations,
      },
      attractions: {
        total: totalAttractions,
      },
      experiences: {
        total: totalExperiences,
      },
      activities: {
        total: totalActivities,
      },
    };
  }

  // ── Bookings & Revenue Metrics Aggregations ─────────────────
  async getBookingsMetrics() {
    const [
      totalBookings,
      bookingStatusGroup,
      revenueResult,
      refundResult,
      totalTrips,
      tripStatusGroup,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.booking.aggregate({
        _sum: { totalAmount: true },
        where: {
          status: {
            in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
          },
        },
      }),
      prisma.bookingCancellation.aggregate({
        _sum: { refundAmount: true },
      }),
      prisma.trip.count(),
      prisma.trip.groupBy({
        by: ['status'],
        _count: true,
      }),
    ]);

    const statusCounts: Record<string, number> = {};
    bookingStatusGroup.forEach((item) => {
      statusCounts[item.status] = item._count;
    });

    const tripCounts: Record<string, number> = {};
    tripStatusGroup.forEach((item) => {
      tripCounts[item.status] = item._count;
    });

    const totalAmount = Number(revenueResult._sum.totalAmount || 0);
    const refundAmount = Number(refundResult._sum.refundAmount || 0);
    const netAmount = Number((totalAmount - refundAmount).toFixed(2));

    return {
      bookings: {
        total: totalBookings,
        pending: statusCounts[BookingStatus.PENDING] || 0,
        confirmed: statusCounts[BookingStatus.CONFIRMED] || 0,
        completed: statusCounts[BookingStatus.COMPLETED] || 0,
        cancelled: statusCounts[BookingStatus.CANCELLED] || 0,
        expired: statusCounts[BookingStatus.EXPIRED] || 0,
      },
      revenue: {
        totalAmount,
        refundAmount,
        netAmount,
      },
      trips: {
        total: totalTrips,
        draft: tripCounts[TripStatus.DRAFT] || 0,
        upcoming: tripCounts[TripStatus.UPCOMING] || 0,
        active: tripCounts[TripStatus.ACTIVE] || 0,
        completed: tripCounts[TripStatus.COMPLETED] || 0,
      },
    };
  }

  // ── Safety & Incident Metrics Aggregations ──────────────────
  async getSafetyMetrics() {
    const [
      totalIncidents,
      incidentStatusGroup,
      incidentPriorityGroup,
      totalContacts,
      availableContacts,
      activeAlerts,
      alertSeverityGroup,
    ] = await Promise.all([
      prisma.incident.count(),
      prisma.incident.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.incident.groupBy({
        by: ['priority'],
        _count: true,
      }),
      prisma.emergencyContact.count(),
      prisma.emergencyContact.count({ where: { isAvailable: true } }),
      prisma.safetyAlert.count({ where: { isActive: true } }),
      prisma.safetyAlert.groupBy({
        by: ['severity'],
        where: { isActive: true },
        _count: true,
      }),
    ]);

    const byStatus: Record<string, number> = {};
    incidentStatusGroup.forEach((item) => {
      byStatus[item.status] = item._count;
    });

    const byPriority: Record<string, number> = {};
    incidentPriorityGroup.forEach((item) => {
      byPriority[item.priority] = item._count;
    });

    const bySeverity: Record<string, number> = {};
    alertSeverityGroup.forEach((item) => {
      bySeverity[item.severity] = item._count;
    });

    return {
      incidents: {
        total: totalIncidents,
        byStatus,
        byPriority,
      },
      emergencyContacts: {
        total: totalContacts,
        available: availableContacts,
      },
      safetyAlerts: {
        active: activeAlerts,
        bySeverity,
      },
    };
  }

  // ── Eco-Management Metrics Aggregations ─────────────────────
  async getEcoMetrics() {
    const [
      totalReports,
      reportStatusGroup,
      reportPriorityGroup,
      totalCategories,
      totalActivities,
      activeActivities,
    ] = await Promise.all([
      prisma.ecoReport.count(),
      prisma.ecoReport.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.ecoReport.groupBy({
        by: ['priority'],
        _count: true,
      }),
      prisma.ecoCategory.count(),
      prisma.ecoActivity.count(),
      prisma.ecoActivity.count({ where: { status: 'ACTIVE' } }),
    ]);

    const byStatus: Record<string, number> = {};
    reportStatusGroup.forEach((item) => {
      byStatus[item.status] = item._count;
    });

    const byPriority: Record<string, number> = {};
    reportPriorityGroup.forEach((item) => {
      byPriority[item.priority] = item._count;
    });

    return {
      ecoReports: {
        total: totalReports,
        byStatus,
        byPriority,
      },
      ecoCategories: {
        total: totalCategories,
      },
      ecoActivities: {
        total: totalActivities,
        active: activeActivities,
      },
    };
  }

  // ── User & Stakeholder Metrics Aggregations ─────────────────
  async getUsersMetrics() {
    const [
      totalUsers,
      userStatusGroup,
      usersWithRole,
      totalTourists,
      totalGuides,
      verifiedGuides,
      pendingGuides,
      totalHomestays,
      verifiedHomestays,
      pendingHomestays,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.user.findMany({
        select: {
          role: {
            select: { name: true },
          },
        },
      }),
      prisma.touristProfile.count(),
      prisma.guideProfile.count(),
      prisma.guideProfile.count({ where: { verificationStatus: VerificationStatus.VERIFIED } }),
      prisma.guideProfile.count({ where: { verificationStatus: VerificationStatus.PENDING } }),
      prisma.homestayProfile.count(),
      prisma.homestayProfile.count({ where: { verificationStatus: VerificationStatus.VERIFIED } }),
      prisma.homestayProfile.count({ where: { verificationStatus: VerificationStatus.PENDING } }),
    ]);

    const byStatus: Record<string, number> = {};
    userStatusGroup.forEach((item) => {
      byStatus[item.status] = item._count;
    });

    const byRole: Record<string, number> = {};
    usersWithRole.forEach((u) => {
      const roleName = u.role.name;
      byRole[roleName] = (byRole[roleName] || 0) + 1;
    });

    return {
      users: {
        total: totalUsers,
        byRole,
        byStatus,
      },
      profiles: {
        tourists: {
          total: totalTourists,
        },
        guides: {
          total: totalGuides,
          verified: verifiedGuides,
          pending: pendingGuides,
        },
        homestays: {
          total: totalHomestays,
          verified: verifiedHomestays,
          pending: pendingHomestays,
        },
      },
    };
  }
}
