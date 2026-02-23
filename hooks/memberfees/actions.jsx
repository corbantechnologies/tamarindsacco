"use client";
import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { getMemberFee, getMemberFees } from "@/services/memberfees";

export function useFetchMemberFees() {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["memberfees"],
    queryFn: () => getMemberFees(auth),
    enabled: auth.isEnabled,
  });
}

export function useFetchMemberFeeDetail(reference) {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["memberfee", reference],
    queryFn: () => getMemberFee(reference, auth),
    enabled: !!reference && auth.isEnabled,
  });
}
