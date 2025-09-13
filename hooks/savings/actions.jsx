"use client";
import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { getSaving, getSavings } from "@/services/savings";

export function useFetchSavings() {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["savings"],
    queryFn: () => getSavings(token),
  });
}

export function useFetchSavingDetail(identity) {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["saving", identity],
    queryFn: () => getSaving(identity, token),
    enabled: !!identity,
  });
}
