"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Loader2,
    DollarSign,
    AlertCircle,
    CreditCard,
    Building2,
} from "lucide-react";
import { makeDisbursementLoanApplication } from "@/services/loanapplications";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import toast from "react-hot-toast";

const formatCurrency = (val) =>
    Number(val || 0).toLocaleString("en-KE", {
        style: "currency",
        currency: "KES",
    });

export default function DisburseLoanApplication({
    loan,
    open,
    onClose,
    onSuccess,
}) {
    const token = useAxiosAuth();
    const [processing, setProcessing] = useState(false);

    const handleDisburse = async () => {
        setProcessing(true);
        try {
            const payload = {
                amount: loan.requested_amount, // Currently full amount
                disbursement_type: "Principal",
            };

            await makeDisbursementLoanApplication(loan.reference, payload, token);

            toast.success("Loan disbursed successfully");
            onSuccess?.();
            onClose();
        } catch (err) {
            toast.error(
                err.response?.data?.detail || "Disbursement failed. Please try again."
            );
        } finally {
            setProcessing(false);
        }
    };

    if (!loan) return null;

    return (
        <Dialog open={open} onOpenChange={(val) => !processing && onClose(val)}>
            <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-2xl border-t-8 border-[#045e32]">
                <DialogHeader className="mb-4">
                    <div className="mx-auto bg-green-100 p-3 rounded-full mb-4 w-fit">
                        <Building2 className="h-8 w-8 text-[#045e32]" />
                    </div>
                    <DialogTitle className="text-center text-2xl font-bold text-[#045e32]">
                        Confirm Disbursement
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-500">
                        You are about to disburse funds for this loan application.
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                        <span className="text-sm font-medium text-gray-500">Applicant</span>
                        <span className="font-bold text-gray-900">{loan.member}</span>
                    </div>

                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                        <span className="text-sm font-medium text-gray-500">Mode</span>
                        <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                            Check / Transfer
                        </Badge>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <span className="text-lg font-bold text-gray-700">Total Amount</span>
                        <span className="text-2xl font-extrabold text-[#045e32]">
                            {formatCurrency(loan.requested_amount)}
                        </span>
                    </div>
                </div>

                <div className="flex items-start gap-3 mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100 text-amber-800 text-sm">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p>
                        This action will credit the member's account and update the loan status to <strong>Disbursed</strong>. This action cannot be undone.
                    </p>
                </div>

                <DialogFooter className="mt-6 gap-3 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={() => onClose()}
                        disabled={processing}
                        className="w-full sm:w-auto mt-2 sm:mt-0"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDisburse}
                        disabled={processing}
                        className="w-full sm:w-auto bg-[#045e32] hover:bg-[#022007] text-white font-semibold ml-2"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <CreditCard className="mr-2 h-4 w-4" />
                                Confirm Disbursement
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}