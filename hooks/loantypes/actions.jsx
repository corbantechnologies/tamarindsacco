"use client";

import { getLoanTypeDetail, getLoanTypes } from "@/services/loantypes";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { useQuery } from "@tanstack/react-query";

export function useFetchLoanTypes() {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["loanTypes"],
    queryFn: () => getLoanTypes(auth),
    enabled: auth.isEnabled,
  });
}

export function useFetchLoanTypeDetail(reference) {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["loanType", reference],
    queryFn: () => getLoanTypeDetail(reference, auth),
    enabled: !!reference && auth.isEnabled,
  });
}
