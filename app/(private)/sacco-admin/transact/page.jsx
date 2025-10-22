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
import { Download } from "lucide-react";
import AccountsListTable from "@/components/transactions/AccountsListTable";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { downloadAccountsListCSV } from "@/services/transactions";
import toast from "react-hot-toast";

function Transactions() {
  const token = useAxiosAuth();
  const [loading, setLoading] = useState(false);
  const {
    isLoading: isLoadingAccountsList,
    data: accountsList,
    refetch: refetchAccountsList,
  } = useFetchAccountsList();

  const handleDownload = async () => {
    setLoading(true);
    try {
      await downloadAccountsListCSV(token);
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
      <div className="container mx-auto p-6 space-y-8">
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#cc5500]">
              Accounts & Transactions
            </h1>
            <p className="text-gray-500 mt-1">
              Manage accounts and transactions
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button
              onClick={handleDownload}
              disabled={loading}
              className="bg-[#045e32] hover:bg-[#022007] text-white text-sm sm:text-base py-2 px-3 sm:px-4 flex-1 sm:flex-none"
            >
              <Download className="mr-2 h-4 w-4" />
              {loading ? "Downloading..." : "Download Account List"}
            </Button>
          </div>
        </div>

        {/* Accounts List Table */}
        {accountsList ? (
          <AccountsListTable accountsList={accountsList} />
        ) : (
          <div className="text-center text-gray-500">No accounts available</div>
        )}
      </div>
    </div>
  );
}

export default Transactions;
