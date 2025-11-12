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
      <Table>
        <TableHeader>
          {/* Main Header Row */}
          <TableRow className="border-b">
            <TableHead className="text-left font-semibold text-gray-700">
              Month
            </TableHead>
            <TableHead
              colSpan={2}
              className="text-center font-semibold text-gray-700 border-x"
            >
              Savings
            </TableHead>
            <TableHead
              colSpan={3}
              className="text-center font-semibold text-gray-700 border-x"
            >
              Ventures
            </TableHead>
            <TableHead
              colSpan={4}
              className="text-center font-semibold text-gray-700 border-x"
            >
              Loans
            </TableHead>
          </TableRow>

          {/* Sub Header Row */}
          <TableRow className="border-b text-xs text-gray-600">
            <TableHead className="w-16"></TableHead>
            <TableHead className="text-right">Deposits</TableHead>
            <TableHead className="text-right border-x">Balance</TableHead>
            <TableHead className="text-right">Deposit (Owed)</TableHead>
            <TableHead className="text-right">Payment (Repaid)</TableHead>
            <TableHead className="text-right border-x">Balance</TableHead>
            <TableHead className="text-right">Disbursed</TableHead>
            <TableHead className="text-right">Repaid</TableHead>
            <TableHead className="text-right">Interest</TableHead>
            <TableHead className="text-right font-medium">
              Outstanding
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y">
          {rows.length > 0 ? (
            rows.map((row, idx) => (
              <TableRow key={idx} className="hover:bg-gray-50">
                <TableCell className="font-medium text-left">
                  {row.month}
                </TableCell>

                {/* Savings */}
                <TableCell className="text-right">
                  {format(row.savingsDeposits)}
                </TableCell>
                <TableCell className="text-right border-x">
                  {format(row.savingsBalance)}
                </TableCell>

                {/* Ventures */}
                <TableCell className="text-right">
                  {format(row.ventureDeposit)}
                </TableCell>
                <TableCell className="text-right">
                  {format(row.venturePayment)}
                </TableCell>
                <TableCell className="text-right border-x">
                  {format(row.ventureBalance)}
                </TableCell>

                {/* Loans */}
                <TableCell className="text-right">
                  {format(row.loanDisbursed)}
                </TableCell>
                <TableCell className="text-right">
                  {format(row.loanRepaid)}
                </TableCell>
                <TableCell className="text-right">
                  {format(row.loanInterest)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {format(row.loanOutstanding)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={10}
                className="text-center text-gray-500 py-6"
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
