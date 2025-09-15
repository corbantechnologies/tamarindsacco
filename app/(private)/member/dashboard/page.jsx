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

function MemberDashboard() {
  const token = useAxiosAuth();
  const [savingsCreateModal, setSavingsCreateModal] = useState(false);
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
    error: savingsError,
  } = useFetchSavings();

  if (isLoadingMember || isLoadingSavingTypes || isLoadingSavings)
    return <MemberLoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4 sm:p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#045e32]">
              Hello, {member?.salutation} {member?.last_name}
            </h1>
            <p className="text-gray-500 mt-1">Welcome to your dashboard</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {savingTypes?.length > 0 && (
              <Button
                className="bg-[#045e32] hover:bg-[#022007] text-white text-sm sm:text-base py-2 px-3 sm:px-4 flex-1 sm:flex-none"
                onClick={() => setSavingsCreateModal(true)}
              >
                Create Savings Account
              </Button>
            )}
            <Button
              variant="outline"
              className="border-black text-black hover:bg-gray-100 text-sm sm:text-base py-2 px-3 sm:px-4 flex-1 sm:flex-none"
              onClick={() => signOut()}
            >
              <DoorOpen className="h-4 w-4 mr-2" />
              Log out
            </Button>
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
          <h2 className="text-xl sm:text-2xl font-bold text-[#045e32]">
            Your Savings Accounts
          </h2>
          <SavingsTable savings={savings} isLoading={isLoadingSavings} />
        </div>

        {/* Modal */}
        <CreateSavingsAccount
          isOpen={savingsCreateModal}
          onClose={() => setSavingsCreateModal(false)}
          refetchSavings={refetchSavings}
          savingTypes={savingTypes}
        />
      </div>
    </div>
  );
}

export default MemberDashboard;
