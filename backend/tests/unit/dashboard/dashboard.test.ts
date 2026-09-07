import { dashboardService } from '../../../src/modules/dashboard/dashboard.service';

describe('Dashboard Service - Unit Tests', () => {
  it('should be defined with getManagerDashboard method', () => {
    expect(dashboardService).toBeDefined();
    expect(typeof dashboardService.getManagerDashboard).toBe('function');
  });
});
