"use client";

import React, { useState } from "react";
import MemberLoadingSpinner from "@/components/general/MemberLoadingSpinner";
import InfoCard from "@/components/member/InfoCard";
import SavingsTable from "@/components/savings/SavingsTable";
import { useFetchMember } from "@/hooks/members/actions";
import LoansTable from "@/components/loans/LoansTable";
import VenturesTable from "@/components/ventures/VenturesTable";
import { useFetchMemberYearlySummary } from "@/hooks/transactions/actions";
import YearlySummaryTable from "@/components/summary/YearlySummaryTable";
import MonthsSummaryTable from "@/components/summary/MonthsSummaryTable";
import DetailedMonthlySummaryTable from "@/components/summary/DetailedMonthlySummaryTable";
import DetailedSummaryTable from "@/components/summary/DetailedSummaryTable";
import DetailedSummaryCards from "@/components/summary/DetailedSummary";
import DetailedSummaryAccordion from "@/components/summary/DetailedSummaryAccordion";

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

  if (isLoadingMember || isLoadingSummary) {
    return <MemberLoadingSpinner />;
  }

  console.log(summary);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className=" sm:p-6 space-y-6">
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

        {/* Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-[#045e32] mb-4">
            Yearly Summary
          </h2>
          <MonthsSummaryTable data={summary} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-[#045e32] mb-4">
            Monthly Summary Table without types
          </h2>
          <DetailedMonthlySummaryTable data={summary} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-[#045e32] mb-4">
            Detailed Table Summary
          </h2>
          <DetailedSummaryTable data={summary} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-[#045e32] mb-4">
            Yearly Summary
          </h2>
          <DetailedSummaryAccordion data={summary} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-[#045e32] mb-4">
            Yearly Summary
          </h2>
          <DetailedSummaryCards data={summary} />
        </div>
      </div>
    </div>
  );
}

export default MemberDashboard;
