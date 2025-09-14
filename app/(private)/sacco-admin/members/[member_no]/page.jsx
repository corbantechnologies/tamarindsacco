"use client";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchMemberDetail } from "@/hooks/members/actions";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

// Mock service for approving a member (replace with actual API call)
async function approveMember(member_no, token) {
  try {
    const response = await fetch(`/api/members/${member_no}/approve`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ is_approved: true }),
    });
    if (!response.ok) throw new Error("Failed to approve member");
    return await response.json();
  } catch (error) {
    throw error;
  }
}

function MemberDetail() {
  const { member_no } = useParams();
  const {
    isLoading: isLoadingMember,
    data: member,
    refetch: refetchMember,
  } = useFetchMemberDetail(member_no);
  const [isApproving, setIsApproving] = useState(false);
  const token = useAxiosAuth();

  if (isLoadingMember) return <LoadingSpinner />;

  if (!member) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <p className="text-gray-500">Member not found.</p>
      </div>
    );
  }

  const handleApprove = async () => {
    try {
      setIsApproving(true);
      await approveMember(member_no, token);
      toast.success("Member approved successfully!");
      refetchMember();
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve member!");
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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4 sm:p-6">
        <Card className="bg-white shadow-xl">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-[#cc5500]">
                {member.salutation} {member.first_name} {member.last_name}
              </CardTitle>
              {!member.is_approved && (
                <Button
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="bg-[#045e32] hover:bg-[#022007] text-white w-full sm:w-auto"
                >
                  {isApproving ? "Approving..." : "Approve Member"}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold text-[#cc5500] mb-4">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-base text-black">{member.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-base text-black">{member.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="text-base text-black">
                    {formatDate(member.dob)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="text-base text-black">
                    {member.gender || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">County</p>
                  <p className="text-base text-black">
                    {member.county || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Identification */}
            <div>
              <h2 className="text-xl font-semibold text-[#cc5500] mb-4">
                Identification
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Member Number</p>
                  <p className="text-base text-black">{member.member_no}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">ID Type</p>
                  <p className="text-base text-black">
                    {member.id_type || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">ID Number</p>
                  <p className="text-base text-black">
                    {member.id_number || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tax PIN</p>
                  <p className="text-base text-black">
                    {member.tax_pin || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Employment */}
            <div>
              <h2 className="text-xl font-semibold text-[#cc5500] mb-4">
                Employment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Employment Type</p>
                  <p className="text-base text-black">
                    {member.employment_type || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employer</p>
                  <p className="text-base text-black">
                    {member.employer || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Job Title</p>
                  <p className="text-base text-black">
                    {member.job_title || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <h2 className="text-xl font-semibold text-[#cc5500] mb-4">
                Status
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Approval Status</p>
                  <Badge
                    variant={member.is_approved ? "default" : "secondary"}
                    className={
                      member.is_approved
                        ? "bg-[#045e32] text-white"
                        : "bg-gray-200 text-gray-800"
                    }
                  >
                    {member.is_approved ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <Clock className="h-3 w-3 mr-1" />
                    )}
                    {member.is_approved ? "Approved" : "Pending"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Status</p>
                  <Badge
                    variant={member.is_active ? "default" : "secondary"}
                    className={
                      member.is_active
                        ? "bg-[#045e32] text-white"
                        : "bg-gray-200 text-gray-800"
                    }
                  >
                    {member.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Roles</p>
                  <div className="flex gap-2">
                    {member.is_staff && (
                      <Badge className="bg-[#cc5500] text-white">Staff</Badge>
                    )}
                    {member.is_member && (
                      <Badge className="bg-[#cc5500] text-white">Member</Badge>
                    )}
                    {member.is_superuser && (
                      <Badge className="bg-[#cc5500] text-white">
                        Superuser
                      </Badge>
                    )}
                    {member.is_system_admin && (
                      <Badge className="bg-[#cc5500] text-white">
                        System Admin
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="text-base text-black">
                    {formatDate(member.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MemberDetail;
