"use client";

import {
  getSaccoYearlySummary,
  getSaccoCashBook,
  getMemberStatement,
  getSaccoBalanceSheet,
  getSaccoIncomeStatement,
  getSaccoTrialBalance,
} from "@/services/saccoreports";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { useQuery } from "@tanstack/react-query";

export function useFetchSaccoYearlySummary(year) {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["sacco-yearly-summary", year],
    queryFn: () => getSaccoYearlySummary(auth, year),
    enabled: auth.isEnabled,
  });
}

export function useFetchSaccoCashBook(year) {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["sacco-cash-book", year],
    queryFn: () => getSaccoCashBook(auth, year),
    enabled: auth.isEnabled,
  });
}

export function useFetchMemberStatement(member_no, year) {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["member-statement", member_no, year],
    queryFn: () => getMemberStatement(member_no, auth, year),
    enabled: !!member_no && auth.isEnabled,
  });
}

export function useFetchSaccoBalanceSheet(date) {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["sacco-balance-sheet", date],
    queryFn: () => getSaccoBalanceSheet(auth, date),
    enabled: auth.isEnabled,
  });
}

export function useFetchSaccoIncomeStatement(startDate, endDate) {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["sacco-income-statement", startDate, endDate],
    queryFn: () => getSaccoIncomeStatement(auth, startDate, endDate),
    enabled: auth.isEnabled,
  });
}

export function useFetchSaccoTrialBalance(date) {
  const auth = useAxiosAuth();

  return useQuery({
    queryKey: ["sacco-trial-balance", date],
    queryFn: () => getSaccoTrialBalance(auth, date),
    enabled: auth.isEnabled,
  });
}