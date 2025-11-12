// components/transactions/MonthsSummaryTable.jsx
import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function MonthsSummaryTable({ data }) {
  const { monthly_summary = [] } = data || {};

  const rows = useMemo(() => {
    let runningSavings = 0;

    return monthly_summary.map((month) => {
      const savingsDeposits = month.savings.total_savings_deposits || 0;
      runningSavings += savingsDeposits;

      return {
        month: month.month.split(" ")[0],
        savingsDeposits,
        savingsBalance: runningSavings,
        ventureDeposit: month.ventures.venture_deposits || 0,
        venturePayment: month.ventures.venture_payments || 0,
        ventureBalance: month.ventures.venture_balance || 0,
        loanDisbursed: month.loans.total_loans_disbursed || 0,
        loanRepaid: month.loans.total_loans_repaid || 0,
        loanInterest: month.loans.total_interest_charged || 0,
        loanOutstanding: month.loans.total_loans_outstanding || 0,
      };
    });
  }, [monthly_summary]);

  const format = (num) =>
    Number(num || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="w-full overflow-x-auto rounded-md border">
      <Table className="text-xs">
        {" "}
        {/* Smaller base font */}
        <TableHeader>
          {/* Main Header */}
          <TableRow className="border-b h-8">
            {" "}
            {/* Reduced height */}
            <TableHead className="text-left font-semibold text-gray-700 px-2 py-1">
              Month
            </TableHead>
            <TableHead
              colSpan={2}
              className="text-center font-semibold text-gray-700 border-x px-2 py-1"
            >
              Savings
            </TableHead>
            <TableHead
              colSpan={3}
              className="text-center font-semibold text-gray-700 border-x px-2 py-1"
            >
              Ventures
            </TableHead>
            <TableHead
              colSpan={4}
              className="text-center font-semibold text-gray-700 border-x px-2 py-1"
            >
              Loans
            </TableHead>
          </TableRow>

          {/* Sub Header */}
          <TableRow className="border-b text-xs text-gray-600 h-7">
            <TableHead className="w-16 px-2 py-1"></TableHead>
            <TableHead className="text-right px-2 py-1">Deposits</TableHead>
            <TableHead className="text-right border-x px-2 py-1">
              Balance
            </TableHead>
            <TableHead className="text-right px-2 py-1">Deposit</TableHead>
            <TableHead className="text-right px-2 py-1">Payment</TableHead>
            <TableHead className="text-right border-x px-2 py-1">
              Balance
            </TableHead>
            <TableHead className="text-right px-2 py-1">Disbursed</TableHead>
            <TableHead className="text-right px-2 py-1">Repaid</TableHead>
            <TableHead className="text-right px-2 py-1">Interest</TableHead>
            <TableHead className="text-right font-medium px-2 py-1">
              Outstanding
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y">
          {rows.length > 0 ? (
            rows.map((row, idx) => (
              <TableRow key={idx} className="h-7 hover:bg-gray-50">
                {" "}
                {/* Compact row */}
                <TableCell className="font-medium text-left px-2 py-1">
                  {row.month}
                </TableCell>
                {/* Savings */}
                <TableCell className="text-right px-2 py-1">
                  {format(row.savingsDeposits)}
                </TableCell>
                <TableCell className="text-right border-x px-2 py-1">
                  {format(row.savingsBalance)}
                </TableCell>
                {/* Ventures */}
                <TableCell className="text-right px-2 py-1">
                  {format(row.ventureDeposit)}
                </TableCell>
                <TableCell className="text-right px-2 py-1">
                  {format(row.venturePayment)}
                </TableCell>
                <TableCell className="text-right border-x px-2 py-1">
                  {format(row.ventureBalance)}
                </TableCell>
                {/* Loans */}
                <TableCell className="text-right px-2 py-1">
                  {format(row.loanDisbursed)}
                </TableCell>
                <TableCell className="text-right px-2 py-1">
                  {format(row.loanRepaid)}
                </TableCell>
                <TableCell className="text-right px-2 py-1">
                  {format(row.loanInterest)}
                </TableCell>
                <TableCell className="text-right font-medium px-2 py-1">
                  {format(row.loanOutstanding)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={10}
                className="text-center text-gray-500 py-3 text-xs"
              >
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default MonthsSummaryTable;
