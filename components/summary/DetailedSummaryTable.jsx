// components/transactions/DetailedSummaryTable.jsx
import React, { useMemo } from "react";

function DetailedSummaryTable({ data }) {
  const { monthly_summary = [] } = data || {};

  const savingsTypes = useMemo(() => {
    const set = new Set();
    monthly_summary.forEach((m) =>
      m.savings.by_type.forEach((t) => set.add(t.type))
    );
    return Array.from(set);
  }, [monthly_summary]);

  const ventureTypes = useMemo(() => {
    const set = new Set();
    monthly_summary.forEach((m) =>
      m.ventures.by_type.forEach((t) => set.add(t.venture_type))
    );
    return Array.from(set);
  }, [monthly_summary]);

  const loanTypes = useMemo(() => {
    const set = new Set();
    monthly_summary.forEach((m) =>
      m.loans.by_type.forEach((t) => set.add(t.loan_type))
    );
    return Array.from(set);
  }, [monthly_summary]);

  const runningBalances = useMemo(() => {
    const bal = { savings: {}, venture: {}, loan: {} };
    savingsTypes.forEach((t) => (bal.savings[t] = 0));
    ventureTypes.forEach((t) => (bal.venture[t] = 0));
    loanTypes.forEach((t) => (bal.loan[t] = 0));

    return monthly_summary.reduce(
      (acc, m) => {
        const key = m.month;
        m.savings.by_type.forEach((t) => {
          bal.savings[t.type] += t.amount || 0;
          acc.savings[key] = { ...bal.savings };
        });
        m.ventures.by_type.forEach((vt) => {
          const dep = (vt.venture_deposits || [])?.reduce(
            (s, d) => s + d.amount,
            0
          );
          const pay = (vt.venture_payments || [])?.reduce(
            (s, p) => s + p.amount,
            0
          );
          bal.venture[vt.venture_type] += dep - pay;
          acc.venture[key] = { ...bal.venture };
        });
        m.loans.by_type.forEach((lt) => {
          const disb = (lt.total_amount_disbursed || [])?.reduce(
            (s, d) => s + d.amount,
            0
          );
          const rep = (lt.total_amount_repaid || [])?.reduce(
            (s, r) => s + r.amount,
            0
          );
          bal.loan[lt.loan_type] += disb - rep;
          acc.loan[key] = { ...bal.loan };
        });
        return acc;
      },
      { savings: {}, venture: {}, loan: {} }
    );
  }, [monthly_summary, savingsTypes, ventureTypes, loanTypes]);

  const format = (n) =>
    Number(n || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const getValue = (key, sec, type) => {
    const m = monthly_summary.find((x) => x.month === key);
    if (!m) return { dep: 0, pay: 0, bal: 0, disb: 0, rep: 0, int: 0, out: 0 };

    if (sec === "savings") {
      const t = m.savings.by_type.find((x) => x.type === type);
      return {
        dep: t?.amount || 0,
        bal: runningBalances.savings[key]?.[type] || 0,
      };
    }
    if (sec === "ventures") {
      const t = m.ventures.by_type.find((x) => x.venture_type === type);
      const dep = (t?.venture_deposits || []).reduce((s, d) => s + d.amount, 0);
      const pay = (t?.venture_payments || []).reduce((s, p) => s + p.amount, 0);
      return { dep, pay, bal: runningBalances.venture[key]?.[type] || 0 };
    }
    if (sec === "loans") {
      const t = m.loans.by_type.find((x) => x.loan_type === type);
      const disb = (t?.total_amount_disbursed || [])?.reduce(
        (s, d) => s + d.amount,
        0
      );
      const rep = (t?.total_amount_repaid || [])?.reduce(
        (s, r) => s + r.amount,
        0
      );
      const int = (t?.total_interest_charged || [])?.reduce(
        (s, i) => s + i.amount,
        0
      );
      return { disb, rep, int, out: t?.total_amount_outstanding || 0 };
    }
    return { dep: 0, pay: 0, bal: 0 };
  };

  if (monthly_summary.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">No data available</div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-md border">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b bg-gray-50">
            <th
              rowSpan={3}
              className="relative font-semibold px-3 py-2 w-24 align-bottom border-r"
            >
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              Month
              </span>
            </th>
            <th
              colSpan={savingsTypes.length * 2}
              className="text-center font-semibold border-x px-3 py-2 align-bottom"
            >
              Savings
            </th>
            <th
              colSpan={ventureTypes.length * 3}
              className="text-center font-semibold border-x px-3 py-2 align-bottom"
            >
              Ventures
            </th>
            <th
              colSpan={loanTypes.length * 4}
              className="text-center font-semibold border-x px-3 py-2 align-bottom"
            >
              Loans
            </th>
          </tr>
          <tr className="border-b">
            {savingsTypes.map((t) => (
              <th
                key={t}
                colSpan={2}
                className="text-center font-medium px-3 py-1 align-bottom border-r last:border-r-0"
              >
                {t}
              </th>
            ))}
            {ventureTypes.map((t) => (
              <th
                key={t}
                colSpan={3}
                className="text-center font-medium px-3 py-1 align-bottom border-r last:border-r-0"
              >
                {t}
              </th>
            ))}
            {loanTypes.map((t) => (
              <th
                key={t}
                colSpan={4}
                className="text-center font-medium px-3 py-1 align-bottom border-r last:border-r-0"
              >
                {t}
              </th>
            ))}
          </tr>
          <tr className="border-b text-gray-600">
            {savingsTypes.flatMap((t) => [
              <th
                key={`${t}-dep`}
                className="text-right px-3 py-1 align-bottom"
              >
                Dep
              </th>,
              <th
                key={`${t}-bal`}
                className="text-right px-3 py-1 align-bottom border-r last:border-r-0"
              >
                Bal
              </th>,
            ])}
            {ventureTypes.flatMap((t) => [
              <th
                key={`${t}-dep`}
                className="text-right px-3 py-1 align-bottom"
              >
                Dep
              </th>,
              <th
                key={`${t}-pay`}
                className="text-right px-3 py-1 align-bottom"
              >
                Pay
              </th>,
              <th
                key={`${t}-bal`}
                className="text-right px-3 py-1 align-bottom border-r last:border-r-0"
              >
                Bal
              </th>,
            ])}
            {loanTypes.flatMap((t) => [
              <th
                key={`${t}-disb`}
                className="text-right px-3 py-1 align-bottom"
              >
                Disb
              </th>,
              <th
                key={`${t}-rep`}
                className="text-right px-3 py-1 align-bottom"
              >
                Rep
              </th>,
              <th
                key={`${t}-int`}
                className="text-right px-3 py-1 align-bottom"
              >
                Int
              </th>,
              <th
                key={`${t}-out`}
                className="text-right font-medium px-3 py-1 align-bottom border-r last:border-r-0"
              >
                Out
              </th>,
            ])}
          </tr>
        </thead>
        <tbody className="divide-y">
          {monthly_summary.map((m) => {
            const k = m.month;
            return (
              <tr key={k} className="h-8 hover:bg-gray-50">
                <td className="font-medium text-left px-3 py-1 border-r">
                  {k.split(" ")[0]}
                </td>
                {savingsTypes.map((t) => {
                  const v = getValue(k, "savings", t);
                  return (
                    <React.Fragment key={t}>
                      <td className="text-right px-3 py-1">{format(v.dep)}</td>
                      <td className="text-right px-3 py-1 border-r last:border-r-0">
                        {format(v.bal)}
                      </td>
                    </React.Fragment>
                  );
                })}
                {ventureTypes.map((t) => {
                  const v = getValue(k, "ventures", t);
                  return (
                    <React.Fragment key={t}>
                      <td className="text-right px-3 py-1">{format(v.dep)}</td>
                      <td className="text-right px-3 py-1">{format(v.pay)}</td>
                      <td className="text-right px-3 py-1 border-r last:border-r-0">
                        {format(v.bal)}
                      </td>
                    </React.Fragment>
                  );
                })}
                {loanTypes.map((t) => {
                  const v = getValue(k, "loans", t);
                  return (
                    <React.Fragment key={t}>
                      <td className="text-right px-3 py-1">{format(v.disb)}</td>
                      <td className="text-right px-3 py-1">{format(v.rep)}</td>
                      <td className="text-right px-3 py-1">{format(v.int)}</td>
                      <td className="text-right font-medium px-3 py-1 border-r last:border-r-0">
                        {format(v.out)}
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DetailedSummaryTable;
