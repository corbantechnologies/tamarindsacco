"use client";

import React from "react";
import { formatCurrency } from "@/tools/format";

export default function BalanceSheet({ data }) {
  if (!data) return null;

  const Section = ({ title, items, total, totalLabel }) => (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 border-b-2 border-gray-100 pb-2">
        {title}
      </h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.code} className="flex justify-between items-center py-1 text-sm border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors px-2 rounded">
            <div className="flex gap-4">
              <span className="text-gray-400 w-12">{item.code}</span>
              <span className="text-gray-700 font-medium">{item.name}</span>
            </div>
            <span className="text-gray-900 font-semibold">{formatCurrency(item.balance)}</span>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-gray-400 italic px-2">No items recorded</p>
        )}
      </div>
      <div className="mt-4 flex justify-between items-center p-3 bg-gray-50 rounded-lg border-t-2 border-gray-200">
        <span className="font-bold text-gray-800 uppercase tracking-wider text-xs">
          {totalLabel || `Total ${title}`}
        </span>
        <span className="text-lg font-black text-primary">
          {formatCurrency(total)}
        </span>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mx-auto">
      <div className="flex justify-between items-start mb-10">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Balance Sheet</h2>
          <p className="text-gray-500 font-medium flex items-center gap-2">
             As of <span className="text-primary">{new Date(data.as_of_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </p>
        </div>
        {!data.in_balance && (
          <div className="px-4 py-2 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold uppercase tracking-widest animate-pulse">
            Out of Balance
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <Section title="Assets" items={data.assets.items} total={data.assets.total} />
        </div>
        
        <div className="space-y-8">
          <Section title="Liabilities" items={data.liabilities.items} total={data.liabilities.total} />
          <Section title="Equity" items={data.equity.items} total={data.equity.total} />
          
          <div className="mt-12 p-4 bg-primary/5 rounded-2xl border-2 border-primary/10">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em]">Total Liabilities & Equity</span>
            </div>
            <div className="flex justify-between items-end">
               <span className="text-2xl font-black text-primary">
                {formatCurrency(data.total_liabilities_and_equity)}
              </span>
              {data.in_balance && (
                <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px]">
                  ✓
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
