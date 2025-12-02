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
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["accountsList"],
    queryFn: () => getAccountsList(token),
    enabled: !!token,
  });
}

export function useFetchMemberYearlySummary() {
  const token = useAxiosAuth();
  const member_no = useMemberNo();

  return useQuery({
    queryKey: ["summary", member_no],
    queryFn: () => getMemberYearlySummary(member_no, token),
    enabled: !!token && !!member_no,
  });
}

export function useDownloadMemberYearlySummary() {
  const token = useAxiosAuth();
  const member_no = useMemberNo();

  return useQuery({
    queryKey: ["summary", member_no],
    queryFn: () => downloadMemberYearlySummary(member_no, token),
    enabled: !!token && !!member_no,
  });
}