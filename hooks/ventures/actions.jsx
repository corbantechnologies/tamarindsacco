"use client";

import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { getVenture, getVentures } from "@/services/ventures";

export function useFetchVentures() {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["ventures"],
    queryFn: () => getVentures(auth),
    enabled: auth.isEnabled,
  });
}

export function useFetchVentureDetail(identity) {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["venture", identity],
    queryFn: () => getVenture(identity, auth),
    enabled: !!identity && auth.isEnabled,
  });
}
