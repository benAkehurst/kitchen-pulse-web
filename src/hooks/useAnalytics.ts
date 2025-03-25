import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useAnalytics = () => {
  const { data: dashboard, ...dashboardQuery } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const { data } = await api.get("/analytics/get-dashboard");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    dashboard,
    dashboardQuery,
  };
};
