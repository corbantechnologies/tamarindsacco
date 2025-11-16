"use client";
import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";
import {
  getGuarantorProfile,
  getGuarantorProfiles,
} from "@/services/guarantorprofile";

export function useFetchGuarantorProfiles() {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["guarantorprofiles"],
    queryFn: () => getGuarantorProfiles(token),
  });
}

export function useFetchGuarantorProfile(reference) {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["guarantorprofile", reference],
    queryFn: () => getGuarantorProfile(reference, token),
    enabled: !!reference,
  });
}
