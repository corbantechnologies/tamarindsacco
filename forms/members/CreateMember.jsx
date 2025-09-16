"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { addMember } from "@/services/members";
import { Field, Form, Formik } from "formik";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

function CreateMember({ closeModal, refetchMembers, openModal }) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const token = useAxiosAuth();

  return (
    <Dialog open={openModal} onOpenChange={closeModal}>
      <DialogContent className="w-full h-auto sm:h-auto p-4 sm:p-6 bg-white overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#cc5500]">
            Create New Member
          </DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={{
            salutation: "",
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            gender: "",
            employment_type: "",
            member_no: "",
            password: "",
          }}
          onSubmit={async (values) => {
            try {
              setLoading(true);
              await addMember(values, token);
              toast?.success("Member created successfully!");
              closeModal();
              refetchMembers();
            } catch (error) {
              toast?.error("Failed to create member!");
            } finally {
              setLoading(false);
            }
          }}
        >
          {({ values }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="salutation"
                    className="text-base text-black font-medium"
                  >
                    Salutation
                  </Label>
                  <Field
                    as="select"
                    name="salutation"
                    id="salutation"
                    className="w-full border border-black rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-[#cc5500] focus:border-[#cc5500] transition-colors"
                  >
                    <option value="">Select Salutation</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Miss">Miss</option>
                    <option value="Ms">Ms</option>
                    <option value="Dr">Dr</option>
                    <option value="Prof">Prof</option>
                  </Field>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="first_name"
                    className="text-base text-black font-medium"
                  >
                    First Name
                  </Label>
                  <Field
                    as={Input}
                    type="text"
                    name="first_name"
                    id="first_name"
                    placeholder="John"
                    className="border-black focus:ring-[#cc5500] focus:border-[#cc5500] rounded-md text-base py-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="last_name"
                    className="text-base text-black font-medium"
                  >
                    Last Name
                  </Label>
                  <Field
                    as={Input}
                    type="text"
                    name="last_name"
                    id="last_name"
                    placeholder="Doe"
                    className="border-black focus:ring-[#cc5500] focus:border-[#cc5500] rounded-md text-base py-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="gender"
                    className="text-base text-black font-medium"
                  >
                    Gender
                  </Label>
                  <Field
                    as="select"
                    name="gender"
                    id="gender"
                    className="w-full border border-black rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-[#cc5500] focus:border-[#cc5500] transition-colors"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Field>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="employment_type"
                    className="text-base text-black font-medium"
                  >
                    Employment Type
                  </Label>
                  <Field
                    as="select"
                    name="employment_type"
                    id="employment_type"
                    className="w-full border border-black rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-[#cc5500] focus:border-[#cc5500] transition-colors"
                  >
                    <option value="">Select Employment Type</option>
                    <option value="Permanent">Permanent</option>
                    <option value="Casual">Casual</option>
                    <option value="Contract">Contract</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Not Employed">Not Employed</option>
                  </Field>
                </div>

                {values.employment_type !== "Self-Employed" &&
                  values.employment_type !== "Not Employed" && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="member_no"
                        className="text-base text-black font-medium"
                      >
                        Payroll Number
                      </Label>
                      <Field
                        as={Input}
                        type="text"
                        name="member_no"
                        id="member_no"
                        className="border-black focus:ring-[#cc5500] focus:border-[#cc5500] rounded-md text-base py-2"
                      />
                    </div>
                  )}

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-base text-black font-medium"
                  >
                    Email
                  </Label>
                  <Field
                    as={Input}
                    type="email"
                    name="email"
                    id="email"
                    placeholder="jdoe@example.com"
                    className="border-black focus:ring-[#cc5500] focus:border-[#cc5500] rounded-md text-base py-2"
                  />
                </div>
                {/* if no email provided, show the password input */}
                {values.email === "" && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-base text-black font-medium"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Field
                        as={Input}
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder="Enter password"
                        className="border-black focus:ring-[#cc5500] focus:border-[#cc5500] rounded-md text-base py-2"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-500" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-500" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  className="border-black text-black hover:bg-gray-100 text-base py-2 px-4 w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#cc5500] hover:bg-[#e66b00] text-white text-base py-2 px-4 w-full sm:w-auto"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Member"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

export default CreateMember;
