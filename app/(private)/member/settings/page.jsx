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
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import UpdateAccount from "@/forms/member/UpdateAccount";
import ChangePassword from "@/forms/member/ChangePassword";

function AccountSettings() {
  const {
    isLoading: isLoadingMember,
    data: member,
    refetch: refetchMember,
  } = useFetchMember();

  const [updateModal, setUpdateModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);

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

  if (isLoadingMember) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-8">
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

        <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col items-start gap-6">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarFallback className="bg-primary text-white text-2xl font-bold">
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
                    className="bg-primary hover:bg-[#022007] text-white px-8 w-full sm:w-auto"
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

        <div className="grid lg:grid-cols-3 gap-8">
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

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Wallet className="h-6 w-6 text-primary" />
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

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Wallet className="h-6 w-6 text-primary" />
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
                          value={`${account?.outstanding_balance} ${
                            account?.currency || "KES"
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
          </div>

          <div className="space-y-8">
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

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Clock className="h-5 w-5 text-primary" />
                  Account Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <div className="h-3 w-3 rounded-full bg-primary"></div>
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
      </div>
    </div>
  );
}

export default AccountSettings;
