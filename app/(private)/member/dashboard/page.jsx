"use client";

import React, { useState } from "react";
import MemberLoadingSpinner from "@/components/general/MemberLoadingSpinner";
import InfoCard from "@/components/member/InfoCard";
import StatsCard from "@/components/member/StatsCard";
import SavingsTable from "@/components/savings/SavingsTable";
import { Button } from "@/components/ui/button";
import CreateSavingsAccount from "@/forms/savings/CreateSavingsAccount";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { useFetchMember } from "@/hooks/members/actions";
import { useFetchSavings } from "@/hooks/savings/actions";
import { useFetchSavingsTypes } from "@/hooks/savingtypes/actions";
import { DoorOpen, Plus, Wallet, Wallet2 } from "lucide-react";
import { signOut } from "next-auth/react";
import LoansTable from "@/components/loans/LoansTable";
import { useFetchLoans } from "@/hooks/loans/actions";
import { useFetchVentures } from "@/hooks/ventures/actions";
import VenturesTable from "@/components/ventures/VenturesTable";

function MemberDashboard() {
  const token = useAxiosAuth();
  const {
    isLoading: isLoadingMember,
    data: member,
    refetch: refetchMember,
  } = useFetchMember();

  const {
    isLoading: isLoadingLoans,
    data: loans,
    refetch: refetchLoans,
  } = useFetchLoans();

  const {
    isLoading: isLoadingSavingTypes,
    data: savingTypes,
    refetch: refetchSavingTypes,
  } = useFetchSavingsTypes();

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

  if (
    isLoadingMember ||
    isLoadingSavingTypes ||
    isLoadingSavings ||
    isLoadingLoans
  )
    return <MemberLoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4 sm:p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
              Hello, {member?.salutation} {member?.last_name}
            </h1>
            <p className="text-gray-500 mt-1">Welcome to your dashboard</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <InfoCard member={member} />
          <StatsCard
            title="Total Savings"
            value={savings?.length || 0}
            Icon={Wallet}
            description="Number of savings accounts created"
          />
          <StatsCard
            title="Savings Types"
            value={savingTypes?.length}
            Icon={Wallet2}
            description="Available saving products"
          />
        </div>

        {/* Savings Table */}
        <div className="space-y-4">
          <SavingsTable
            savings={savings}
            isLoading={isLoadingSavings}
            route="member"
          />
        </div>

        {/* Loans Table */}
        <div className="space-y-4">
          <LoansTable loans={loans} isLoading={isLoadingLoans} />
        </div>

        {/* Ventures Table */}
        <div className="space-y-4">
          <VenturesTable ventures={ventures} isLoading={isLoadingVentures} route="member" />
        </div>
      </div>
    </div>
  );
}

export default MemberDashboard;
