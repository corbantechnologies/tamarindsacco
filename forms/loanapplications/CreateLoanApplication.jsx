"use client";

import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { useRouter } from "next/navigation";
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
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { createLoanApplication } from "@/services/loanapplications";

export default function CreateLoanApplication({
  onClose,
  isOpen,
  products,
  route,
}) {
  const token = useAxiosAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl p-4 sm:p-6 bg-white overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#045e32]">
            Apply for a Loan
          </DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={{
            product: "",
            requested_amount: "",
            start_date: "",
            calculation_mode: "",
            term_months: "",
            monthly_payment: "",
          }}
          onSubmit={async (values, { setSubmitting }) => {
            setLoading(true);
            try {
              const response = await createLoanApplication(values, token);
              toast.success("Loan application created successfully");
              onClose();
              router.push(
                `/${route}/loan-applications/${response?.data?.reference}`
              );
            } catch (error) {
              toast.error(
                error.response?.data?.message ||
                  "Failed to create loan application. Please try again."
              );
            } finally {
              setLoading(false);
              setSubmitting(false);
            }
          }}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product - Native Select */}
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
                        {products?.map((product) => (
                          <option key={product.reference} value={product.name}>
                            {product.name} ({product.interest_rate}%)
                          </option>
                        ))}
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

                {/* Calculation Mode - Native Select */}
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

              <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3">
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
                      Creating...
                    </>
                  ) : (
                    "Create Application"
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
