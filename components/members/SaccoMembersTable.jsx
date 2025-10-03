"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { CheckCircle, Clock, Search } from "lucide-react";

function SaccoMembersTable({ members }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filter members by search term and status
  const filteredMembers =
    members?.filter((member) => {
      const fullName =
        `${member?.salutation} ${member?.first_name} ${member?.last_name}`.toLowerCase();
      const matchesSearch = fullName.includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "approved" && member?.is_approved) ||
        (statusFilter === "pending" && !member?.is_approved);
      return matchesSearch && matchesStatus;
    }) || [];

  // Pagination logic
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-[#cc5500]">Members List</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Label
              htmlFor="search"
              className="text-base text-black font-medium sr-only"
            >
              Search Members
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="search"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="pl-10 border-black focus:ring-[#cc5500] focus:border-[#cc5500] rounded-md text-base"
              />
            </div>
          </div>
          <div className="w-full sm:w-48">
            <Label
              htmlFor="status-filter"
              className="text-base text-black font-medium sr-only"
            >
              Filter by Status
            </Label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1); // Reset to first page on filter change
              }}
              className="w-full border border-black rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-[#cc5500] focus:border-[#cc5500] transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {filteredMembers.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-black">Member No</TableHead>
                    <TableHead className="text-black">Name</TableHead>
                    {/* <TableHead className="text-black">Email</TableHead>
                    <TableHead className="text-black">Phone</TableHead> */}
                    <TableHead className="text-black">Status</TableHead>
                    <TableHead className="text-black">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedMembers.map((member) => (
                    <TableRow key={member?.reference}>
                      <TableCell className="font-medium">
                        {member?.member_no}
                      </TableCell>
                      <TableCell>
                        {member?.salutation} {member?.first_name}{" "}
                        {member?.last_name}
                      </TableCell>
                      {/* <TableCell>{member?.email}</TableCell>
                      <TableCell>{member?.phone}</TableCell> */}
                      <TableCell>
                        <Badge
                          variant={
                            member?.is_approved ? "default" : "secondary"
                          }
                          className={
                            member?.is_approved
                              ? "bg-[#045e32] text-white"
                              : "bg-gray-200 text-gray-800"
                          }
                        >
                          {member?.is_approved ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {member?.is_approved ? "Approved" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => {
                            router.push(
                              `/sacco-admin/members/${member?.member_no}`
                            );
                          }}
                          className="bg-[#cc5500] hover:bg-[#e66b00] text-white"
                        >
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredMembers.length)}{" "}
                of {filteredMembers.length} members
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-black text-black hover:bg-gray-100"
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={
                        currentPage === page
                          ? "bg-[#cc5500] text-white hover:bg-[#e66b00]"
                          : "border-black text-black hover:bg-gray-100"
                      }
                    >
                      {page}
                    </Button>
                  )
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="border-black text-black hover:bg-gray-100"
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">No members found.</p>
        )}
      </CardContent>
    </Card>
  );
}

export default SaccoMembersTable;
