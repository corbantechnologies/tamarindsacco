"use client";

import React from "react";
import { Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ReportFilters({
  type,
  filters,
  setFilters,
  onFetch,
  loading,
}) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-wrap items-end gap-4">
      {/* Year Filter for CashBook and YearlySummary */}
      {(type === "cashbook" || type === "yearly") && (
        <div className="space-y-1.5 text-sm w-full sm:w-auto">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700">
            Select Year
          </label>
          <select
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            className="flex h-10 w-full sm:w-[180px] rounded-md border border-input bg-background py-2 px-3 text-sm ring-offset-background border-gray-300 focus:ring-2 focus:ring-[#045e32] focus:border-[#045e32] transition-colors outline-none custom-select"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Date Filter for Balance Sheet and Trial Balance */}
      {(type === "balancesheet" || type === "trialbalance") && (
        <div className="space-y-1.5 text-sm w-full sm:w-auto mt-2 sm:mt-0">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700">
            As Of Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            <Input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="pl-10 w-full sm:w-[200px] border-gray-300 focus-visible:ring-[#045e32] focus-visible:border-[#045e32]"
            />
          </div>
        </div>
      )}

      {/* Date Range for Income Statement */}
      {type === "incomestatement" && (
        <>
          <div className="space-y-1.5 text-sm w-full sm:w-auto mt-2 sm:mt-0">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
                className="pl-10 w-full sm:w-[180px] border-gray-300 focus-visible:ring-[#045e32] focus-visible:border-[#045e32]"
              />
            </div>
          </div>
          <div className="space-y-1.5 text-sm w-full sm:w-auto mt-2 sm:mt-0">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
                className="pl-10 w-full sm:w-[180px] border-gray-300 focus-visible:ring-[#045e32] focus-visible:border-[#045e32]"
              />
            </div>
          </div>
        </>
      )}

      <Button
        onClick={onFetch}
        disabled={loading}
        className="w-full sm:w-auto h-10 bg-[#045e32] hover:bg-[#034b28] text-white shadow-sm mt-2 sm:mt-0"
      >
        <Search className="h-4 w-4 mr-2" />
        {loading ? "Fetching..." : "Fetch Report"}
      </Button>
    </div>
  );
}
