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
import { adminCreateLoanForMember } from "@/services/loans";

function CreateLoanAccountAdmin({
  isOpen,
  onClose,
  refetchMember,
  loanTypes,
  member,
}) {
  const [loading, setLoading] = useState(false);
  const token = useAxiosAuth();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="">Create New Loan</DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={{
            loan_type: loanTypes?.name || "",
            member_no: member?.member_no || "",
            loan_amount: 0,
            is_active: true,
            is_approved: true,
          }}
          onSubmit={async (values) => {
            setLoading(true);
            try {
              await adminCreateLoanForMember(values, token);
              toast?.success("Loan created successfully!");
              setLoading(false);
              onClose();
              refetchMember();
            } catch (error) {
              toast?.error("Failed to create loan!");
            } finally {
              setLoading(false);
            }
          }}
        >
          {({ values }) => (
            <Form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="member_no" className="text-black">
                  Member
                </Label>
                <Field
                  as={Input}
                  type="text"
                  name="member_no"
                  placeholder={`${member?.member_no}`}
                  value={`${member?.member_no}`}
                  disabled
                  className="w-full border border-black rounded-md px-3 py-2 text-base focus:ring-2   transition-colors bg-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loan_type" className="text-black">
                  Loan Type
                </Label>
                <Field
                  as="select"
                  name="loan_type"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" label="Select loan type" />
                  {loanTypes?.map((type) => (
                    <option key={type?.reference} value={type?.name}>
                      {type?.name}
                    </option>
                  ))}
                </Field>
              </div>
              <div className="space-y-2">
                <Label htmlFor="loan_amount" className="text-black">
                  Loan Amount
                </Label>
                <Field
                  as={Input}
                  type="number"
                  name="loan_amount"
                  className="w-full border border-black rounded-md px-3 py-2 text-base focus:ring-2   transition-colors"
                />
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-[#cc5500] text-white hover:bg-[#cc5500] disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Loan"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

export default CreateLoanAccountAdmin;
