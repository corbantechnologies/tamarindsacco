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
import useUserId from "@/hooks/authentication/useUserId";
import { updateMember } from "@/services/members";
import { counties } from "@/data/counties";

function UpdateAccount({ member, isOpen, onClose, refetchMember }) {
  const [loading, setLoading] = useState(false);
  const token = useAxiosAuth();
  const userId = useUserId();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[#045e32]">Update Account</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={{
            salutation: member?.salutation || "",
            email: member?.email || "",
            first_name: member?.first_name || "",
            middle_name: member?.middle_name || "",
            last_name: member?.last_name || "",
            dob: member?.dob || "",
            avatar: null,
            gender: member?.gender || "",
            id_type: member?.id_type || "",
            id_number: member?.id_number || "",
            tax_pin: member?.tax_pin || "",
            phone: member?.phone || "",
            county: member?.county || "",
            employment_type: member?.employment_type || "",
            employer: member?.employer || "",
            job_title: member?.job_title || "",
          }}
          onSubmit={async (values) => {
            setLoading(true);
            try {
              const formData = new FormData();

              if (values.avatar) {
                formData.append("avatar", values.avatar);
              }

              formData.append("salutation", values.salutation);
              formData.append("email", values.email);
              formData.append("first_name", values.first_name);
              formData.append("middle_name", values.middle_name);
              formData.append("last_name", values.last_name);
              formData.append("dob", values.dob);
              formData.append("gender", values.gender);
              formData.append("id_type", values.id_type);
              formData.append("id_number", values.id_number);
              formData.append("tax_pin", values.tax_pin);
              formData.append("phone", values.phone);
              formData.append("county", values.county);
              formData.append("employment_type", values.employment_type);
              formData.append("employer", values.employer);
              formData.append("job_title", values.job_title);

              await updateMember(userId, formData, token);
              onClose();
              toast.success("Account updated successfully!");
              refetchMember();
            } catch (error) {
              console.log(error);
              toast.error("Failed to update account. Please try again.");
            } finally {
              setLoading(false);
            }
          }}
        >
          {({ values, setFieldValue }) => (
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
                    className="w-full border border-black rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-[#045e32] focus:border-[#045e32] transition-colors"
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
                    htmlFor="avatar"
                    className="text-base text-black font-medium"
                  >
                    Avatar
                  </Label>
                  <input
                    type="file"
                    name="avatar"
                    id="avatar"
                    onChange={(e) => setFieldValue("avatar", e.target.files[0])}
                    className="border-black focus:ring-[#045e32] focus:border-[#045e32] rounded-md text-base py-2"
                  />
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
                    value={values.first_name}
                    className="border-black focus:ring-[#045e32] focus:border-[#045e32] rounded-md text-base py-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="middle_name"
                    className="text-base text-black font-medium"
                  >
                    Middle Name
                  </Label>
                  <Field
                    as={Input}
                    type="text"
                    name="middle_name"
                    id="middle_name"
                    value={values.middle_name}
                    className="border-black focus:ring-[#045e32] focus:border-[#045e32] rounded-md text-base py-2"
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
                    value={values.last_name}
                    className="border-black focus:ring-[#045e32] focus:border-[#045e32] rounded-md text-base py-2"
                  />
                </div>

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
                    value={values.email}
                    className="border-black focus:ring-[#045e32] focus:border-[#045e32] rounded-md text-base py-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="dob"
                    className="text-base text-black font-medium"
                  >
                    Date of Birth
                  </Label>
                  <Field
                    as={Input}
                    type="date"
                    name="dob"
                    id="dob"
                    value={values.dob}
                    className="border-black focus:ring-[#045e32] focus:border-[#045e32] rounded-md text-base py-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-base text-black font-medium"
                  >
                    Phone
                  </Label>
                  <Field
                    as={Input}
                    type="tel"
                    name="phone"
                    id="phone"
                    value={values.phone}
                    className="border-black focus:ring-[#045e32] focus:border-[#045e32] rounded-md text-base py-2"
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
                    className="w-full border border-black rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-[#045e32] focus:border-[#045e32] transition-colors"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Field>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="id_type"
                    className="text-base text-black font-medium"
                  >
                    ID Type
                  </Label>
                  <Field
                    as="select"
                    name="id_type"
                    id="id_type"
                    className="w-full border border-black rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-[#045e32] focus:border-[#045e32] transition-colors"
                  >
                    <option value="">Select ID Type</option>
                    <option value="National ID">National ID</option>
                    <option value="Passport">Passport</option>
                  </Field>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="id_number"
                    className="text-base text-black font-medium"
                  >
                    ID Number
                  </Label>
                  <Field
                    as={Input}
                    type="text"
                    name="id_number"
                    id="id_number"
                    value={values.id_number}
                    className="border-black focus:ring-[#045e32] focus:border-[#045e32] rounded-md text-base py-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="tax_pin"
                    className="text-base text-black font-medium"
                  >
                    Tax/KRA Pin
                  </Label>
                  <Field
                    as={Input}
                    type="text"
                    name="tax_pin"
                    id="tax_pin"
                    value={values.tax_pin}
                    className="border-black focus:ring-[#045e32] focus:border-[#045e32] rounded-md text-base py-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="county"
                    className="text-base text-black font-medium"
                  >
                    County
                  </Label>
                  <Field
                    as="select"
                    name="county"
                    id="county"
                    className="w-full border border-black rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-[#045e32] focus:border-[#045e32] transition-colors"
                  >
                    <option value="">Select County</option>
                    <option value="Mombasa">Mombasa</option>
                    <option value="Kwale">Kwale</option>
                    <option value="Kilifi">Kilifi</option>
                    <option value="Tana River">Tana River</option>
                    <option value="Lamu">Lamu</option>
                    <option value="Taita Taveta">Taita Taveta</option>
                    <option value="Garissa">Garissa</option>
                    <option value="Wajir">Wajir</option>
                    <option value="Mandera">Mandera</option>
                    <option value="Marsabit">Marsabit</option>
                    <option value="Isiolo">Isiolo</option>
                    <option value="Meru">Meru</option>
                    <option value="Tharaka Nithi">Tharaka Nithi</option>
                    <option value="Embu">Embu</option>
                    <option value="Kitui">Kitui</option>
                    <option value="Machakos">Machakos</option>
                    <option value="Makueni">Makueni</option>
                    <option value="Nyandarua">Nyandarua</option>
                    <option value="Nyeri">Nyeri</option>
                    <option value="Kirinyaga">Kirinyaga</option>
                    <option value="Muranga">Muranga</option>
                    <option value="Kiambu">Kiambu</option>
                    <option value="Turkana">Turkana</option>
                    <option value="West Pokot">West Pokot</option>
                    <option value="Samburu">Samburu</option>
                    <option value="Trans Nzoia">Trans Nzoia</option>
                    <option value="Uasin Gishu">Uasin Gishu</option>
                    <option value="Elgeyo Marakwet">Elgeyo Marakwet</option>
                    <option value="Nandi">Nandi</option>
                    <option value="Baringo">Baringo</option>
                    <option value="Laikipia">Laikipia</option>
                    <option value="Nakuru">Nakuru</option>
                    <option value="Narok">Narok</option>
                    <option value="Kajiado">Kajiado</option>
                    <option value="Kericho">Kericho</option>
                    <option value="Bomet">Bomet</option>
                    <option value="Kakamega">Kakamega</option>
                    <option value="Vihiga">Vihiga</option>
                    <option value="Bungoma">Bungoma</option>
                    <option value="Busia">Busia</option>
                    <option value="Siaya">Siaya</option>
                    <option value="Kisumu">Kisumu</option>
                    <option value="Homa Bay">Homa Bay</option>
                    <option value="Migori">Migori</option>
                    <option value="Kisii">Kisii</option>
                    <option value="Nyamira">Nyamira</option>
                    <option value="Nairobi">Nairobi</option>
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
                    className="w-full border border-black rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-[#045e32] focus:border-[#045e32] transition-colors"
                  >
                    <option value="">Select Employment Type</option>
                    <option value="Permanent">Permanent</option>
                    <option value="Casual">Casual</option>
                    <option value="Contract">Contract</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Not Employed">Not Employed</option>
                  </Field>
                </div>

                {values?.employment_type !== "Self-Employed" &&
                  values?.employment_type !== "Not Employed" && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="employer"
                        className="text-base text-black font-medium"
                      >
                        Employer Name
                      </Label>
                      <Field
                        as={Input}
                        type="text"
                        name="employer"
                        id="employer"
                        value={values.employer}
                        className="border-black focus:ring-[#045e32] focus:border-[#045e32] rounded-md text-base py-2"
                      />
                    </div>
                  )}

                <div className="space-y-2">
                  <Label
                    htmlFor="job_title"
                    className="text-base text-black font-medium"
                  >
                    Job Title
                  </Label>
                  <Field
                    as={Input}
                    type="text"
                    name="job_title"
                    id="job_title"
                    value={values.job_title}
                    className="border-black focus:ring-[#045e32] focus:border-[#045e32] rounded-md text-base py-2"
                  />
                </div>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-black text-black hover:bg-gray-100 text-base py-2 px-4 w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#045e32] hover:bg-[#022007] text-white text-base py-2 px-4 w-full sm:w-auto"
                  disabled={loading}
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
}

export default UpdateAccount;
