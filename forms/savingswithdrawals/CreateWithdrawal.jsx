"use client";

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
import { createSavingsWithdrawals } from "@/services/savingswithdrawals";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";

function CreateWithdrawal({ isOpen, onClose, account, refetchAccount }) {
  const [loading, setLoading] = useState(false);
  const auth = useAxiosAuth();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[#cc5500]">
            Create New Withdrawal
          </DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={{
            savings_account: account?.account_number,
            amount: 0,
            payment_method: "",
          }}
          onSubmit={async (values) => {
            setLoading(true);
            try {
              await createSavingsWithdrawals(values, auth);
              toast?.success("Withdrawal created successfully!");
              onClose();
              refetchAccount();
            } catch (error) {
              if (error?.response?.data?.amount) {
                toast?.error(error?.response?.data?.amount[0]);
              } else {
                toast?.error("Failed to create withdrawal!");
              }
            } finally {
              setLoading(false);
            }
          }}
        >
          {({ values }) => (
            <Form className="space-y-4">
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
                  placeholder="Enter deposit amount"
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
                  <option value="" label="Select payment method" />
                  <option value="Cash">Cash</option>
                  <option value="Mpesa">Mpesa</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Mobile Transfer">Mobile Transfer</option>
                  <option value="Cheque">Cheque</option>
                </Field>
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  size={"sm"}
                  disabled={loading || !auth.isEnabled}
                  className="bg-[#045e32] hover:bg-[#022007] text-white text-sm sm:text-base py-2 px-3 sm:px-4 flex-1 sm:flex-none"
                >
                  {loading ? "Submitting..." : "Withdraw"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

export default CreateWithdrawal;
