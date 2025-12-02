"use client";

import MemberLoadingSpinner from "@/components/general/MemberLoadingSpinner";
import { useFetchMember } from "@/hooks/members/actions";
import { useDownloadMemberYearlySummary, useFetchMemberYearlySummary } from "@/hooks/transactions/actions";
import SaccoStatement from "@/components/summary/Statement";
import DetailedSummaryTable from "@/components/summary/DetailedSummaryTable";
import { useState } from "react";
import { downloadMemberYearlySummary } from "@/services/transactions";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import useMemberNo from "@/hooks/authentication/useMemberNo";

function MemberDashboard() {
  const [showSummary, setShowSummary] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const token = useAxiosAuth()
  const memberNo = useMemberNo()
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

  const handleSummaryDownload = async () => {
    setDownloading(false);
    try {
      await downloadMemberYearlySummary(memberNo, token)
    } catch (error) {
      console.error(error)
    } finally {
      setDownloading(false)
    }
  };

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
              Hello, {member?.salutation} {member?.last_name} -{" "}
              {member?.member_no}
            </h1>
            <p className="text-gray-500 text-sm sm:text-base mt-1">
              Welcome to your dashboard
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={()=>setShowSummary(prev=>!prev)} className="px-4 py-2 rounded-md font-medium text-white transition bg-[#045e32] hover:bg-[#037a40]">{showSummary ? 'Hide':'View'} Summary</button>
            <button
              onClick={() => handleSummaryDownload()}
              disabled={downloading}
              className={`px-4 py-2 rounded-md font-medium text-white transition ${
                downloading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#045e32] hover:bg-[#037a40]"
              }`}
            >
              {downloading ? "Downloading…" : "Download Summary"}
            </button>
          </div>
        </div>

        {/* Statement */}
        {showSummary ? <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-[#045e32] mb-4">Summary</h2>
          <DetailedSummaryTable data={summary} member={member} />
        </div>
        :null
        }

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
