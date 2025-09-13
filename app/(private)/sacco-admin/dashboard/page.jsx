"use client";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import MembersTable from "@/components/members/MembersTables";
import AdminInfoCard from "@/components/saccoadmin/AdminInfoCard";
import StatsCard from "@/components/saccoadmin/StatsCard";
import SavingsTypesTable from "@/components/savingstypes/SavingsTypesTable";
import { Button } from "@/components/ui/button";
import CreateSavingType from "@/forms/savingtypes/CreateSavingType";
import { useFetchMember, useFetchMembers } from "@/hooks/members/actions";
import { useFetchSavingsTypes } from "@/hooks/savingtypes/actions";
import { DoorOpen, Plus, Users, Wallet } from "lucide-react";
import { signOut } from "next-auth/react";
import React, { useState } from "react";

function SaccoAdminDashboard() {
  const [savingTypeModal, setSavingTypeModal] = useState(false);
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

  if (isLoadingMember || isLoadingMembers || isLoadingSavingTypes) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary">
              Welcome, {member.salutation} {member.last_name}
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your members and saving types
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setSavingTypeModal(true)}
              className="bg-[#cc5500] hover:bg-[#e66b00] text-white"
            >
              <Plus className="h-4 w-4 mr-2" /> New Saving Type
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut()}
              className="flex items-center gap-2 border-black text-black hover:bg-gray-100"
            >
              <DoorOpen className="h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </div>

        {/* Tables Section */}
        <div className="space-y-6">
          <MembersTable members={members} />
          <SavingsTypesTable savingTypes={savingTypes} />
        </div>

        {/* Modal */}
        <CreateSavingType
          isOpen={savingTypeModal}
          onClose={() => setSavingTypeModal(false)}
          refetchSavingTypes={refetchSavingTypes}
        />
      </div>
    </div>
  );
}

export default SaccoAdminDashboard;
