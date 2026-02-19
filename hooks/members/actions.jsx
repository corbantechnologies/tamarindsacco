"use client";

import { useMutation, useQuery, keepPreviousData } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";
import useUserId from "../authentication/useUserId";
import { approveMember, getMember, getMemberDetail, getMembers } from "@/services/members";
import { getMemberYearlySummary } from "@/services/transactions";

// MEMBER Hooks
export function useFetchMember() {
  const userId = useUserId();
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["member", userId],
    queryFn: () => getMember(userId, auth),
    enabled: !!userId && auth.isEnabled,
  });
}

// -----------------------------------------------------------------------------------------------

// SACCO Admin Hooks
// All members
export function useFetchMembers(page = 1, pageSize = 20) {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["members", page, pageSize],
    queryFn: () => getMembers(auth, page, pageSize),
    placeholderData: keepPreviousData,
    enabled: auth.isEnabled,
  });
}

// Single Member by member_no
export function useFetchMemberDetail(member_no) {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["member", member_no],
    queryFn: () => getMemberDetail(member_no, auth),
    enabled: !!member_no && auth.isEnabled,
  });
}

// Verify member
export function useVerifyMember(member_no) {
  const auth = useAxiosAuth();

  return useMutation({
    mutationFn: () => approveMember(member_no, auth),
  });
}

// fetch member summary in admin dashboard
export function useFetchMemberYearlySummaryAdmin(member_no, year) {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["summary", member_no, year],
    queryFn: () => getMemberYearlySummary(member_no, auth, year),
    enabled: !!auth.isEnabled && !!member_no,
  });
}
