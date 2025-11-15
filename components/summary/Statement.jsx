

const SaccoStatement = ({summaryData, member}) => {
  const summary = summaryData?.monthly_summary
  const bFSummary = summaryData?.monthly_summary[0]
  const loans = bFSummary?.loans?.by_type
  const totalLoans = loans?.reduce((sum, item) => {
    return item.loan_type === "Instant Loan"
      ? sum
      : sum + item.balance_brought_forward;
  }, 0);
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-md text-sm">
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

      <table className="w-full border border-gray-400 text-xs">
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
          <tr className="hover:bg-gray-50">
              <td className="border border-gray-300 px-1 py-1">2024 - BF</td>
              {/* shares */}
              <td className="border border-gray-300 px-1 py-1">{bFSummary?.savings?.by_type?.find(item => item.type === "Capital Share").balance_brought_forward}</td>
              {/* deposits */}
              <td className="border border-gray-300 px-1 py-1"></td>
              <td className="border border-gray-300 px-1 py-1"></td>
              <td className="border border-gray-300 px-1 py-1">{bFSummary?.savings?.by_type?.find(item => item.type === "Member Contributions").balance_brought_forward}</td>
              {/* loans */}
              <td className="border border-gray-300 px-1 py-1"></td>
              <td className="border border-gray-300 px-1 py-1"></td>
              <td className="border border-gray-300 px-1 py-1">{totalLoans}</td>
              <td className="border border-gray-300 px-1 py-1"></td>
              {/* instant loans */}
              <td className="border border-gray-300 px-1 py-1"></td>
              <td className="border border-gray-300 px-1 py-1"></td>
              <td className="border border-gray-300 px-1 py-1">{bFSummary?.loans?.by_type?.find(item => item.loan_type === "Instant Loan").balance_brought_forward}</td>
              <td className="border border-gray-300 px-1 py-1"></td>
              {/* other deductions */}
              <td className="border border-gray-300 px-1 py-1">{bFSummary?.savings?.by_type?.find(item => item.type === "Holiday Savings").balance_brought_forward}</td>
              <td className="border border-gray-300 px-1 py-1"></td>
              <td className="border border-gray-300 px-1 py-1">{bFSummary?.ventures?.by_type?.find(item => item.venture_type === "Sodas").balance_brought_forward}</td>
              {/* total deductions */}
              <td className="border border-gray-300 px-1 py-1 font-semibold text-blue-600"></td>
            </tr>
            <tr>
            {Array.from({ length: 17 }).map((_, index) => (
              <td key={index} className="border border-gray-300">&nbsp;</td>
            ))}
            </tr>
          {/* Example data rows (you can map through a real dataset later) */}
          {summary?.map((r, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-1 py-1">{r.month.split(' ')[0]}</td>
              {/* shares */}
              <td className="border border-gray-300 px-1 py-1">{r.savings.by_type[2].total_deposits}</td>
              {/* deposits */}
              <td className="border border-gray-300 px-1 py-1">{r.savings.by_type[1].total_deposits}</td>
              <td className="border border-gray-300 px-1 py-1">-</td>
              <td className="border border-gray-300 px-1 py-1">{r.savings.by_type[1].amount}</td>
              {/* loans */}
              <td className="border border-gray-300 px-1 py-1">{r.loans.total_loans_disbursed}</td>
              <td className="border border-gray-300 px-1 py-1">{r.loans.total_loans_repaid}</td>
              <td className="border border-gray-300 px-1 py-1">{r.loans.total_loans_outstanding}</td>
              <td className="border border-gray-300 px-1 py-1">{r.loans.total_interest_charged}</td>
              {/* instant loans */}
              <td className="border border-gray-300 px-1 py-1">{r.loans.by_type[2].total_amount_disbursed}</td>
              <td className="border border-gray-300 px-1 py-1">{r.loans.by_type[2].total_amount_repaid}</td>
              <td className="border border-gray-300 px-1 py-1">{r.loans.by_type[2].total_amount_outstanding}</td>
              <td className="border border-gray-300 px-1 py-1">{r.loans.by_type[2].total_interest_charged}</td>
              {/* other deductions */}
              <td className="border border-gray-300 px-1 py-1">{r.savings.by_type[0].total_deposits}</td>
              <td className="border border-gray-300 px-1 py-1">-</td>
              <td className="border border-gray-300 px-1 py-1">{r.ventures.venture_balance}</td>
              {/* total deductions */}
              <td className="border border-gray-300 px-1 py-1 font-semibold text-blue-600">-</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

    </div>
  );
};

export default SaccoStatement;
