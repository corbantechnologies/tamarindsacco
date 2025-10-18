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
import { Card, CardContent } from "@/components/ui/card";

function SavingsWithdrawalsTable({ withdrawals }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination logic
  const totalItems = withdrawals?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedWithdrawals = withdrawals?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (!withdrawals || withdrawals.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No withdrawals found.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#045e32]">
                <TableHead className="text-white font-semibold">Date</TableHead>
                <TableHead className="text-white font-semibold">
                  Amount
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Withdrawn By
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
              {paginatedWithdrawals?.map((withdrawal) => (
                <TableRow key={withdrawal.reference} className="border-b">
                  <TableCell className="text-sm text-gray-700">
                    {format(new Date(withdrawal.created_at), "PPP")}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    KES {parseFloat(withdrawal.amount).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {withdrawal.withdrawn_by}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {withdrawal.payment_method}
                  </TableCell>
                  <TableCell className="text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        withdrawal.transaction_status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : withdrawal.transaction_status === "Processing"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {withdrawal.transaction_status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

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
                  >
                    {page}
                  </Button>
                )
              )}
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
      </CardContent>
    </Card>
  );
}

export default SavingsWithdrawalsTable;
