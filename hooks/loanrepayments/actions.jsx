"use client";

import { getLoanRepayment, getLoanRepayments } from "@/services/loanrepayments";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { useQuery } from "@tanstack/react-query";

export function useFetchLoanRepayments() {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["loanRepayments"],
    queryFn: () => getLoanRepayments(auth),
    enabled: auth.isEnabled,
  });
}

export function useFetchLoanRepaymentDetail(reference) {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["loanRepayment", reference],
    queryFn: () => getLoanRepayment(reference, auth),
    enabled: !!reference && auth.isEnabled,
  });
}
