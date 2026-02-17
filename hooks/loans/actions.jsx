"use client";

import { getLoan, getLoans } from "@/services/loans";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { useQuery } from "@tanstack/react-query";

export function useFetchLoans() {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["loans"],
    queryFn: () => getLoans(auth),
    enabled: auth.isEnabled,
  });
}

export function useFetchLoanDetail(identity) {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["loan", identity],
    queryFn: () => getLoan(identity, auth),
    enabled: !!identity && auth.isEnabled,
  });
}
