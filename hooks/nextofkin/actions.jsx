"use client";

import { getNextOfKin, getNextOfKins } from "@/services/nextofkin";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { useQuery } from "@tanstack/react-query";

export function useFetchNextOfKins() {
  const { token } = useAxiosAuth();

  return useQuery({
    queryKey: ["nextofkins"],
    queryFn: () => getNextOfKins(token),
  });
}

export function useFetchNextOfKin(reference) {
  const { token } = useAxiosAuth();

  return useQuery({
    queryKey: ["nextofkin", reference],
    queryFn: () => getNextOfKin(reference, token),
    enabled: !!reference,
  });
}
