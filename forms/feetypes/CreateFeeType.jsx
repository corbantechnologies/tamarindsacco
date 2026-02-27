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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { createFeeType } from "@/services/feetypes";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";

const CreateFeeType = ({ isOpen, onClose, refetchFeeTypes }) => {
  const [loading, setLoading] = useState(false);
  const auth = useAxiosAuth();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[#cc5500]">
            Create New Fee Type
          </DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={{
            name: "",
            standard_amount: 0,
            is_income: false,
            is_expense: false,
            is_liability: false,
            is_asset: false,
            is_equity: false,
            is_active: true,
          }}
          onSubmit={async (values) => {
            setLoading(true);
            try {
              await createFeeType(values, auth);
              toast?.success("Fee type created successfully!");
              onClose();
              refetchFeeTypes();
            } catch (error) {
              toast?.error("Failed to create fee type!");
            } finally {
              setLoading(false);
            }
          }}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-black">
                  Name
                </Label>
                <Field
                  as={Input}
                  id="name"
                  name="name"
                  className="border-black focus:ring-[#cc5500]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="standard_amount" className="text-black">
                  Standard Amount
                </Label>
                <Field
                  as={Input}
                  type="number"
                  id="standard_amount"
                  name="standard_amount"
                  className="border-black focus:ring-[#cc5500]"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_income"
                  checked={values.is_income}
                  onCheckedChange={(checked) => {
                    setFieldValue("is_income", checked);
                    if (checked) {
                      setFieldValue("is_expense", false);
                      setFieldValue("is_liability", false);
                      setFieldValue("is_asset", false);
                      setFieldValue("is_equity", false);
                    }
                  }}
                />
                <Label htmlFor="is_income" className="text-black font-medium">
                  Is Income?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_expense"
                  checked={values.is_expense}
                  onCheckedChange={(checked) => {
                    setFieldValue("is_expense", checked);
                    if (checked) {
                      setFieldValue("is_income", false);
                      setFieldValue("is_liability", false);
                      setFieldValue("is_asset", false);
                      setFieldValue("is_equity", false);
                    }
                  }}
                />
                <Label htmlFor="is_expense" className="text-black font-medium">
                  Is Expense?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_liability"
                  checked={values.is_liability}
                  onCheckedChange={(checked) => {
                    setFieldValue("is_liability", checked);
                    if (checked) {
                      setFieldValue("is_income", false);
                      setFieldValue("is_expense", false);
                      setFieldValue("is_asset", false);
                      setFieldValue("is_equity", false);
                    }
                  }}
                />
                <Label htmlFor="is_liability" className="text-black font-medium">
                  Is Liability?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_asset"
                  checked={values.is_asset}
                  onCheckedChange={(checked) => {
                    setFieldValue("is_asset", checked);
                    if (checked) {
                      setFieldValue("is_income", false);
                      setFieldValue("is_expense", false);
                      setFieldValue("is_liability", false);
                      setFieldValue("is_equity", false);
                    }
                  }}
                />
                <Label htmlFor="is_asset" className="text-black font-medium">
                  Is Asset?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_equity"
                  checked={values.is_equity}
                  onCheckedChange={(checked) => {
                    setFieldValue("is_equity", checked);
                    if (checked) {
                      setFieldValue("is_income", false);
                      setFieldValue("is_expense", false);
                      setFieldValue("is_liability", false);
                      setFieldValue("is_asset", false);
                    }
                  }}
                />
                <Label htmlFor="is_equity" className="text-black font-medium">
                  Is Equity?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={values.is_active}
                  onCheckedChange={(checked) =>
                    setFieldValue("is_active", checked)
                  }
                />
                <Label htmlFor="is_active" className="text-black font-medium">
                  Is Active?
                </Label>
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
                  className="bg-[#cc5500] hover:bg-[#e66b00] text-white"
                  disabled={loading || !auth.isEnabled}
                >
                  {loading ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFeeType;
