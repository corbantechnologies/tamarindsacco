"use client";

import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";
import {
  getVenturePayment,
  getVenturePayments,
} from "@/services/venturepayments";

export function useFetchVenturePayments() {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["venturepayments"],
    queryFn: () => getVenturePayments(auth),
    enabled: auth.isEnabled,
  });
}

export function useFetchVenturePayment(reference) {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["venturepayment", reference],
    queryFn: () => getVenturePayment(reference, auth),
    enabled: !!reference && auth.isEnabled,
  });
}
