"use client";

import React from "react";
import MemberLoadingSpinner from "@/components/general/MemberLoadingSpinner";
import { useFetchMemberYearlySummary } from "@/hooks/transactions/actions";
import DetailedSummaryTable from "@/components/summary/DetailedSummaryTable";

function Transactions() {
  const {
    isLoading: isLoadingSummary,
    data: summary,
    refetch: refetchSummary,
  } = useFetchMemberYearlySummary();

  console.log(summary);

  if (isLoadingSummary) {
    return <MemberLoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="px-2 py-2 sm:p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#045e32]">
              Transactions
            </h1>
            <p className="text-gray-500 mt-1">View your transactions</p>
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <DetailedSummaryTable
            data={summary}
            refetchSummary={refetchSummary}
          />
        </div>
      </div>
    </div>
  );
}

export default Transactions;
