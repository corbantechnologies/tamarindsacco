"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { addMember } from "@/services/members";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";

function CreateMember({ closeModal, refetchMembers, openModal }) {
  const [loading, setLoading] = useState(false);
  const token = useAxiosAuth();

  return (
    <Dialog open={openModal} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[#cc5500]">
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
            id_type: "",
            id_number: "",
            tax_pin: "",
            employment_type: "",
            member_no: "",
          }}
          onSubmit={async (values) => {
            try {
              setLoading(async () => {
                await addMember(values, token);
                toast?.success("Member created successfully!");
                closeModal();
                refetchMembers();
              });
            } catch (error) {
              console.error(error);
              toast?.error("Failed to create member!");
            }
          }}
        >
          {({ values }) => (
            <Form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="salutation">Salutation</Label>
                <Field
                  as={Select}
                  name="salutation"
                  id="salutation"
                  className="border-black focus:ring-[#cc5500]"
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
                <Label htmlFor="first_name">First Name</Label>
                <Field
                  as={Input}
                  type="text"
                  name="first_name"
                  id="first_name"
                  className="border-black focus:ring-[#cc5500]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Field
                  as={Input}
                  type="text"
                  name="last_name"
                  id="last_name"
                  className="border-black focus:ring-[#cc5500]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Field
                  as={Input}
                  type="email"
                  name="email"
                  id="email"
                  className="border-black focus:ring-[#cc5500]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Field
                  as={Input}
                  type="text"
                  name="phone"
                  id="phone"
                  className="border-black focus:ring-[#cc5500]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Field
                  as={Select}
                  name="gender"
                  id="gender"
                  className="border-black focus:ring-[#cc5500]"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Field>
              </div>

              <div className="space-y-2">
                <Label htmlFor="id_type">ID Type</Label>
                <Field
                  as={Select}
                  name="id_type"
                  id="id_type"
                  className="border-black focus:ring-[#cc5500]"
                >
                  <option value="">Select ID Type</option>
                  <option value="National ID">National ID</option>
                  <option value="Passport">Passport</option>
                </Field>
              </div>

              <div className="space-y-2">
                <Label htmlFor="id_number">ID Number</Label>
                <Field
                  as={Input}
                  type="text"
                  name="id_number"
                  id="id_number"
                  className="border-black focus:ring-[#cc5500]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tax_pin">Tax Pin</Label>
                <Field
                  as={Input}
                  type="text"
                  name="tax_pin"
                  id="tax_pin"
                  className="border-black focus:ring-[#cc5500]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employment_type">Employment Type</Label>
                <Field
                  as={Select}
                  name="employment_type"
                  id="employment_type"
                  className="border-black focus:ring-[#cc5500]"
                >
                  <option value="">Select Employment Type</option>
                  <option value="Permenent">Permenent</option>
                  <option value="Casual">Casual</option>
                  <option value="Contract">Contract</option>
                  <option value="Employed">Self-Employed</option>
                  <option value="Not Employed">Not Employed</option>
                </Field>
              </div>

              {/* hide if employment type is self employed or not employed. the system will automatically generate a payroll number */}
              {values.employment_type !== "Self-Employed" &&
                values.employment_type !== "Not Employed" && (
                  <div className="space-y-2">
                    <Label htmlFor="member_no">Payroll Number</Label>
                    <Field
                      as={Input}
                      type="text"
                      name="member_no"
                      id="member_no"
                      className="border-black focus:ring-[#cc5500]"
                    />
                  </div>
                )}
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
