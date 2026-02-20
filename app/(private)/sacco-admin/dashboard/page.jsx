"use client";

import React, { useState } from "react";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import LoanTypesTable from "@/components/loantypes/LoanTypesTable";
import SaccoMembersTable from "@/components/members/SaccoMembersTable";
import AdminInfoCard from "@/components/saccoadmin/AdminInfoCard";
import StatsCard from "@/components/saccoadmin/StatsCard";
import SavingsTypesTable from "@/components/savingstypes/SavingsTypesTable";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import VentureTypesTable from "@/components/venturetypes/VentureTypesTable";
import CreateLoanType from "@/forms/loantypes/CreateLoanType";
import CreateMember from "@/forms/members/CreateMember";
import BulkMemberUploadCreate from "@/forms/members/BulkMemberUploadCreate";
import CreateSavingType from "@/forms/savingtypes/CreateSavingType";
import CreateVentureType from "@/forms/venturetypes/CreateVentureType";
import { useFetchLoans } from "@/hooks/loans/actions";
import { useFetchLoanTypes } from "@/hooks/loantypes/actions";
import { useFetchMember, useFetchMembers } from "@/hooks/members/actions";
import { useFetchSavings } from "@/hooks/savings/actions";
import { useFetchSavingsTypes } from "@/hooks/savingtypes/actions";
import { useFetchVentureTypes } from "@/hooks/venturetypes/actions";
import {
  Plus,
  ShoppingCart,
  User,
  Users,
  Wallet,
  Wallet2,
  Menu,
  Upload,
  LayoutDashboard,
  Settings,
} from "lucide-react";

