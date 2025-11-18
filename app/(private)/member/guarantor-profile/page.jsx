"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MemberLoadingSpinner from "@/components/general/MemberLoadingSpinner";
import { useFetchGuarantorProfile } from "@/hooks/guarantorprofiles/actions";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { acceptDeclineGuaranteeRequest } from "@/services/guaranteerequests";
import toast from "react-hot-toast";
import {
  Shield,
  CheckCircle,
  XCircle,
  Loader2,
  Users,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

const formatCurrency = (val) =>
  Number(val || 0).toLocaleString("en-KE", {
    style: "currency",
    currency: "KES",
  });

const formatDate = (dateStr) =>
  dateStr ? format(new Date(dateStr), "dd MMM yyyy") : "—";

export default function GuarantorProfile() {
  const token = useAxiosAuth();
  const { isLoading, data: profile, refetch } = useFetchGuarantorProfile();
  const [processing, setProcessing] = useState({});

  if (isLoading) return <MemberLoadingSpinner />;

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Guarantor profile not found.</p>
      </div>
    );
  }

  const pendingRequests =
    profile.guarantors?.filter((g) => g.status === "Pending") || [];

  const handleAction = async (requestRef, action) => {
    setProcessing((prev) => ({ ...prev, [requestRef]: action }));

    try {
      await acceptDeclineGuaranteeRequest(requestRef, action, token);
      toast.success(`Request ${action.toLowerCase()}ed successfully`);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Action failed");
    } finally {
      setProcessing((prev) => ({ ...prev, [requestRef]: null }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-[#045e32]/10 rounded-full">
            <Shield className="h-12 w-12 text-[#045e32]" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-[#045e32]">
          My Guarantor Profile
        </h1>
        <p className="text-xl text-gray-700 mt-2">
          {profile.guarantor_name || profile.member}
        </p>
        <p className="text-sm text-gray-500">Member No: {profile.member}</p>
      </div>

      {/* Capacity Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-2 border-[#045e32]/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#045e32]" />
              Available to Guarantee
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#045e32]">
              {formatCurrency(profile.available_amount)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Guarantees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {profile.active_guarantees_count}{" "}
              <span className="text-lg text-gray-500">
                / {profile.max_active_guarantees}
              </span>
            </p>
          </CardContent>
        </Card>

        <Card
          className={
            profile.has_reached_limit ? "border-red-300" : "border-green-300"
          }
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Eligibility Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant={profile.is_eligible ? "default" : "destructive"}
              className="text-lg px-4 py-2"
            >
              {profile.is_eligible ? "Eligible to Guarantee" : "Limit Reached"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <Users className="h-7 w-7 text-[#045e32]" />
            Pending Guarantee Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-xl text-gray-600 font-medium">
                No pending requests
              </p>
              <p className="text-gray-500 mt-2">
                Members will request your guarantee when they apply for loans
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Loan Amount</TableHead>
                    <TableHead>Requested from You</TableHead>
                    <TableHead>Applied On</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.map((req) => {
                    const detail = req.loan_application_detail;
                    const isProcessing = processing[req.reference];

                    return (
                      <TableRow
                        key={req.reference}
                        className="hover:bg-gray-50"
                      >
                        <TableCell className="font-medium">
                          {req.member}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(detail?.requested_amount)}
                        </TableCell>
                        <TableCell className="font-semibold text-[#045e32]">
                          {formatCurrency(req.guaranteed_amount)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDate(req.created_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-3">
                            <Button
                              size="sm"
                              className="bg-[#045e32] hover:bg-[#022007]"
                              disabled={!!isProcessing}
                              onClick={() =>
                                handleAction(req.reference, "Accepted")
                              }
                            >
                              {isProcessing === "Accepted" ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle className="mr-1 h-4 w-4" />
                                  Accept
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50"
                              disabled={!!isProcessing}
                              onClick={() =>
                                handleAction(req.reference, "Declined")
                              }
                            >
                              {isProcessing === "Declined" ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <XCircle className="mr-1 h-4 w-4" />
                                  Decline
                                </>
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
