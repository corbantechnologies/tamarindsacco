"use client";

import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";
import {
  getVentureDeposit,
  getVentureDeposits,
} from "@/services/venturedeposits";

export function useFetchVentureDeposits() {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["venturedeposits"],
    queryFn: () => getVentureDeposits(auth),
    enabled: auth.isEnabled,
  });
}

export function useFetchVentureDeposit(reference) {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["venturedeposit", reference],
    queryFn: () => getVentureDeposit(reference, auth),
    enabled: !!reference && auth.isEnabled,
  });
}
