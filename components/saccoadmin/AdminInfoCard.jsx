"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { User } from "lucide-react";

const AdminInfoCard = ({ member }) => (
  <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-primary">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-primary text-lg sm:text-xl">
        <User className="h-5 w-5" />
        Admin Details
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-2 text-sm sm:text-base">
      <div className="flex flex-col">
        <span className="font-medium">Name:</span>
        <span className="truncate">
          {member?.salutation} {member?.first_name} {member?.last_name}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-medium">Email:</span>
        <span className="truncate">{member?.email}</span>
      </div>
      <div className="flex flex-col">
        <span className="font-medium">Member No:</span>
        <span className="truncate">{member?.member_no}</span>
      </div>
      <div className="flex flex-col">
        <span className="font-medium">Phone:</span>
        <span className="truncate">{member?.phone}</span>
      </div>
    </CardContent>
  </Card>
);

export default AdminInfoCard;
