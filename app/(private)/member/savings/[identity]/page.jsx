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

function SavingsDetail() {
  const { identity } = useParams();
  const [withdrawalModal, setWithdrawalModal] = useState(false);

  const {
    isLoading: isLoadingSaving,
    data: saving,
    refetch: refetchSaving,
  } = useFetchSavingDetail(identity);

  console.log(saving);

  if (isLoadingSaving) return <MemberLoadingSpinner />;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/member/dashboard">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {/* <BreadcrumbItem>
                        <BreadcrumbLink href="/member/savings">Savings</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator /> */}
            <BreadcrumbItem>
              <BreadcrumbPage>{saving?.account_type}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Details section */}
        <Card className="mt-4 border-l-4 border-l-[#045e32]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {saving?.account_type}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="bg-red-500 hover:bg-[#022007] text-white px-8 w-full sm:w-auto"
                onClick={() => setWithdrawalModal(true)}
              >
                Withdraw
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-base mb-2 font-medium leading-none">
              Account Number: {saving?.account_number}
            </p>
            <p className="text-base mb-2 leading-none">
              Account Type: {saving?.account_type}
            </p>
            <p className="text-base mb-2 leading-none">
              Account Balance: {saving?.balance}
            </p>
          </CardContent>
        </Card>

        {/* modals */}
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
