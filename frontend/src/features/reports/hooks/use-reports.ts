import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reportsApi } from '../api/reports.api';
import { Report, ReportVersion } from "@/types";

export const useMyReports = () => {
  return useQuery({
    queryKey: ["reports", "my"],
    queryFn: reportsApi.getMyReports,
  });
};

export const useAllReports = (filters?: any) => {
  return useQuery({
    queryKey: ["reports", "all", filters],
    queryFn: () => reportsApi.getAllReports(filters),
  });
};

export const useReport = (id: string) => {
  return useQuery({
    queryKey: ["reports", id],
    queryFn: () => reportsApi.getReport(id),
    enabled: !!id,
  });
};

export const useReportVersions = (id: string) => {
  return useQuery({
    queryKey: ["reports", id, "versions"],
    queryFn: () => reportsApi.getReportVersions(id),
    enabled: !!id,
  });
};

export const useCreateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reportsApi.createReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};

export const useUpdateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      reportsApi.updateReport(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["reports", id] });
      queryClient.invalidateQueries({ queryKey: ["reports", "my"] });
    },
  });
};

export const useSubmitReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reportsApi.submitReport,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["reports", id] });
      queryClient.invalidateQueries({ queryKey: ["reports", "my"] });
    },
  });
};

export const useApproveReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reportsApi.approveReport,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["reports", id] });
      queryClient.invalidateQueries({ queryKey: ["reports", "all"] });
    },
  });
};

export const useRequestChanges = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment: string }) => 
      reportsApi.requestChanges(id, comment),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["reports", id] });
      queryClient.invalidateQueries({ queryKey: ["reports", "all"] });
    },
  });
};
