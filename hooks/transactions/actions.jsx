"use client";

import {
  downloadMemberYearlySummary,
  getAccountsList,
  getMemberYearlySummary,
} from "@/services/transactions";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { useQuery } from "@tanstack/react-query";
import useMemberNo from "../authentication/useMemberNo";

export function useFetchAccountsList() {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["accountsList"],
    queryFn: () => getAccountsList(auth),
    enabled: auth.isEnabled,
  });
}

export function useFetchMemberYearlySummary() {
  const auth = useAxiosAuth();
  const member_no = useMemberNo();

  return useQuery({
    queryKey: ["summary", member_no],
    queryFn: () => getMemberYearlySummary(member_no, auth),
    enabled: auth.isEnabled && !!member_no,
  });
}

export function useDownloadMemberYearlySummary() {
  const auth = useAxiosAuth();
  const member_no = useMemberNo();

  return useQuery({
    queryKey: ["summary", member_no],
    queryFn: () => downloadMemberYearlySummary(member_no, auth),
    enabled: auth.isEnabled && !!member_no,
  });
}