"use client";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchMember } from "@/hooks/members/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building,
  CreditCard,
  Shield,
  Clock,
  Wallet,
  Wallet2,
  CheckCircle,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UpdateAccount from "@/forms/member/UpdateAccount";
import ChangePassword from "@/forms/member/ChangePassword";
import NextOfKinTable from "@/components/nextofkin/NextOfKinTable";
import NextOfKinFormDialog from "@/forms/nextofkin/NextOfKinFormDialog";

function AccountSettings() {
  const {
    isLoading: isLoadingMember,
    data: member,
    refetch: refetchMember,
  } = useFetchMember();


  const [updateModal, setUpdateModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [nextOfKinModal, setNextOfKinModal] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""
      }`.toUpperCase();
  };

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

  const totalAllocatedPercentage = React.useMemo(() => {
    if (!member?.next_of_kin || member.next_of_kin.length === 0) return 0;
    return member.next_of_kin.reduce((sum, kin) => {
      return sum + (parseFloat(kin.percentage) || 0);
    }, 0);
  }, [member?.next_of_kin]);

  const isPercentageFull = totalAllocatedPercentage >= 100;
  const remainingPercentage = Math.max(0, 100 - totalAllocatedPercentage);

  if (isLoadingMember) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="p-2 space-y-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/member/dashboard">
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">
                <BreadcrumbPage>Account Settings</BreadcrumbPage>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-[#045e32]/5 to-[#045e32]/10">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col items-start gap-6">
              <Avatar className="h-24 w-24 border-4 border-[#045e32]/20">
                <AvatarFallback className="bg-[#045e32] text-white text-2xl font-bold">
                  {getInitials(member?.first_name, member?.last_name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4 w-full">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                    {member?.salutation} {member?.first_name}{" "}
                    {member?.middle_name} {member?.last_name}
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

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => setUpdateModal(true)}
                    size="sm"
                    className="bg-[#045e32] hover:bg-[#022007] text-white px-8 w-full sm:w-auto"
                  >
                    Update Account
                  </Button>
                  <Button
                    onClick={() => setPasswordModal(true)}
                    size="sm"
                    className="bg-red-500 hover:bg-[#022007] text-white px-8 w-full sm:w-auto"
                  >
                    Change Password
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="next-of-kin">Next of Kin</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid lg:grid-cols-3 gap-8 mt-6">
              <div className="lg:col-span-2 space-y-8">
                {/* Personal Information */}
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <User className="h-6 w-6 text-[#045e32]" />
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

                {/* Employment Details */}
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Building className="h-6 w-6 text-[#045e32]" />
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

              <div className="space-y-8">
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Shield className="h-5 w-5 text-[#045e32]" />
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

                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Clock className="h-5 w-5 text-[#045e32]" />
                      Account Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                      <div className="h-3 w-3 rounded-full bg-[#045e32]"></div>
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
                      <div className="h-3 w-3 rounded-full bg-[#045e32]"></div>
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
          </TabsContent>

          <TabsContent value="accounts">
            <div className="grid gap-8 mt-6">
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
                        <div key={account?.reference} className="space-y-2">
                          <InfoField
                            icon={Wallet2}
                            label={`${account?.account_type} - ${account?.account_number}`}
                            value={`${account?.balance} ${account?.currency || "KES"
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
                        <div key={account?.reference} className="space-y-2">
                          <InfoField
                            icon={CreditCard}
                            label={`${account?.loan_type} - ${account?.account_number}`}
                            value={`${account?.outstanding_balance} ${account?.currency || "KES"
                              }`}
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
                        <div key={account?.reference} className="space-y-2">
                          <InfoField
                            icon={TrendingUp}
                            label={`${account?.venture_type} - ${account?.account_number}`}
                            value={`${account?.balance} ${account?.currency || "KES"
                              }`}
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

              {member?.guarantor_profile && (
                <Card className="shadow-md">
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
                      value={member.guarantor_profile.has_reached_limit ? "Limit Reached" : "Active"}
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
              )}
            </div>
          </TabsContent>

          <TabsContent value="next-of-kin">
            <div className="mt-6">
              {/* Next of Kin */}
              <Card className="shadow-md">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <User className="h-6 w-6 text-[#045e32]" />
                    Next of Kin
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      ({totalAllocatedPercentage}% allocated)
                    </span>
                  </CardTitle>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    {isPercentageFull ? (
                      <div className="text-sm text-orange-600 font-medium bg-orange-50 px-3 py-2 rounded-md">
                        100% Allocated — Cannot add more
                      </div>
                    ) : (
                      <Button
                        onClick={() => setNextOfKinModal(true)}
                        size="sm"
                        className="bg-[#045e32] hover:bg-[#022007] text-white whitespace-nowrap"
                      >
                        Add New ({remainingPercentage}% left)
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Total Allocation</span>
                      <span
                        className={
                          totalAllocatedPercentage > 100
                            ? "text-red-600"
                            : "text-green-600"
                        }
                      >
                        {totalAllocatedPercentage}% / 100%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${totalAllocatedPercentage >= 100
                          ? "bg-red-500"
                          : "bg-[#045e32]"
                          }`}
                        style={{
                          width: `${Math.min(totalAllocatedPercentage, 100)}%`,
                        }}
                      />
                    </div>
                    {totalAllocatedPercentage > 100 && (
                      <p className="text-red-600 text-xs mt-1">
                        Warning: Over 100% allocated!
                      </p>
                    )}
                  </div>
                  <NextOfKinTable
                    nextofkin={member?.next_of_kin}
                    refetchAccount={refetchMember}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <UpdateAccount
          isOpen={updateModal}
          onClose={() => setUpdateModal(false)}
          refetchMember={refetchMember}
          member={member}
        />
        <ChangePassword
          isOpen={passwordModal}
          onClose={() => setPasswordModal(false)}
        />
        <NextOfKinFormDialog
          isOpen={nextOfKinModal}
          onClose={() => setNextOfKinModal(false)}
          refetchAccount={refetchMember}
        />
      </div>
    </div>
  );
}

export default AccountSettings;
