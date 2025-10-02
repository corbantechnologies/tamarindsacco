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
import { Search } from "lucide-react";

function SavingsTypesTable({ savingTypes }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;

  // Filter saving types by search term (name)
  const filteredSavingTypes = useMemo(() => {
    if (!searchTerm) return savingTypes;
    return savingTypes?.filter((type) =>
      type.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [savingTypes, searchTerm]);

  // Pagination logic
  const totalItems = filteredSavingTypes?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedSavingTypes = filteredSavingTypes?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (!savingTypes || savingTypes.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No savings types found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-[#cc5500]">Savings Types</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Filter */}
        <div className="flex items-center gap-4">
          <Label htmlFor="search" className="text-sm font-medium text-gray-700">
            Search by Name
          </Label>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="search"
              placeholder="Search savings types..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="pl-10 border-gray-300 focus:ring-[#cc5500] focus:border-[#cc5500] rounded-md text-base"
            />
          </div>
        </div>

        {/* Table */}
        <div className=" rounded-lg shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#cc5500] hover:bg-[#cc5500]">
                <TableHead className="text-white font-semibold text-base">
                  Name
                </TableHead>
                <TableHead className="text-white font-semibold text-base">
                  Interest Rate
                </TableHead>
                {/* <TableHead className="text-white font-semibold text-base">
                  Description
                </TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSavingTypes?.map((type) => (
                <TableRow
                  key={type.reference}
                  className="border-b border-gray-200"
                >
                  <TableCell className="font-medium text-gray-900">
                    {type.name}
                  </TableCell>
                  <TableCell className="font-semibold text-green-600">
                    {type.interest_rate}%
                  </TableCell>
                  {/* <TableCell className="text-gray-600">
                    {type.description}
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
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
                className="bg-[#cc5500] hover:bg-[#e66b00] text-white text-sm disabled:opacity-50"
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
                        ? "bg-[#cc5500] text-white"
                        : "border-[#cc5500] text-[#cc5500] hover:bg-[#cc5500] hover:text-white"
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
                className="bg-[#cc5500] hover:bg-[#e66b00] text-white text-sm disabled:opacity-50"
                aria-label="Next page"
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

export default SavingsTypesTable;
