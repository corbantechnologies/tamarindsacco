"use client";

import {
  getLoanDisbursement,
  getLoanDisbursements,
} from "@/services/loandisbursements";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { useQuery } from "@tanstack/react-query";

export function useFetchLoanDisbursement(reference) {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["loandisbursement", reference],
    queryFn: () => getLoanDisbursement(reference, auth),
    enabled: !!reference && auth.isEnabled,
  });
}

export function useFetchLoanDisbursements() {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["loandisbursements"],
    queryFn: () => getLoanDisbursements(auth),
    enabled: auth.isEnabled,
  });
}
