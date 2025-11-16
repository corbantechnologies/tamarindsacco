"use client";

import MemberLoadingSpinner from "@/components/general/MemberLoadingSpinner";
import InfoCard from "@/components/member/InfoCard";
import { useFetchMember } from "@/hooks/members/actions";
import { useFetchMemberYearlySummary } from "@/hooks/transactions/actions";
import DetailedSummaryTable from "@/components/summary/DetailedSummaryTable";
import SaccoStatement from "@/components/summary/Statement";

function MemberDashboard() {
  const {
    isLoading: isLoadingMember,
    data: member,
    refetch: refetchMember,
  } = useFetchMember();

  const {
    isLoading: isLoadingSummary,
    data: summary,
    refetch: refetchSummary,
  } = useFetchMemberYearlySummary();

  if (isLoadingMember || isLoadingSummary) {
    return <MemberLoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="px-2 py-2 sm:p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#045e32]">
              Hello, {member?.salutation} {member?.last_name} - {member?.member_no}
            </h1>
            <p className="text-gray-500 text-sm sm:text-base mt-1">
              Welcome to your dashboard
            </p>
          </div>
        </div>

        {/* Statement */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-[#045e32] mb-4">Statement</h2>
          <SaccoStatement summaryData={summary} member={member} />
        </div>
      </div>
    </div>
  );
}

export default MemberDashboard;
