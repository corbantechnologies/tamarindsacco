// components/transactions/DetailedMonthlySummaryTable.jsx
import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function DetailedMonthlySummaryTable({ data }) {
  const { monthly_summary = [], chart_of_accounts = {} } = data || {};

  // Extract all unique types
  const savingsTypes = useMemo(() => {
    const types = new Set();
    monthly_summary.forEach((m) => {
      m.savings.by_type.forEach((t) => types.add(t.type));
    });
    return Array.from(types);
  }, [monthly_summary]);

  const ventureTypes = useMemo(() => {
    const types = new Set();
    monthly_summary.forEach((m) => {
      m.ventures.by_type.forEach((t) => types.add(t.venture_type));
    });
    return Array.from(types);
  }, [monthly_summary]);

  const loanTypes = useMemo(() => {
    const types = new Set();
    monthly_summary.forEach((m) => {
      m.loans.by_type.forEach((t) => types.add(t.loan_type));
    });
    return Array.from(types);
  }, [monthly_summary]);

  // Calculate running balances per type
  const runningBalances = useMemo(() => {
    const balances = { savings: {}, venture: {}, loan: {} };
    savingsTypes.forEach((t) => (balances.savings[t] = 0));
    ventureTypes.forEach((t) => (balances.venture[t] = 0));
    loanTypes.forEach((t) => (balances.loan[t] = 0));

    return monthly_summary.reduce(
      (acc, month) => {
        const key = month.month;

        month.savings.by_type.forEach((t) => {
          balances.savings[t.type] += t.amount || 0;
          acc.savings[key] = { ...balances.savings };
        });

        month.ventures.by_type.forEach((vt) => {
          const deposit = (vt.venture_deposits || []).reduce(
            (s, d) => s + d.amount,
            0
          );
          const payment = (vt.venture_payments || []).reduce(
            (s, p) => s + p.amount,
            0
          );
          balances.venture[vt.venture_type] += deposit - payment;
          acc.venture[key] = { ...balances.venture };
        });

        month.loans.by_type.forEach((lt) => {
          const disbursed = (lt.total_amount_disbursed || []).reduce(
            (s, d) => s + d.amount,
            0
          );
          const repaid = (lt.total_amount_repaid || []).reduce(
            (s, r) => s + r.amount,
            0
          );
          balances.loan[lt.loan_type] += disbursed - repaid;
          acc.loan[key] = { ...balances.loan };
        });

        return acc;
      },
      { savings: {}, venture: {}, loan: {} }
    );
  }, [monthly_summary, savingsTypes, ventureTypes, loanTypes]);

  const format = (num) =>
    Number(num || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const getTypeValue = (monthKey, section, type) => {
    const month = monthly_summary.find((m) => m.month === monthKey);
    if (!month) return { deposit: 0, payment: 0, balance: 0 };

    if (section === "savings") {
      const t = month.savings.by_type.find((x) => x.type === type);
      return {
        deposit: t?.amount || 0,
        payment: 0,
        balance: runningBalances.savings[monthKey]?.[type] || 0,
      };
    }

    if (section === "ventures") {
      const t = month.ventures.by_type.find((x) => x.venture_type === type);
      const deposit = (t?.venture_deposits || []).reduce(
        (s, d) => s + d.amount,
        0
      );
      const payment = (t?.venture_payments || []).reduce(
        (s, p) => s + p.amount,
        0
      );
      return {
        deposit,
        payment,
        balance: runningBalances.venture[monthKey]?.[type] || 0,
      };
    }

    if (section === "loans") {
      const t = month.loans.by_type.find((x) => x.loan_type === type);
      const disbursed = (t?.total_amount_disbursed || []).reduce(
        (s, d) => s + d.amount,
        0
      );
      const repaid = (t?.total_amount_repaid || []).reduce(
        (s, r) => s + r.amount,
        0
      );
      const interest = (t?.total_interest_charged || []).reduce(
        (s, i) => s + i.amount,
        0
      );
      return {
        disbursed,
        repaid,
        interest,
        outstanding: t?.total_amount_outstanding || 0,
      };
    }

    return { deposit: 0, payment: 0, balance: 0 };
  };

  return (
    <div className="w-full overflow-x-auto rounded-md border">
      <Table className="text-xs">
        <TableHeader>
          <TableRow className="border-b h-8">
            <TableHead
              rowSpan={2}
              className="text-left font-semibold px-2 py-1 w-20"
            >
              Month
            </TableHead>
            <TableHead
              colSpan={savingsTypes.length * 2}
              className="text-center font-semibold border-x px-2 py-1"
            >
              Savings
            </TableHead>
            <TableHead
              colSpan={ventureTypes.length * 3}
              className="text-center font-semibold border-x px-2 py-1"
            >
              Ventures
            </TableHead>
            <TableHead
              colSpan={loanTypes.length * 4}
              className="text-center font-semibold border-x px-2 py-1"
            >
              Loans
            </TableHead>
          </TableRow>
          <TableRow className="border-b text-xs text-gray-600 h-7">
            {savingsTypes.map((type) => (
              <React.Fragment key={`savings-${type}`}>
                <TableHead className="text-right px-2 py-1">
                  {type} Dep
                </TableHead>
                <TableHead className="text-right border-x px-2 py-1">
                  Bal
                </TableHead>
              </React.Fragment>
            ))}
            {ventureTypes.map((type) => (
              <React.Fragment key={`venture-${type}`}>
                <TableHead className="text-right px-2 py-1">
                  {type} Dep
                </TableHead>
                <TableHead className="text-right px-2 py-1">Pay</TableHead>
                <TableHead className="text-right border-x px-2 py-1">
                  Bal
                </TableHead>
              </React.Fragment>
            ))}
            {loanTypes.map((type) => (
              <React.Fragment key={`loan-${type}`}>
                <TableHead className="text-right px-2 py-1">Disb</TableHead>
                <TableHead className="text-right px-2 py-1">Rep</TableHead>
                <TableHead className="text-right px-2 py-1">Int</TableHead>
                <TableHead className="text-right font-medium px-2 py-1">
                  Out
                </TableHead>
              </React.Fragment>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y">
          {monthly_summary.length > 0 ? (
            monthly_summary.map((month) => {
              const monthKey = month.month;
              return (
                <TableRow key={monthKey} className="h-7 hover:bg-gray-50">
                  <TableCell className="font-medium text-left px-2 py-1">
                    {monthKey.split(" ")[0]}
                  </TableCell>
                  {savingsTypes.map((type) => {
                    const { deposit, balance } = getTypeValue(
                      monthKey,
                      "savings",
                      type
                    );
                    return (
                      <React.Fragment key={`savings-${type}`}>
                        <TableCell className="text-right px-2 py-1">
                          {format(deposit)}
                        </TableCell>
                        <TableCell className="text-right border-x px-2 py-1">
                          {format(balance)}
                        </TableCell>
                      </React.Fragment>
                    );
                  })}
                  {ventureTypes.map((type) => {
                    const { deposit, payment, balance } = getTypeValue(
                      monthKey,
                      "ventures",
                      type
                    );
                    return (
                      <React.Fragment key={`venture-${type}`}>
                        <TableCell className="text-right px-2 py-1">
                          {format(deposit)}
                        </TableCell>
                        <TableCell className="text-right px-2 py-1">
                          {format(payment)}
                        </TableCell>
                        <TableCell className="text-right border-x px-2 py-1">
                          {format(balance)}
                        </TableCell>
                      </React.Fragment>
                    );
                  })}
                  {loanTypes.map((type) => {
                    const { disbursed, repaid, interest, outstanding } =
                      getTypeValue(monthKey, "loans", type);
                    return (
                      <React.Fragment key={`loan-${type}`}>
                        <TableCell className="text-right px-2 py-1">
                          {format(disbursed)}
                        </TableCell>
                        <TableCell className="text-right px-2 py-1">
                          {format(repaid)}
                        </TableCell>
                        <TableCell className="text-right px-2 py-1">
                          {format(interest)}
                        </TableCell>
                        <TableCell className="text-right font-medium px-2 py-1">
                          {format(outstanding)}
                        </TableCell>
                      </React.Fragment>
                    );
                  })}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={
                  1 +
                  savingsTypes.length * 2 +
                  ventureTypes.length * 3 +
                  loanTypes.length * 4
                }
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

export default DetailedMonthlySummaryTable;
