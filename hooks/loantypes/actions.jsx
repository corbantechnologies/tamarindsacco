"use client";

import { getLoanTypeDetail, getLoanTypes } from "@/services/loantypes";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { useQuery } from "@tanstack/react-query";

export function useFetchLoanTypes() {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["loanTypes"],
    queryFn: () => getLoanTypes(token),
  });
}

export function useFetchLoanTypeDetail(reference) {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["loanType", reference],
    queryFn: () => getLoanTypeDetail(reference, token),
  });
}
