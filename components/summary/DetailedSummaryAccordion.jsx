// components/transactions/DetailedSummaryAccordion.jsx
import React, { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

function DetailedSummaryAccordion({ data }) {
  const { monthly_summary = [] } = data || {};
  const [openMonths, setOpenMonths] = useState(new Set());

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
          const dep = (vt.venture_deposits || []).reduce(
            (s, d) => s + d.amount,
            0
          );
          const pay = (vt.venture_payments || []).reduce(
            (s, p) => s + p.amount,
            0
          );
          bal.venture[vt.venture_type] += dep - pay;
          acc.venture[key] = { ...bal.venture };
        });
        m.loans.by_type.forEach((lt) => {
          const disb = (lt.total_amount_disbursed || []).reduce(
            (s, d) => s + d.amount,
            0
          );
          const rep = (lt.total_amount_repaid || []).reduce(
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
      const disb = (t?.total_amount_disbursed || []).reduce(
        (s, d) => s + d.amount,
        0
      );
      const rep = (t?.total_amount_repaid || []).reduce(
        (s, r) => s + r.amount,
        0
      );
      const int = (t?.total_interest_charged || []).reduce(
        (s, i) => s + i.amount,
        0
      );
      return { disb, rep, int, out: t?.total_amount_outstanding || 0 };
    }
    return { dep: 0, pay: 0, bal: 0 };
  };

  const toggleMonth = (month) => {
    setOpenMonths((prev) => {
      const next = new Set(prev);
      if (next.has(month)) next.delete(month);
      else next.add(month);
      return next;
    });
  };

  if (monthly_summary.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">No data available</div>
    );
  }

  return (
    <div className="space-y-3">
      {monthly_summary.map((m) => {
        const k = m.month;
        const isOpen = openMonths.has(k);
        return (
          <div key={k} className="bg-white rounded-lg border shadow-sm">
            <button
              onClick={() => toggleMonth(k)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
            >
              <span className="font-semibold text-lg">{k.split(" ")[0]}</span>
              {isOpen ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>

            {isOpen && (
              <div className="px-4 pb-4 space-y-4 border-t">
                {/* Savings */}
                {savingsTypes.length > 0 && (
                  <div className="pt-3">
                    <h4 className="font-medium text-sm text-gray-700 mb-2 pb-1 border-b">
                      Savings
                    </h4>
                    {savingsTypes.map((t) => {
                      const v = getValue(k, "savings", t);
                      return (
                        <div
                          key={t}
                          className="flex justify-between py-1 text-sm"
                        >
                          <span className="font-medium text-gray-800">{t}</span>
                          <div className="flex gap-4 text-xs">
                            <span>
                              Deposit: <strong>{format(v.dep)}</strong>
                            </span>
                            <span>
                              Balance: <strong>{format(v.bal)}</strong>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Ventures */}
                {ventureTypes.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2 pb-1 border-b">
                      Ventures
                    </h4>
                    {ventureTypes.map((t) => {
                      const v = getValue(k, "ventures", t);
                      return (
                        <div
                          key={t}
                          className="flex justify-between py-1 text-sm"
                        >
                          <span className="font-medium text-gray-800">{t}</span>
                          <div className="flex gap-4 text-xs">
                            <span>
                              Deposit: <strong>{format(v.dep)}</strong>
                            </span>
                            <span>
                              Payment: <strong>{format(v.pay)}</strong>
                            </span>
                            <span>
                              Balance: <strong>{format(v.bal)}</strong>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Loans */}
                {loanTypes.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2 pb-1 border-b">
                      Loans
                    </h4>
                    {loanTypes.map((t) => {
                      const v = getValue(k, "loans", t);
                      return (
                        <div
                          key={t}
                          className="flex justify-between py-1 text-sm"
                        >
                          <span className="font-medium text-gray-800">{t}</span>
                          <div className="flex gap-3 text-xs">
                            <span>
                              Disb: <strong>{format(v.disb)}</strong>
                            </span>
                            <span>
                              Rep: <strong>{format(v.rep)}</strong>
                            </span>
                            <span>
                              Int: <strong>{format(v.int)}</strong>
                            </span>
                            <span>
                              Out: <strong>{format(v.out)}</strong>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default DetailedSummaryAccordion;
