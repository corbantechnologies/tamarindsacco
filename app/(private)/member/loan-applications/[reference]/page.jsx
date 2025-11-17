"use client";

import React, { useMemo, useState } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import MemberLoadingSpinner from "@/components/general/MemberLoadingSpinner";
import {
  Edit,
  Users,
  Send,
  MoreVertical,
  CheckCircle,
  XCircle,
  Loader2,
  UserCheck,
} from "lucide-react";
import { useFetchLoanApplication } from "@/hooks/loanapplications/actions";
import UpdateLoanApplication from "@/forms/loanapplications/UpdateLoanApplication";
import { submitLoanApplication } from "@/services/loanapplications";
import toast from "react-hot-toast";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { useFetchGuarantorProfiles } from "@/hooks/guarantorprofiles/actions";
import RequestGuarantorModal from "@/forms/guaranteerequests/RequestGuarantorModal";
import CreateGuaranteeRequest from "@/forms/guaranteerequests/CreateGuaranteeRequest";

const formatCurrency = (val) =>
  Number(val || 0).toLocaleString("en-KE", {
    style: "currency",
    currency: "KES",
  });

const formatDate = (dateStr) =>
  dateStr ? format(new Date(dateStr), "dd MMM yyyy") : "—";

const getStatusBadge = (status) => {
  const map = {
    Pending: "bg-gray-100 text-gray-800",
    "In Progress": "bg-blue-100 text-blue-800",
    "Ready for Submission": "bg-purple-100 text-purple-800",
    Submitted: "bg-cyan-100 text-cyan-800",
    Approved: "bg-green-100 text-green-800",
    Disbursed: "bg-teal-100 text-teal-800",
    Declined: "bg-red-100 text-red-800",
    Cancelled: "bg-orange-100 text-orange-800",
  };
  return map[status] || "bg-amber-100 text-amber-800";
};

const getGuarantorStatusBadge = (status) => {
  const map = {
    Accepted: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Declined: "bg-red-100 text-red-800",
  };
  return map[status] || "bg-gray-100 text-gray-800";
};

export default function LoanApplicationDetail() {
  const { reference } = useParams();
  const router = useRouter();
  const token = useAxiosAuth();

  const { isLoading, data: loan, refetch } = useFetchLoanApplication(reference);
  const { isLoading: isLoadingGuarantors, data: guarantorProfiles } =
    useFetchGuarantorProfiles(reference);
  const [editOpen, setEditOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [guarantorModalOpen, setGuarantorModalOpen] = useState(false);

  const status = loan?.status;
  const canSubmit = loan?.can_submit;
  const isFullyCovered = loan?.is_fully_covered;
  const guarantors = loan?.guarantors || [];

  // --------------------------------------------------------------------
  // SUBMIT HANDLER
  // --------------------------------------------------------------------
  const handleSubmit = async () => {
    if (!canSubmit || !isFullyCovered) return;

    setSubmitting(true);
    try {
      await submitLoanApplication(reference, token);
      toast.success("Loan application submitted successfully");
      refetch();
    } catch (err) {
      toast.error(
        err.response?.data?.detail ||
          "Failed to submit loan application. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------------------------------------------
  // ACTION BUTTONS
  // --------------------------------------------------------------------
  const actionButtons = useMemo(() => {
    if (!status) return null;

    switch (status) {
      case "Pending":
        return (
          <>
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
              onClick={() => setEditOpen(true)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Update Application
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
              onClick={() => setGuarantorModalOpen(true)}
            >
              <Users className="mr-2 h-4 w-4" />
              Request Guarantors
            </Button>
          </>
        );

      case "Ready for Submission":
        return (
          <>
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
              onClick={() => setEditOpen(true)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Update Application
            </Button>

            <Button
              size="sm"
              className="w-full bg-[#045e32] hover:bg-[#022007] text-white"
              disabled={!canSubmit || !isFullyCovered || submitting}
              onClick={handleSubmit}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Application
                </>
              )}
            </Button>
          </>
        );

      default:
        return (
          <p className="text-xs text-muted-foreground text-center">
            No actions available
          </p>
        );
    }
  }, [status, canSubmit, isFullyCovered, submitting, reference, router]);

  // --------------------------------------------------------------------
  // LOADING / NOT FOUND
  // --------------------------------------------------------------------
  if (isLoading) return <MemberLoadingSpinner />;

  const schedule = loan?.projection?.schedule || [];

  // --------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------
  return (
    <>
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#045e32]">
              Loan Application
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Reference: <span className="font-mono">{loan?.reference}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge className={getStatusBadge(status)}>{status}</Badge>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3 space-y-2" align="end">
                {actionButtons}
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Requested Amount
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
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Repayment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(loan.repayment_amount)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Interest
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-600">
                {formatCurrency(loan.total_interest)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {formatCurrency(loan.monthly_payment)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {loan.term_months} months
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Details Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Product</span>
                  <span className="font-medium">{loan.product}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Start Date
                  </span>
                  <span className="font-medium">
                    {formatDate(loan.start_date)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Mode</span>
                  <span className="font-medium capitalize">
                    {loan.calculation_mode.replace("_", " ")}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Self Guarantee
                  </span>
                  <span className="font-medium">
                    {formatCurrency(loan.self_guaranteed_amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Remaining to Cover
                  </span>
                  <span className="font-medium text-red-600">
                    {formatCurrency(loan.remaining_to_cover)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Fully Covered
                  </span>
                  {loan.is_fully_covered ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guarantors Table */}
        {guarantors.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Guarantors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
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
                    {guarantors.map((g, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">
                          {g.member}
                        </TableCell>
                        <TableCell>{g.guarantor}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(g.guaranteed_amount)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getGuarantorStatusBadge(g.status)}>
                            {g.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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
                    <TableHead className="text-right">Total Due</TableHead>
                    <TableHead className="text-right">Balance After</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedule.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">
                        {formatDate(item.due_date)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.principal_due)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.interest_due)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.total_due)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.balance_after)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total Interest</p>
                <p className="font-bold text-amber-600">
                  {formatCurrency(loan.projection?.total_interest)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Repayment</p>
                <p className="font-bold text-red-600">
                  {formatCurrency(loan.projection?.total_repayment)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Term</p>
                <p className="font-bold">
                  {loan.projection?.term_months} months
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Monthly</p>
                <p className="font-bold">
                  {formatCurrency(loan.projection?.monthly_payment)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Update Modal */}
      <UpdateLoanApplication
        loan={loan}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSuccess={refetch}
      />

      <CreateGuaranteeRequest
        loanapplication={loan}
        guarantors={guarantorProfiles}
        isOpen={guarantorModalOpen}
        onClose={() => setGuarantorModalOpen(false)}
        refetchApplication={refetch}
      />
    </>
  );
}
