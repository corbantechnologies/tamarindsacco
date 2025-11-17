// components/loanapplications/UpdateLoanApplication.jsx
"use client";

import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { updateLoanApplication } from "@/services/loanapplications";

export default function UpdateLoanApplication({
  loan,
  open,
  onClose,
  onSuccess,
}) {
  const token = useAxiosAuth();
  const [loading, setLoading] = useState(false);

  const initialValues = {
    product: loan?.product ?? "",
    requested_amount: loan?.requested_amount ?? "",
    start_date: loan?.start_date ?? "",
    calculation_mode: loan?.calculation_mode ?? "",
    term_months: loan?.term_months ?? "",
    monthly_payment: loan?.monthly_payment ?? "",
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#045e32]">
            Update Loan Application
          </DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={initialValues}
          onSubmit={async (values, { setSubmitting }) => {
            setLoading(true);
            try {
              await updateLoanApplication(loan.reference, values, token);
              toast.success("Loan application updated successfully");
              onClose();
              onSuccess?.(); // refresh detail page
            } catch (err) {
              toast.error(
                err.response?.data?.message ||
                  "Failed to update loan application."
              );
            } finally {
              setLoading(false);
              setSubmitting(false);
            }
          }}
        >
          {({ values }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product */}
                <div className="space-y-2">
                  <Label htmlFor="product">Loan Product</Label>
                  <Field name="product">
                    {({ field }) => (
                      <select
                        {...field}
                        id="product"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select a product</option>
                        <option value={loan?.product}>{loan?.product}</option>
                      </select>
                    )}
                  </Field>
                </div>

                {/* Requested Amount */}
                <div className="space-y-2">
                  <Label htmlFor="requested_amount">Requested Amount</Label>
                  <Field
                    type="number"
                    id="requested_amount"
                    name="requested_amount"
                    as={Input}
                    placeholder="e.g., 100,000"
                  />
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Field
                    type="date"
                    id="start_date"
                    name="start_date"
                    as={Input}
                  />
                </div>

                {/* Calculation Mode */}
                <div className="space-y-2">
                  <Label htmlFor="calculation_mode">Calculation Mode</Label>
                  <Field name="calculation_mode">
                    {({ field }) => (
                      <select
                        {...field}
                        id="calculation_mode"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select mode</option>
                        <option value="fixed_term">Fixed Term</option>
                        <option value="fixed_payment">Fixed Payment</option>
                      </select>
                    )}
                  </Field>
                </div>

                {/* Conditional: Term Months */}
                {values.calculation_mode === "fixed_term" && (
                  <div className="space-y-2">
                    <Label htmlFor="term_months">Term (Months)</Label>
                    <Field
                      type="number"
                      id="term_months"
                      name="term_months"
                      as={Input}
                      placeholder="e.g., 12"
                    />
                  </div>
                )}

                {/* Conditional: Monthly Payment */}
                {values.calculation_mode === "fixed_payment" && (
                  <div className="space-y-2">
                    <Label htmlFor="monthly_payment">Monthly Payment</Label>
                    <Field
                      type="number"
                      id="monthly_payment"
                      name="monthly_payment"
                      as={Input}
                      placeholder="e.g., 10,000"
                    />
                  </div>
                )}
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#045e32] hover:bg-[#022007] text-white w-full sm:w-auto"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Application"
                  )}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
