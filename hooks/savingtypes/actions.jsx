"use client";

import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { getSavingTypeDetail, getSavingTypes } from "@/services/savingstypes";

export function useFetchSavingsTypes() {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["savingstypes"],
    queryFn: () => getSavingTypes(auth),
    enabled: auth.isEnabled,
  });
}

export function useFetchSavingsTypeDetail(reference) {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["savingstype", reference],
    queryFn: () => getSavingTypeDetail(reference, auth),
    enabled: !!reference && auth.isEnabled,
  });
}
