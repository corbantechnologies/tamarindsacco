"use client";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchMemberDetail } from "@/hooks/members/actions";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  CheckCircle,
  Clock,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building,
  CreditCard,
  Shield,
  Settings,
  Wallet,
  Wallet2,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { apiActions } from "@/tools/axios";
import CreateDepositAdmin from "@/forms/savingsdepostis/CreateDepositAdmin";
import CreateLoanAccountAdmin from "@/forms/loans/CreateLoanAdmin";
import CreateVentureDeposits from "@/forms/venturedeposits/CreateVentureDeposits";
import CreateVenturePayment from "@/forms/venturepayments/CreateVenturePayment";
import { useFetchLoanTypes } from "@/hooks/loantypes/actions";

function MemberDetail() {
  const { member_no } = useParams();
  const token = useAxiosAuth();
  const {
    isLoading: isLoadingMember,
    data: member,
    error,
    refetch: refetchMember,
  } = useFetchMemberDetail(member_no);

  const {
    isLoading: isLoadingLoanTypes,
    data: loanTypes,
    refetch: refetchLoanTypes,
  } = useFetchLoanTypes();

  // states
  const [isApproving, setIsApproving] = useState(false);
  const [depositModal, setDepositModal] = useState(false);
  const [loanModal, setLoanModal] = useState(false);
  const [ventureDepositModal, setVentureDepositModal] = useState(false);
  const [venturePaymentModal, setVenturePaymentModal] = useState(false);

  const handleApprove = async () => {
    try {
      setIsApproving(true);
      await apiActions?.patch(
        `/api/v1/auth/approve-member/${member_no}/`,
        {},
        token
      );
      toast.success("Member approved successfully");
      refetchMember();
    } catch (error) {
      toast.error("Failed to approve member. Please try again");
    } finally {
      setIsApproving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const InfoField = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors">
      <Icon className="h-5 w-5 text-primary mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-base font-semibold text-foreground truncate">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );

  const roles = [
    { key: "is_staff", label: "Staff", active: member?.is_staff },
    { key: "is_member", label: "Member", active: member?.is_member },
    { key: "is_superuser", label: "Superuser", active: member?.is_superuser },
    {
      key: "is_system_admin",
      label: "System Admin",
      active: member?.is_system_admin,
    },
  ].filter((role) => role?.active);

  if (isLoadingMember) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/sacco-admin/dashboard">
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/sacco-admin/members">
                <BreadcrumbPage>Members</BreadcrumbPage>
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">
                <BreadcrumbPage>
                  {member?.first_name} {member?.last_name}
                </BreadcrumbPage>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {/* Header Card */}
        <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {getInitials(member?.first_name, member?.last_name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-4xl font-bold text-foreground mb-2">
                    {member?.salutation} {member?.first_name}{" "}
                    {member?.last_name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4" />
                      Member #{member?.member_no}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {formatDate(member?.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Badge
                    variant={member?.is_approved ? "default" : "secondary"}
                    className={`${
                      member?.is_approved
                        ? "bg-success text-success-foreground hover:bg-success/90"
                        : "bg-warning text-warning-foreground hover:bg-warning/90"
                    } px-3 py-1 text-sm font-semibold`}
                  >
                    {member?.is_approved ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <Clock className="h-4 w-4 mr-1" />
                    )}
                    {member?.is_approved ? "Approved" : "Pending Approval"}
                  </Badge>

                  <Badge
                    variant={member?.is_active ? "default" : "secondary"}
                    className={`${
                      member?.is_active
                        ? "bg-success text-success-foreground hover:bg-success/90"
                        : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    } px-3 py-1 text-sm font-semibold`}
                  >
                    {member?.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              {!member?.is_approved && (
                <Button
                  onClick={() => handleApprove()}
                  disabled={isApproving}
                  size="sm"
                  className="bg-primary hover:bg-[#022007] text-white px-8"
                >
                  {isApproving ? "Approving..." : "Approve Member"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Key Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="flex flex-col h-full">
            {/* Savings Accounts */}
            <Card className="shadow-md flex flex-col h-full">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Wallet className="h-6 w-6 text-primary" />
                    Savings Accounts
                  </CardTitle>
                  {member?.is_approved && (
                    <Button
                      onClick={() => setDepositModal(true)}
                      size="sm"
                      className="bg-primary hover:bg-[#022007] text-white mt-4"
                    >
                      Deposit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                {member?.savings_accounts?.length > 0 ? (
                  <>
                    {member?.savings_accounts.map((account) => (
                      <div key={account?.reference} className="space-y-2">
                        <InfoField
                          icon={Wallet2}
                          label={`${account?.account_type} - ${account?.account_number}`}
                          value={`${account?.balance} ${
                            account?.currency || "KES"
                          }`}
                        />
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No savings accounts found.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col h-full">
            {/* Venture Accounts */}
            <Card className="shadow-md flex flex-col h-full">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Wallet className="h-6 w-6 text-primary" />
                    Venture Accounts
                  </CardTitle>
                  {member?.is_approved && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setVentureDepositModal(true)}
                        size="sm"
                        className="bg-primary hover:bg-[#022007] text-white mt-4"
                      >
                        Deposit
                      </Button>
                      <Button
                        onClick={() => setVenturePaymentModal(true)}
                        size="sm"
                        className="bg-[#cc5500] hover:bg-[#e66b00] text-white mt-4"
                      >
                        Pay
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                {member?.venture_accounts?.length > 0 ? (
                  <>
                    {member?.venture_accounts.map((account) => (
                      <div key={account?.reference} className="space-y-2">
                        <InfoField
                          icon={Wallet2}
                          label={`${account?.venture_type} - ${account?.account_number}`}
                          value={`${account?.balance} KES`}
                        />
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No venture accounts found.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col h-full">
            {/* Loan Accounts */}
            <Card className="shadow-md flex flex-col h-full">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Wallet className="h-6 w-6 text-primary" />
                    Loan Accounts
                  </CardTitle>
                  {member?.is_approved && (
                    <Button
                      onClick={() => setLoanModal(true)}
                      size="sm"
                      className="bg-primary hover:bg-[#022007] text-white"
                    >
                      Create Loan
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                {member?.loans?.length > 0 ? (
                  <>
                    {member?.loans?.map((account) => (
                      <div key={account?.reference} className="space-y-2">
                        <InfoField
                          icon={CreditCard}
                          label={`${account?.loan_type} - ${account?.account_number}`}
                          value={`${account?.outstanding_balance} KES`}
                        />
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No loan accounts found.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <User className="h-6 w-6 text-primary" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <InfoField
                  icon={Mail}
                  label="Email Address"
                  value={member?.email}
                />
                <InfoField
                  icon={Phone}
                  label="Phone Number"
                  value={member?.phone}
                />
                <InfoField
                  icon={Calendar}
                  label="Date of Birth"
                  value={formatDate(member?.dob)}
                />
                <InfoField icon={User} label="Gender" value={member?.gender} />
                <InfoField
                  icon={MapPin}
                  label="County"
                  value={member?.county}
                />
                <InfoField
                  icon={CreditCard}
                  label="Reference Code"
                  value={member?.reference}
                />
              </CardContent>
            </Card>

            {/* Employment Information */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Building className="h-6 w-6 text-primary" />
                  Employment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <InfoField
                  icon={Building}
                  label="Employment Type"
                  value={member?.employment_type}
                />
                <InfoField
                  icon={Building}
                  label="Employer"
                  value={member?.employer}
                />
                <InfoField
                  icon={User}
                  label="Job Title"
                  value={member?.job_title}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Identification */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Shield className="h-5 w-5 text-primary" />
                  Identification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoField
                  icon={CreditCard}
                  label="ID Type"
                  value={member?.id_type}
                />
                <InfoField
                  icon={CreditCard}
                  label="ID Number"
                  value={member?.id_number}
                />
                <InfoField
                  icon={CreditCard}
                  label="Tax PIN"
                  value={member?.tax_pin}
                />
              </CardContent>
            </Card>

            {/* Roles & Permissions */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Settings className="h-5 w-5 text-primary" />
                  Roles & Permissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {roles.length > 0 ? (
                    roles.map((role) => (
                      <div
                        key={role.key}
                        className="flex items-center justify-between p-3 rounded-lg bg-primary/5"
                      >
                        <span className="font-medium text-foreground">
                          {role.label}
                        </span>
                        <Badge
                          variant="default"
                          className="bg-primary text-primary-foreground"
                        >
                          Active
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No roles assigned
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Account Timeline */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Clock className="h-5 w-5 text-primary" />
                  Account Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <div className="h-3 w-3 rounded-full bg-success"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Account Created
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(member?.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <div className="h-3 w-3 rounded-full bg-primary"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Last Updated
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(member?.updated_at)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <CreateDepositAdmin
          isOpen={depositModal}
          onClose={() => setDepositModal(false)}
          refetchMember={refetchMember}
          accounts={member?.savings_accounts}
        />

        <CreateLoanAccountAdmin
          isOpen={loanModal}
          onClose={() => setLoanModal(false)}
          refetchMember={refetchMember}
          loanTypes={loanTypes}
          member={member}
        />

        <CreateVentureDeposits
          isOpen={ventureDepositModal}
          onClose={() => setVentureDepositModal(false)}
          refetchMember={refetchMember}
          ventures={member?.venture_accounts}
        />

        <CreateVenturePayment
          isOpen={venturePaymentModal}
          onClose={() => setVenturePaymentModal(false)}
          refetchMember={refetchMember}
          ventures={member?.venture_accounts}
        />
      </div>
    </div>
  );
}

export default MemberDetail;
