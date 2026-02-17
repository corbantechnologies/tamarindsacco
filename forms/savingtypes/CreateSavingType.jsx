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
import { createSavingType } from "@/services/savingstypes";
import { Field, Form, Formik } from "formik";
import React, { useTransition } from "react";
import toast from "react-hot-toast";

const CreateSavingTypeModal = ({ isOpen, onClose, refetchSavingTypes }) => {
  const [loading, setLoading] = useTransition();
  const auth = useAxiosAuth();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[#cc5500]">
            Create New Saving Type
          </DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={{
            name: "",
            interest_rate: 0,
            is_guaranteed: false,
          }}
          onSubmit={async (values) => {
            try {
              setLoading(async () => {
                await createSavingType(values, auth);
                toast?.success("Saving type created successfully!");
                onClose();
                refetchSavingTypes();
              });
            } catch (error) {
              toast?.error("Failed to create saving type!");
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
                <Label htmlFor="interest_rate" className="text-black">
                  Interest Rate (%)
                </Label>
                <Field
                  as={Input}
                  type="number"
                  id="interest_rate"
                  name="interest_rate"
                  className="border-black focus:ring-[#cc5500]"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_guaranteed"
                  checked={values.is_guaranteed}
                  onCheckedChange={(checked) =>
                    setFieldValue("is_guaranteed", checked)
                  }
                />
                <Label htmlFor="is_guaranteed" className="text-black font-medium">
                  Is Guaranteed?
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

export default CreateSavingTypeModal;
