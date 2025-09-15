"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { signUpMember } from "@/services/members";
import { RegistrationSchema } from "@/validation";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff, UserPlus } from "lucide-react";

function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  return (
    <Card className="w-full max-w-5xl bg-white/95 backdrop-blur-sm shadow-2xl border-0">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/logoNoBg.png"
              width={96}
              height={96}
              alt="Tamarind SACCO Logo"
              className="w-24 h-24 rounded-full shadow-2xl"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#cc5500] mb-2">
            Tamarind SACCO
          </h1>
          <p className="text-lg text-gray-500">The SACCO for everyone</p>
        </div>

        <Formik
          initialValues={{
            salutation: "",
            first_name: "",
            middle_name: "",
            last_name: "",
            email: "",
            phone: "",
            gender: "",
            id_type: "",
            id_number: "",
            tax_pin: "",
            employment_type: "",
            member_no: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={RegistrationSchema}
          onSubmit={async (values) => {
            setLoading(true);
            try {
              await signUpMember(values);
              toast.success("Registration successful!");
              router.push("/success");
            } catch (error) {
              console.error(error);
              toast.error("Registration failed. Please try again.");
            } finally {
              setLoading(false);
            }
          }}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-8">
              {/* Personal Details */}
              <section>
                <h2 className="text-2xl font-bold text-[#cc5500] mb-6 flex items-center gap-2">
                  <UserPlus className="w-6 h-6" />
                  Personal Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="salutation"
                      className="text-sm font-medium text-gray-700"
                    >
                      Salutation *
                    </Label>
                    <Field as={Select} name="salutation">
                      <SelectTrigger>
                        <SelectValue placeholder="Select salutation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mr">Mr</SelectItem>
                        <SelectItem value="Mrs">Mrs</SelectItem>
                        <SelectItem value="Miss">Miss</SelectItem>
                        <SelectItem value="Ms">Ms</SelectItem>
                        <SelectItem value="Dr">Dr</SelectItem>
                        <SelectItem value="Prof">Prof</SelectItem>
                      </SelectContent>
                    </Field>
                    <ErrorMessage
                      name="salutation"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="first_name"
                      className="text-sm font-medium text-gray-700"
                    >
                      First Name *
                    </Label>
                    <Field
                      as={Input}
                      type="text"
                      name="first_name"
                      id="first_name"
                      placeholder="John"
                      className="border-gray-300 focus:ring-[#cc5500] focus:border-[#cc5500] rounded-md text-base"
                    />
                    <ErrorMessage
                      name="first_name"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="middle_name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Middle Name
                    </Label>
                    <Field
                      as={Input}
                      type="text"
                      name="middle_name"
                      id="middle_name"
                      placeholder="Middle name"
                      className="border-gray-300 focus:ring-[#cc5500] focus:border-[#cc5500] rounded-md text-base"
                    />
                    <ErrorMessage
                      name="middle_name"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="last_name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Last Name *
                    </Label>
                    <Field
                      as={Input}
                      type="text"
                      name="last_name"
                      id="last_name"
                      placeholder="Doe"
                      className="border-gray-300 focus:ring-[#cc5500] focus:border-[#cc5500] rounded-md text-base"
                    />
                    <ErrorMessage
                      name="last_name"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email *
                    </Label>
                    <Field
                      as={Input}
                      type="email"
                      name="email"
                      id="email"
                      placeholder="john.doe@example.com"
                      className="border-gray-300 focus:ring-[#cc5500] focus:border-[#cc5500] rounded-md text-base"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium text-gray-700"
                    >
                      Phone *
                    </Label>
                    <Field
                      as={Input}
                      type="text"
                      name="phone"
                      id="phone"
                      placeholder="0712345678"
                      className="border-gray-300 focus:ring-[#cc5500] focus:border-[#cc5500] rounded-md text-base"
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="gender"
                      className="text-sm font-medium text-gray-700"
                    >
                      Gender *
                    </Label>
                    <Field as={Select} name="gender">
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Field>
                    <ErrorMessage
                      name="gender"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                </div>
              </section>

              {/* Identification */}
              <section>
                <h2 className="text-2xl font-bold text-[#cc5500] mb-6">
                  Identification
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="id_type"
                      className="text-sm font-medium text-gray-700"
                    >
                      ID Type *
                    </Label>
                    <Field as={Select} name="id_type">
                      <SelectTrigger>
                        <SelectValue placeholder="Select ID type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="National ID">National ID</SelectItem>
                        <SelectItem value="Passport">Passport</SelectItem>
                      </SelectContent>
                    </Field>
                    <ErrorMessage
                      name="id_type"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="id_number"
                      className="text-sm font-medium text-gray-700"
                    >
                      ID Number *
                    </Label>
                    <Field
                      as={Input}
                      type="text"
                      name="id_number"
                      id="id_number"
                      placeholder="12345678"
                      className="border-gray-300 focus:ring-[#cc5500] focus:border-[#cc5500] rounded-md text-base"
                    />
                    <ErrorMessage
                      name="id_number"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="tax_pin"
                      className="text-sm font-medium text-gray-700"
                    >
                      Tax PIN *
                    </Label>
                    <Field
                      as={Input}
                      type="text"
                      name="tax_pin"
                      id="tax_pin"
                      placeholder="A123456789Z"
                      className="border-gray-300 focus:ring-[#cc5500] focus:border-[#cc5500] rounded-md text-base"
                    />
                    <ErrorMessage
                      name="tax_pin"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                </div>
              </section>

              {/* Employment */}
              <section>
                <h2 className="text-2xl font-bold text-[#cc5500] mb-6">
                  Employment
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="employment_type"
                      className="text-sm font-medium text-gray-700"
                    >
                      Employment Type *
                    </Label>
                    <Field as={Select} name="employment_type">
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Permanent">Permanent</SelectItem>
                        <SelectItem value="Casual">Casual</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Self-Employed">
                          Self-Employed
                        </SelectItem>
                        <SelectItem value="Not Employed">
                          Not Employed
                        </SelectItem>
                      </SelectContent>
                    </Field>
                    <ErrorMessage
                      name="employment_type"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                  {values.employment_type !== "Self-Employed" &&
                    values.employment_type !== "Not Employed" &&
                    values.employment_type && (
                      <div className="space-y-2">
                        <Label
                          htmlFor="member_no"
                          className="text-sm font-medium text-gray-700"
                        >
                          Payroll Number
                        </Label>
                        <Field
                          as={Input}
                          type="text"
                          name="member_no"
                          id="member_no"
                          placeholder="PAY12345"
                          className="border-gray-300 focus:ring-[#cc5500] focus:border-[#cc5500] rounded-md text-base"
                        />
                        <ErrorMessage
                          name="member_no"
                          component="div"
                          className="text-sm text-red-500"
                        />
                      </div>
                    )}
                </div>
              </section>

              {/* Password */}
              <section>
                <h2 className="text-2xl font-bold text-[#cc5500] mb-6">
                  Security
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Password *
                    </Label>
                    <div className="relative">
                      <Field
                        as={Input}
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder="Enter password"
                        className="border-gray-300 focus:ring-[#cc5500] focus:border-[#cc5500] rounded-md text-base pr-10"
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
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-gray-700"
                    >
                      Confirm Password *
                    </Label>
                    <div className="relative">
                      <Field
                        as={Input}
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="Confirm password"
                        className="border-gray-300 focus:ring-[#cc5500] focus:border-[#cc5500] rounded-md text-base pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-500" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-500" />
                        )}
                        <span className="sr-only">
                          {showConfirmPassword
                            ? "Hide password"
                            : "Show password"}
                        </span>
                      </button>
                    </div>
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                </div>
              </section>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-semibold bg-[#cc5500] hover:bg-[#e66b00] text-white transition-colors"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register Now"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}

export default RegisterForm;
