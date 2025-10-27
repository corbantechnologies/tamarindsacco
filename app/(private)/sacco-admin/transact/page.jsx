"use client";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchAccountsList } from "@/hooks/transactions/actions";
import React, { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Download, Upload, Menu } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AccountsListTable from "@/components/transactions/AccountsListTable";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { downloadAccountsListCSV } from "@/services/transactions";
import toast from "react-hot-toast";
import BulkSavingsAccountsDepositUpload from "@/forms/transactions/BulkSavingsAccountsDepositUpload";
import BulkVentureAccountsDepositUpload from "@/forms/transactions/BulkVentureAccountsDepositUpload";
import BulkVentureAccountsPaymentUpload from "@/forms/transactions/BulkVentureAccountsPaymentUpload";
import BulkLoanRepaymentsUpload from "@/forms/transactions/BulkLoanRepaymentsUpload";
import BulkTamarindLoanInterestUpload from "@/forms/transactions/BulkTamarindLoanInterestUpload";
import BulkCombinedUpload from "@/forms/transactions/BulkCombinedUpload";

function Transactions() {
  const token = useAxiosAuth();
  const [loading, setLoading] = useState(false);
  const [isSavingsUploadDialogOpen, setIsSavingsUploadDialogOpen] =
    useState(false);
  const [isVentureUploadDialogOpen, setIsVentureUploadDialogOpen] =
    useState(false);
  const [
    isVenturePaymentUploadDialogOpen,
    setIsVenturePaymentUploadDialogOpen,
  ] = useState(false);
  const [isLoanRepaymentUploadDialogOpen, setIsLoanRepaymentUploadDialogOpen] =
    useState(false);
  const [isLoanInterestUploadDialogOpen, setIsLoanInterestUploadDialogOpen] =
    useState(false);
  const [isCombinedUploadDialogOpen, setIsCombinedUploadDialogOpen] =
    useState(false);
  const {
    isLoading: isLoadingAccountsList,
    data: accountsList,
    refetch: refetchAccountsList,
  } = useFetchAccountsList();

  const handleDownload = async (interestOnly = false) => {
    setLoading(true);
    try {
      await downloadAccountsListCSV(token, interestOnly);
    } catch (error) {
      toast.error(error.message || "Failed to download CSV");
      console.error("Error downloading CSV:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingAccountsList) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-3 sm:p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/sacco-admin/dashboard">
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/sacco-admin/transact">
                <BreadcrumbPage>Transact</BreadcrumbPage>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Headers */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
          <div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#cc5500]">
              Accounts & Transactions
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              Manage accounts and transactions
            </p>
          </div>
          <div className="flex items-center justify-end">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className="bg-[#045e32] hover:bg-[#022007] text-white text-xs sm:text-sm py-1.5 px-2 sm:py-2 sm:px-3 h-10"
                  disabled={loading}
                >
                  <Menu className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Actions
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 sm:w-72 p-1 sm:p-2">
                <div className="flex flex-col gap-1 sm:gap-2">
                  <Button
                    onClick={() => handleDownload(false)}
                    disabled={loading}
                    variant="ghost"
                    className="justify-start text-left text-xs sm:text-sm py-1.5 px-2"
                  >
                    <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Download Account List
                  </Button>
                  <Button
                    onClick={() => setIsSavingsUploadDialogOpen(true)}
                    variant="ghost"
                    className="justify-start text-left text-xs sm:text-sm py-1.5 px-2"
                  >
                    <Upload className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Savings Deposit Upload
                  </Button>
                  <Button
                    onClick={() => setIsVentureUploadDialogOpen(true)}
                    variant="ghost"
                    className="justify-start text-left text-xs sm:text-sm py-1.5 px-2"
                  >
                    <Upload className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Venture Deposit Upload
                  </Button>
                  <Button
                    onClick={() => setIsVenturePaymentUploadDialogOpen(true)}
                    variant="ghost"
                    className="justify-start text-left text-xs sm:text-sm py-1.5 px-2"
                  >
                    <Upload className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Venture Payment Upload
                  </Button>
                  <Button
                    onClick={() => setIsLoanRepaymentUploadDialogOpen(true)}
                    variant="ghost"
                    className="justify-start text-left text-xs sm:text-sm py-1.5 px-2"
                  >
                    <Upload className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Bulk Loan Repayments Upload
                  </Button>
                  <Button
                    onClick={() => setIsLoanInterestUploadDialogOpen(true)}
                    variant="ghost"
                    className="justify-start text-left text-xs sm:text-sm py-1.5 px-2"
                  >
                    <Upload className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Bulk Loan Interest Upload
                  </Button>
                  <Button
                    onClick={() => setIsCombinedUploadDialogOpen(true)}
                    variant="ghost"
                    className="justify-start text-left text-xs sm:text-sm py-1.5 px-2"
                  >
                    <Upload className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Bulk Combined Upload
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Accounts List Table */}
        {accountsList ? (
          <AccountsListTable accountsList={accountsList} />
        ) : (
          <div className="text-center text-gray-500 text-xs sm:text-sm">
            No accounts available
          </div>
        )}

        {/* Bulk Upload Dialogs */}
        <BulkSavingsAccountsDepositUpload
          isOpen={isSavingsUploadDialogOpen}
          onClose={() => setIsSavingsUploadDialogOpen(false)}
          refetchTransactions={refetchAccountsList}
        />
        <BulkVentureAccountsDepositUpload
          isOpen={isVentureUploadDialogOpen}
          onClose={() => setIsVentureUploadDialogOpen(false)}
          refetchTransactions={refetchAccountsList}
        />
        <BulkVentureAccountsPaymentUpload
          isOpen={isVenturePaymentUploadDialogOpen}
          onClose={() => setIsVenturePaymentUploadDialogOpen(false)}
          refetchTransactions={refetchAccountsList}
        />
        <BulkLoanRepaymentsUpload
          isOpen={isLoanRepaymentUploadDialogOpen}
          onClose={() => setIsLoanRepaymentUploadDialogOpen(false)}
          refetchTransactions={refetchAccountsList}
        />
        <BulkTamarindLoanInterestUpload
          isOpen={isLoanInterestUploadDialogOpen}
          onClose={() => setIsLoanInterestUploadDialogOpen(false)}
          refetchTransactions={refetchAccountsList}
        />
        <BulkCombinedUpload
          isOpen={isCombinedUploadDialogOpen}
          onClose={() => setIsCombinedUploadDialogOpen(false)}
          refetchTransactions={refetchAccountsList}
        />
      </div>
    </div>
  );
}

export default Transactions;
