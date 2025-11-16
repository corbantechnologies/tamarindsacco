"use client";

import {
  getLoanDisbursement,
  getLoanDisbursements,
} from "@/services/loandisbursements";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { useQuery } from "@tanstack/react-query";

export function useFetchLoanDisbursement(reference) {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["loandisbursement", reference],
    queryFn: () => getLoanDisbursement(reference, token),
    enabled: !!reference,
  });
}

export function useFetchLoanDisbursements() {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["loandisbursements"],
    queryFn: () => getLoanDisbursements(token),
  });
}
