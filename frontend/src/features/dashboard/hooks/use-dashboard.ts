import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from '../api/dashboard.api';

export const useManagerDashboard = (weekStartDate?: string) => {
  return useQuery({
    queryKey: ["manager", "dashboard", weekStartDate],
    queryFn: () => dashboardApi.getManagerDashboard(weekStartDate),
  });
};
