"use client";

import {
  getSavingsWithdrawal,
  getSavingsWithdrawals,
} from "@/services/savingswithdrawals";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { useQuery } from "@tanstack/react-query";

export function useFetchSavingsWithdrawals() {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["withdrawals"],
    queryFn: () => getSavingsWithdrawals(auth),
    enabled: auth.isEnabled,
  });
}

export function useFetchSavingsWithdrawal(reference) {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["withdrawal", reference],
    queryFn: () => getSavingsWithdrawal(reference, auth),
    enabled: !!reference && auth.isEnabled,
  });
}
