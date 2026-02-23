"use client";

import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { getFeeTypeDetail, getFeeTypes } from "@/services/feetypes";

export function useFetchFeeTypes() {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["feetypes"],
    queryFn: () => getFeeTypes(auth),
    enabled: auth.isEnabled,
  });
}

export function useFetchFeeTypeDetail(reference) {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["feetype", reference],
    queryFn: () => getFeeTypeDetail(reference, auth),
    enabled: !!reference && auth.isEnabled,
  });
}
