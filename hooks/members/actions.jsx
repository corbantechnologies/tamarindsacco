"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";
import useUserId from "../authentication/useUserId";
import { approveMember, getMember, getMemberDetail, getMembers } from "@/services/members";
import { getMemberYearlySummary } from "@/services/transactions";

// MEMBER Hooks
export function useFetchMember() {
  const userId = useUserId();
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["member", userId],
    queryFn: () => getMember(userId, token),
    enabled: !!userId,
  });
}

// -----------------------------------------------------------------------------------------------

// SACCO Admin Hooks
// All members
export function useFetchMembers(page = 1, pageSize = 20) {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["members", page, pageSize],
    queryFn: () => getMembers(token, page, pageSize),
  });
}

// Single Member by member_no
export function useFetchMemberDetail(member_no) {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["member", member_no],
    queryFn: () => getMemberDetail(member_no, token),
    enabled: !!member_no,
  });
}

// Verify member
export function useVerifyMember(member_no) {
  const token = useAxiosAuth();

  return useMutation({
    mutationFn: () => approveMember(member_no, token),
  });
}

// fetch member summary in admin dashboard
export function useFetchMemberYearlySummaryAdmin(member_no) {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["summary", member_no],
    queryFn: () => getMemberYearlySummary(member_no, token),
    enabled: !!token && !!member_no,
  });
}
