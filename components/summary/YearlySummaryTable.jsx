// components/transactions/YearlySummaryTable.jsx
import React from "react";

function YearlySummaryTable({ data }) {
  const { monthly_summary = [], chart_of_accounts = {}, year } = data || {};

  if (!monthly_summary.length) {
    return <p className="text-center text-gray-500 py-8">No data available.</p>;
  }

  // Extract all unique types
  const savingsTypes = new Set();
  const ventureTypes = new Set();
  const loanTypes = new Set();

  monthly_summary.forEach((m) => {
    m.savings.by_type.forEach((t) => savingsTypes.add(t.type));
    m.ventures.by_type.forEach((t) => ventureTypes.add(t.venture_type));
    m.loans.by_type.forEach((t) => loanTypes.add(t.loan_type));
  });

  const savings = Array.from(savingsTypes);
  const ventures = Array.from(ventureTypes);
  const loans = Array.from(loanTypes);

  const format = (n) => (n ? n.toLocaleString() : "0");

  return (
    <div className="w-full overflow-x-auto rounded-lg border">
      <table className="w-full min-w-max table-auto text-left text-sm">
        <thead>
          {/* Main Header */}
          <tr className="bg-[#045e32] text-white">
            <th rowSpan="2" className="px-4 py-3 font-semibold align-middle">
              DETAIL
            </th>

            {savings.length > 0 && (
              <th
                colSpan={savings.length * 2}
                className="px-4 py-3 text-center font-semibold"
              >
                SAVINGS
              </th>
            )}
            {loans.length > 0 && (
              <th
                colSpan={loans.length * 4}
                className="px-4 py-3 text-center font-semibold"
              >
                LOANS
              </th>
            )}
            {ventures.length > 0 && (
              <th
                colSpan={ventures.length * 2}
                className="px-4 py-3 text-center font-semibold"
              >
                VENTURES
              </th>
            )}
          </tr>

          {/* Sub Headers */}
          <tr className="bg-[#045e32]/80 text-white text-xs">
            {savings.map((t) => (
              <React.Fragment key={t}>
                <th className="px-4 py-2">{t} DEPOSITS</th>
                <th className="px-4 py-2">BALANCE</th>
              </React.Fragment>
            ))}
            {loans.map((t) => (
              <React.Fragment key={t}>
                <th className="px-4 py-2">DISBURSED</th>
                <th className="px-4 py-2">REPAID</th>
                <th className="px-4 py-2">INTEREST</th>
                <th className="px-4 py-2">OUTSTANDING</th>
              </React.Fragment>
            ))}
            {ventures.map((t) => (
              <React.Fragment key={t}>
                <th className="px-4 py-2">DEPOSITS</th>
                <th className="px-4 py-2">PAYMENTS</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {monthly_summary.map((month, idx) => {
            // Map types to values
            const savingsMap = Object.fromEntries(
              month.savings.by_type.map((t) => [t.type, t])
            );
            const loanMap = Object.fromEntries(
              month.loans.by_type.map((t) => [t.loan_type, t])
            );
            const ventureMap = Object.fromEntries(
              month.ventures.by_type.map((t) => [t.venture_type, t])
            );

            // Running balance for savings
            let runningSavings = 0;

            return (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {month.month}
                </td>

                {/* SAVINGS */}
                {savings.map((type) => {
                  const item = savingsMap[type] || { deposits: [], amount: 0 };
                  const depositSum = item.deposits.reduce(
                    (s, d) => s + (d.amount || 0),
                    0
                  );
                  runningSavings += depositSum;
                  return (
                    <React.Fragment key={type}>
                      <td className="px-4 py-3 text-right">
                        {format(depositSum)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {format(runningSavings)}
                      </td>
                    </React.Fragment>
                  );
                })}

                {/* LOANS */}
                {loans.map((type) => {
                  const item = loanMap[type] || {
                    total_amount_disbursed: [],
                    total_amount_repaid: [],
                    total_interest_charged: [],
                    total_amount_outstanding: 0,
                  };
                  const disbursed = item.total_amount_disbursed.reduce(
                    (s, d) => s + (d.amount || 0),
                    0
                  );
                  const repaid = item.total_amount_repaid.reduce(
                    (s, d) => s + (d.amount || 0),
                    0
                  );
                  const interest = item.total_interest_charged.reduce(
                    (s, d) => s + (d.amount || 0),
                    0
                  );
                  return (
                    <React.Fragment key={type}>
                      <td className="px-4 py-3 text-right">
                        {format(disbursed)}
                      </td>
                      <td className="px-4 py-3 text-right">{format(repaid)}</td>
                      <td className="px-4 py-3 text-right">
                        {format(interest)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {format(item.total_amount_outstanding)}
                      </td>
                    </React.Fragment>
                  );
                })}

                {/* VENTURES */}
                {ventures.map((type) => {
                  const item = ventureMap[type] || {
                    venture_deposits: [],
                    venture_payments: [],
                  };
                  const deposits = item.venture_deposits.reduce(
                    (s, d) => s + (d.amount || 0),
                    0
                  );
                  const payments = item.venture_payments.reduce(
                    (s, d) => s + (d.amount || 0),
                    0
                  );
                  return (
                    <React.Fragment key={type}>
                      <td className="px-4 py-3 text-right">
                        {format(deposits)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {format(payments)}
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
            );
          })}
        </tbody>

        <tfoot>
          <tr className="bg-green-100 font-bold text-gray-800">
            <td
              colSpan={
                1 + savings.length * 2 + loans.length * 4 + ventures.length * 2
              }
              className="px-4 py-3 text-left"
            >
              AS AT DECEMBER {year} CHART OF ACCOUNTS
            </td>
          </tr>

          <tr className="bg-green-100 font-bold text-gray-800">
            <td className="px-4 py-3">TOTAL SAVINGS</td>
            <td
              colSpan={
                savings.length * 2 + loans.length * 4 + ventures.length * 2
              }
              className="px-4 py-3 text-right"
            >
              {format(chart_of_accounts.total_savings)}
            </td>
          </tr>

          <tr className="bg-green-100 font-bold text-gray-800">
            <td className="px-4 py-3">TOTAL VENTURES</td>
            <td
              colSpan={
                savings.length * 2 + loans.length * 4 + ventures.length * 2
              }
              className="px-4 py-3 text-right"
            >
              {format(chart_of_accounts.total_ventures)}
            </td>
          </tr>

          <tr className="bg-green-100 font-bold text-gray-800">
            <td className="px-4 py-3">TOTAL LOANS</td>
            <td
              colSpan={
                savings.length * 2 + loans.length * 4 + ventures.length * 2
              }
              className="px-4 py-3 text-right"
            >
              {format(chart_of_accounts.total_loans)}
            </td>
          </tr>

          <tr className="bg-green-100 font-bold text-gray-800">
            <td className="px-4 py-3">TOTAL SAVINGS DEPOSITS</td>
            <td
              colSpan={
                savings.length * 2 + loans.length * 4 + ventures.length * 2
              }
              className="px-4 py-3 text-right"
            >
              {format(chart_of_accounts.total_savings_deposits)}
            </td>
          </tr>

          {/* Per-type savings */}
          {chart_of_accounts.total_savings_by_type?.map((t) => (
            <tr key={t.type} className="bg-green-100 font-bold text-gray-800">
              <td className="px-4 py-3">{t.type.toUpperCase()} SAVINGS</td>
              <td
                colSpan={
                  savings.length * 2 + loans.length * 4 + ventures.length * 2
                }
                className="px-4 py-3 text-right"
              >
                {format(t.amount)}
              </td>
            </tr>
          ))}

          {/* Per-type loan outstanding */}
          {chart_of_accounts.total_loans_by_type
            ?.filter((t) => t.total_outstanding_amount > 0)
            .map((t) => (
              <tr
                key={t.loan_type}
                className="bg-green-100 font-bold text-gray-800"
              >
                <td className="px-4 py-3">
                  {t.loan_type.toUpperCase()} OUTSTANDING
                </td>
                <td
                  colSpan={
                    savings.length * 2 + loans.length * 4 + ventures.length * 2
                  }
                  className="px-4 py-3 text-right"
                >
                  {format(t.total_outstanding_amount)}
                </td>
              </tr>
            ))}
        </tfoot>
      </table>
    </div>
  );
}

export default YearlySummaryTable;
