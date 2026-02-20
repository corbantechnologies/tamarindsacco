import React from "react";

const SaccoStatement = ({ summaryData, member }) => {
  const summary = summaryData?.monthly_summary || [];
  const bFSummary = summaryData?.monthly_summary?.[0] || {};
  const currentYear = summaryData?.year || new Date().getFullYear();
  const previousYear = currentYear - 1;

  // Helper to safely access nested properties and find by type
  const getAmount = (monthData, section, typePattern, field) => {
    if (!monthData || !monthData[section]) return 0;

    // Handle Guarantees (no 'by_type' array)
    if (section === 'guarantees') {
      if (field === 'active_balance') {
        return monthData.guarantees?.transactions?.reduce((sum, t) => sum + (Number(t.current_balance) || 0), 0) || 0;
      }
      return monthData.guarantees?.[field] || 0;
    }

    const list = monthData[section]?.by_type || [];

    // Sum of all types identifying as LOAN but NOT Instant Loan
    if (typePattern === 'NOT_INSTANT_LOAN') {
      return list.reduce((sum, item) => {
        if (!item.loan_type?.match(/Instant Loan/i)) {
          return sum + (Number(item[field]) || 0);
        }
        return sum;
      }, 0);
    }

    const item = list.find(i => {
      const typeName = i.type || i.loan_type || i.venture_type || "";
      return typeName.match(typePattern);
    });

    return item ? (Number(item[field]) || 0) : 0;
  };

  const format = (val) => Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="bg-white text-sm">
      <h1 className="text-2xl font-bold text-center mb-4 uppercase">
        Tamarind Sacco Ltd
      </h1>
      <h2 className="text-center font-semibold mb-6">
        Member&apos;s Statement
      </h2>

      <div className="flex justify-between mb-4 text-sm">
        <div>
          <p>
            <strong>Member&apos;s Name:</strong> {member?.first_name} {member?.last_name}
          </p>
          <p>
            <strong>Account No:</strong> {member?.member_no}
          </p>
        </div>
        <div>
          <p>
            <strong>Employer:</strong> Tamarind Sacco Ltd
          </p>
        </div>
      </div>
      {/* === Table === */}
      <div className="overflow-x-auto">

        <table className="w-full border border-gray-400 text-xs text-[10px]">
          <thead className="bg-gray-100 text-center">
            <tr>
              <th rowSpan={2} className="border border-gray-400 px-2 py-1">DATE</th>
              <th colSpan={1} className="border border-gray-400 px-2 py-1">SHARES</th>
              <th colSpan={3} className="border border-gray-400 px-2 py-1">DEPOSITS</th>
              <th colSpan={4} className="border border-gray-400 px-2 py-1">LOANS</th>
              <th colSpan={4} className="border border-gray-400 px-2 py-1">INSTANT LOANS</th>
              <th colSpan={4} className="border border-gray-400 px-2 py-1">OTHER DEDUCTIONS</th>
            </tr>
            <tr>
              {/* Shares */}
              <th className="border border-gray-400 px-2 py-1">Balance</th>

              {/* Deposits */}
              <th className="border border-gray-400 px-2 py-1">RECEIVED</th>
              <th className="border border-gray-400 px-2 py-1">W/DRAW</th>
              <th className="border border-gray-400 px-2 py-1">BALANCE</th>

              {/* Loans */}
              <th className="border border-gray-400 px-2 py-1">LOANED</th>
              <th className="border border-gray-400 px-2 py-1">REPAID</th>
              <th className="border border-gray-400 px-2 py-1">BALANCE</th>
              <th className="border border-gray-400 px-2 py-1">INTEREST</th>

              {/* Instant Loans */}
              <th className="border border-gray-400 px-2 py-1">LOANED</th>
              <th className="border border-gray-400 px-2 py-1">REPAID</th>
              <th className="border border-gray-400 px-2 py-1">BALANCE</th>
              <th className="border border-gray-400 px-2 py-1">INTEREST</th>

              {/* Other deductions */}
              <th className="border border-gray-400 px-2 py-1">HOLIDAY SAVINGS</th>
              <th className="border border-gray-400 px-2 py-1">GUARANTEE AMOUNT</th>
              <th className="border border-gray-400 px-2 py-1">SODA</th>
              <th className="border border-gray-400 px-2 py-1">TOTAL DEDUCTIONS</th>
            </tr>
          </thead>

          <tbody className="text-center">
            <tr>
              {Array.from({ length: 17 }).map((_, index) => (
                <td key={index} className="border border-gray-300">&nbsp;</td>
              ))}
            </tr>
            {/* BF */}
            <tr className="hover:bg-gray-50 bg-gray-50/50">
              <td className="border border-gray-300 px-1 py-1 font-medium text-left">{previousYear} - BF</td>
              {/* shares */}
              <td className="border border-gray-300 px-1 py-1 text-right">
                {format(getAmount(bFSummary, 'savings', /Share Capital/i, 'balance_brought_forward'))}
              </td>
              {/* deposits */}
              <td className="border border-gray-300 px-1 py-1 text-right"></td>
              <td className="border border-gray-300 px-1 py-1 text-right"></td>
              <td className="border border-gray-300 px-1 py-1 text-right">
                {format(getAmount(bFSummary, 'savings', /Member Contribution/i, 'balance_brought_forward'))}
              </td>
              {/* loans */}
              <td className="border border-gray-300 px-1 py-1 text-right"></td>
              <td className="border border-gray-300 px-1 py-1 text-right"></td>
              <td className="border border-gray-300 px-1 py-1 text-right">
                {format(getAmount(bFSummary, 'loans', 'NOT_INSTANT_LOAN', 'balance_brought_forward'))}
              </td>
              <td className="border border-gray-300 px-1 py-1 text-right"></td>
              {/* instant loans */}
              <td className="border border-gray-300 px-1 py-1 text-right"></td>
              <td className="border border-gray-300 px-1 py-1 text-right"></td>
              <td className="border border-gray-300 px-1 py-1 text-right">
                {format(getAmount(bFSummary, 'loans', /Instant Loan/i, 'balance_brought_forward'))}
              </td>
              <td className="border border-gray-300 px-1 py-1 text-right"></td>
              {/* other deductions */}
              <td className="border border-gray-300 px-1 py-1 text-right">
                {format(getAmount(bFSummary, 'savings', /Holiday/i, 'balance_brought_forward'))}
              </td>
              <td className="border border-gray-300 px-1 py-1 text-right">0.00</td>
              <td className="border border-gray-300 px-1 py-1 text-right">
                {format(getAmount(bFSummary, 'ventures', /Sodas/i, 'balance_brought_forward'))}
              </td>
              {/* total deductions */}
              <td className="border border-gray-300 px-1 py-1 font-semibold text-blue-600 text-right"></td>
            </tr>
            <tr>
              {Array.from({ length: 17 }).map((_, index) => (
                <td key={index} className="border border-gray-300">&nbsp;</td>
              ))}
            </tr>

            {summary?.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-1 py-1 text-left">{r?.month?.split(' ')?.[0] || '-'}</td>

                {/* shares */}
                <td className="border border-gray-300 px-1 py-1 text-right">{format(getAmount(r, 'savings', /Share Capital/i, 'balance_carried_forward'))}</td>

                {/* deposits */}
                <td className="border border-gray-300 px-1 py-1 text-right">{format(getAmount(r, 'savings', /Member Contribution/i, 'total_deposits'))}</td>
                <td className="border border-gray-300 px-1 py-1 text-right">0.00</td>
                <td className="border border-gray-300 px-1 py-1 text-right">{format(getAmount(r, 'savings', /Member Contribution/i, 'balance_carried_forward'))}</td>

                {/* loans (Not Instant) */}
                <td className="border border-gray-300 px-1 py-1 text-right">{format(getAmount(r, 'loans', 'NOT_INSTANT_LOAN', 'total_amount_disbursed'))}</td>
                <td className="border border-gray-300 px-1 py-1 text-right">{format(getAmount(r, 'loans', 'NOT_INSTANT_LOAN', 'total_amount_repaid'))}</td>
                <td className="border border-gray-300 px-1 py-1 text-right">{format(getAmount(r, 'loans', 'NOT_INSTANT_LOAN', 'total_amount_outstanding'))}</td>
                <td className="border border-gray-300 px-1 py-1 text-right">{format(getAmount(r, 'loans', 'NOT_INSTANT_LOAN', 'total_interest_charged'))}</td>

                {/* instant loans */}
                <td className="border border-gray-300 px-1 py-1 text-right">{format(getAmount(r, 'loans', /Instant Loan/i, 'total_amount_disbursed'))}</td>
                <td className="border border-gray-300 px-1 py-1 text-right">{format(getAmount(r, 'loans', /Instant Loan/i, 'total_amount_repaid'))}</td>
                <td className="border border-gray-300 px-1 py-1 text-right">{format(getAmount(r, 'loans', /Instant Loan/i, 'total_amount_outstanding'))}</td>
                <td className="border border-gray-300 px-1 py-1 text-right">{format(getAmount(r, 'loans', /Instant Loan/i, 'total_interest_charged'))}</td>

                {/* other deductions */}
                <td className="border border-gray-300 px-1 py-1 text-right">{format(getAmount(r, 'savings', /Holiday/i, 'total_deposits'))}</td>
                <td className="border border-gray-300 px-1 py-1 text-right">{format(getAmount(r, 'guarantees', null, 'active_balance'))}</td>
                <td className="border border-gray-300 px-1 py-1 text-right">{format(getAmount(r, 'ventures', /Sodas/i, 'balance_carried_forward'))}</td>

                {/* total deductions */}
                <td className="border border-gray-300 px-1 py-1 font-semibold text-blue-600 text-right">
                  {format(
                    getAmount(r, 'savings', /Holiday/i, 'total_deposits') +
                    getAmount(r, 'guarantees', null, 'active_balance') +
                    getAmount(r, 'ventures', /Sodas/i, 'balance_carried_forward')
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default SaccoStatement;
