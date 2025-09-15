"use client";

import MemberLoadingSpinner from "@/components/general/MemberLoadingSpinner";
import { useFetchMember } from "@/hooks/members/actions";
import { useFetchSavings } from "@/hooks/savings/actions";
import { useFetchSavingsTypes } from "@/hooks/savingtypes/actions";
import React from "react";

function MemberDashboard() {
  const {
    isLoading: isLoadingMember,
    data: member,
    refetch: refetchMember,
  } = useFetchMember();

  const {
    isLoading: isLoadingSavingTypes,
    data: savingTypes,
    refetch: refetchSavingTypes,
  } = useFetchSavingsTypes();

  const {
    isLoading: isLoadingSavings,
    data: savings,
    refetch: refetchSavings,
  } = useFetchSavings();

  if (isLoadingMember || isLoadingSavingTypes || isLoadingSavings)
    return <MemberLoadingSpinner />;

  return <div>MemberDashboard</div>;
}

export default MemberDashboard;
