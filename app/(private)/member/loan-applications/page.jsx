"use client";

import React from "react";
import MemberLoadingSpinner from "@/components/general/MemberLoadingSpinner";
import LoanApplicationsTable from "@/components/loanapplications/LoanApplicationsTable";
import { Button } from "@/components/ui/button";
import { useFetchLoanApplications } from "@/hooks/loanapplications/actions";

export default function LoanApplications() {
  const {
    isLoading,
    data: loanApplications = [],
    refetch,
  } = useFetchLoanApplications();

  if (isLoading) return <MemberLoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="px-2 py-2 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#045e32]">
              Loan Applications
            </h1>
            <p className="text-gray-500 mt-1">
              View and manage your loan requests
            </p>
          </div>

          <Button
            size="sm"
            className="bg-[#045e32] hover:bg-[#022007] text-white"
            onClick={() => alert("Navigate to loan-application form")}
          >
            Apply for a loan
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <LoanApplicationsTable data={loanApplications} />
        </div>
      </div>
    </div>
  );
}
