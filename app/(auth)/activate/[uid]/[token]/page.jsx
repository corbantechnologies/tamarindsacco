"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { activateAccount } from "@/services/members";
import { PasswordSetupSchema } from "@/validation";
import { Field, Form, Formik } from "formik";
import { Eye, EyeOff, Info } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import toast from "react-hot-toast";

function AccountActivation() {
  const { uid, token } = useParams();
  const [loading, setLoading] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  return (
    <div className="flex justify-center items-center min-h-screen bg-white px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <Info className="w-12 h-12  mx-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold ">
            Account Activation
          </h1>
          <p className="text-gray-500 mt-2">
            Set your password to activate your Mzedu SACCO account
          </p>
        </div>

        <Formik
          initialValues={{
            uidb64: uid,
            token: token,
            password: "",
            confirmPassword: "",
          }}
          validationSchema={PasswordSetupSchema}
          onSubmit={async (values) => {
            try {
              setLoading(async () => {
                await activateAccount(values);
                toast?.success("Account Activated Successfully!");
                router.push("/login");
              });
            } catch (error) {
              toast?.error("Failed to activate account!");
            }
          }}
        >
          {({ values, errors, touched }) => (
            <Form className="space-y-6">
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
                    placeholder="Enter your password"
                    className="border-black   rounded-md text-base py-2 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-500" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-base text-black font-medium"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Field
                    as={Input}
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    className="border-black   rounded-md text-base py-2 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-500" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#cc5500] hover:bg-[#e66b00] text-white text-base py-2"
                disabled={loading}
              >
                {loading ? "Activating..." : "Activate Account"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default AccountActivation;
