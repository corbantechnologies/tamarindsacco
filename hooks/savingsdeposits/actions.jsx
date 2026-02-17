"use client";

import {
  getSavingsDeposit,
  getSavingsDeposits,
} from "@/services/savingsdeposits";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { useQuery } from "@tanstack/react-query";

export function useFetchSavingsDeposits() {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["deposits"],
    queryFn: () => getSavingsDeposits(auth),
    enabled: auth.isEnabled,
  });
}

export function useFetchSavingsDepositDetail(reference) {
  const auth = useAxiosAuth();
  return useQuery({
    queryKey: ["deposit", reference],
    queryFn: () => getSavingsDeposit(reference, auth),
    enabled: !!reference && auth.isEnabled,
  });
}
