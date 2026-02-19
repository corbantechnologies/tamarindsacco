"use client";

import React, { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { useParams } from "next/navigation";
import { useFetchVentureDetail } from "@/hooks/ventures/actions";
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
  Download,
  Calendar,
  Wallet,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  PlusCircle
} from "lucide-react";
import Link from "next/link";
import CreateVenturePayment from "@/forms/venturepayments/CreateVenturePayment";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function VentureDetail() {
  const { venture_identity } = useParams();
  const [paymentModal, setPaymentModal] = useState(false);
  const [monthFilter, setMonthFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    isLoading: isLoadingVenture,
    data: venture,
    refetch: refetchVenture,
  } = useFetchVentureDetail(venture_identity);
  const {
    isLoading: isLoadingMember,
    data: member,
    refetch: refetchMember,
  } = useFetchMember();

  // Combine deposits and payments
  const allTransactions = useMemo(() => {
    if (!venture) return [];
    const deposits = (venture.deposits || []).map((deposit) => ({
      ...deposit,
      transaction_type: "Deposit",
      balance: venture.balance,
      payment_method: deposit.payment_method || "N/A",
      transaction_status: deposit.transaction_status || "Completed",
      details: "N/A",
    }));
    const payments = (venture.payments || []).map((payment) => ({
      ...payment,
      transaction_type: "Payment",
      balance: venture.balance,
      payment_method: payment.payment_method || "N/A",
      transaction_status: payment.transaction_status || "Completed",
      details: "N/A",
    }));
    return [...deposits, ...payments].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [venture]);

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
      if (methodFilter && transaction.payment_method !== methodFilter)
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
    methodFilter,
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
  if (isLoadingVenture || isLoadingMember) return <MemberLoadingSpinner />;
  if (!venture || !member) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <p className="text-lg text-gray-500">Venture details not found.</p>
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
    setMethodFilter("");
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

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yOffset = 20;

    // Add member details
    doc.setFontSize(16);
    doc.text("Venture Transaction Report", margin, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.text(`Member Number: ${member.member_no}`, margin, yOffset);
    yOffset += 10;
    doc.text(
      `Member Name: ${member.first_name} ${member.last_name}`,
      margin,
      yOffset
    );
    yOffset += 10;
    doc.text(
      `Report Generated: ${format(new Date(), "MMM dd, yyyy HH:mm")}`,
      margin,
      yOffset
    );
    yOffset += 20;

    // Add venture details
    doc.setFontSize(14);
    doc.text("Venture Details", margin, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.text(`Venture Type: ${venture.venture_type}`, margin, yOffset);
    yOffset += 10;
    doc.text(`Account Number: ${venture.account_number}`, margin, yOffset);
    yOffset += 10;
    doc.text(
      `Balance: KES ${parseFloat(venture.balance).toFixed(2)}`,
      margin,
      yOffset
    );
    yOffset += 10;
    doc.text(
      `Status: ${venture.is_active ? "Active" : "Inactive"}`,
      margin,
      yOffset
    );
    yOffset += 20;

    // Add filter details
    doc.setFontSize(14);
    doc.text("Applied Filters", margin, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    if (monthFilter) {
      const [year, month] = monthFilter.split("-").map(Number);
      doc.text(
        `Month: ${format(new Date(year, month - 1), "MMMM yyyy")}`,
        margin,
        yOffset
      );
      yOffset += 10;
    } else if (startDateFilter && endDateFilter) {
      doc.text(
        `Date Range: ${formatDate(startDateFilter)} to ${formatDate(
          endDateFilter
        )}`,
        margin,
        yOffset
      );
      yOffset += 10;
    }
    if (methodFilter && methodFilter !== "all") {
      doc.text(`Payment Method: ${methodFilter}`, margin, yOffset);
      yOffset += 10;
    }
    if (statusFilter && statusFilter !== "all") {
      doc.text(`Status: ${statusFilter}`, margin, yOffset);
      yOffset += 10;
    }
    if (
      !monthFilter &&
      !startDateFilter &&
      !endDateFilter &&
      !methodFilter &&
      !statusFilter
    ) {
      doc.text("No filters applied", margin, yOffset);
      yOffset += 10;
    }
    yOffset += 10;

    // Add transactions table
    if (filteredTransactions.length > 0) {
      autoTable(doc, {
        startY: yOffset,
        head: [
          [
            "Date",
            "Type",
            "Amount",
            "Balance",
            "Method",
            "Status",
            "Details",
          ],
        ],
        body: filteredTransactions.map((t) => [
          formatDate(t.created_at),
          t.transaction_type,
          `KES ${parseFloat(t.amount).toFixed(2)}`,
          t.balance ? `KES ${parseFloat(t.balance).toFixed(2)}` : "N/A",
          t.payment_method || "N/A",
          t.transaction_status || "N/A",
          t.details || "N/A",
        ]),
        theme: "grid",
        headStyles: { fillColor: [4, 94, 50], textColor: [255, 255, 255] },
        bodyStyles: { textColor: [51, 51, 51] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: margin, right: margin },
      });
    } else {
      doc.text(
        "No transactions found for the selected filters.",
        margin,
        yOffset
      );
    }

    // Save PDF
    doc.save(
      `venture_report_${venture.account_number}_${format(
        new Date(),
        "yyyyMMdd"
      )}.pdf`
    );
  };

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

        {/* Venture Details Card */}
        <Card className="border-none shadow-lg overflow-hidden">
          <div className="bg-white p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Wallet className="h-6 w-6 text-emerald-700" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">{venture?.venture_type}</h1>
                </div>
                <p className="text-muted-foreground flex items-center gap-2">
                  <span>{venture?.account_number}</span>
                  <span className="text-gray-300">•</span>
                  <span>Created {format(new Date(venture?.created_at), "MMM d, yyyy")}</span>
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
                <h2 className="text-3xl font-bold text-[#045e32]">KES {parseFloat(venture?.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                <div className="mt-2 flex md:justify-end gap-2">
                  <Badge className={venture?.is_active ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-red-100 text-red-700 hover:bg-red-200"}>
                    {venture?.is_active ? "Active Venture" : "Inactive Venture"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-50/50 p-4 flex flex-wrap justify-end gap-3">
            <Button onClick={() => setPaymentModal(true)} className="bg-[#045e32] hover:bg-[#037a40] text-white">
              <PlusCircle className="h-4 w-4 mr-2" /> Make Payment
            </Button>
            <Button onClick={generatePDF} variant="outline" className="border-[#045e32] text-[#045e32] hover:bg-emerald-50">
              <Download className="h-4 w-4 mr-2" /> Download Report
            </Button>
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
                  value={methodFilter}
                  onChange={(e) => { setMethodFilter(e.target.value); setCurrentPage(1); }}
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
                <Clock className="h-5 w-5 text-gray-500" /> Transaction History
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
                        <TableHead className="text-right">Balance</TableHead>
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
                              {t.transaction_type === 'Deposit' ? (
                                <ArrowDownLeft className="h-4 w-4 text-emerald-600" />
                              ) : (
                                <ArrowUpRight className="h-4 w-4 text-amber-600" />
                              )}
                              <span className="text-xs sm:text-sm font-medium">{t.transaction_type}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-bold text-gray-900 text-xs sm:text-sm">
                            <span className={t.transaction_type === 'Deposit' ? "text-emerald-700" : ""}>
                              {t.transaction_type === 'Deposit' ? '+' : '-'} {parseFloat(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground text-xs">{t.payment_method}</TableCell>
                          <TableCell>{getStatusBadge(t.transaction_status)}</TableCell>
                          <TableCell className="text-right font-mono text-xs sm:text-sm">
                            {t.balance ? parseFloat(t.balance).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-'}
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

        <CreateVenturePayment
          isOpen={paymentModal}
          onClose={() => setPaymentModal(false)}
          ventures={[venture]}
          refetchVenture={refetchVenture}
        />
      </div>
    </div>
  );
}

export default VentureDetail;
