"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import MemberLoadingSpinner from "@/components/general/MemberLoadingSpinner";
import { useFetchLoanApplication } from "@/hooks/loanapplications/actions";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { adminApproveDeclineLoanApplication } from "@/services/loanapplications";
import toast from "react-hot-toast";
import { CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";

const formatCurrency = (val) =>
  Number(val || 0).toLocaleString("en-KE", {
    style: "currency",
    currency: "KES",
  });

const formatDate = (dateStr) =>
  dateStr ? format(new Date(dateStr), "dd MMM yyyy") : "—";

export default function SaccoAdminLoanApplicationDetail() {
  const { reference } = useParams();
  const router = useRouter();
  const token = useAxiosAuth();
  const { isLoading, data: loan, refetch } = useFetchLoanApplication(reference);
  const [processing, setProcessing] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setProcessing(true);
    try {
      await adminApproveDeclineLoanApplication(reference, newStatus, token);
      toast.success(`Application ${newStatus.toLowerCase()} successfully`);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Action failed");
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading) return <MemberLoadingSpinner />;

  if (!loan) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 text-center">
        <p className="text-gray-500">Application not found.</p>
      </div>
    );
  }

  const schedule = loan.projection?.schedule || [];
  const guarantors = loan.guarantors || [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "#cc5500" }}>
                Loan Application
              </h1>
              <p className="text-sm text-gray-500 font-mono">
                {loan.reference}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-lg px-3 py-1">
            {loan.status}
          </Badge>
        </div>

        {/* Action Buttons */}
        {loan.status === "Submitted" && (
          <Card className="border-2 border-orange-200">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                  disabled={processing}
                  onClick={() => handleStatusChange("Approved")}
                >
                  {processing ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-5 w-5" />
                  )}
                  Approve Application
                </Button>
                <Button
                  size="lg"
                  variant="destructive"
                  disabled={processing}
                  onClick={() => handleStatusChange("Declined")}
                >
                  {processing ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <XCircle className="mr-2 h-5 w-5" />
                  )}
                  Decline Application
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Requested
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {formatCurrency(loan.requested_amount)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Member
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{loan.member}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Applied
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">
                {formatDate(loan.created_at)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Details */}
        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Product</span>
                  <span className="font-medium">{loan.product}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date</span>
                  <span className="font-medium">
                    {formatDate(loan.start_date)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Term</span>
                  <span className="font-medium">{loan.term_months} months</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Self Guarantee</span>
                  <span className="font-medium">
                    {formatCurrency(loan.self_guaranteed_amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Interest</span>
                  <span className="font-medium text-amber-600">
                    {formatCurrency(loan.total_interest)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly</span>
                  <span className="font-medium">
                    {formatCurrency(loan.monthly_payment)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guarantors */}
        {guarantors.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Guarantors</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Guarantor</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guarantors.map((g, i) => (
                    <TableRow key={i}>
                      <TableCell>{g.member}</TableCell>
                      <TableCell>{g.guarantor}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(g.guaranteed_amount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            g.status === "Accepted" ? "default" : "secondary"
                          }
                        >
                          {g.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Repayment Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Repayment Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Principal</TableHead>
                    <TableHead className="text-right">Interest</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedule.slice(0, 6).map((s, i) => (
                    <TableRow key={i}>
                      <TableCell>{formatDate(s.due_date)}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(s.principal_due)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(s.interest_due)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(s.total_due)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {schedule.length > 6 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-muted-foreground"
                      >
                        ... and {schedule.length - 6} more
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
