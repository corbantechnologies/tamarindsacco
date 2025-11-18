"use client";
import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";
import {
  getGuarantorProfile,
  getGuarantorProfiles,
} from "@/services/guarantorprofile";
import useMemberNo from "../authentication/useMemberNo";

export function useFetchGuarantorProfiles() {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["guarantorprofiles"],
    queryFn: () => getGuarantorProfiles(token),
  });
}

export function useFetchGuarantorProfile() {
  const token = useAxiosAuth();
  const member = useMemberNo();

  return useQuery({
    queryKey: ["guarantorprofile", member],
    queryFn: () => getGuarantorProfile(member, token),
    enabled: !!member,
  });
}
