"use client";

import MemberLoadingSpinner from "@/components/general/MemberLoadingSpinner";
import { useFetchMember } from "@/hooks/members/actions";
import { useFetchMemberYearlySummary } from "@/hooks/transactions/actions";
import SaccoStatement from "@/components/summary/Statement";
import DetailedSummaryTable from "@/components/summary/DetailedSummaryTable";
import { useState, useMemo } from "react";
import { downloadMemberYearlySummary } from "@/services/transactions";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import useMemberNo from "@/hooks/authentication/useMemberNo";

import Link from "next/link";
import {
  Wallet,
  CreditCard,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  User,
  LayoutDashboard,
  FileText,
  Download,
  ChevronRight,
  Eye,
  EyeOff,
  PiggyBank,
  Banknote,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// --- Components ---

const StatCard = ({ title, value, icon: Icon, colorClass, borderClass }) => (
  <Card className={`shadow-sm border-l-4 ${borderClass} hover:shadow-md transition-all duration-200`}>
    <CardContent className="p-5 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
      </div>
      <div className={`p-2 rounded-full ${colorClass} bg-opacity-10`}>
        <Icon className={`h-5 w-5 ${colorClass.replace("bg-", "text-")}`} />
      </div>
    </CardContent>
  </Card>
);

const AccountListItem = ({ href, title, subtitle, amount, icon: Icon }) => (
  <Link href={href} className="group block">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-transparent hover:border-gray-200 hover:bg-white hover:shadow-sm transition-all duration-200 bg-gray-50/50 gap-4 sm:gap-0">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors truncate">{title}</h4>
          <p className="text-sm text-gray-500 truncate">{subtitle}</p>
        </div>
      </div>
      <div className="text-left sm:text-right pl-14 sm:pl-0">
        <p className="font-bold text-gray-900">{amount}</p>
        <div className="flex items-center sm:justify-end text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          View Details <ChevronRight className="h-3 w-3 ml-1" />
        </div>
      </div>
    </div>
  </Link>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-medium text-gray-900">{value}</span>
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
  } = useFetchMember();

  const {
    isLoading: isLoadingSummary,
    data: summary,
  } = useFetchMemberYearlySummary();

  const handleSummaryDownload = async () => {
    setDownloading(true);
    try {
      await downloadMemberYearlySummary(memberNo, token);
    } catch (error) {
      console.error(error);
    } finally {
      setDownloading(false);
    }
  };

  // --- Derived Stats ---
  const totals = useMemo(() => {
    if (!member) return { savings: 0, loans: 0, shares: 0 };

    // Helper to sum
    const sum = (arr, field) => (arr || []).reduce((acc, curr) => acc + (Number(curr[field]) || 0), 0);

    // Find Share Capital specifically if possible, else just sum all savings
    // Assuming 'savings_accounts' contains shares too, or we just sum total savings
    const totalSavings = sum(member.savings_accounts, 'balance');
    const totalLoans = sum(member.loans, 'outstanding_balance');
    const totalVentures = sum(member.venture_accounts, 'balance');

    return { totalSavings, totalLoans, totalVentures };
  }, [member]);

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(val || 0);

  if (isLoadingMember || isLoadingSummary) {
    return <MemberLoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      {/* Top Decoration */}
      <div className="h-32 w-full absolute top-0 left-0 z-0 bg-gradient-to-r from-[#045e32] to-[#067d43]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-white">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {member?.first_name}
            </h1>
            <p className="text-[#e0e7ff] mt-1 text-lg">
              Member No: <span className="font-mono font-medium opacity-90">{member?.member_no}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-white border-white/30 bg-white/10 backdrop-blur-sm px-3 py-1">
              Active Member
            </Badge>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Savings"
            value={formatCurrency(totals.totalSavings)}
            icon={PiggyBank}
            colorClass="text-emerald-600 bg-emerald-600"
            borderClass="border-emerald-600"
          />
          <StatCard
            title="Outstanding Loans"
            value={formatCurrency(totals.totalLoans)}
            icon={CreditCard}
            colorClass="text-amber-600 bg-amber-600"
            borderClass="border-amber-600"
          />
          <StatCard
            title="Venture Balance"
            value={formatCurrency(totals.totalVentures)}
            icon={TrendingUp}
            colorClass="text-blue-600 bg-blue-600"
            borderClass="border-blue-600"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="reports" className="w-full space-y-6">
          <div className="sticky top-0 z-20 bg-gray-50/50 backdrop-blur-sm pt-2 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className="bg-white border shadow-sm p-1 rounded-xl w-full sm:w-auto grid grid-cols-3 sm:inline-flex h-auto">
              <TabsTrigger value="reports" className="rounded-lg px-2 sm:px-6 py-2.5 text-xs sm:text-sm data-[state=active]:bg-[#045e32] data-[state=active]:text-white">
                <FileText className="h-4 w-4 mr-2" /> <span className="hidden sm:inline">Reports</span><span className="sm:hidden">Reports</span>
              </TabsTrigger>
              <TabsTrigger value="accounts" className="rounded-lg px-2 sm:px-6 py-2.5 text-xs sm:text-sm data-[state=active]:bg-[#045e32] data-[state=active]:text-white">
                <LayoutDashboard className="h-4 w-4 mr-2" /> <span className="hidden sm:inline">Accounts</span><span className="sm:hidden">Accts</span>
              </TabsTrigger>
              <TabsTrigger value="guarantor" className="rounded-lg px-2 sm:px-6 py-2.5 text-xs sm:text-sm data-[state=active]:bg-[#045e32] data-[state=active]:text-white">
                <ShieldCheck className="h-4 w-4 mr-2" /> <span className="hidden sm:inline">Guarantor Profile</span><span className="sm:hidden">Guarantor</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* REPORTS TAB */}
          <TabsContent value="reports" className="space-y-6 animate-in fade-in-50 duration-300">
            <Card className="border-none shadow-md overflow-hidden">
              <div className="bg-white p-6 border-b flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Financial Reports</h2>
                  <p className="text-muted-foreground text-sm">View your statement summary and detailed transaction history.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={() => setShowSummary(prev => !prev)}
                    className="border-[#045e32] text-[#045e32] hover:bg-[#045e32] hover:text-white w-full sm:w-auto justify-center"
                  >
                    {showSummary ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                    {showSummary ? "Hide" : "View"} Summary
                  </Button>
                  <Button
                    onClick={() => {
                      import('@/lib/pdfGenerator').then(mod => {
                        mod.generateStatementPDF(summary, member);
                      });
                    }}
                    className="bg-[#045e32] hover:bg-[#037a40] text-white w-full sm:w-auto justify-center"
                  >
                    <Download className="h-4 w-4 mr-2" /> Download PDF
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50/50 p-6">
                {showSummary && (
                  <div className="mb-8 bg-white rounded-xl shadow-sm border p-6 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="h-5 w-5 text-[#045e32]" />
                      <h3 className="font-bold text-lg text-gray-900">Monthly breakdown</h3>
                    </div>
                    <DetailedSummaryTable data={summary} member={member} />
                  </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Banknote className="h-5 w-5 text-[#045e32]" />
                    <h3 className="font-bold text-lg text-gray-900">Detailed Statement</h3>
                  </div>
                  <SaccoStatement summaryData={summary} member={member} />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* ACCOUNTS TAB */}
          <TabsContent value="accounts" className="animate-in fade-in-50 duration-300">
            <div className="grid md:grid-cols-2 gap-6">

              {/* Savings */}
              <Card className="shadow-md border-none">
                <CardHeader className="border-b bg-white rounded-t-xl pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Wallet className="h-6 w-6 text-emerald-700" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Savings Accounts</CardTitle>
                      <CardDescription>Your active savings and deposits</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-3 bg-gray-50/30 min-h-[200px]">
                  {member?.savings_accounts?.length > 0 ? (
                    member.savings_accounts.map(account => (
                      <AccountListItem
                        key={account.identity}
                        href={`/member/savings/${account.identity}`}
                        title={account.account_type}
                        subtitle={account.account_number}
                        amount={`${account.currency || 'KES'} ${account.balance?.toLocaleString()}`}
                        icon={PiggyBank}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
                      <PiggyBank className="h-12 w-12 opacity-20 mb-2" />
                      <p>No savings accounts found</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Loans */}
              <Card className="shadow-md border-none">
                <CardHeader className="border-b bg-white rounded-t-xl pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <CreditCard className="h-6 w-6 text-amber-700" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Loan Accounts</CardTitle>
                      <CardDescription>Active loans and repayment status</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-3 bg-gray-50/30 min-h-[200px]">
                  {member?.loans?.length > 0 ? (
                    member.loans.map(account => (
                      <AccountListItem
                        key={account.identity}
                        href={`/member/loans/${account.identity}`}
                        title={account.loan_type}
                        subtitle={account.account_number}
                        amount={`${account.currency || 'KES'} ${account.outstanding_balance?.toLocaleString()}`}
                        icon={CreditCard}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
                      <CheckCircle className="h-12 w-12 opacity-20 mb-2" />
                      <p>No active loans</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Ventures */}
              <Card className="shadow-md border-none md:col-span-2">
                <CardHeader className="border-b bg-white rounded-t-xl pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-blue-700" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Venture Accounts</CardTitle>
                      <CardDescription>Investments and other ventures</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 grid md:grid-cols-2 gap-4 bg-gray-50/30">
                  {member?.venture_accounts?.length > 0 ? (
                    member.venture_accounts.map(account => (
                      <AccountListItem
                        key={account.identity}
                        href={`/member/ventures/${account.identity}`}
                        title={account.venture_type}
                        subtitle={account.account_number}
                        amount={`${account.currency || 'KES'} ${account.balance?.toLocaleString()}`}
                        icon={TrendingUp}
                      />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8 text-muted-foreground flex flex-col items-center">
                      <TrendingUp className="h-12 w-12 opacity-20 mb-2" />
                      <p>No venture accounts found</p>
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>
          </TabsContent>

          {/* GUARANTOR TAB */}
          <TabsContent value="guarantor" className="animate-in fade-in-50 duration-300">
            {member?.guarantor_profile ? (
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 shadow-md border-none h-fit">
                  <CardHeader className="bg-[#045e32] text-white rounded-t-xl p-6">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="p-3 bg-white/20 rounded-full">
                        <ShieldCheck className="h-10 w-10 text-white" />
                      </div>
                      <CardTitle>Guarantor Status</CardTitle>
                      <Badge className={member.guarantor_profile.has_reached_limit ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"}>
                        {member.guarantor_profile.has_reached_limit ? "Limit Reached" : "Active & Eligible"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <Button asChild className="w-full" variant="outline">
                      <Link href="/member/guarantor-profile">View Full Profile</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2 shadow-md border-none">
                  <CardHeader className="border-b">
                    <CardTitle>Limit Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      <div className="p-4 flex justify-between items-center hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <Wallet className="h-5 w-5" />
                          </div>
                          <span className="font-medium text-gray-700">Max Guarantee Limit</span>
                        </div>
                        <span className="font-bold text-gray-900">{formatCurrency(member.guarantor_profile.max_guarantee_amount)}</span>
                      </div>

                      <div className="p-4 flex justify-between items-center hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                            <CheckCircle className="h-5 w-5" />
                          </div>
                          <span className="font-medium text-gray-700">Available Limit</span>
                        </div>
                        <span className="font-bold text-emerald-600">{formatCurrency(member.guarantor_profile.available_amount)}</span>
                      </div>

                      <div className="p-4 flex justify-between items-center hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                            <User className="h-5 w-5" />
                          </div>
                          <span className="font-medium text-gray-700">Active Guarantees</span>
                        </div>
                        <span className="font-bold text-gray-900">{member.guarantor_profile.active_guarantees_count} <span className="text-gray-400 font-normal">/ {member.guarantor_profile.max_active_guarantees}</span></span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="shadow-sm border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="p-4 bg-gray-100 rounded-full mb-4">
                    <ShieldCheck className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Guarantor Profile</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    You currently do not have an active guarantor profile associated with your account.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}

export default MemberDashboard;
