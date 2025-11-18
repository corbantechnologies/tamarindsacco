"use client";

import {
  getLoanApplication,
  getLoanApplications,
  getMyLoanApplications,
} from "@/services/loanapplications";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { useQuery } from "@tanstack/react-query";

export function useFetchLoanApplications() {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["loanapplications"],
    queryFn: () => getLoanApplications(token),
  });
}

export function useFetchLoanApplication(reference) {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["loanapplication", reference],
    queryFn: () => getLoanApplication(reference, token),
    enabled: !!reference,
  });
}

export function useFetchMyLoanApplications() {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["myloanapplications"],
    queryFn: () => getMyLoanApplications(token),
  });
}
