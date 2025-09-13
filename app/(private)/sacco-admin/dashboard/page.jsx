"use client";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import MembersCountCard from "@/components/members/MemberInfoCard";
import MembersTable from "@/components/members/MembersTables";
import AdminInfoCard from "@/components/saccoadmin/AdminInfoCard";
import StatsCard from "@/components/saccoadmin/StatsCard";
import SavingsTypesTable from "@/components/savingstypes/SavingsTypesTable";
import SavingsTypesCountCard from "@/components/savingstypes/SavingTypesCount";
import { useFetchMember, useFetchMembers } from "@/hooks/members/actions";
import { useFetchSavingsTypes } from "@/hooks/savingtypes/actions";
import { Button, Card, Flex, Heading, Table, Text } from "@radix-ui/themes";
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
              variant="outline"
              onClick={() => signOut()}
              className="flex items-center gap-2"
            >
              <DoorOpen className="h-4 w-4" />
              Log out
            </Button>
            <Button
              onClick={() => setSavingTypeModal(true)}
              className="bg-primary hover:bg-primary/90 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Saving Type
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
      </div>
    </div>
  );
}

export default SaccoAdminDashboard;
