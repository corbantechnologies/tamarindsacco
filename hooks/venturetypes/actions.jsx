"use client";

import { getVentureTypeDetail, getVentureTypes } from "@/services/venturetypes";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { useQuery } from "@tanstack/react-query";

export function useFetchVentureTypes() {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["venturetypes"],
    queryFn: () => getVentureTypes(auth),
    enabled: auth.isEnabled,
  });
}

export function useFetchVentureTypeDetail(reference) {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["venturetype", reference],
    queryFn: () => getVentureTypeDetail(reference, auth),
    enabled: !!reference && auth.isEnabled,
  });
}
