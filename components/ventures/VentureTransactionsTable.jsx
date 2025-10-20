"use client";

import React, { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  isSameDay,
  isWithinInterval,
} from "date-fns";
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

function VentureTransactions({ deposits = [], payments = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [specificDate, setSpecificDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [month, setMonth] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [status, setStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const itemsPerPage = 5;

  // Combine deposits and payments
  const allTransactions = useMemo(() => {
    const formattedDeposits = deposits.map((deposit) => ({
      ...deposit,
      transaction_type: "Deposit",
      initiator: deposit.deposited_by,
    }));
    const formattedPayments = payments.map((payment) => ({
      ...payment,
      transaction_type: "Payment",
      initiator: payment.paid_by,
      details: payment.payment_type,
    }));
    return [...formattedDeposits, ...formattedPayments].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [deposits, payments]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.created_at);

      // Specific Date Filter
      if (specificDate) {
        const selectedDate = new Date(specificDate);
        if (!isSameDay(transactionDate, selectedDate)) return false;
      }

      // Date Range Filter
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (!isWithinInterval(transactionDate, { start, end })) return false;
      }

      // Month Filter
      if (month) {
        const [year, monthIndex] = month.split("-").map(Number);
        const startOfSelectedMonth = startOfMonth(
          new Date(year, monthIndex - 1)
        );
        const endOfSelectedMonth = endOfMonth(new Date(year, monthIndex - 1));
        if (
          !isWithinInterval(transactionDate, {
            start: startOfSelectedMonth,
            end: endOfSelectedMonth,
          })
        ) {
          return false;
        }
      }

      // Transaction Type Filter
      if (transactionType && transaction.transaction_type !== transactionType)
        return false;

      // Status Filter (only for payments)
      if (
        status &&
        transaction.transaction_type === "Payment" &&
        transaction.transaction_status !== status
      ) {
        return false;
      }

      // Payment Method Filter
      if (paymentMethod && transaction.payment_method !== paymentMethod)
        return false;

      // Payment Type Filter (only for payments)
      if (
        paymentType &&
        transaction.transaction_type === "Payment" &&
        transaction.payment_type !== paymentType
      ) {
        return false;
      }

      return true;
    });
  }, [
    allTransactions,
    specificDate,
    startDate,
    endDate,
    month,
    transactionType,
    status,
    paymentMethod,
    paymentType,
  ]);

  // Pagination logic
  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const resetFilters = () => {
    setSpecificDate("");
    setStartDate("");
    setEndDate("");
    setMonth("");
    setTransactionType("");
    setStatus("");
    setPaymentMethod("");
    setPaymentType("");
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div>
      {/* Filter Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#045e32]">
            Filter Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="specificDate"
                className="text-sm font-medium text-gray-700"
              >
                Specific Date
              </Label>
              <input
                type="date"
                id="specificDate"
                value={specificDate}
                onChange={(e) => {
                  setSpecificDate(e.target.value);
                  setStartDate("");
                  setEndDate("");
                  setMonth("");
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
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setSpecificDate("");
                  setMonth("");
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
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setSpecificDate("");
                  setMonth("");
                  setCurrentPage(1);
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#045e32] focus:border-[#045e32] transition-colors"
              />
            </div>
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
                value={month}
                onChange={(e) => {
                  setMonth(e.target.value);
                  setSpecificDate("");
                  setStartDate("");
                  setEndDate("");
                  setCurrentPage(1);
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#045e32] focus:border-[#045e32] transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="transactionType"
                className="text-sm font-medium text-gray-700"
              >
                Transaction Type
              </Label>
              <select
                id="transactionType"
                value={transactionType}
                onChange={(e) => {
                  setTransactionType(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#045e32] focus:border-[#045e32] transition-colors"
              >
                <option value="">All Types</option>
                <option value="Deposit">Deposit</option>
                <option value="Payment">Payment</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="status"
                className="text-sm font-medium text-gray-700"
              >
                Payment Status
              </Label>
              <select
                id="status"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#045e32] focus:border-[#045e32] transition-colors"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
              </select>
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
                value={paymentMethod}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#045e32] focus:border-[#045e32] transition-colors"
              >
                <option value="">All Methods</option>
                <option value="Cash">Cash</option>
                <option value="Mpesa">Mpesa</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Mobile Transfer">Mobile Transfer</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="paymentType"
                className="text-sm font-medium text-gray-700"
              >
                Payment Type
              </Label>
              <select
                id="paymentType"
                value={paymentType}
                onChange={(e) => {
                  setPaymentType(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#045e32] focus:border-[#045e32] transition-colors"
              >
                <option value="">All Types</option>
                <option value="Individual Settlement">
                  Individual Settlement
                </option>
                <option value="Group Settlement">Group Settlement</option>
                <option value="Other">Other</option>
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

      {/* Empty State */}
      {(!filteredTransactions || filteredTransactions.length === 0) && (
        <div className="p-6 text-center text-muted-foreground">
          No transactions found.
        </div>
      )}

      {/* Table */}
      {filteredTransactions && filteredTransactions.length > 0 && (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#045e32] hover:bg-[#045e32]">
                <TableHead className="text-white font-semibold">Date</TableHead>
                <TableHead className="text-white font-semibold">
                  Transaction Type
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Amount
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Initiator
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Details
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Payment Method
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.reference} className="border-b">
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
                    {transaction.initiator}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {transaction.transaction_type === "Payment"
                      ? transaction.details || "N/A"
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {transaction.payment_method || "N/A"}
                  </TableCell>
                  <TableCell className="text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        transaction.transaction_type === "Deposit"
                          ? transaction.transaction_status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                          : transaction.transaction_status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : transaction.transaction_status === "Processing"
                          ? "bg-yellow-100 text-yellow-700"
                          : transaction.transaction_status === "Pending"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {transaction.transaction_status || "N/A"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
            entries
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-[#045e32] hover:bg-[#022007] text-white text-sm disabled:opacity-50"
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                onClick={() => handlePageChange(page)}
                variant={currentPage === page ? "default" : "outline"}
                className={`${
                  currentPage === page
                    ? "bg-[#045e32] text-white"
                    : "border-[#045e32] text-[#045e32] hover:bg-[#045e32] hover:text-white"
                } text-sm`}
              >
                {page}
              </Button>
            ))}
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-[#045e32] hover:bg-[#022007] text-white text-sm disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VentureTransactions;
