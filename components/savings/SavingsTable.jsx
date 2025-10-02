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

function SavingsTable({ savings, isLoading }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("All");
  const itemsPerPage = 5;

  // Get unique account types for filter
  const accountTypes = useMemo(() => {
    const types = new Set(savings?.map((item) => item.account_type));
    return ["All", ...types];
  }, [savings]);

  // Filter savings by account_type
  const filteredSavings = useMemo(() => {
    if (filterType === "All") return savings;
    return savings?.filter((item) => item.account_type === filterType);
  }, [savings, filterType]);

  // Pagination logic
  const totalItems = filteredSavings?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedSavings = filteredSavings?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return <div className="text-center text-gray-700">Loading savings...</div>;
  }

  if (!savings || savings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-[#045e32]">My Savings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-700">No savings found.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-[#045e32]">My Savings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filter */}
          <div className="flex items-center gap-4">
            <Label
              htmlFor="account-type-filter"
              className="text-sm font-medium text-gray-700"
            >
              Filter by Account Type
            </Label>
            <Select
              value={filterType}
              onValueChange={(value) => {
                setFilterType(value);
                setCurrentPage(1); // Reset to first page on filter change
              }}
            >
              <SelectTrigger
                id="account-type-filter"
                className="w-[200px] border-gray-300 focus:ring-[#045e32] focus:border-[#045e32]"
                aria-label="Filter by account type"
              >
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                {accountTypes.map((type) => (
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
                <TableRow className="bg-[#045e32] hover:bg-[#045e32]">
                  <TableHead className="text-white font-semibold text-base">
                    Account Type
                  </TableHead>
                  <TableHead className="text-white font-semibold text-base">
                    Account Number
                  </TableHead>
                  <TableHead className="text-white font-semibold text-base">
                    Balance
                  </TableHead>
                  <TableHead className="text-white font-semibold text-base">
                    Status
                  </TableHead>
                  <TableHead className="text-white font-semibold text-base">
                    Created At
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSavings?.map((saving) => (
                  <TableRow
                    key={saving.identity}
                    className="border-b border-gray-200"
                  >
                    <TableCell className="text-sm text-gray-700">
                      {saving.account_type}
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">
                      {saving.account_number}
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">
                      KES {parseFloat(saving.balance).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          saving.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {saving.is_active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">
                      {format(new Date(saving.created_at), "MM/dd/yyyy")}
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
        </div>
      </CardContent>
    </Card>
  );
}

export default SavingsTable;
