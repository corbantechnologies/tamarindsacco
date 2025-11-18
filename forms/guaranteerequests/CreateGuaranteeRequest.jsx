"use client";

import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Users, Search, UserX } from "lucide-react";
import toast from "react-hot-toast";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { createGuaranteeRequest } from "@/services/guaranteerequests";

const formatCurrency = (val) =>
  Number(val || 0).toLocaleString("en-KE", {
    style: "currency",
    currency: "KES",
  });

export default function CreateGuaranteeRequest({
  isOpen,
  onClose,
  guarantors = [],
  loanapplication,
  refetchApplication,
}) {
  const token = useAxiosAuth();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const remaining = loanapplication?.remaining_to_cover || 0;
  const currentMember = loanapplication?.member; // This is the loan applicant

  // EXCLUDE the applicant from appearing as a guarantor
  const filteredGuarantors = guarantors
    .filter((g) => {
      // 1. Not the applicant themselves
      if (g.member === currentMember) return false;

      // 2. Search filter
      const query = search.toLowerCase();
      const matchesSearch =
        g.member.toLowerCase().includes(query) ||
        (g.guarantor_name && g.guarantor_name.toLowerCase().includes(query));

      // 3. Must have available amount > 0
      return matchesSearch && Number(g.available_amount) > 0;
    })
    .sort((a, b) => b.available_amount - a.available_amount);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white rounded-2xl shadow-2xl">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="h-6 w-6 text-[#045e32]" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-[#045e32]">
                Request Guarantor
              </DialogTitle>
              <DialogDescription className="text-base">
                Ask another member to guarantee part of your loan
              </DialogDescription>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-800 font-medium">
              Remaining amount to cover:{" "}
              <span className="text-xl font-bold text-red-600">
                {formatCurrency(remaining)}
              </span>
            </p>
          </div>
        </DialogHeader>

        <Formik
          initialValues={{
            guarantor: "",
            loan_application: loanapplication?.reference || "",
            guaranteed_amount: "",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.guarantor)
              errors.guarantor = "Please select a guarantor";
            if (!values.guaranteed_amount || values.guaranteed_amount <= 0)
              errors.guaranteed_amount = "Enter a valid amount";
            return errors;
          }}
          onSubmit={async (values, { resetForm }) => {
            setLoading(true);
            try {
              await createGuaranteeRequest(values, token);
              toast.success("Guarantee request sent successfully!");
              resetForm();
              onClose();
              refetchApplication();
            } catch (error) {
              toast.error(
                error.response?.data?.detail ||
                  "Failed to send request. Please try again."
              );
            } finally {
              setLoading(false);
            }
          }}
        >
          {({ values, errors, touched, setFieldValue }) => {
            const selectedGuarantor = guarantors.find(
              (g) => g.member === values.guarantor
            );
            const maxAvailable = selectedGuarantor?.available_amount || 0;

            return (
              <Form className="space-y-6 mt-6">
                {/* Search + Select */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    Select Guarantor
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by member number or name..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-[#045e32]"
                    />
                  </div>

                  <div className="max-h-64 overflow-y-auto border rounded-lg bg-gray-50">
                    {filteredGuarantors.length === 0 ? (
                      <div className="p-12 text-center text-gray-500">
                        <UserX className="mx-auto h-12 w-12 mb-3 text-gray-300" />
                        <p className="font-medium">
                          No eligible guarantors found
                        </p>
                        <p className="text-sm mt-2">
                          {search
                            ? "Try a different search term"
                            : "Your savings already cover part of the loan"}
                        </p>
                      </div>
                    ) : (
                      filteredGuarantors.map((g) => (
                        <label
                          key={g.member}
                          className={`flex items-center justify-between p-4 cursor-pointer hover:bg-green-50 transition ${
                            values.guarantor === g.member
                              ? "bg-green-100 border-l-4 border-[#045e32]"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="guarantor"
                              value={g.member}
                              checked={values.guarantor === g.member}
                              onChange={() => {
                                setFieldValue("guarantor", g.member);
                                setFieldValue(
                                  "guaranteed_amount",
                                  Math.min(g.available_amount, remaining)
                                );
                              }}
                              className="h-4 w-4 text-[#045e32]"
                            />
                            <div>
                              <p className="font-medium text-gray-900">
                                {g.guarantor_name || g.member}
                              </p>
                              <p className="text-sm text-gray-600">
                                Member: {g.member}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-[#045e32]">
                              {formatCurrency(g.available_amount)}
                            </p>
                            <p className="text-xs text-gray-500">Available</p>
                          </div>
                        </label>
                      ))
                    )}
                  </div>

                  {errors.guarantor && touched.guarantor && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.guarantor}
                    </p>
                  )}
                </div>

                {/* Amount Input */}
                {values.guarantor && (
                  <div className="space-y-3 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <Label className="text-base font-semibold">
                      Amount to Request from{" "}
                      <span className="text-[#045e32]">
                        {selectedGuarantor?.guarantor_name ||
                          selectedGuarantor?.member}
                      </span>
                    </Label>
                    <Field
                      name="guaranteed_amount"
                      as={Input}
                      type="number"
                      placeholder={`Max: ${formatCurrency(maxAvailable)}`}
                      className="text-xl font-bold border-2 focus:border-[#045e32]"
                    />
                    <div className="text-sm space-y-1">
                      <p>
                        Max available:{" "}
                        <strong className="text-[#045e32]">
                          {formatCurrency(maxAvailable)}
                        </strong>
                      </p>
                      {Number(values.guaranteed_amount) > maxAvailable && (
                        <p className="text-red-600 font-medium">
                          Amount exceeds available guarantee
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      loading || !values.guarantor || !values.guaranteed_amount
                    }
                    className="flex-1 bg-[#045e32] hover:bg-[#022007] text-white font-semibold text-lg py-6"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending Request...
                      </>
                    ) : (
                      "Send Guarantee Request"
                    )}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
