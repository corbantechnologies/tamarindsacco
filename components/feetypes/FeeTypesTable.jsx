"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Search, Edit } from "lucide-react";
import UpdateFeeType from "@/forms/feetypes/UpdateFeeType";

function FeeTypesTable({ feeTypes, refetchFeeTypes }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFeeType, setSelectedFeeType] = useState(null);
  const [updateModal, setUpdateModal] = useState(false);
  
  const itemsPerPage = 5;

  const filteredFeeTypes = useMemo(() => {
    if (!searchTerm) return feeTypes;
    return feeTypes?.filter((type) =>
      type.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [feeTypes, searchTerm]);

  const totalItems = filteredFeeTypes?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedFeeTypes = filteredFeeTypes?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEditClick = (type) => {
    setSelectedFeeType(type);
    setUpdateModal(true);
  };

  if (!feeTypes || feeTypes.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No fee types found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl text-[#045e32]">
          Fee Types
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Label htmlFor="search" className="text-sm font-medium text-gray-700">
            Search by Name
          </Label>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="search"
              placeholder="Search fee types..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 border-gray-300 focus:ring-[#045e32] focus:border-[#045e32] rounded-md text-sm sm:text-base"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#045e32] hover:bg-[#045e32]">
                <TableHead className="text-white font-semibold text-sm sm:text-base">
                  Name
                </TableHead>
                <TableHead className="text-white font-semibold text-sm sm:text-base">
                  Amount
                </TableHead>
                <TableHead className="text-white font-semibold text-sm sm:text-base">
                  Is Income
                </TableHead>
                <TableHead className="text-white font-semibold text-sm sm:text-base">
                  Status
                </TableHead>
                <TableHead className="text-white font-semibold text-sm sm:text-base text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedFeeTypes?.map((type) => (
                <TableRow
                  key={type.reference}
                  className="border-b border-gray-200"
                >
                  <TableCell className="font-medium text-gray-900 text-sm sm:text-base truncate">
                    {type.name}
                  </TableCell>
                  <TableCell className="font-semibold text-gray-900 text-sm sm:text-base">
                    KES {parseFloat(type.standard_amount).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm sm:text-base">
                    {type.is_income ? "Yes" : "No"}
                  </TableCell>
                  <TableCell className="text-sm sm:text-base">
                    <span className={`px-2 py-1 rounded-full text-xs ${type.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {type.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(type)}
                      className="text-[#045e32] hover:text-white hover:bg-[#045e32]"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
            <div className="text-sm text-gray-500 whitespace-nowrap">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
              entries
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-[#045e32] hover:bg-[#037a40] text-white text-sm disabled:opacity-50"
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
                    className={`min-w-[2.5rem] ${
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
                className="bg-[#045e32] hover:bg-[#037a40] text-white text-sm disabled:opacity-50"
                aria-label="Next page"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <UpdateFeeType
         isOpen={updateModal}
         onClose={() => {
            setUpdateModal(false);
            setSelectedFeeType(null);
         }}
         feeType={selectedFeeType}
         refetchFeeTypes={refetchFeeTypes}
      />
    </Card>
  );
}

export default FeeTypesTable;
