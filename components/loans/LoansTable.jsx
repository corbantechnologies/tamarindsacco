"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

function LoansTable({ loans, isLoading }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("All");
  const itemsPerPage = 5;

  // Get unique loan types for filter
  const loanTypes = useMemo(() => {
    const types = new Set(loans?.map((item) => item.loan_type));
    return ["All", ...types];
  }, [loans]);

  // Filter loans by loan_type
  const filteredLoans = useMemo(() => {
    if (filterType === "All") return loans;
    return loans?.filter((item) => item.loan_type === filterType);
  }, [loans, filterType]);

  // Pagination logic
  const totalItems = filteredLoans?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedLoans = filteredLoans?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Status badge logic
  const getStatus = (loan) => {
    if (!loan.is_approved) return "Pending";
    return loan.is_active ? "Active" : "Inactive";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Inactive":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading) {
    return <div className="text-center text-gray-700">Loading loans...</div>;
  }

  if (!loans || loans.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-primary">My Loans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-700">No loans found.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-primary">My Loans</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filter */}
          <div className="flex items-center gap-4">
            <Label
              htmlFor="loan-type-filter"
              className="text-sm font-medium text-gray-700"
            >
              Filter by Loan Type
            </Label>
            <Select
              value={filterType}
              onValueChange={(value) => {
                setFilterType(value);
                setCurrentPage(1); // Reset to first page on filter change
              }}
            >
              <SelectTrigger
                id="loan-type-filter"
                className="w-[200px] border-gray-300 focus:ring-primary focus:border-primary"
                aria-label="Filter by loan type"
              >
                <SelectValue placeholder="Select loan type" />
              </SelectTrigger>
              <SelectContent>
                {loanTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary hover:bg-primary">
                  <TableHead className="text-white font-semibold text-base">
                    Loan Type
                  </TableHead>
                  <TableHead className="text-white font-semibold text-base">
                    Account Number
                  </TableHead>
                  <TableHead className="text-white font-semibold text-base">
                    Loan Amount
                  </TableHead>
                  <TableHead className="text-white font-semibold text-base">
                    Outstanding Balance
                  </TableHead>
                  <TableHead className="text-white font-semibold text-base">
                    Status
                  </TableHead>
                  {/* TODO: sort this out */}
                  {/* <TableHead className="text-white font-semibold text-base">
                    Approved By
                  </TableHead> */}
                  <TableHead className="text-white font-semibold text-base">
                    Approval Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLoans?.map((loan) => (
                  <TableRow
                    key={loan.identity}
                    className="border-b border-gray-200"
                  >
                    <TableCell className="text-sm text-gray-700">
                      {loan.loan_type}
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">
                      {loan.account_number}
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">
                      KES {parseFloat(loan.loan_amount).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">
                      KES {parseFloat(loan.outstanding_balance).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                          getStatus(loan)
                        )}`}
                      >
                        {getStatus(loan)}
                      </span>
                    </TableCell>
                    {/* <TableCell className="text-sm text-gray-700">
                      {loan.approved_by}
                    </TableCell> */}
                    <TableCell className="text-sm text-gray-700">
                      {loan.approval_date
                        ? format(new Date(loan.approval_date), "MM/dd/yyyy")
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
              entries
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-primary hover:bg-[#067a46] text-white text-sm disabled:opacity-50"
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
                        ? "bg-primary text-white"
                        : "border-primary text-primary hover:bg-primary hover:text-white"
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
                className="bg-primary hover:bg-[#067a46] text-white text-sm disabled:opacity-50"
                aria-label="Next page"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default LoansTable;
