"use client";
import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";
import {
  getGuarantorProfile,
  getGuarantorProfiles,
} from "@/services/guarantorprofile";
import useMemberNo from "../authentication/useMemberNo";

export function useFetchGuarantorProfiles() {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["guarantorprofiles"],
    queryFn: () => getGuarantorProfiles(auth),
    enabled: auth.isEnabled,
  });
}

export function useFetchGuarantorProfile() {
  const auth = useAxiosAuth();
  const member = useMemberNo();

  return useQuery({
    queryKey: ["guarantorprofile", member],
    queryFn: () => getGuarantorProfile(member, auth),
    enabled: !!member && auth.isEnabled,
  });
}
