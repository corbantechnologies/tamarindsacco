"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
    CheckCircle,
    XCircle,
    AlertCircle,
    Calendar,
    CreditCard,
    DollarSign,
    Loader2,
    X,
    TrendingUp,
    Wallet,
} from "lucide-react";

const formatCurrency = (val) =>
    Number(val || 0).toLocaleString("en-KE", {
        style: "currency",
        currency: "KES",
    });

export default function UpdateGuaranteeRequest({
    request,
    open,
    onClose,
    onProcess,
    processingAction, // "Accepted" | "Declined" | null
}) {
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");

    const detail = request?.loan_application_detail;
    const maxAmount = detail?.remaining_to_cover || detail?.requested_amount || 0;

    useEffect(() => {
        if (open && request) {
            setAmount("");
            setError("");
        }
    }, [open, request]);

    const handleAction = async (action) => {
        if (action === "Accepted") {
            if (!amount || Number(amount) <= 0) {
                setError("Please enter a valid amount to guarantee.");
                return;
            }
            await onProcess(request.reference, "Accepted", amount);
        } else {
            await onProcess(request.reference, "Declined", null);
        }
    };

    if (!open || !request) return null;

    const isAccepting = processingAction === "Accepted";
    const isDeclining = processingAction === "Declined";
    const isProcessing = isAccepting || isDeclining;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => !isProcessing && onClose()}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-6xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-[#045e32]/10 flex items-center justify-center">
                            <Wallet className="h-6 w-6 text-[#045e32]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Guarantee Request</h2>
                            <p className="text-sm text-gray-500">
                                Request from <span className="font-semibold text-gray-900">{request.member}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => !isProcessing && onClose()}
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <X className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 bg-white">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">

                        {/* LEFT COLUMN: Details & Action */}
                        <div className="flex flex-col space-y-8">

                            {/* Key Figures */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                                    <p className="text-sm text-blue-600 font-medium mb-1">Requested Loan</p>
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-5 w-5 text-blue-700" />
                                        <span className="text-2xl font-bold text-blue-900">
                                            {formatCurrency(detail?.requested_amount)}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100">
                                    <p className="text-sm text-orange-600 font-medium mb-1">Cover Needed</p>
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-orange-700" />
                                        <span className="text-2xl font-bold text-orange-900">
                                            {formatCurrency(detail?.remaining_to_cover)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* More Details */}
                            <div className="grid grid-cols-2 gap-y-6 gap-x-4 p-6 rounded-2xl border border-gray-100 bg-gray-50/30">
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Duration</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Calendar className="h-4 w-4 text-gray-600" />
                                        <span className="text-lg font-medium text-gray-900">{detail?.term_months} Months</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Monthly Payment</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <CreditCard className="h-4 w-4 text-gray-600" />
                                        <span className="text-lg font-medium text-gray-900">{formatCurrency(detail?.monthly_payment)}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Repayment</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <TrendingUp className="h-4 w-4 text-gray-600" />
                                        <span className="text-lg font-medium text-gray-900">{formatCurrency(detail?.total_repayment)}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Application Date</p>
                                    <span className="text-lg font-medium text-gray-900 mt-1 block">
                                        {request.created_at ? format(new Date(request.created_at), "dd MMM yyyy") : "-"}
                                    </span>
                                </div>
                            </div>

                            {/* Action Area */}
                            <div className="mt-auto pt-6 border-t border-gray-100">
                                <label htmlFor="guarantee-amount" className="block text-lg font-semibold text-gray-900 mb-2">
                                    Amount to Guarantee
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">KES</span>
                                    <input
                                        id="guarantee-amount"
                                        type="number"
                                        placeholder={`Max: ${formatCurrency(maxAmount)}`}
                                        value={amount}
                                        onChange={(e) => {
                                            setAmount(e.target.value);
                                            setError("");
                                        }}
                                        disabled={isProcessing}
                                        className="w-full pl-16 pr-4 py-4 text-xl font-bold text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:border-[#045e32] focus:ring-4 focus:ring-[#045e32]/10 transition-all outline-none disabled:bg-gray-100 disabled:text-gray-400"
                                    />
                                </div>
                                {error && (
                                    <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                                        <AlertCircle className="h-4 w-4" /> {error}
                                    </p>
                                )}

                                <div className="flex gap-4 mt-6">
                                    <button
                                        onClick={() => handleAction("Declined")}
                                        disabled={isProcessing}
                                        className="flex-1 py-4 rounded-xl border-2 border-red-100 text-red-600 font-bold hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isDeclining ? <Loader2 className="animate-spin" /> : <XCircle />}
                                        Decline
                                    </button>
                                    <button
                                        onClick={() => handleAction("Accepted")}
                                        disabled={isProcessing}
                                        className="flex-[2] py-4 rounded-xl bg-[#045e32] text-white font-bold hover:bg-[#022b17] shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isAccepting ? <Loader2 className="animate-spin" /> : <CheckCircle />}
                                        Accept Guarantee
                                    </button>
                                </div>
                            </div>

                        </div>

                        {/* RIGHT COLUMN: Schedule */}
                        <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden flex flex-col h-[600px] lg:h-auto">
                            <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-[#045e32]" />
                                    Repayment Schedule
                                </h3>
                            </div>

                            <div className="overflow-auto flex-1 p-0">
                                {detail?.projection_snapshot?.schedule ? (
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-100 sticky top-0 z-10 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-3 border-b border-gray-200">Date</th>
                                                <th className="px-6 py-3 border-b border-gray-200 text-right">Interest</th>
                                                <th className="px-6 py-3 border-b border-gray-200 text-right">Total</th>
                                                <th className="px-6 py-3 border-b border-gray-200 text-right">Bal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {detail.projection_snapshot.schedule.map((row, index) => (
                                                <tr key={index} className="hover:bg-blue-50/50 transition-colors">
                                                    <td className="px-6 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                        {format(new Date(row.due_date), "MMM dd, yyyy")}
                                                    </td>
                                                    <td className="px-6 py-3 text-sm text-gray-600 text-right whitespace-nowrap">
                                                        {formatCurrency(row.interest_due)}
                                                    </td>
                                                    <td className="px-6 py-3 text-sm font-bold text-[#045e32] text-right whitespace-nowrap">
                                                        {formatCurrency(row.total_due)}
                                                    </td>
                                                    <td className="px-6 py-3 text-sm text-gray-500 text-right whitespace-nowrap">
                                                        {formatCurrency(row.balance_after)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                        <Calendar className="h-12 w-12 mb-2 opacity-20" />
                                        <p>No schedule available</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}