"use client";

import {
  getFeesPayment,
  getFeesPayments,
} from "@/services/feespayments";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { useQuery } from "@tanstack/react-query";

export function useFetchFeesPayments() {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["feespayments"],
    queryFn: () => getFeesPayments(auth),
    enabled: auth.isEnabled,
  });
}

export function useFetchFeesPaymentDetail(reference) {
  const auth = useAxiosAuth();
  return useQuery({
    queryKey: ["feespayment", reference],
    queryFn: () => getFeesPayment(reference, auth),
    enabled: !!reference && auth.isEnabled,
  });
}
