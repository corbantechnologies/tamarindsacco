"use client";

import React from "react";
import { Calendar, Search } from "lucide-react";

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
        <div className="space-y-1.5 text-sm">
          <label className="text-gray-500 font-medium">Select Year</label>
          <select
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            className="w-40 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
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
        <div className="space-y-1.5 text-sm">
          <label className="text-gray-500 font-medium">As Of Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>
        </div>
      )}

      {/* Date Range for Income Statement */}
      {type === "incomestatement" && (
        <>
          <div className="space-y-1.5 text-sm">
            <label className="text-gray-500 font-medium">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
                className="pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>
          <div className="space-y-1.5 text-sm">
            <label className="text-gray-500 font-medium">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
                className="pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>
        </>
      )}

      <button
        onClick={onFetch}
        disabled={loading}
        className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
      >
        <Search className="h-4 w-4" />
        {loading ? "Fetching..." : "Fetch Report"}
      </button>
    </div>
  );
}
