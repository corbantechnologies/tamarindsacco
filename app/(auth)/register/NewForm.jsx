"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpMember } from "@/services/members";
import { RegistrationSchema } from "@/validation";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  UserPlus,
  Fingerprint,
  Briefcase,
  Lock,
} from "lucide-react";

const steps = [
  {
    name: "Personal Details",
    fields: [
      "salutation",
      "first_name",
      "middle_name",
      "last_name",
      "email",
      "phone",
      "gender",
    ],
    icon: UserPlus,
  },
  {
    name: "Identification",
    fields: ["id_type", "id_number", "tax_pin"],
    icon: Fingerprint,
  },
  {
    name: "Employment",
    fields: ["employment_type", "member_no"],
    icon: Briefcase,
  },
  {
    name: "Security",
    fields: ["password", "confirmPassword"],
    icon: Lock,
  },
];

const StepIndicator = ({ currentStep }) => (
  <div className="md:max-w-3xl md:mx-auto flex justify-between items-center mb-8 space-x-2">
    {steps.map((step, index) => {
      const isCurrent = index === currentStep;
      const isCompleted = index < currentStep;
      const Icon = step.icon;
      return (
        <div key={step.name} className="flex items-center flex-1 gap-2">
          <Icon className={`size-6
                ${
                    isCurrent
                    ? "text-blue-600"
                    : isCompleted
                    ? "text-green-500"
                    : "text-gray-600"
                }
                `} />
          <p
            className={`text-sm text-center font-medium ${
                isCurrent
                ? "text-blue-600"
                : isCompleted
                ? "text-green-500"
                : "text-gray-600"
            }`}
          >
            {step.name}
          </p>
        </div>
      );
    })}
  </div>
);

const validateStep = async (values, stepIndex, validationSchema) => {
  const stepFields = steps[stepIndex].fields;
  const errors = {};

  const stepValues = stepFields.reduce((acc, field) => {
    if (field === "member_no") {
      const shouldValidate =
        values.employment_type &&
        values.employment_type !== "Self-Employed" &&
        values.employment_type !== "Not Employed";
      if (shouldValidate) {
        acc[field] = values[field];
      }
    } else {
      acc[field] = values[field];
    }
    return acc;
  }, {});

  try {
    await validationSchema.validate(stepValues, {
      abortEarly: false,
      context: { fields: stepFields },
    });
    return {};
  } catch (err) {
    err.inner.forEach((error) => {
      if (stepFields.includes(error.path)) {
        errors[error.path] = error.message;
      }
    });
    return errors;
  }
};

