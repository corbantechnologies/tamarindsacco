"use client";

import React, { useState } from "react";
import { 
  FileText, 
  BookOpen, 
  Library, 
  ClipboardCheck, 
  BarChart,
  Calendar,
  Download,
  Printer
} from "lucide-react";
import { 
  useFetchSaccoYearlySummary, 
  useFetchSaccoCashBook, 
  useFetchSaccoBalanceSheet, 
  useFetchSaccoIncomeStatement, 
  useFetchSaccoTrialBalance 
} from "@/hooks/saccoreports/actions";
import ReportFilters from "@/components/saccoreports/ReportFilters";
import YearlySummary from "@/components/saccoreports/YearlySummary";
import CashBook from "@/components/saccoreports/CashBook";
import BalanceSheet from "@/components/saccoreports/BalanceSheet";
import IncomeStatement from "@/components/saccoreports/IncomeStatement";
import TrialBalance from "@/components/saccoreports/TrialBalance";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("yearly");
  const [filters, setFilters] = useState({
    year: new Date().getFullYear().toString(),
    date: new Date().toISOString().split('T')[0],
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  // Fetching data based on active tab
  const yearlyQuery = useFetchSaccoYearlySummary(filters.year);
  const cashbookQuery = useFetchSaccoCashBook(filters.year);
  const balancesheetQuery = useFetchSaccoBalanceSheet(filters.date);
  const incomeStatementQuery = useFetchSaccoIncomeStatement(filters.startDate, filters.endDate);
  const trialBalanceQuery = useFetchSaccoTrialBalance(filters.date);

  const tabs = [
    { id: "yearly", label: "Yearly Summary", icon: BarChart, query: yearlyQuery },
    { id: "cashbook", label: "Cash Book", icon: BookOpen, query: cashbookQuery },
    { id: "balancesheet", label: "Balance Sheet", icon: Library, query: balancesheetQuery },
    { id: "incomestatement", label: "Income Statement", icon: FileText, query: incomeStatementQuery },
    { id: "trialbalance", label: "Trial Balance", icon: ClipboardCheck, query: trialBalanceQuery },
  ];

  const activeTabData = tabs.find(t => t.id === activeTab);

  const handleFetch = () => {
    activeTabData.query.refetch();
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-6 lg:p-10">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Sacco Reports</h1>
            <p className="text-gray-500 font-medium">Comprehensive financial oversight and transaction audit trails.</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm text-gray-400 hover:text-primary transition-colors">
               <Printer className="h-5 w-5" />
             </button>
             <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-xl shadow-sm text-gray-700 font-bold hover:border-primary transition-all">
               <Download className="h-5 w-5 text-primary" />
               Export CSV
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-gray-100/50 p-1.5 rounded-2xl w-fit border border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-400 hover:text-gray-600 hover:bg-white/50"
              }`}
            >
              <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-primary' : 'text-gray-300'}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <ReportFilters 
          type={activeTab}
          filters={filters}
          setFilters={setFilters}
          onFetch={handleFetch}
          loading={activeTabData.query.isFetching}
        />

        {/* Content Area */}
        <div className="relative min-h-[400px]">
          {activeTabData.query.isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Generating Report...</span>
              </div>
            </div>
          ) : activeTabData.query.isError ? (
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="p-8 bg-rose-50 border border-rose-100 rounded-3xl text-center max-w-md">
                 <div className="h-16 w-16 bg-rose-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-rose-100">
                   <Calendar className="h-8 w-8" />
                 </div>
                 <h3 className="text-lg font-black text-rose-900 mb-2">Failed to Load Report</h3>
                 <p className="text-sm text-rose-600 font-medium mb-6">There was an error communicating with the server. Please check your connection or filters.</p>
                 <button 
                  onClick={handleFetch}
                  className="px-6 py-2 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-colors shadow-sm"
                 >
                   Try Again
                 </button>
               </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {activeTab === "yearly" && <YearlySummary data={yearlyQuery.data} year={filters.year} />}
              {activeTab === "cashbook" && <CashBook data={cashbookQuery.data} year={filters.year} />}
              {activeTab === "balancesheet" && <BalanceSheet data={balancesheetQuery.data} />}
              {activeTab === "incomestatement" && <IncomeStatement data={incomeStatementQuery.data} />}
              {activeTab === "trialbalance" && <TrialBalance data={trialBalanceQuery.data} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}