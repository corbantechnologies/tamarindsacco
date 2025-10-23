"use client";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import LoansTable from "@/components/loans/LoansTable";
import SavingsTable from "@/components/savings/SavingsTable";
import VenturesTable from "@/components/ventures/VenturesTable";
import { useFetchLoans } from "@/hooks/loans/actions";
import { useFetchMember } from "@/hooks/members/actions";
import { useFetchSavings } from "@/hooks/savings/actions";
import { useFetchVentures } from "@/hooks/ventures/actions";
import React from "react";

function PersonalDashboard() {
  const {
    isLoading: isLoadingMember,
    data: member,
    refetch: refetchMember,
  } = useFetchMember();
  const {
    isLoading: isLoadingSavings,
    data: savings,
    refetch: refetchSavings,
    error: savingsError,
  } = useFetchSavings();

  const {
    isLoading: isLoadingVentures,
    data: ventures,
    refetch: refetchVentures,
  } = useFetchVentures();

  const {
    isLoading: isLoadingLoans,
    data: loans,
    refetch: refetchLoans,
  } = useFetchLoans();

  if (
    isLoadingMember ||
    isLoadingSavings ||
    isLoadingLoans ||
    isLoadingVentures
  )
    return <LoadingSpinner />;

  console.log(ventures);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
              Hello, {member?.salutation} {member?.last_name}
            </h1>
            <p className="text-gray-500 mt-1">
              Welcome to your personal dashboard
            </p>
          </div>
        </div>

        {/* Savings Table */}
        <div className="space-y-4">
          <SavingsTable
            savings={savings}
            isLoading={isLoadingSavings}
            route="sacco-admin"
          />
        </div>

        {/* Loans Table */}
        <div className="space-y-4">
          <LoansTable loans={loans} isLoading={isLoadingLoans} />
        </div>

        {/* Ventures Table */}
        <div className="space-y-4">
          <VenturesTable
            ventures={ventures}
            isLoading={isLoadingVentures}
            route="sacco-admin"
          />
        </div>
      </div>
    </div>
  );
}

export default PersonalDashboard;
