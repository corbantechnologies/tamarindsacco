"use client";

import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, Form, Formik } from "formik";
import toast from "react-hot-toast";
import { createLoanRepayment } from "@/services/loanrepayments";

function CreateLoanRepayment({ isOpen, onClose, refetchMember, loans }) {
    const [loading, setLoading] = useState(false);
    const auth = useAxiosAuth();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-[#cc5500]">
                        Create New Loan Repayment
                    </DialogTitle>
                </DialogHeader>

                <Formik
                    initialValues={{
                        loan_account: "",
                        amount: "",
                        payment_method: "",
                        repayment_type: "Repayment",
                        receipt_number: "",
                        transaction_status: "Completed",
                    }}
                    onSubmit={async (values, actions) => {
                        setLoading(true);
                        try {
                            await createLoanRepayment(values, auth);
                            toast.success("Loan Repayment created successfully!");
                            actions.resetForm();
                            onClose();
                            refetchMember();
                        } catch (error) {
                            console.error(error);
                            toast.error("Failed to create Loan Repayment!");
                        } finally {
                            setLoading(false);
                            actions.setSubmitting(false);
                        }
                    }}
                >
                    {({ values }) => (
                        <Form className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="loan_account" className="text-black">
                                    Loan Account
                                </Label>
                                <Field
                                    as="select"
                                    name="loan_account"
                                    className="w-full border border-black rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-[#cc5500] focus:border-[#cc5500] transition-colors"
                                    required
                                >
                                    <option value="" label="Select account" />
                                    {loans?.map((loan) => (
                                        <option
                                            key={loan?.reference}
                                            value={loan?.account_number}
                                        >
                                            {loan?.account_number} - {loan?.loan_type} ({loan?.outstanding_balance})
                                        </option>
                                    ))}
                                </Field>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="amount" className="text-black">
                                    Amount
                                </Label>
                                <Field
                                    as={Input}
                                    type="number"
                                    id="amount"
                                    name="amount"
                                    className="border-black focus:ring-[#cc5500]"
                                    placeholder="Enter repayment amount"
                                    required
                                    min="0.01"
                                    step="0.01"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="payment_method" className="text-black">
                                    Payment Method
                                </Label>
                                <Field
                                    as="select"
                                    name="payment_method"
                                    className="w-full border border-black rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-[#cc5500] focus:border-[#cc5500] transition-colors"
                                    required
                                >

                                    <option value="" label="Select method" />
                                    <option value="Cash">Cash</option>
                                    <option value="Mpesa">Mpesa</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Mobile Transfer">Mobile Transfer</option>
                                    <option value="Cheque">Cheque</option>
                                    <option value="Standing Order">Standing Order</option>
                                    <option value="Mobile Banking">Mobile Banking</option>
                                </Field>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="repayment_type" className="text-black">
                                    Repayment Type
                                </Label>
                                <Field
                                    as="select"
                                    name="repayment_type"
                                    className="w-full border border-black rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-[#cc5500] focus:border-[#cc5500] transition-colors"
                                    required
                                >
                                    <option value="Regular Repayment">Regular Repayment</option>
                                    <option value="Payroll Deduction">Payroll Deduction</option>
                                    <option value="Interest Payment">Interest Payment</option>
                                    <option value="Individual Settlement">Individual Settlement</option>
                                    <option value="Early Settlement">Early Settlement</option>
                                    <option value="Partial Payment">Partial Payment</option>
                                    <option value="Other">Other</option>
                                </Field>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="receipt_number" className="text-black">
                                    Receipt Number
                                </Label>
                                <Field
                                    as={Input}
                                    type="text"
                                    id="receipt_number"
                                    name="receipt_number"
                                    className="border-black focus:ring-[#cc5500]"
                                    placeholder="e.g. RCP-001"
                                    required
                                />
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    className="border-black text-black hover:bg-gray-100"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    size={"sm"}
                                    disabled={loading || !auth.isEnabled}
                                    className="bg-[#045e32] hover:bg-[#022007] text-white text-sm sm:text-base py-2 px-3 sm:px-4 flex-1 sm:flex-none"
                                >
                                    {loading ? "Processing..." : "Submit Payment"}
                                </Button>
                            </DialogFooter>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
}

export default CreateLoanRepayment;