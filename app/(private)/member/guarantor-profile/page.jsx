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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  History,
  TrendingUp,
} from "lucide-react";

const formatCurrency = (val) =>
  Number(val || 0).toLocaleString("en-KE", {
    style: "currency",
    currency: "KES",
  });

const formatDate = (dateStr) =>
  dateStr ? format(new Date(dateStr), "dd MMM yyyy") : "—";

const getStatusBadge = (status) => {
  const map = {
    Pending: "bg-yellow-100 text-yellow-800",
    Accepted: "bg-green-100 text-green-800",
    Declined: "bg-red-100 text-red-800",
  };
  return map[status] || "bg-gray-100 text-gray-800";
};

import UpdateGuaranteeRequest from "@/forms/guaranteerequests/UpdateGuaranteeRequest";

export default function GuarantorProfile() {
  const token = useAxiosAuth();
  const { isLoading, data: profile, refetch } = useFetchGuarantorProfile();
  const [processing, setProcessing] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingAction, setProcessingAction] = useState(null);

  if (isLoading) return <MemberLoadingSpinner />;

  const allRequests = profile?.guarantees || [];
  const pendingRequests = allRequests.filter((r) => r.status === "Pending");
  const historyRequests = allRequests.filter((r) => r.status !== "Pending");

  const openReviewModal = (req) => {
    setSelectedRequest(req);
    setIsModalOpen(true);
    setProcessingAction(null);
  };

  const handleProcessRequest = async (requestRef, status, guaranteedAmount) => {
    setProcessingAction(status);
    try {
      const payload = { status };
      if (status === "Accepted") {
        payload.guaranteed_amount = guaranteedAmount;
      }

      await acceptDeclineGuaranteeRequest(requestRef, payload, token);

      toast.success(
        `Request ${status === "Accepted" ? "accepted" : "declined"} successfully`
      );
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Action failed");
    } finally {
      setProcessingAction(null);
    }
  };

  const RequestRow = ({ req }) => {
    const detail = req.loan_application_detail;

    return (
      <TableRow className="hover:bg-gray-50">
        <TableCell className="font-medium">{req.member}</TableCell>
        <TableCell>{formatCurrency(detail?.requested_amount || 0)}</TableCell>
        <TableCell className="font-semibold text-[#045e32]">
          {formatCurrency(req.guaranteed_amount)}
        </TableCell>
        <TableCell className="text-sm text-gray-600">
          {formatDate(req.created_at)}
        </TableCell>
        <TableCell>
          <Badge className={getStatusBadge(req.status)}>{req.status}</Badge>
        </TableCell>
        <TableCell>
          {req.status === "Pending" && (
            <Button
              size="sm"
              className="bg-[#045e32] hover:bg-[#022007]"
              onClick={() => openReviewModal(req)}
            >
              Review Request
            </Button>
          )}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-[#045e32]/10 rounded-full">
            <Shield className="h-14 w-14 text-[#045e32]" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-[#045e32]">
          My Guarantor Profile
        </h1>
        <p className="text-2xl text-gray-700 mt-2">
          {profile?.guarantor_name || profile?.member}
        </p>
        <p className="text-sm text-gray-500">Member: {profile?.member}</p>
      </div>

      {/* Capacity Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-2 border-[#045e32]/20 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#045e32]" />
              Available to Guarantee
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-[#045e32]">
              {formatCurrency(profile?.available_amount)}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Guarantees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {profile?.active_guarantees_count}
              <span className="text-lg text-gray-500">
                {" / "}
                {profile?.max_active_guarantees}
              </span>
            </p>
          </CardContent>
        </Card>

        <Card
          className={
            profile?.has_reached_limit
              ? "border-red-300"
              : "border-green-300 shadow-lg"
          }
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant={profile?.is_eligible ? "default" : "destructive"}
              className="text-lg px-6 py-3"
            >
              {profile?.is_eligible ? "Eligible" : "Limit Reached"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Tabs: Pending & History */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Guarantee Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="pending" className="text-base">
                Pending ({pendingRequests.length})
              </TabsTrigger>
              <TabsTrigger value="history" className="text-base">
                <History className="h-4 w-4 mr-2" />
                History ({historyRequests.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {pendingRequests.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <Users className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-xl font-medium">No pending requests</p>
                  <p className="text-sm mt-2">
                    Members will request your guarantee when they need it
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Loan Amount</TableHead>
                        <TableHead>Requested</TableHead>
                        <TableHead>Applied On</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingRequests.map((req) => (
                        <RequestRow key={req.reference} req={req} />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history">
              {historyRequests.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <History className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-xl font-medium">No history yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Loan Amount</TableHead>
                        <TableHead>Requested</TableHead>
                        <TableHead>Applied On</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {historyRequests.map((req) => (
                        <RequestRow key={req.reference} req={req} />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <UpdateGuaranteeRequest
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={selectedRequest}
        onProcess={handleProcessRequest}
        processingAction={processingAction}
      />
    </div>
  );
}
