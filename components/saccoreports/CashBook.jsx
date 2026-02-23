"use client";

import React from "react";
import { formatCurrency } from "@/tools/format";
import { BookText, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export default function CashBook({ data, year }) {
  if (!data) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <BookText className="h-8 w-8 text-primary" />
            General Cash Book
          </h2>
          <p className="text-gray-500 font-medium">
             Financial records for the year <span className="text-primary font-bold">{year}</span>
          </p>
        </div>
      </div>

      <div className="overflow-x-auto -mx-8">
        <table className="w-full border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="text-left py-4 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Date</th>
              <th className="text-left py-4 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Description</th>
              <th className="text-right py-4 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Debit (IN)</th>
              <th className="text-right py-4 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Credit (OUT)</th>
              <th className="text-right py-4 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-primary">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((entry, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                <td className="py-4 px-8 whitespace-nowrap">
                  <span className="text-xs font-bold text-gray-500">{new Date(entry.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </td>
                <td className="py-4 px-8">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">{entry.description}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-gray-400">{entry.reference.substring(0, 8)}...</span>
                      <span className="px-1.5 py-0.5 bg-gray-100 text-gray-400 text-[8px] font-black uppercase rounded tracking-wider">{entry.source}</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-8 text-right">
                  {entry.debit > 0 ? (
                    <div className="flex items-center justify-end gap-1.5 text-emerald-600">
                      <span className="text-xs font-mono font-bold">{formatCurrency(entry.debit)}</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </div>
                  ) : <span className="text-gray-300">-</span>}
                </td>
                <td className="py-4 px-8 text-right">
                  {entry.credit > 0 ? (
                    <div className="flex items-center justify-end gap-1.5 text-rose-600">
                      <span className="text-xs font-mono font-bold">{formatCurrency(entry.credit)}</span>
                      <ArrowDownLeft className="h-3 w-3" />
                    </div>
                  ) : <span className="text-gray-300">-</span>}
                </td>
                <td className="py-4 px-8 text-right bg-primary/0 group-hover:bg-primary/5 transition-colors">
                  <span className="text-sm font-black text-primary font-mono">{formatCurrency(entry.balance)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-2">Total Receipts</span>
          <span className="text-2xl font-black text-emerald-700">{formatCurrency(data.reduce((acc, curr) => acc + curr.debit, 0))}</span>
        </div>
        <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100">
          <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest block mb-2">Total Payments</span>
          <span className="text-2xl font-black text-rose-700">{formatCurrency(data.reduce((acc, curr) => acc + curr.credit, 0))}</span>
        </div>
        <div className="p-6 bg-primary/5 rounded-2xl border-2 border-primary/10">
          <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest block mb-1">Final Balance</span>
          <span className="text-3xl font-black text-primary leading-none">
            {formatCurrency(data.length > 0 ? data[data.length - 1].balance : 0)}
          </span>
        </div>
      </div>
    </div>
  );
}
