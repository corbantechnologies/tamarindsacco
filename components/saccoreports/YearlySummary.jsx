"use client";

import React from "react";
import { formatCurrency } from "@/tools/format";
import { 
  BarChart3, 
  Wallet, 
  HandCoins, 
  TrendingUp, 
  ShieldCheck,
  CreditCard,
  PieChart
} from "lucide-react";
import DetailedSummaryTable from "@/components/summary/DetailedSummaryTable";

export default function YearlySummary({ data, year }) {
  if (!data) return null;

  const { summary, yearly_accumulators } = data;

  const SummaryCard = ({ title, value, icon: Icon, colorClass, borderClass }) => (
    <div className={`p-6 rounded-3xl border-2 bg-white ${borderClass} shadow-sm group hover:shadow-md transition-all duration-300`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colorClass}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="h-2 w-2 rounded-full bg-gray-100 group-hover:bg-primary transition-colors" />
      </div>
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">{title}</span>
      <h4 className="text-2xl font-black text-gray-900 tracking-tight">{formatCurrency(value)}</h4>
    </div>
  );

  const AccumulatorSection = ({ title, items, icon: Icon, colorClass }) => (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className={`p-2 rounded-lg ${colorClass}`}>
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">{title}</h3>
      </div>
      <div className="space-y-4">
        {Object.entries(items).map(([key, value]) => (
          <div key={key}>
            <div className="flex justify-between items-center text-sm mb-1 px-1">
              <span className="text-gray-500 font-medium">{key}</span>
              <span className="text-gray-900 font-bold">{formatCurrency(value)}</span>
            </div>
            <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
              <div 
                className={`h-full ${colorClass.split(' ')[0]} transition-all duration-1000`} 
                style={{ width: `${Math.min(100, (value / (Object.values(items).reduce((a, b) => a + b, 0) || 1)) * 100)}%` }} 
              />
            </div>
          </div>
        ))}
        {Object.entries(items).length === 0 && (
          <p className="text-xs text-gray-400 italic text-center py-4 bg-gray-50/50 rounded-xl">No data available</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-12">
      {/* High Level Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard 
          title="Total Savings" 
          value={summary.total_savings} 
          icon={Wallet} 
          colorClass="bg-blue-500 text-white shadow-blue-200 shadow-lg"
          borderClass="border-blue-50"
        />
        <SummaryCard 
          title="Loans Outstanding" 
          value={summary.total_loan_outstanding} 
          icon={HandCoins} 
          colorClass="bg-rose-500 text-white shadow-rose-200 shadow-lg"
          borderClass="border-rose-50"
        />
        <SummaryCard 
          title="Fee Income" 
          value={summary.total_fee_income} 
          icon={TrendingUp} 
          colorClass="bg-emerald-500 text-white shadow-emerald-200 shadow-lg"
          borderClass="border-emerald-50"
        />
        <SummaryCard 
          title="Active Guarantees" 
          value={summary.total_guaranteed_active} 
          icon={ShieldCheck} 
          colorClass="bg-amber-500 text-white shadow-amber-200 shadow-lg"
          borderClass="border-amber-50"
        />
      </div>

      {/* Yearly Accumulators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AccumulatorSection 
          title="Savings Performance" 
          items={yearly_accumulators.savings} 
          icon={PieChart}
          colorClass="bg-blue-500 text-white"
        />
        <AccumulatorSection 
          title="Loan Repayments" 
          items={yearly_accumulators.loan_repayments} 
          icon={CreditCard}
          colorClass="bg-emerald-500 text-white"
        />
        <AccumulatorSection 
          title="Fee Income" 
          items={yearly_accumulators.fee_income} 
          icon={BarChart3}
          colorClass="bg-orange-500 text-white"
        />
      </div>

      {/* Detailed Monthly Table */}
      <div className="pt-8">
        <div className="flex items-center gap-3 mb-6">
           <div className="h-px bg-gray-100 flex-1" />
           <h3 className="text-xs font-black text-gray-300 uppercase tracking-[0.4em] whitespace-nowrap">Detailed Monthly Breakdown</h3>
           <div className="h-px bg-gray-100 flex-1" />
        </div>
        <div className="bg-white p-2 border border-gray-100 shadow-xl overflow-hidden">
          <DetailedSummaryTable data={data} />
        </div>
      </div>
    </div>
  );
}
