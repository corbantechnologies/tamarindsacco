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

import Link from "next/link";
import {
  Wallet,
  Wallet2,
  CreditCard,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  User,
  LayoutDashboard,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const InfoField = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors">
    <Icon className="h-5 w-5 text-[#045e32] mt-0.5" />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base font-semibold text-foreground truncate">
        {value || "N/A"}
      </p>
    </div>
  </div>
);

function MemberDashboard() {
  const [showSummary, setShowSummary] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const token = useAxiosAuth();
  const memberNo = useMemberNo();
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
      await downloadMemberYearlySummary(memberNo, token);
    } catch (error) {
      console.error(error);
    } finally {
      setDownloading(false);
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
        </div>

        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="inline-flex w-auto mb-8 bg-muted rounded-lg p-1">
            <TabsTrigger value="reports" className="flex items-center gap-2 px-6">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="accounts" className="flex items-center gap-2 px-6">
              <LayoutDashboard className="h-4 w-4" />
              Accounts
            </TabsTrigger>
            <TabsTrigger value="guarantor" className="flex items-center gap-2 px-6">
              <ShieldCheck className="h-4 w-4" />
              Guarantor Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            <div className="flex justify-end gap-2 mb-4">
              <button
                onClick={() => setShowSummary((prev) => !prev)}
                className="px-4 py-2 rounded-md font-medium text-white transition bg-[#045e32] hover:bg-[#037a40]"
              >
                {showSummary ? "Hide" : "View"} Summary
              </button>
              <button
                onClick={() => handleSummaryDownload()}
                disabled={downloading}
                className={`px-4 py-2 rounded-md font-medium text-white transition ${downloading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#045e32] hover:bg-[#037a40]"
                  }`}
              >
                {downloading ? "Downloading…" : "Download Summary"}
              </button>
            </div>

            {/* Statement */}
            {showSummary ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-[#045e32] mb-4">
                  Summary
                </h2>
                <DetailedSummaryTable data={summary} member={member} />
              </div>
            ) : null}

            {/* Statement */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-[#045e32] mb-4">
                Statement
              </h2>
              <SaccoStatement summaryData={summary} member={member} />
            </div>
          </TabsContent>

          <TabsContent value="accounts">
            <div className="grid md:grid-cols-2 gap-8 mt-6">
              {/* Savings Accounts */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Wallet className="h-6 w-6 text-[#045e32]" />
                    Savings Accounts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {member?.savings_accounts?.length > 0 ? (
                    <>
                      {member?.savings_accounts.map((account) => (
                        <Link
                          href={`/member/savings/${account?.identity}`}
                          key={account?.reference}
                          className="block transition-transform hover:scale-[1.01]"
                        >
                          <InfoField
                            icon={Wallet2}
                            label={`${account?.account_type} - ${account?.account_number}`}
                            value={`${account?.balance} ${account?.currency || "KES"
                              }`}
                          />
                        </Link>
                      ))}
                    </>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No savings accounts found.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Loan Accounts */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Wallet className="h-6 w-6 text-[#045e32]" />
                    Loan Accounts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {member?.loans?.length > 0 ? (
                    <>
                      {member?.loans.map((account) => (
                        <Link
                          href={`/member/loans/${account?.identity}`}
                          key={account?.reference}
                          className="block transition-transform hover:scale-[1.01]"
                        >
                          <InfoField
                            icon={CreditCard}
                            label={`${account?.loan_type} - ${account?.account_number}`}
                            value={`${account?.outstanding_balance} ${account?.currency || "KES"
                              }`}
                          />
                        </Link>
                      ))}
                    </>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No loan accounts found.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Venture Accounts */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <TrendingUp className="h-6 w-6 text-[#045e32]" />
                    Venture Accounts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {member?.venture_accounts?.length > 0 ? (
                    <>
                      {member?.venture_accounts.map((account) => (
                        <Link
                          href={`/member/ventures/${account?.identity}`}
                          key={account?.reference}
                          className="block transition-transform hover:scale-[1.01]"
                        >
                          <InfoField
                            icon={TrendingUp}
                            label={`${account?.venture_type} - ${account?.account_number}`}
                            value={`${account?.balance} ${account?.currency || "KES"
                              }`}
                          />
                        </Link>
                      ))}
                    </>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No venture accounts found.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Guarantor Profile */}
              {member?.guarantor_profile && (
                <Link
                  href="/member/guarantor-profile"
                  className="block transition-transform hover:scale-[1.01]"
                >
                  <Card className="shadow-md h-full hover:border-[#045e32]/50 transition-colors">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        <ShieldCheck className="h-6 w-6 text-[#045e32]" />
                        Guarantor Profile
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                      <InfoField
                        icon={ShieldCheck}
                        label="Limit Status"
                        value={
                          member.guarantor_profile.has_reached_limit
                            ? "Limit Reached"
                            : "Active"
                        }
                      />
                      <InfoField
                        icon={Wallet}
                        label="Max Guarantee Limit"
                        value={`${member.guarantor_profile.max_guarantee_amount} KES`}
                      />
                      <InfoField
                        icon={CheckCircle}
                        label="Available Limit"
                        value={`${member.guarantor_profile.available_amount} KES`}
                      />
                      <InfoField
                        icon={User}
                        label="Active Guarantees"
                        value={`${member.guarantor_profile.active_guarantees_count} / ${member.guarantor_profile.max_active_guarantees}`}
                      />
                    </CardContent>
                  </Card>
                </Link>
              )}
            </div>
          </TabsContent>

          <TabsContent value="guarantor">
            <div className="mt-6">
              {member?.guarantor_profile ? (
                <Link
                  href="/member/guarantor-profile"
                  className="block transition-transform hover:scale-[1.01]"
                >
                  <Card className="shadow-md hover:border-[#045e32]/50 transition-colors">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        <ShieldCheck className="h-6 w-6 text-[#045e32]" />
                        Guarantor Profile
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                      <InfoField
                        icon={ShieldCheck}
                        label="Limit Status"
                        value={
                          member.guarantor_profile.has_reached_limit
                            ? "Limit Reached"
                            : "Active"
                        }
                      />
                      <InfoField
                        icon={Wallet}
                        label="Max Guarantee Limit"
                        value={`${member.guarantor_profile.max_guarantee_amount} KES`}
                      />
                      <InfoField
                        icon={CheckCircle}
                        label="Available Limit"
                        value={`${member.guarantor_profile.available_amount} KES`}
                      />
                      <InfoField
                        icon={User}
                        label="Active Guarantees"
                        value={`${member.guarantor_profile.active_guarantees_count} / ${member.guarantor_profile.max_active_guarantees}`}
                      />
                    </CardContent>
                  </Card>
                </Link>
              ) : (
                <Card className="shadow-md">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <ShieldCheck className="h-16 w-16 text-gray-300 mb-4" />
                    <p className="text-xl font-medium text-gray-900">
                      No Guarantor Profile
                    </p>
                    <p className="text-muted-foreground">
                      This member does not have an active guarantor profile.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default MemberDashboard;
