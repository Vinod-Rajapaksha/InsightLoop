import { useQuery } from "@tanstack/react-query";
import { dashboardApi, DashboardFilters } from '../api/dashboard.api';

export const useManagerDashboard = (filters?: DashboardFilters) => {
  return useQuery({
    queryKey: ["manager", "dashboard", filters],
    queryFn: () => dashboardApi.getManagerDashboard(filters),
  });
};
