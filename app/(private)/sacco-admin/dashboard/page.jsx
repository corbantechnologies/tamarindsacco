"use client";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import LoanTypesTable from "@/components/loantypes/LoanTypesTable";
import SaccoMembersTable from "@/components/members/SaccoMembersTable";
import AdminInfoCard from "@/components/saccoadmin/AdminInfoCard";
import StatsCard from "@/components/saccoadmin/StatsCard";
import SavingsTypesTable from "@/components/savingstypes/SavingsTypesTable";
import { Button } from "@/components/ui/button";
import VentureTypesTable from "@/components/venturetypes/VentureTypesTable";
import CreateLoanType from "@/forms/loantypes/CreateLoanType";
import CreateMember from "@/forms/members/CreateMember";
import CreateSavingType from "@/forms/savingtypes/CreateSavingType";
import CreateVentureType from "@/forms/venturetypes/CreateVentureType";
import { useFetchLoans } from "@/hooks/loans/actions";
import { useFetchLoanTypes } from "@/hooks/loantypes/actions";
import { useFetchMember, useFetchMembers } from "@/hooks/members/actions";
import { useFetchSavings } from "@/hooks/savings/actions";
import { useFetchSavingsTypes } from "@/hooks/savingtypes/actions";
import { useFetchVentureTypes } from "@/hooks/venturetypes/actions";
import {
  DoorOpen,
  Plus,
  ShoppingCart,
  User,
  Users,
  Wallet,
  Wallet2,
} from "lucide-react";
import React, { useState } from "react";

function SaccoAdminDashboard() {
  const [savingTypeModal, setSavingTypeModal] = useState(false);
  const [loanTypeModal, setLoanTypeModal] = useState(false);
  const [memberCreateModal, setMemberCreateModal] = useState(false);
  const [ventureTypeModal, setVentureTypeModal] = useState(false);

  const {
    isLoading: isLoadingMember,
    data: member,
    refetch: refetchMember,
  } = useFetchMember();
  const {
    isLoading: isLoadingMembers,
    data: members,
    refetch: refetchMembers,
  } = useFetchMembers();
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
    isLoading: isLoadingLoanTypes,
    data: loanTypes,
    refetch: refetchLoanTypes,
  } = useFetchLoanTypes();

  const {
    isLoading: isLoadingLoans,
    data: loans,
    refetch: refetchLoans,
  } = useFetchLoans();

  const {
    isLoading: isLoadingVentureTypes,
    data: ventureTypes,
    refetch: refetchVentureTypes,
  } = useFetchVentureTypes();

  if (
    isLoadingMember ||
    isLoadingMembers ||
    isLoadingSavingTypes ||
    isLoadingSavings ||
    isLoadingLoanTypes ||
    isLoadingLoans ||
    isLoadingVentureTypes
  ) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4 sm:p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold ">
              Welcome, {member?.salutation} {member?.last_name}
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your members, saving types, savings and loan types
            </p>
          </div>

          {/* Header Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button
              onClick={() => setMemberCreateModal(true)}
              className="bg-primary hover:bg-[#022007] text-white text-sm sm:text-base py-2 px-3 sm:px-4 flex-1 sm:flex-none"
            >
              <User className="h-4 w-4 mr-2" /> Member
            </Button>
            <Button
              onClick={() => setSavingTypeModal(true)}
              className="bg-[#cc5500] hover:bg-[#e66b00] text-white text-sm sm:text-base py-2 px-3 sm:px-4 flex-1 sm:flex-none"
            >
              <Wallet2 className="h-4 w-4 mr-2" /> Saving Type
            </Button>
            <Button
              onClick={() => setLoanTypeModal(true)}
              className="bg-primary hover:bg-[#022007] text-white text-sm sm:text-base py-2 px-3 sm:px-4 flex-1 sm:flex-none"
            >
              <Plus className="h-4 w-4 mr-2" /> Loan Type
            </Button>
            <Button
              onClick={() => setVentureTypeModal(true)}
              className="bg-[#cc5500] hover:bg-[#e66b00] text-white text-sm sm:text-base py-2 px-3 sm:px-4 flex-1 sm:flex-none"
            >
              <ShoppingCart className="h-4 w-4 mr-2" /> Venture Type
            </Button>
          </div>
        </div>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          <AdminInfoCard member={member} />
          <StatsCard
            title="Total Members"
            value={members?.length}
            Icon={Users}
            description="Active members in the system"
          />
          <StatsCard
            title="Savings Types"
            value={savingTypes?.length}
            Icon={Wallet}
            description="Available saving products"
          />
          <StatsCard
            title="Loan Types"
            value={loanTypes?.length}
            Icon={Wallet2}
            description="Available loan products"
          />
          <StatsCard
            title="Venture Types"
            value={ventureTypes?.length}
            Icon={ShoppingCart}
            description="Available venture products"
          />
        </div>

        {/* Tables Section */}
        <div className="space-y-6">
          {/* Put these tables side by side and stack over each other on smaller screens */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SavingsTypesTable savingTypes={savingTypes} />
            <LoanTypesTable loanTypes={loanTypes} />
            <VentureTypesTable ventureTypes={ventureTypes} />
          </div>

          {/* Members Table */}
          <SaccoMembersTable
            members={members}
            refetchMembers={refetchMembers}
          />
        </div>

        {/* Modals */}
        <CreateSavingType
          isOpen={savingTypeModal}
          onClose={() => setSavingTypeModal(false)}
          refetchSavingTypes={refetchSavingTypes}
        />

        <CreateMember
          openModal={memberCreateModal}
          closeModal={() => setMemberCreateModal(false)}
        />

        <CreateLoanType
          isOpen={loanTypeModal}
          onClose={() => setLoanTypeModal(false)}
          refetchLoanTypes={refetchLoanTypes}
        />

        <CreateVentureType
          isOpen={ventureTypeModal}
          onClose={() => setVentureTypeModal(false)}
          refetchVentureTypes={refetchVentureTypes}
        />
      </div>
    </div>
  );
}

export default SaccoAdminDashboard;
