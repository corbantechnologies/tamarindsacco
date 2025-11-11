"use client";

import React, { useState } from "react";
import MemberLoadingSpinner from "@/components/general/MemberLoadingSpinner";
import InfoCard from "@/components/member/InfoCard";
import SavingsTable from "@/components/savings/SavingsTable";
import { useFetchMember } from "@/hooks/members/actions";
import LoansTable from "@/components/loans/LoansTable";
import VenturesTable from "@/components/ventures/VenturesTable";
import { useFetchMemberYearlySummary } from "@/hooks/transactions/actions";

function MemberDashboard() {
  const {
    isLoading: isLoadingMember,
    data: member,
    refetch: refetchMember,
  } = useFetchMember();

  const {
    isLoading: isLoadingSummary,
    data: summary,
    refetch: refetchSummary,
  } = useFetchMemberYearlySummary();

  if (isLoadingMember) {
    return <MemberLoadingSpinner />;
  }

  console.log(summary);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4 sm:p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#045e32]">
              Hello, {member?.salutation} {member?.last_name}
            </h1>
            <p className="text-gray-500 text-sm sm:text-base mt-1">
              Welcome to your dashboard
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div>
          <InfoCard member={member} />
        </div>

        {/* Savings Table */}
        <div className="space-y-4">
          <SavingsTable
            savings={member?.savings_accounts}
            isLoading={isLoadingMember}
            route="member"
          />
        </div>

        {/* Loans Table */}
        <div className="space-y-4">
          <LoansTable
            loans={member?.loans}
            isLoading={isLoadingMember}
            route="member"
          />
        </div>

        {/* Ventures Table */}
        <div className="space-y-4">
          <VenturesTable
            ventures={member?.venture_accounts}
            isLoading={isLoadingMember}
            route="member"
          />
        </div>
      </div>
    </div>
  );
}

export default MemberDashboard;
