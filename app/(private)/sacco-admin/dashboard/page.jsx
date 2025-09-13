"use client";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import MembersCountCard from "@/components/members/MemberInfoCard";
import MembersTable from "@/components/members/MembersTables";
import AdminInfoCard from "@/components/saccoadmin/AdminInfoCard";
import SavingsTypesTable from "@/components/savingstypes/SavingsTypesTable";
import SavingsTypesCountCard from "@/components/savingstypes/SavingTypesCount";
import { useFetchMember, useFetchMembers } from "@/hooks/members/actions";
import { useFetchSavingsTypes } from "@/hooks/savingtypes/actions";
import { Button, Card, Flex, Heading, Table, Text } from "@radix-ui/themes";
import { DoorOpen, Plus, Users, Wallet } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50 p-6">
      <Flex direction="column" gap="6">
        {/* Header Section */}
        <Flex justify="between" align="center" gap="4">
          <Flex direction="column" gap="2">
            <Heading size="8" style={{ color: "#cc5500" }}>
              Welcome, {member?.salutation} {member?.last_name}
            </Heading>
            <Text size="4" color="gray">
              Manage your members and saving types
            </Text>
          </Flex>
          <Flex gap="4">
            <Button
              variant="outline"
              size="2"
              onClick={() => signOut()}
              className="flex items-center gap-2 cursor-pointer"
            >
              <DoorOpen className="h-4 w-4" />
              Log out
            </Button>
            <Button
              onClick={() => setSavingTypeModal(true)}
              color="orange"
              variant="soft"
            >
              <Plus className="h-4 w-4 mr-2" /> New Saving Type
            </Button>
          </Flex>
        </Flex>

        {/* Cards Section */}
        <Flex gap="4" wrap="wrap">
          <AdminInfoCard member={member} />
          <MembersCountCard count={members?.length || 0} />
          <SavingsTypesCountCard count={savingTypes?.length || 0} />
        </Flex>

        {/* Tables Section */}
        <MembersTable members={members} refetchMembers={refetchMembers} />
        <SavingsTypesTable savingTypes={savingTypes} />
      </Flex>
    </div>
  );
}

export default SaccoAdminDashboard;
