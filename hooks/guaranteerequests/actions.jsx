"use client";

import {
  getGuaranteeRequest,
  getGuaranteeRequests,
} from "@/services/guaranteerequests";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { useQuery } from "@tanstack/react-query";

export function useFetchGuaranteeRequests() {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["guaranteeRequests"],
    queryFn: () => getGuaranteeRequests(token),
  });
}

export function useFetchGuaranteeRequest(reference) {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["guaranteeRequest", reference],
    queryFn: () => getGuaranteeRequest(reference, token),
    enabled: !!reference,
  });
}
