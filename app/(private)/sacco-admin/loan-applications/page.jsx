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
  const router = useRouter();
  const { isLoading, data: applications = [] } = useFetchLoanApplications();

  if (isLoading) return <MemberLoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: "#cc5500" }}
          >
            Loan Applications
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.reference}>
                      <TableCell className="font-mono text-sm">
                        {app.reference}
                      </TableCell>
                      <TableCell className="font-medium">
                        {app.member}
                      </TableCell>
                      <TableCell>{app.product}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(app.requested_amount)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(app.status)}>
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(app.created_at)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            router.push(
                              `/sacco-admin/loan-applications/${app.reference}`
                            )
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
