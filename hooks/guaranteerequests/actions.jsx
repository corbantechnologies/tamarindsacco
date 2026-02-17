"use client";

import {
  getGuaranteeRequest,
  getGuaranteeRequests,
} from "@/services/guaranteerequests";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { useQuery } from "@tanstack/react-query";

export function useFetchGuaranteeRequests() {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["guaranteeRequests"],
    queryFn: () => getGuaranteeRequests(auth),
    enabled: auth.isEnabled,
  });
}

export function useFetchGuaranteeRequest(reference) {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["guaranteeRequest", reference],
    queryFn: () => getGuaranteeRequest(reference, auth),
    enabled: !!reference && auth.isEnabled,
  });
}