function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const totalSteps = steps.length;
  const isLastStep = currentStep === totalSteps - 1;

  const handleNext = async (values, setErrors) => {
    setLoading(true);
    const errors = await validateStep(values, currentStep, RegistrationSchema);
    setLoading(false);

    if (Object.keys(errors).length === 0) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setErrors(errors);
      toast.error("Please fill in all required fields correctly.");
    }
  };

  const handleSubmit = async (values, actions) => {
    setLoading(true);
    const errors = await validateStep(
      values,
      totalSteps - 1,
      RegistrationSchema
    );

    if (Object.keys(errors).length > 0) {
      actions.setErrors(errors);
      setLoading(false);
      toast.error("Please correct the errors before submitting.");
      setCurrentStep(totalSteps - 1);
      return;
    }

    try {
      await signUpMember(values);
      toast.success("Registration successful!");
      router.push("/success");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="p-8">
        <div className="w-full relative md:max-w-4xl mx-auto">
          <div className="fixed md:w-4xl z-50 bg-white">
        <StepIndicator currentStep={currentStep} />
            <h1 className="text-3xl sm:text-4xl font-semibold mb-2">
              Welcome to Mzedu SACCO
            </h1>
            <p className=" text-gray-500">Setup your personal account</p>
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
            onSubmit={handleSubmit}
          >
            {({ values, setErrors, setFieldValue }) => (
              <Form className="space-y-6 pt-44">
                {currentStep === 0 && (
                  <section>
                    <h2 className="text-2xl mb-6 flex items-center gap-2 text-gray-600">
                      <UserPlus className="w-6 h-6" />
                      Step 1: Personal Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="salutation"
                          className="text-sm font-medium text-gray-700"
                        >
                          Salutation *
                        </Label>
                        <Field
                          as="select"
                          name="salutation"
                          id="salutation"
                          className="w-full border border-black rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                          <option value="">Select Salutation</option>
                          <option value="Mr">Mr</option>
                          <option value="Mrs">Mrs</option>
                          <option value="Miss">Miss</option>
                          <option value="Ms">Ms</option>
                          <option value="Dr">Dr</option>
                          <option value="Prof">Prof</option>
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
                          className="border bg-white rounded-md text-base"
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
                          className="border-gray-300 rounded-md text-base"
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
                          className="border-gray-300 rounded-md text-base"
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
                          className="border-gray-300 rounded-md text-base"
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
                          className="border-gray-300 rounded-md text-base"
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
                        <Field
                          as="select"
                          name="gender"
                          id="gender"
                          className="w-full border border-black rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </Field>
                        <ErrorMessage
                          name="gender"
                          component="div"
                          className="text-sm text-red-500"
                        />
                      </div>
                    </div>
                  </section>
                )}

                {/* STEP 2: Identification */}
                {currentStep === 1 && (
                  <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-600">
                      <Fingerprint className="w-6 h-6" />
                      Step 2: Identification
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="id_type"
                          className="text-sm font-medium text-gray-700"
                        >
                          ID Type *
                        </Label>
                        <Field
                          as="select"
                          name="id_type"
                          id="id_type"
                          className="w-full border border-black rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                          <option value="">Select ID Type</option>
                          <option value="National ID">National ID</option>
                          <option value="Passport">Passport</option>
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
                          className="border-gray-300 rounded-md text-base"
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
                          className="border-gray-300 rounded-md text-base"
                        />
                        <ErrorMessage
                          name="tax_pin"
                          component="div"
                          className="text-sm text-red-500"
                        />
                      </div>
                    </div>
                  </section>
                )}

                {/* STEP 3: Employment */}
                {currentStep === 2 && (
                  <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-600">
                      <Briefcase className="w-6 h-6" />
                      Step 3: Employment
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="employment_type"
                          className="text-sm font-medium text-gray-700"
                        >
                          Employment Type *
                        </Label>
                        <Field
                          as="select"
                          name="employment_type"
                          id="employment_type"
                          className="w-full border border-black rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                          <option value="">Select Employment Type</option>
                          <option value="Permanent">Permanent</option>
                          <option value="Casual">Casual</option>
                          <option value="Contract">Contract</option>
                          <option value="Self-Employed">Self-Employed</option>
                          <option value="Not Employed">Not Employed</option>
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
                              className="border-gray-300 rounded-md text-base"
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
                )}

                {/* STEP 4: Security */}
                {currentStep === 3 && (
                  <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-600">
                      <Lock className="w-6 h-6" />
                      Step 4: Security
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
                            className="border-gray-300 rounded-md text-base pr-10"
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
                            className="border-gray-300 rounded-md text-base pr-10"
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
                )}

                {/* Navigation Buttons */}
                <div className="pt-6 flex justify-between">
                  {currentStep > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                      className="h-10 text-lg font-semibold"
                    >
                      Previous
                    </Button>
                  )}

                  {!isLastStep && (
                    <Button
                      type="button"
                      onClick={() => handleNext(values, setErrors)}
                      className={`h-10 text-lg font-semibold text-white transition-colors ${
                        currentStep === 0 ? "ml-auto" : ""
                      }`}
                      disabled={loading}
                    >
                      {loading ? "Checking..." : "Next Step"}
                    </Button>
                  )}

                  {isLastStep && (
                    <Button
                      type="submit"
                      className="w-full md:w-auto h-12 text-lg font-semibold text-white transition-colors ml-auto"
                      disabled={loading}
                    >
                      {loading ? "Registering..." : "Register Now"}
                    </Button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Back to login link or similar */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?
          <a
            onClick={() => router.push("/login")}
            className="text-primary hover:underline cursor-pointer ml-1"
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;
