"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { CreditCard, CheckCircle2, Clock } from "lucide-react";
import CreateFeesPayments from "@/forms/feespayments/CreateFeesPayments";

function MemberFeesTable({ memberFees, refetchMemberFees }) {
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentModal, setPaymentModal] = useState(false);

  const handlePayClick = (fee) => {
    setSelectedFee(fee);
    setPaymentModal(true);
  };

  if (!memberFees || memberFees.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No fees recorded for this member.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <div className="overflow-x-auto rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="font-semibold">Fee Type</TableHead>
                <TableHead className="font-semibold">Account Number</TableHead>
                <TableHead className="font-semibold text-right">Total Amount</TableHead>
                <TableHead className="font-semibold text-right">Remaining Balance</TableHead>
                <TableHead className="font-semibold text-center">Status</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberFees.map((fee) => (
                <TableRow key={fee.reference} className="hover:bg-gray-50/50">
                  <TableCell>
                    <div className="font-medium text-gray-900">{fee.fee_type?.name}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(fee.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{fee.account_number}</TableCell>
                  <TableCell className="text-right font-medium text-gray-500">
                    KES {parseFloat(fee.amount).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-red-600">
                    KES {parseFloat(fee.remaining_balance).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    {fee.is_paid ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 flex items-center gap-1 w-fit mx-auto">
                        <CheckCircle2 className="h-3 w-3" /> Paid
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 flex items-center gap-1 w-fit mx-auto">
                        <Clock className="h-3 w-3" /> Unpaid
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => handlePayClick(fee)}
                      className="bg-[#045e32] hover:bg-[#037a40] text-white gap-2"
                    >
                      <CreditCard className="h-4 w-4" /> Pay
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CreateFeesPayments
        isOpen={paymentModal}
        onClose={() => {
          setPaymentModal(false);
          setSelectedFee(null);
        }}
        memberFee={selectedFee}
        refetchPayments={refetchMemberFees}
      />
    </Card>
  );
}

export default MemberFeesTable;
