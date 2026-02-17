"use client";

import {
  getLoanApplication,
  getLoanApplications,
  getMyLoanApplications,
} from "@/services/loanapplications";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { useQuery } from "@tanstack/react-query";

export function useFetchLoanApplications() {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["loanapplications"],
    queryFn: () => getLoanApplications(auth),
    enabled: auth.isEnabled,
  });
}

export function useFetchLoanApplication(reference) {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["loanapplication", reference],
    queryFn: () => getLoanApplication(reference, auth),
    enabled: !!reference && auth.isEnabled,
  });
}

export function useFetchMyLoanApplications() {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["myloanapplications"],
    queryFn: () => getMyLoanApplications(auth),
    enabled: auth.isEnabled,
  });
}
