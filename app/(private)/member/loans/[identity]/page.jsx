"use client";

import React, { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { useParams } from "next/navigation";
import { useFetchLoanDetail } from "@/hooks/loans/actions";
import { useFetchMember } from "@/hooks/members/actions";
import MemberLoadingSpinner from "@/components/general/MemberLoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  FileText,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

function LoanDetail() {
  const { identity } = useParams();
  const [monthFilter, setMonthFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    isLoading: isLoadingLoan,
    data: loan,
    refetch: refetchLoan,
  } = useFetchLoanDetail(identity);
  const {
    isLoading: isLoadingMember,
    data: member,
    refetch: refetchMember,
  } = useFetchMember();

  // Combine repayments and disbursements
  const allTransactions = useMemo(() => {
    if (!loan) return [];

    const repayments = (loan.repayments || []).map((repayment) => ({
      ...repayment,
      transaction_type: "Repayment",
      outstanding_balance: loan.outstanding_balance, // Ideally this should be snapshot balance if available
      details: repayment.receipt_number || "N/A",
      description: `Repayment via ${repayment.payment_method}`
    }));

    const disbursements = (loan.loan_disbursements || []).map((disbursement) => ({
      ...disbursement,
      transaction_type: "Disbursement",
      payment_method: "Transfer",
      transaction_status: disbursement.transaction_status,
      outstanding_balance: loan.outstanding_balance,
      details: disbursement.reference,
      description: `Loan Disbursement`
    }));

    // If there were any interest transactions in the future, map them here.
    // For now based on sample, rely on repayments and disbursements.

    return [...repayments, ...disbursements].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [loan]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.created_at);
      // Apply month filter if set
      if (monthFilter) {
        const [year, month] = monthFilter.split("-").map(Number);
        const startOfSelectedMonth = startOfMonth(new Date(year, month - 1));
        const endOfSelectedMonth = endOfMonth(new Date(year, month - 1));
        if (
          !isWithinInterval(transactionDate, {
            start: startOfSelectedMonth,
            end: endOfSelectedMonth,
          })
        ) {
          return false;
        }
      }
      // Apply date range filter if both dates are set
      if (startDateFilter && endDateFilter) {
        const startDate = new Date(startDateFilter);
        const endDate = new Date(endDateFilter);
        if (
          !isWithinInterval(transactionDate, {
            start: startDate,
            end: endDate,
          })
        ) {
          return false;
        }
      }
      if (
        paymentMethodFilter &&
        transaction.payment_method !== paymentMethodFilter
      )
        return false;
      if (statusFilter && transaction.transaction_status !== statusFilter)
        return false;
      return true;
    });
  }, [
    allTransactions,
    monthFilter,
    startDateFilter,
    endDateFilter,
    paymentMethodFilter,
    statusFilter,
  ]);

  // Pagination
  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Early returns after all Hooks
  if (isLoadingLoan || isLoadingMember) return <MemberLoadingSpinner />;
  if (!loan || !member) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <p className="text-lg text-gray-500">Loan details not found.</p>
        <Button asChild variant="outline">
          <Link href="/member/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const resetFilters = () => {
    setMonthFilter("");
    setStartDateFilter("");
    setEndDateFilter("");
    setPaymentMethodFilter("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200 shadow-none">Completed</Badge>;
      case "Processing":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200 shadow-none">Processing</Badge>;
      case "Pending":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 shadow-none">Pending</Badge>;
      case "Failed":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200 shadow-none">Failed</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-500">Unknown</Badge>;
    }
  };

  // Derived Data
  const activeApplication = loan.applications?.[0];
  const principalAmount = activeApplication?.requested_amount || 0;
  const interestAccrued = loan.interest_accrued || 0;

  // Find next payment date
  const nextPayment = activeApplication?.projection?.schedule?.find(
    (s) => new Date(s.due_date) > new Date()
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      {/* Top Decoration */}
      <div className="h-48 w-full absolute top-0 left-0 z-0 bg-gradient-to-r from-[#045e32] to-[#067d43]" />

      <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white/90">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="text-white hover:text-white hover:bg-white/10 -ml-2">
              <Link href="/member/dashboard">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>

        {/* Loan Details Card */}
        <Card className="border-none shadow-lg overflow-hidden">
          <div className="bg-white p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <FileText className="h-6 w-6 text-emerald-700" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">{loan?.loan_type}</h1>
                  </div>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <span>{loan?.account_number}</span>
                    <span className="text-gray-300">•</span>
                    <span>Applied {format(new Date(activeApplication?.created_at || loan?.created_at), "MMM d, yyyy")}</span>
                  </p>
                </div>

                {nextPayment && (
                  <div className="bg-amber-50 border border-amber-100 rounded-md p-3 flex items-center gap-3 w-fit">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="text-xs text-amber-800 font-medium">Next Payment Due</p>
                      <p className="text-sm font-bold text-amber-900">
                        {format(new Date(nextPayment.due_date), "MMM dd, yyyy")} • KES {parseFloat(nextPayment.total_due).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-left md:text-right space-y-1">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Outstanding Balance</p>
                  <h2 className="text-3xl font-bold text-[#045e32]">KES {parseFloat(loan?.outstanding_balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                </div>

                <div className="flex flex-col items-end gap-1 pt-2">
                  <div className="flex justify-between w-full md:w-auto md:justify-end gap-8 text-sm">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Original Loan</p>
                      <p className="font-medium">KES {parseFloat(principalAmount).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Interest Accrued</p>
                      <p className="font-medium text-amber-700">KES {parseFloat(interestAccrued).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mt-2">
                    <Badge className={loan?.is_active ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-red-100 text-red-700 hover:bg-red-200"}>
                      {loan?.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Filters & Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Filters Sidebar */}
          <Card className="lg:col-span-1 h-fit shadow-md border-none sticky top-24">
            <CardHeader className="bg-gray-50/50 border-b pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filter Transactions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase">By Month</Label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <input
                    type="month"
                    value={monthFilter}
                    onChange={(e) => {
                      setMonthFilter(e.target.value);
                      setStartDateFilter("");
                      setEndDateFilter("");
                      setCurrentPage(1);
                    }}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#045e32] pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase">Date Range</Label>
                <div className="grid gap-2">
                  <input
                    type="date"
                    placeholder="Start Date"
                    value={startDateFilter}
                    onChange={(e) => {
                      setStartDateFilter(e.target.value);
                      setMonthFilter("");
                      setCurrentPage(1);
                    }}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#045e32]"
                  />
                  <input
                    type="date"
                    placeholder="End Date"
                    value={endDateFilter}
                    onChange={(e) => {
                      setEndDateFilter(e.target.value);
                      setMonthFilter("");
                      setCurrentPage(1);
                    }}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#045e32]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase">Details</Label>
                <select
                  value={paymentMethodFilter}
                  onChange={(e) => { setPaymentMethodFilter(e.target.value); setCurrentPage(1); }}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#045e32]"
                >
                  <option value="">All Methods</option>
                  <option value="Cash">Cash</option>
                  <option value="Mpesa">Mpesa</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Mobile Transfer">Mobile Transfer</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Standing Order">Standing Order</option>
                  <option value="Mobile Banking">Mobile Banking</option>
                  <option value="Transfer">Transfer</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#045e32]"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>

              <Button
                variant="outline"
                onClick={resetFilters}
                className="w-full text-xs"
              >
                Reset Filters
              </Button>
            </CardContent>
          </Card>

          {/* Transactions List */}
          <Card className="lg:col-span-3 shadow-md border-none min-h-[500px] flex flex-col">
            <CardHeader className="bg-white border-b flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" /> Transactions History
              </CardTitle>
              <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                {totalItems} Records
              </Badge>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              {filteredTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center p-8">
                  <div className="p-4 bg-gray-50 rounded-full mb-3">
                    <Search className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="text-gray-900 font-medium">No transactions found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your filters to see more results.</p>
                </div>
              ) : (
                <div className="relative w-full overflow-auto">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="w-[120px]">Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="hidden md:table-cell">Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedTransactions.map((t, idx) => (
                        <TableRow key={idx} className="hover:bg-gray-50/50">
                          <TableCell className="font-medium text-xs sm:text-sm whitespace-nowrap">
                            {formatDate(t.created_at)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {t.transaction_type === 'Repayment' ? (
                                <ArrowDownLeft className="h-4 w-4 text-emerald-600" />
                              ) : (
                                <ArrowUpRight className="h-4 w-4 text-amber-600" />
                              )}
                              <span className="text-xs sm:text-sm font-medium">{t.transaction_type}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-bold text-gray-900 text-xs sm:text-sm">
                            <span className={t.transaction_type === 'Repayment' ? "text-emerald-700" : "text-amber-700"}>
                              {t.transaction_type === 'Repayment' ? '+' : '-'} {parseFloat(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground text-xs">{t.payment_method}</TableCell>
                          <TableCell>{getStatusBadge(t.transaction_status)}</TableCell>
                          <TableCell className="text-right font-mono text-xs sm:text-sm text-muted-foreground">
                            {t.details}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t bg-gray-50/30 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 px-2 lg:px-4"
                  >
                    <ChevronLeft className="h-4 w-4" /> <span className="hidden sm:inline ml-1">Previous</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 px-2 lg:px-4"
                  >
                    <span className="hidden sm:inline mr-1">Next</span> <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default LoanDetail;
