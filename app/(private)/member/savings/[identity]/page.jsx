"use client";

import React, { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { useParams } from "next/navigation";
import { useFetchSavingDetail } from "@/hooks/savings/actions";
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function SavingsDetail() {
  const { identity } = useParams();
  const [monthFilter, setMonthFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    isLoading: isLoadingSaving,
    data: saving,
    refetch: refetchSaving,
  } = useFetchSavingDetail(identity);
  const {
    isLoading: isLoadingMember,
    data: member,
    refetch: refetchMember,
  } = useFetchMember();

  // Combine deposits and withdrawals
  const allTransactions = useMemo(() => {
    if (!saving) return [];
    const deposits = (saving.deposits || []).map((deposit) => ({
      ...deposit,
      transaction_type: "Deposit",
      balance: saving.balance,
      payment_method: deposit.payment_method || "N/A",
      transaction_status: deposit.transaction_status || "Completed",
      details: "N/A",
    }));
    const withdrawals = (saving.withdrawals || []).map((withdrawal) => ({
      ...withdrawal,
      transaction_type: "Withdrawal",
      balance: saving.balance,
      payment_method: withdrawal.payment_method || "N/A",
      transaction_status: withdrawal.transaction_status || "Completed",
      details: "N/A",
    }));
    return [...deposits, ...withdrawals].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [saving]);

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
  if (isLoadingSaving || isLoadingMember) return <MemberLoadingSpinner />;
  if (!saving || !member) return <div>No saving or member data found.</div>;

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

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Processing":
        return "bg-yellow-100 text-yellow-700";
      case "Pending":
        return "bg-blue-100 text-blue-700";
      case "Failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yOffset = 20;

    // Add member details
    doc.setFontSize(16);
    doc.text("Savings Transaction Report", margin, yOffset);
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

    // Add savings details
    doc.setFontSize(14);
    doc.text("Savings Details", margin, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.text(`Account Type: ${saving.account_type}`, margin, yOffset);
    yOffset += 10;
    doc.text(`Account Number: ${saving.account_number}`, margin, yOffset);
    yOffset += 10;
    doc.text(
      `Balance: KES ${parseFloat(saving.balance).toFixed(2)}`,
      margin,
      yOffset
    );
    yOffset += 10;
    doc.text(
      `Status: ${saving.is_active ? "Active" : "Inactive"}`,
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
            "Transaction Type",
            "Amount",
            "Balance",
            "Payment Method",
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
        alternateRowStyles: { fillColor: [245, 245, 220] },
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
      `savings_report_${saving.account_number}_${format(
        new Date(),
        "yyyyMMdd"
      )}.pdf`
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-2 sm:p-6 space-y-6">
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

        <Card className="border-l-4 border-l-[#045e32] shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold text-[#045e32]">
              {saving?.account_type}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>
            <Button
              onClick={generatePDF}
              className="bg-[#045e32] hover:bg-[#067a46] text-white text-sm sm:text-base"
            >
              Download Report
            </Button>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#045e32]">
              Filter Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="month"
                  className="text-sm font-medium text-gray-700"
                >
                  Month
                </Label>
                <input
                  type="month"
                  id="month"
                  value={monthFilter}
                  onChange={(e) => {
                    setMonthFilter(e.target.value);
                    setStartDateFilter(""); // Clear date range when month is selected
                    setEndDateFilter("");
                    setCurrentPage(1);
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#045e32] focus:border-[#045e32] transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="startDate"
                  className="text-sm font-medium text-gray-700"
                >
                  Start Date
                </Label>
                <input
                  type="date"
                  id="startDate"
                  value={startDateFilter}
                  onChange={(e) => {
                    setStartDateFilter(e.target.value);
                    setMonthFilter(""); // Clear month when date range is selected
                    setCurrentPage(1);
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#045e32] focus:border-[#045e32] transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="endDate"
                  className="text-sm font-medium text-gray-700"
                >
                  End Date
                </Label>
                <input
                  type="date"
                  id="endDate"
                  value={endDateFilter}
                  onChange={(e) => {
                    setEndDateFilter(e.target.value);
                    setMonthFilter(""); // Clear month when date range is selected
                    setCurrentPage(1);
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#045e32] focus:border-[#045e32] transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="method"
                  className="text-sm font-medium text-gray-700"
                >
                  Payment Method
                </Label>
                <select
                  id="method"
                  value={methodFilter}
                  onChange={(e) => {
                    setMethodFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#045e32] focus:border-[#045e32] transition-colors"
                >
                  <option value="all">All Methods</option>
                  <option value="Cash">Cash</option>
                  <option value="Mpesa">Mpesa</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Mobile Transfer">Mobile Transfer</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Standing Order">Standing Order</option>
                  <option value="Mobile Banking">Mobile Banking</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="status"
                  className="text-sm font-medium text-gray-700"
                >
                  Status
                </Label>
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#045e32] focus:border-[#045e32] transition-colors"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={resetFilters}
                  className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#045e32]">
              All Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center text-gray-700">
                No transactions found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#045e32] hover:bg-[#045e32]">
                      <TableHead className="text-white font-semibold">
                        Date
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        Transaction Type
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        Amount
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        Balance
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        Payment Method
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        Status
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        Details
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.map((transaction, index) => (
                      <TableRow
                        key={`${transaction.created_at}-${transaction.transaction_type}-${index}`}
                      >
                        <TableCell className="text-sm text-gray-700">
                          {formatDate(transaction.created_at)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-700">
                          {transaction.transaction_type}
                        </TableCell>
                        <TableCell className="text-sm text-gray-700">
                          KES {parseFloat(transaction.amount).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-700">
                          {transaction.balance
                            ? `KES ${parseFloat(transaction.balance).toFixed(
                                2
                              )}`
                            : "N/A"}
                        </TableCell>
                        <TableCell className="text-sm text-gray-700">
                          {transaction.payment_method || "N/A"}
                        </TableCell>
                        <TableCell className="text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                              transaction.transaction_status
                            )}`}
                          >
                            {transaction.transaction_status || "N/A"}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-700">
                          {transaction.details || "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                  {totalItems} entries
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-[#045e32] hover:bg-[#067a46] text-white text-sm disabled:opacity-50"
                    aria-label="Previous page"
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        variant={currentPage === page ? "default" : "outline"}
                        className={`${
                          currentPage === page
                            ? "bg-[#045e32] text-white"
                            : "border-[#045e32] text-[#045e32] hover:bg-[#045e32] hover:text-white"
                        } text-sm`}
                        aria-label={`Go to page ${page}`}
                      >
                        {page}
                      </Button>
                    )
                  )}
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="bg-[#045e32] hover:bg-[#067a46] text-white text-sm disabled:opacity-50"
                    aria-label="Next page"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SavingsDetail;
