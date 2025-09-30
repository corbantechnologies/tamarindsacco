"use client";

import { getLoan, getLoans } from "@/services/loans";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { useQuery } from "@tanstack/react-query";

export function useFetchLoans() {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["loans"],
    queryFn: () => getLoans(token),
  });
}

export function useFetchLoanDetail(identity) {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["loan", identity],
    queryFn: () => getLoan(identity, token),
    enabled: !!identity,
  });
}
