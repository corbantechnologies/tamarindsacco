"use client";

import React from "react";
import { formatCurrency } from "@/tools/format";
import { Scale, CheckCircle2, AlertCircle } from "lucide-react";

export default function TrialBalance({ data }) {
  if (!data) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-8 mx-auto overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 sm:mb-10 gap-4 sm:gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2 sm:gap-3 justify-center md:justify-start">
            <Scale className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            Trial Balance
          </h2>
          <p className="text-sm sm:text-base text-gray-500 font-medium mt-1">
             Consolidated as of <span className="text-primary font-bold">{new Date(data.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </p>
        </div>

        <div className={`w-full md:w-auto flex justify-center items-center gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl border-2 transition-all duration-500 ${data.is_balanced ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100 animate-pulse'}`}>
          {data.is_balanced ? (
            <>
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1">Status</span>
                <span className="text-sm font-black text-emerald-700 leading-none">Balanced</span>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-rose-600" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest leading-none mb-1">Status</span>
                <span className="text-sm font-black text-rose-700 leading-none">Unbalanced</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 sm:-mx-8">
        <table className="w-full border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="text-left py-3 sm:py-4 px-4 sm:px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Code</th>
              <th className="text-left py-3 sm:py-4 px-4 sm:px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Account Particulars</th>
              <th className="text-left py-3 sm:py-4 px-4 sm:px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Type</th>
              <th className="text-right py-3 sm:py-4 px-4 sm:px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Debit (DR)</th>
              <th className="text-right py-3 sm:py-4 px-4 sm:px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Credit (CR)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.accounts.map((acc, idx) => (
              <tr key={acc.code} className="hover:bg-gray-50/50 transition-colors group">
                <td className="py-3 sm:py-4 px-4 sm:px-8 text-xs font-mono text-gray-400 group-hover:text-primary transition-colors">{acc.code}</td>
                <td className="py-3 sm:py-4 px-4 sm:px-8">
                  <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">{acc.name}</span>
                </td>
                <td className="py-3 sm:py-4 px-4 sm:px-8">
                   <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${
                     acc.type === 'Asset' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                     acc.type === 'Liability' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                     acc.type === 'Revenue' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                     'bg-gray-50 border-gray-100 text-gray-600'
                   }`}>
                     {acc.type}
                   </span>
                </td>
                <td className="py-3 sm:py-4 px-4 sm:px-8 text-right font-mono text-xs font-bold text-gray-800">
                  {acc.debit > 0 ? formatCurrency(acc.debit) : '-'}
                </td>
                <td className="py-3 sm:py-4 px-4 sm:px-8 text-right font-mono text-xs font-bold text-gray-800">
                  {acc.credit > 0 ? formatCurrency(acc.credit) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-primary/5">
              <td colSpan={3} className="py-4 sm:py-6 px-4 sm:px-8 text-[10px] sm:text-xs font-black text-primary uppercase tracking-[0.2em] sm:tracking-[0.3em] text-right">Trial Balance Totals</td>
              <td className="py-4 sm:py-6 px-4 sm:px-8 text-right">
                <div className="inline-block border-b-4 border-double border-primary pb-1">
                  <span className="text-base sm:text-lg font-black text-primary font-mono">{formatCurrency(data.total_debit)}</span>
                </div>
              </td>
              <td className="py-4 sm:py-6 px-4 sm:px-8 text-right">
                <div className="inline-block border-b-4 border-double border-primary pb-1">
                  <span className="text-base sm:text-lg font-black text-primary font-mono">{formatCurrency(data.total_credit)}</span>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      {!data.is_balanced && (
        <div className="mt-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-rose-500 flex items-center justify-center text-white shrink-0">
             <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-sm font-black text-rose-800 uppercase tracking-tight">Imbalance Detected</h4>
            <p className="text-xs text-rose-600 font-medium">The total debits and credits do not match. Please review the underlying general ledger entries for errors.</p>
          </div>
        </div>
      )}
    </div>
  );
}
