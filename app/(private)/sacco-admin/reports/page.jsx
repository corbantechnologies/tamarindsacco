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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

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
    { id: "yearly", label: "Yearly Summary", icon: BarChart, query: yearlyQuery, component: YearlySummary, props: { data: yearlyQuery.data, year: filters.year } },
    { id: "cashbook", label: "Cash Book", icon: BookOpen, query: cashbookQuery, component: CashBook, props: { data: cashbookQuery.data, year: filters.year } },
    { id: "balancesheet", label: "Balance Sheet", icon: Library, query: balancesheetQuery, component: BalanceSheet, props: { data: balancesheetQuery.data } },
    { id: "incomestatement", label: "Income Statement", icon: FileText, query: incomeStatementQuery, component: IncomeStatement, props: { data: incomeStatementQuery.data } },
    { id: "trialbalance", label: "Trial Balance", icon: ClipboardCheck, query: trialBalanceQuery, component: TrialBalance, props: { data: trialBalanceQuery.data } },
  ];

  const activeTabData = tabs.find(t => t.id === activeTab);

  const handleFetch = () => {
    activeTabData.query.refetch();
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Sacco Reports
            </h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive financial oversight and transaction audit trails.
            </p>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" className="bg-white shadow-sm hover:bg-gray-50">
               <Printer className="h-4 w-4 mr-2 text-gray-500" /> Print
             </Button>
             <Button className="bg-[#045e32] hover:bg-[#034b28] text-white shadow-sm transition-all hover:shadow-md">
               <Download className="h-4 w-4 mr-2" />
               Export CSV
             </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <TabsList className="bg-white p-1 rounded-xl border shadow-sm h-auto flex flex-wrap gap-1 sm:inline-flex w-full sm:w-auto">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id} 
                className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-[#045e32] data-[state=active]:text-white transition-all flex-1 sm:flex-none whitespace-nowrap"
              >
                  <tab.icon className="h-4 w-4 mr-2" /> {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Filters */}
          <ReportFilters 
            type={activeTab}
            filters={filters}
            setFilters={setFilters}
            onFetch={handleFetch}
            loading={activeTabData?.query.isFetching}
          />

          {/* Content Area */}
          <div className="relative min-h-[400px]">
             {tabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="animate-in fade-in-50 duration-500 mt-0">
                  {tab.query.isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 z-10 rounded-xl">
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-12 w-12 border-4 border-primary/20 border-t-[#045e32] rounded-full animate-spin" />
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Generating Report...</span>
                      </div>
                    </div>
                  ) : tab.query.isError ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 z-10 rounded-xl">
                       <div className="p-8 bg-red-50 border border-red-100 rounded-3xl text-center max-w-md">
                         <div className="h-16 w-16 bg-red-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-red-100">
                           <Calendar className="h-8 w-8" />
                         </div>
                         <h3 className="text-lg font-bold text-red-900 mb-2">Failed to Load Report</h3>
                         <p className="text-sm text-red-600 font-medium mb-6">There was an error communicating with the server. Please check your connection or filters.</p>
                         <Button 
                          onClick={handleFetch}
                          className="bg-red-600 hover:bg-red-700 text-white shadow-sm"
                         >
                           Try Again
                         </Button>
                       </div>
                    </div>
                  ) : (
                    <div className="bg-transparent border-none">
                       <tab.component {...tab.props} />
                    </div>
                  )}
                </TabsContent>
             ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
}