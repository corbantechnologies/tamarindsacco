"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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
import {
  CheckCircle,
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Assuming you have shadcn Select component

function SaccoMembersTable({
  members = [],
  totalMembers = 0,
  page = 1,
  setPage,
  pageSize = 10,
  setPageSize,
  search = "",
  setSearch,
  hidePagination = false,
  isLoading = false,
}) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(search);

  // Sync internal search input with prop
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Debounce search update
  useEffect(() => {
    if (!setSearch) return;
    const timeoutId = setTimeout(() => {
      setSearch(searchInput);
      if (setPage) setPage(1); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchInput, setSearch, setPage]);

  const totalPages = Math.ceil(totalMembers / pageSize);

  // Helper to generate pagination range
  const getPaginationRange = () => {
    const range = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      if (page <= 3) {
        range.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        range.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        range.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return range;
  };

  const paginationRange = getPaginationRange();

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="pb-3 border-b bg-white rounded-t-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <CardTitle className="text-lg sm:text-xl text-[#cc5500]">
            Members List
          </CardTitle>
          {!hidePagination && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 h-9 border-gray-300 focus:ring-[#cc5500] focus:border-[#cc5500] text-sm"
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-semibold text-gray-700 w-[150px]">
                  Member No
                </TableHead>
                <TableHead className="font-semibold text-gray-700">Name</TableHead>
                <TableHead className="font-semibold text-gray-700 w-[150px]">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-gray-700 w-[100px] text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.length > 0 ? (
                members.map((member) => (
                  <TableRow
                    key={member?.reference || member?.member_no}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-900">
                      <Link
                        href={`/sacco-admin/members/${member?.member_no}`}
                        className="truncate block hover:text-[#cc5500]"
                      >
                        {member?.member_no}
                      </Link>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      <div className="flex items-center gap-2">
                        {/* {member?.profile_image && (
                          <img
                            src={member.profile_image}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )} */}
                        <Link
                          href={`/sacco-admin/members/${member?.member_no}`}
                          className="font-medium hover:text-[#cc5500]"
                        >
                          {member?.first_name} {member?.last_name}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={member?.is_approved ? "default" : "secondary"}
                        className={`font-normal ${member?.is_approved
                          ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-200"
                          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200"
                          }`}
                      >
                        {member?.is_approved ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {member?.is_approved ? "Approved" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          router.push(`/sacco-admin/members/${member?.member_no}`)
                        }
                        className="text-[#cc5500] hover:text-[#cc5500] hover:bg-orange-50 font-medium h-8"
                      >
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-gray-500"
                  >
                    {isLoading ? "Loading members..." : "No members found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {!hidePagination && totalMembers > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t bg-gray-50/50">
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-500 order-2 sm:order-1">
              <span className="whitespace-nowrap">Rows per page</span>
              <Select
                value={`${pageSize}`}
                onValueChange={(value) => {
                  if (setPageSize) {
                    setPageSize(Number(value));
                    if (setPage) setPage(1);
                  }
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="whitespace-nowrap ml-1 sm:ml-2">
                Page {page} of {totalPages || 1}
              </span>
            </div>

            <div className="flex items-center gap-1 order-1 sm:order-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage && setPage(1)}
                disabled={page === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
                <span className="sr-only">First page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage && setPage(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>

              <div className="hidden sm:flex items-center gap-1 mx-2">
                {paginationRange.map((p, i) => (
                  <React.Fragment key={i}>
                    {p === "..." ? (
                      <span className="text-gray-400 px-1">...</span>
                    ) : (
                      <Button
                        variant={page === p ? "default" : "outline"}
                        size="sm"
                        className={`h-8 w-8 p-0 ${page === p
                            ? "bg-[#cc5500] hover:bg-[#b04a00] text-white border-[#cc5500]"
                            : "hover:bg-gray-100"
                          }`}
                        onClick={() => setPage && setPage(Number(p))}
                      >
                        {p}
                      </Button>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage && setPage(page + 1)}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage && setPage(totalPages)}
                disabled={page === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
                <span className="sr-only">Last page</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SaccoMembersTable;
