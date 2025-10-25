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

function LoanDetail() {
  const { identity } = useParams();
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
  const [monthFilter, setMonthFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Combine repayments and interest transactions
  const allTransactions = useMemo(() => {
    if (!loan) return [];
    const repayments = (loan.repayments || []).map((repayment) => ({
      ...repayment,
      transaction_type: "Repayment",
      outstanding_balance: loan.outstanding_balance,
      details: "N/A",
    }));
    const interests = (loan.loan_interests || []).map((interest) => ({
      ...interest,
      transaction_type: "Interest",
      outstanding_balance:
        interest.outstanding_balance || loan.outstanding_balance,
      payment_method: interest.payment_method || "N/A",
      transaction_status: interest.transaction_status || "Completed",
      details: "N/A",
    }));
    return [...repayments, ...interests].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [loan]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.created_at);
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
      if (
        paymentMethodFilter &&
        transaction.payment_method !== paymentMethodFilter
      )
        return false;
      if (statusFilter && transaction.transaction_status !== statusFilter)
        return false;
      return true;
    });
  }, [allTransactions, monthFilter, paymentMethodFilter, statusFilter]);

  // Pagination
  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Early returns after all Hooks
  if (isLoadingLoan || isLoadingMember) return <MemberLoadingSpinner />;
  if (!loan || !member) return <div>No loan or member data found.</div>;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const resetFilters = () => {
    setMonthFilter("");
    setPaymentMethodFilter("");
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
    doc.text("Loan Transaction Report", margin, yOffset);
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

    // Add loan details
    doc.setFontSize(14);
    doc.text("Loan Details", margin, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.text(`Loan Type: ${loan.loan_type}`, margin, yOffset);
    yOffset += 10;
    doc.text(`Account Number: ${loan.account_number}`, margin, yOffset);
    yOffset += 10;
    doc.text(
      `Loan Amount: KES ${parseFloat(loan.loan_amount).toFixed(2)}`,
      margin,
      yOffset
    );
    yOffset += 10;
    doc.text(
      `Outstanding Balance: KES ${parseFloat(loan.outstanding_balance).toFixed(
        2
      )}`,
      margin,
      yOffset
    );
    yOffset += 20;

    // Add transactions table
    if (filteredTransactions.length > 0) {
      autoTable(doc, {
        startY: yOffset,
        head: [
          [
            "Date",
            "Transaction Type",
            "Amount",
            "Outstanding Balance",
            "Payment Method",
            "Status",
            "Details",
          ],
        ],
        body: filteredTransactions.map((t) => [
          formatDate(t.created_at),
          t.transaction_type,
          `KES ${parseFloat(t.amount).toFixed(2)}`,
          t.outstanding_balance
            ? `KES ${parseFloat(t.outstanding_balance).toFixed(2)}`
            : "N/A",
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
      `loan_report_${loan.account_number}_${format(new Date(), "yyyyMMdd")}.pdf`
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 sm:p-6 space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/member/dashboard">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/member/loans">Loans</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>Loan Details</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        <Card className="border-l-4 border-l-[#045e32] shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#045e32]">
              Loan Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="text-base font-medium">
                Loan Type: <span className="font-normal">{loan.loan_type}</span>
              </p>
              <p className="text-base font-medium">
                Account Number:{" "}
                <span className="font-normal">{loan.account_number}</span>
              </p>
              <p className="text-base font-medium">
                Loan Amount:{" "}
                <span className="font-normal">
                  KES {parseFloat(loan.loan_amount).toFixed(2)}
                </span>
              </p>
              <p className="text-base font-medium">
                Outstanding Balance:{" "}
                <span className="font-normal">
                  KES {parseFloat(loan.outstanding_balance).toFixed(2)}
                </span>
              </p>
              <p className="text-base font-medium">
                Status:{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                    loan.is_approved
                      ? loan.is_active
                        ? "Active"
                        : "Inactive"
                      : "Pending"
                  )}`}
                >
                  {loan.is_approved
                    ? loan.is_active
                      ? "Active"
                      : "Inactive"
                    : "Pending"}
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
                    setCurrentPage(1);
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#045e32] focus:border-[#045e32] transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="paymentMethod"
                  className="text-sm font-medium text-gray-700"
                >
                  Payment Method
                </Label>
                <select
                  id="paymentMethod"
                  value={paymentMethodFilter}
                  onChange={(e) => {
                    setPaymentMethodFilter(e.target.value);
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
              Repayments & Interest Transactions
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
                        Outstanding Balance
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
                          {transaction.outstanding_balance
                            ? `KES ${parseFloat(
                                transaction.outstanding_balance
                              ).toFixed(2)}`
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

export default LoanDetail;
