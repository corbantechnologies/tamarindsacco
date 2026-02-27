"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { createFeesPayment } from "@/services/feespayments";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";

const PAYMENT_METHODS = [
  { label: "Mpesa", value: "Mpesa" },
  { label: "Bank Transfer", value: "Bank Transfer" },
  { label: "Cash", value: "Cash" },
  { label: "Mobile Banking", value: "Mobile Banking" },
];

const CreateFeesPayments = ({ isOpen, onClose, memberFee, refetchPayments }) => {
  const [loading, setLoading] = useState(false);
  const auth = useAxiosAuth();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[#045e32]">Record Fee Payment</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={{
            member_fee: memberFee?.account_number || "",
            amount: memberFee?.remaining_balance || 0,
            payment_method: "Mpesa",
            receipt_number: "",
          }}
          enableReinitialize
          onSubmit={async (values) => {
            setLoading(true);
            try {
              await createFeesPayment(values, auth);
              toast?.success("Payment recorded successfully!");
              onClose();
              refetchPayments();
            } catch (error) {
              toast?.error("Failed to record payment!");
            } finally {
              setLoading(false);
            }
          }}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="member_fee" className="text-black">
                  Member Fee Account
                </Label>
                <div className="flex flex-col gap-1">
                  <Field
                    as={Input}
                    id="member_fee"
                    name="member_fee"
                    className="border-black focus:ring-[#045e32] bg-gray-100"
                    readOnly
                  />
                  {memberFee && (
                    <p className="text-sm text-gray-500">
                      Remaining Balance: <span className="font-semibold text-[#cc5500]">KES {parseFloat(memberFee.remaining_balance).toLocaleString()}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-black">
                  Payment Amount
                </Label>
                <Field
                  as={Input}
                  type="number"
                  id="amount"
                  name="amount"
                  className="border-black focus:ring-[#045e32]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_method" className="text-black">
                  Payment Method
                </Label>
                <Select
                  value={values.payment_method}
                  onValueChange={(val) => setFieldValue("payment_method", val)}
                >
                  <SelectTrigger className="border-black">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="receipt_number" className="text-black">
                  Receipt Number
                </Label>
                <Field
                  as={Input}
                  id="receipt_number"
                  name="receipt_number"
                  className="border-black focus:ring-[#045e32]"
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
                  className="bg-[#045e32] hover:bg-[#037a40] text-white"
                  disabled={loading || !auth.isEnabled}
                >
                  {loading ? "Recording..." : "Record Payment"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFeesPayments;