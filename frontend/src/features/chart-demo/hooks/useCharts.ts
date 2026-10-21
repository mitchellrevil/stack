import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/auth/context";
import { getCharts } from "../api/charts";

export function useCharts() {
  const { api } = useAuth();

  return useQuery({
    queryKey: ["charts"],
    queryFn: ({ signal }) => getCharts(api, signal),
    staleTime: 60_000,
    retry: false,
  });
}
