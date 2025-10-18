"use client";

import MemberLoadingSpinner from "@/components/general/MemberLoadingSpinner";
import { useFetchSavingDetail } from "@/hooks/savings/actions";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import CreateWithdrawal from "@/forms/savingswithdrawals/CreateWithdrawal";

import { format } from "date-fns";
import SavingsWithdrawalsTable from "@/components/savings/SavingsWithdrawalsTable";
import SavingsDepositsTable from "@/components/savings/SavingsDeposits";

function SavingsDetail() {
  const { identity } = useParams();
  const [withdrawalModal, setWithdrawalModal] = useState(false);

  const {
    isLoading: isLoadingSaving,
    data: saving,
    refetch: refetchSaving,
  } = useFetchSavingDetail(identity);

  if (isLoadingSaving) return <MemberLoadingSpinner />;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 sm:p-6 space-y-6 max-w-7xl">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/member/dashboard">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{saving?.account_type}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Account Details */}
        <Card className="border-l-4 border-l-[#045e32] shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold text-[#045e32]">
              {saving?.account_type}
            </CardTitle>
            <Button
              size="sm"
              className="bg-[#045e32] hover:bg-[#022007] text-white"
              onClick={() => setWithdrawalModal(true)}
            >
              Withdraw
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-base font-medium">
              Account Number:{" "}
              <span className="font-normal">{saving?.account_number}</span>
            </p>
            <p className="text-base font-medium">
              Balance:{" "}
              <span className="font-normal text-[#045e32]">
                KES {parseFloat(saving?.balance).toFixed(2)}
              </span>
            </p>
            <p className="text-base font-medium">
              Status:{" "}
              <span
                className={`font-normal ${
                  saving?.is_active ? "text-green-600" : "text-red-600"
                }`}
              >
                {saving?.is_active ? "Active" : "Inactive"}
              </span>
            </p>
            <p className="text-base font-medium">
              Created At:{" "}
              <span className="font-normal">
                {format(new Date(saving?.created_at), "PPP")}
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Deposits Table */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#045e32]">Deposits</h2>
          <SavingsDepositsTable deposits={saving?.deposits || []} />
        </div>

        {/* Withdrawals Table */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#045e32]">Withdrawals</h2>
          <SavingsWithdrawalsTable withdrawals={saving?.withdrawals || []} />
        </div>

        {/* Modal */}
        <CreateWithdrawal
          isOpen={withdrawalModal}
          onClose={() => setWithdrawalModal(false)}
          account={saving}
          refetchAccount={refetchSaving}
        />
      </div>
    </div>
  );
}

export default SavingsDetail;
