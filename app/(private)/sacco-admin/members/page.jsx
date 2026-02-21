"use client";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import SaccoMembersTable from "@/components/members/SaccoMembersTable";
import StatsCard from "@/components/saccoadmin/StatsCard";
import { Button } from "@/components/ui/button";
import BulkMemberUploadCreate from "@/forms/members/BulkMemberUploadCreate";
import CreateMember from "@/forms/members/CreateMember";
import { useFetchMembers } from "@/hooks/members/actions";
import { Plus, Upload, User, Users } from "lucide-react";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Assuming you're using shadcn/ui

function Members() {
  const [memberCreateModal, setMemberCreateModal] = useState(false);
  const [memberUploadModal, setMemberUploadModal] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false); // Optional: control open state

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const {
    isLoading: isLoadingMembers,
    data: membersData,
    refetch: refetchMembers,
  } = useFetchMembers(page, pageSize, search);

  const members = membersData?.results || [];
  const totalMembers = membersData?.count || 0;

  if (isLoadingMembers) return <LoadingSpinner />;

  const pendingApprovals =
    members?.filter((member) => !member?.is_approved).length || 0;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-2 sm:p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#cc5500]">
              Members
            </h1>
            <p className="text-gray-500 mt-1">Manage your members</p>
          </div>

          {/* Popover with Action Buttons */}
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button className="bg-[#045e32] hover:bg-[#022007] text-white font-medium">
                <Plus className="h-5 w-5 mr-2" />
                Add Members
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="end">
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  className="justify-start text-left font-normal hover:bg-gray-100"
                  onClick={() => {
                    setMemberCreateModal(true);
                    setPopoverOpen(false);
                  }}
                >
                  <User className="h-4 w-4 mr-3" />
                  New Member (Single)
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-left font-normal hover:bg-gray-100"
                  onClick={() => {
                    setMemberUploadModal(true);
                    setPopoverOpen(false);
                  }}
                >
                  <Upload className="h-4 w-4 mr-3" />
                  Upload Member CSV (Bulk)
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <StatsCard
            title="Total Members"
            value={totalMembers}
            Icon={Users}
            description="Active members in the system"
          />
          {/* Note: Pending approvals count might only be accurate for current page without separate API call */}
          <StatsCard
            title="Pending Approvals (Page)"
            value={pendingApprovals}
            Icon={Users}
            description="Members awaiting approval on this page"
          />
        </div>

        {/* Members Table */}
        <SaccoMembersTable
          members={members}
          refetchMembers={refetchMembers}
          totalMembers={totalMembers}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          search={search}
          setSearch={setSearch}
        />

        {/* Modals */}
        <CreateMember
          openModal={memberCreateModal}
          closeModal={() => setMemberCreateModal(false)}
        />

        <BulkMemberUploadCreate
          isOpen={memberUploadModal}
          onClose={() => setMemberUploadModal(false)}
          refetchMembers={refetchMembers}
        />
      </div>
    </div>
  );
}

export default Members;