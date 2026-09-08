import { AnalyticsRepository } from './analytics.repository';
import {
  OverviewAnalyticsResponse,
  TourismAnalyticsResponse,
  BookingsAnalyticsResponse,
  SafetyAnalyticsResponse,
  EcoAnalyticsResponse,
  UsersAnalyticsResponse,
} from './analytics.types';

export class AnalyticsService {
  private repository: AnalyticsRepository;

  constructor() {
    this.repository = new AnalyticsRepository();
  }

  async getOverviewMetrics(): Promise<OverviewAnalyticsResponse> {
    const overview = await this.repository.getOverviewMetrics();
    return { overview };
  }

  async getTourismMetrics(): Promise<TourismAnalyticsResponse> {
    return this.repository.getTourismMetrics();
  }

  async getBookingsMetrics(): Promise<BookingsAnalyticsResponse> {
    return this.repository.getBookingsMetrics();
  }

  async getSafetyMetrics(): Promise<SafetyAnalyticsResponse> {
    return this.repository.getSafetyMetrics();
  }

  async getEcoMetrics(): Promise<EcoAnalyticsResponse> {
    return this.repository.getEcoMetrics();
  }

  async getUsersMetrics(): Promise<UsersAnalyticsResponse> {
    return this.repository.getUsersMetrics();
  }
}
