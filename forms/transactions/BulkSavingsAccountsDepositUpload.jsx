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
import { createBulkSavingsDeposits } from "@/services/savingsdeposits";

function BulkSavingsAccountsDepositUpload({
  isOpen,
  onClose,
  refetchTransactions,
}) {
  const token = useAxiosAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    if (!values.file) {
      toast.error("Please select a CSV file");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", values.file);
      const response = await createBulkSavingsDeposits(formData, token);

      const { success_count, error_count, errors, log_reference } =
        response.data;
      if (success_count > 0) {
        toast.success(
          `Successfully uploaded ${success_count} deposits. Reference: ${log_reference}`
        );
        if (error_count > 0) {
          toast.error(
            `${error_count} errors occurred. Check the log for details.`
          );
          errors.forEach((error) => {
            toast.error(
              `Row ${error.row}: ${error.error || JSON.stringify(error.errors)}`
            );
          });
        }
        resetForm();
        refetchTransactions();
        onClose();
      } else {
        toast.error("No deposits processed. Check the CSV format.");
        errors.forEach((error) => {
          toast.error(
            `Row ${error.row}: ${error.error || JSON.stringify(error.errors)}`
          );
        });
      }
    } catch (error) {
      console.error("Bulk upload error:", error);
      toast.error("Failed to upload CSV");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[#cc5500]">
            Bulk Savings Accounts Deposit Upload
          </DialogTitle>
        </DialogHeader>
        <Formik initialValues={{ file: null }} onSubmit={handleSubmit}>
          {({ setFieldValue }) => (
            <Form>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="file">Upload CSV File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".csv"
                    onChange={(event) => {
                      setFieldValue("file", event.currentTarget.files[0]);
                    }}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    CSV should include columns:{" "}
                    <code>&lt;Savings Type&gt; Account</code>,{" "}
                    <code>&lt;Savings Type&gt; Amount</code> (e.g., "Members
                    Contribution Account", "Members Contribution Amount").
                    Optional: <code>Payment Method</code> (defaults to "Cash").
                    Download the account list as a template.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#045e32] hover:bg-[#022007] text-white"
                >
                  {loading ? "Uploading..." : "Upload"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

export default BulkSavingsAccountsDepositUpload;
