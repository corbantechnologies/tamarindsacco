"use client";

import React from "react";
import { formatCurrency } from "@/tools/format";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export default function IncomeStatement({ data }) {
  if (!data) return null;

  const Section = ({ title, items, total, totalLabel, icon: Icon, colorClass }) => (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4 border-b-2 border-gray-100 pb-2">
        <Icon className={`h-5 w-5 ${colorClass}`} />
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.code} className="flex justify-between items-center py-2 text-sm border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors px-2 rounded">
            <div className="flex flex-col">
              <span className="text-gray-700 font-medium">{item.name}</span>
              <span className="text-[10px] text-gray-400 font-mono tracking-wider">{item.code}</span>
            </div>
            <span className="text-gray-900 font-semibold">{formatCurrency(item.balance)}</span>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-gray-400 italic px-2 py-4 text-center bg-gray-50/50 rounded-lg">No {title.toLowerCase()} recorded for this period</p>
        )}
      </div>
      <div className={`mt-4 flex justify-between items-center p-3 rounded-xl border-t-2 ${colorClass.replace('text-', 'bg-').replace('-600', '-50')} ${colorClass.replace('text-', 'border-')}`}>
        <span className={`font-bold uppercase tracking-wider text-xs ${colorClass}`}>
          {totalLabel || `Total ${title}`}
        </span>
        <span className={`text-lg font-black ${colorClass}`}>
          {formatCurrency(total)}
        </span>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Income Statement</h2>
        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-gray-50 rounded-full border border-gray-100">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Period</span>
          <span className="text-sm font-black text-primary">
            {new Date(data.period.start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <span className="text-gray-300">→</span>
          <span className="text-sm font-black text-primary">
            {new Date(data.period.end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>

      <div className="space-y-12">
        <Section 
          title="Revenue" 
          items={data.revenue.items} 
          total={data.revenue.total} 
          icon={TrendingUp}
          colorClass="text-emerald-600"
        />
        
        <Section 
          title="Expenses" 
          items={data.expenses.items} 
          total={data.expenses.total} 
          icon={TrendingDown}
          colorClass="text-rose-600"
        />

        <div className="relative group mt-16 pt-8 border-t-4 border-double border-gray-200">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 bg-white border border-gray-200 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
            Summary
          </div>
          
          <div className={`p-8 rounded-3xl border-2 transition-all duration-300 ${data.net_income >= 0 ? 'bg-emerald-50/30 border-emerald-100 group-hover:bg-emerald-50' : 'bg-rose-50/30 border-rose-100 group-hover:bg-rose-50'}`}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${data.net_income >= 0 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white shadow-rose-200 shadow-xl'}`}>
                  <DollarSign className="h-8 w-8" />
                </div>
                <div className="text-center md:text-left">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 block">Net Surplus / Deficit</span>
                  <h4 className={`text-4xl font-black tracking-tighter ${data.net_income >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {formatCurrency(data.net_income)}
                  </h4>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest ${data.net_income >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {data.net_income >= 0 ? 'Profitable' : 'Deficit'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
