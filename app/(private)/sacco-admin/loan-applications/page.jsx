// app/admin/loan-applications/page.jsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MemberLoadingSpinner from "@/components/general/MemberLoadingSpinner";
import { useFetchLoanApplications } from "@/hooks/loanapplications/actions";
import { Eye, Calendar, User, DollarSign } from "lucide-react";
import LoanApplicationsTable from "@/components/loanapplications/LoanApplicationsTable";

const formatCurrency = (val) =>
  Number(val || 0).toLocaleString("en-KE", {
    style: "currency",
    currency: "KES",
  });

const formatDate = (dateStr) =>
  dateStr ? format(new Date(dateStr), "dd MMM yyyy") : "—";

const getStatusBadge = (status) => {
  const map = {
    Submitted: "bg-blue-100 text-blue-800",
    Approved: "bg-green-100 text-green-800",
    Declined: "bg-red-100 text-red-800",
    Disbursed: "bg-teal-100 text-teal-800",
  };
  return map[status] || "bg-gray-100 text-gray-800";
};

export default function SaccoAdminLoanApplications() {
  const {
    isLoading,
    data: loanApplications = [],
    refetch,
  } = useFetchLoanApplications();

  if (isLoading) return <MemberLoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="px-2 py-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#cc0000]">
              Loan Applications
            </h1>
            <p className="text-gray-500 mt-1">
              View and manage member loan applications
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <LoanApplicationsTable route="sacco-admin" data={loanApplications} />
        </div>
      </div>
    </div>
  );
}
