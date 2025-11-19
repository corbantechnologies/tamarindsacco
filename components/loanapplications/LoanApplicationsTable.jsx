// components/loanapplications/LoanApplicationsTable.jsx
"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation"; // <-- for navigation
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronLeft, ChevronRight, Eye } from "lucide-react";

const formatCurrency = (val) =>
  Number(val || 0).toLocaleString("en-KE", {
    style: "currency",
    currency: "KES",
  });

// Map Django status → Tailwind badge
const getStatusBadge = (status) => {
  const map = {
    Pending: "bg-gray-100 text-gray-800",
    "In Progress": "bg-blue-100 text-blue-800",
    "Ready for Submission": "bg-purple-100 text-purple-800",
    Submitted: "bg-cyan-100 text-cyan-800",
    Approved: "bg-green-100 text-green-800",
    Disbursed: "bg-teal-100 text-teal-800",
    Declined: "bg-red-100 text-red-800",
    Cancelled: "bg-orange-100 text-orange-800",
  };
  return map[status] || "bg-amber-100 text-amber-800";
};

export default function LoanApplicationsTable({ data, route }) {
  const router = useRouter();
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "product",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Product
            <ArrowUpDown className="ml-1 h-3 w-3" />
          </Button>
        ),
        cell: ({ row }) => row.getValue("product"),
      },
      {
        accessorKey: "requested_amount",
        header: "Amount",
        cell: ({ row }) => formatCurrency(row.getValue("requested_amount")),
      },
      {
        accessorKey: "repayment_amount",
        header: "Repayment",
        cell: ({ row }) => formatCurrency(row.getValue("repayment_amount")),
      },
      {
        accessorKey: "total_interest",
        header: "Interest",
        cell: ({ row }) => formatCurrency(row.getValue("total_interest")),
      },
      {
        accessorKey: "calculation_mode",
        header: "Mode",
        cell: ({ row }) => row.getValue("calculation_mode"),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status");
          return (
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${getStatusBadge(
                status
              )}`}
            >
              {status}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => {
          const reference = row.original.reference;
          return (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() =>
                router.push(`/${route}/loan-applications/${reference}`)
              }
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Button>
          );
        },
      },
    ],
    [router]
  );

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="space-y-4">
      {/* Search + Page Size */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <Input
          placeholder="Search any column..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-xs"
        />
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(v) => table.setPageSize(Number(v))}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20, 50].map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size} rows
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs sm:text-sm whitespace-nowrap px-2"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-xs sm:text-sm whitespace-nowrap px-2"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8 text-gray-500"
                >
                  No loan applications found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