function SaccoAdminDashboard() {
  const [savingTypeModal, setSavingTypeModal] = useState(false);
  const [loanTypeModal, setLoanTypeModal] = useState(false);
  const [memberCreateModal, setMemberCreateModal] = useState(false);
  const [memberUploadModal, setMemberUploadModal] = useState(false);
  const [ventureTypeModal, setVentureTypeModal] = useState(false);

  // Fetch Data
  const { isLoading: isLoadingMember, data: member } = useFetchMember();
  const { isLoading: isLoadingMembers, data: membersData, refetch: refetchMembers } = useFetchMembers(1, 20);
  const members = membersData?.results || [];
  
  const { isLoading: isLoadingSavingTypes, data: savingTypes, refetch: refetchSavingTypes } = useFetchSavingsTypes();
  const { isLoading: isLoadingLoanTypes, data: loanTypes, refetch: refetchLoanTypes } = useFetchLoanTypes();
  const { isLoading: isLoadingVentureTypes, data: ventureTypes, refetch: refetchVentureTypes } = useFetchVentureTypes();

  const isLoading = isLoadingMember || isLoadingMembers || isLoadingSavingTypes || isLoadingLoanTypes || isLoadingVentureTypes;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6 space-y-8">
        <div className="flex justify-between items-center">
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
        </div>
        <Skeleton className="h-10 w-96 rounded-lg" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {member?.salutation} {member?.last_name}
            </p>
          </div>

          {/* Quick Actions */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className="bg-[#045e32] hover:bg-[#034b28] text-white shadow-sm transition-all hover:shadow-md">
                <Menu className="h-4 w-4 mr-2" /> Quick Actions
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="end">
              <div className="grid gap-1">
                <p className="text-xs font-medium text-muted-foreground px-2 py-1.5">Members</p>
                <Button
                  variant="ghost"
                  onClick={() => setMemberCreateModal(true)}
                  className="justify-start h-9 px-2"
                >
                  <User className="h-4 w-4 mr-2 text-[#045e32]" /> New Member
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setMemberUploadModal(true)}
                  className="justify-start h-9 px-2"
                >
                  <Upload className="h-4 w-4 mr-2 text-[#045e32]" /> Bulk Upload
                </Button>
                
                <div className="my-1 border-t" />
                
                <p className="text-xs font-medium text-muted-foreground px-2 py-1.5">Products</p>
                <Button
                  variant="ghost"
                  onClick={() => setSavingTypeModal(true)}
                  className="justify-start h-9 px-2"
                >
                  <Wallet2 className="h-4 w-4 mr-2 text-orange-600" /> New Saving Type
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setLoanTypeModal(true)}
                  className="justify-start h-9 px-2"
                >
                  <Plus className="h-4 w-4 mr-2 text-[#045e32]" /> New Loan Type
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setVentureTypeModal(true)}
                  className="justify-start h-9 px-2"
                >
                  <ShoppingCart className="h-4 w-4 mr-2 text-blue-600" /> New Venture Type
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
           {/* Admin Card */}
           <div className="lg:col-span-1">
              <AdminInfoCard member={member} />
           </div>
           
           {/* Stats Grid */}
           <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               <StatsCard
                title="Total Members"
                value={membersData?.count || 0}
                Icon={Users}
                description="Active members"
                className="border-l-4 border-l-[#045e32]"
                iconClassName="text-[#045e32]"
              />
               
               <StatsCard
                title="Savings Products"
                value={savingTypes?.length || 0}
                Icon={Wallet}
                description="Active saving types"
                className="border-l-4 border-l-orange-500"
                iconClassName="text-orange-500"
              />

               <StatsCard
                title="Loan Products"
                value={loanTypes?.length || 0}
                Icon={Wallet2}
                description="Active loan types"
                className="border-l-4 border-l-blue-500"
                iconClassName="text-blue-500"
              />
               
               <StatsCard
                title="Venture Products"
                value={ventureTypes?.length || 0}
                Icon={ShoppingCart}
                description="Active venture types"
                className="border-l-4 border-l-purple-500"
                iconClassName="text-purple-500"
              />
           </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="members" className="w-full space-y-6">
          <TabsList className="bg-white p-1 rounded-xl border shadow-sm h-auto grid grid-cols-2 sm:inline-flex w-full sm:w-auto">
            <TabsTrigger value="members" className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-[#045e32] data-[state=active]:text-white transition-all">
                <Users className="h-4 w-4 mr-2" /> Members
            </TabsTrigger>
            <TabsTrigger value="savings" className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-[#045e32] data-[state=active]:text-white transition-all">
                <Wallet className="h-4 w-4 mr-2" /> Savings Types
            </TabsTrigger>
            <TabsTrigger value="loans" className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-[#045e32] data-[state=active]:text-white transition-all">
                <Wallet2 className="h-4 w-4 mr-2" /> Loan Types
            </TabsTrigger>
            <TabsTrigger value="ventures" className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-[#045e32] data-[state=active]:text-white transition-all">
                <ShoppingCart className="h-4 w-4 mr-2" /> Venture Types
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="animate-in fade-in-50 duration-500">
             <div className="bg-white rounded-xl shadow-sm border p-1 sm:p-6">
                <div className="mb-6 px-4 sm:px-0">
                    <h2 className="text-lg font-semibold text-gray-900">Member Directory</h2>
                    <p className="text-sm text-gray-500">Manage pending and active members</p>
                </div>
                <SaccoMembersTable
                  members={members}
                  refetchMembers={refetchMembers}
                  hidePagination={true}
                />
             </div>
          </TabsContent>

          <TabsContent value="savings" className="animate-in fade-in-50 duration-500">
            <div className="bg-white rounded-xl shadow-sm border p-1 sm:p-6">
                <div className="mb-6 px-4 sm:px-0">
                    <h2 className="text-lg font-semibold text-gray-900">Savings Products Configuration</h2>
                    <p className="text-sm text-gray-500">Manage available savings account types</p>
                </div>
                <SavingsTypesTable savingTypes={savingTypes} />
             </div>
          </TabsContent>

          <TabsContent value="loans" className="animate-in fade-in-50 duration-500">
             <div className="bg-white rounded-xl shadow-sm border p-1 sm:p-6">
                <div className="mb-6 px-4 sm:px-0">
                    <h2 className="text-lg font-semibold text-gray-900">Loan Products Configuration</h2>
                    <p className="text-sm text-gray-500">Manage available loan account types and interest rates</p>
                </div>
                <LoanTypesTable loanTypes={loanTypes} />
             </div>
          </TabsContent>

          <TabsContent value="ventures" className="animate-in fade-in-50 duration-500">
             <div className="bg-white rounded-xl shadow-sm border p-1 sm:p-6">
                <div className="mb-6 px-4 sm:px-0">
                    <h2 className="text-lg font-semibold text-gray-900">Venture Products Configuration</h2>
                    <p className="text-sm text-gray-500">Manage available venture types</p>
                </div>
                <VentureTypesTable ventureTypes={ventureTypes} />
             </div>
          </TabsContent>
        </Tabs>

        {/* Modals - Kept available globally */}
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
        <BulkMemberUploadCreate
          isOpen={memberUploadModal}
          onClose={() => setMemberUploadModal(false)}
          refetchMembers={refetchMembers}
        />
      </div>
    </div>
  );
}

export default SaccoAdminDashboard;
