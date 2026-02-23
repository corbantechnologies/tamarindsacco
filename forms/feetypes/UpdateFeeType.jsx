// only the name can be updated and is_active
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
import { Checkbox } from "@/components/ui/checkbox";

import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { updateFeeType } from "@/services/feetypes";
import { Field, Form, Formik } from "formik";
import React, { useTransition } from "react";
import toast from "react-hot-toast";

const UpdateFeeType = ({ isOpen, onClose, feeType, refetchFeeTypes }) => {
  const [loading, setLoading] = useTransition();
  const auth = useAxiosAuth();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[#045e32]">
            Update Fee Type: {feeType?.name}
          </DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={{
            name: feeType?.name || "",
            is_active: feeType?.is_active ?? true,
          }}
          enableReinitialize
          onSubmit={async (values) => {
            try {
              setLoading(async () => {
                await updateFeeType(feeType?.reference, values, auth);
                toast?.success("Fee type updated successfully!");
                onClose();
                refetchFeeTypes();
              });
            } catch (error) {
              toast?.error("Failed to update fee type!");
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
                  className="border-black focus:ring-[#045e32]"
                  required
                />
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
                  className="bg-[#045e32] hover:bg-[#037a40] text-white"
                  disabled={loading || !auth.isEnabled}
                >
                  {loading ? "Updating..." : "Update"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateFeeType;
