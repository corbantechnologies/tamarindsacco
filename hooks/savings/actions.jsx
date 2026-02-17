"use client";
import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { getSaving, getSavings } from "@/services/savings";

export function useFetchSavings() {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["savings"],
    queryFn: () => getSavings(auth),
    enabled: auth.isEnabled,
  });
}

export function useFetchSavingDetail(identity) {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["saving", identity],
    queryFn: () => getSaving(identity, auth),
    enabled: !!identity && auth.isEnabled,
  });
}
