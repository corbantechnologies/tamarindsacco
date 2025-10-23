"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { getSession, signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import toast from "react-hot-toast";

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [member_no, setMemberNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await signIn("credentials", {
        redirect: false,
        member_no,
        password,
      });
      const session = await getSession();
      if (response?.error) {
        toast?.error("Invalid member number or password");
        setLoading(false);
      } else {
        toast?.success("Login successful! Redirecting...");
        if (session?.user?.is_staff === true) {
          router.push("/sacco-admin/dashboard");
        } else if (session?.user?.is_system_admin === true) {
          router.push("/sacco-admin/dashboard");
        } else if (session?.user?.is_member === true) {
          router.push("/member/dashboard");
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      setLoading(false);
      toast?.error("Login failed. Please try again.");
    }
  };

  return (
    <div>
      <Image
            src="/auth-image-noBg-2.png"
            alt="Mzedu SACCO Logo"
            width={200}
            height={200}
            className="mx-auto"
          />
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black">Mzedu SACCO</h1>
          <p className="text-gray-500">The SACCO for everyone</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payroll Number */}
          <div className="space-y-2">
            <Label htmlFor="member_no" className="text-black">
              Payroll Number
            </Label>
            <Input
              type="text"
              id="member_no"
              placeholder="Enter your member number or payroll number"
              className="border"
              value={member_no}
              onChange={(e) => setMemberNo(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-black">
              Password
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                className="border"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>

          {/* TODO: Add forgot password link */}

          {/* Login Button */}
          <Button
            type="submit"
            className="w-full text-white"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          {/* Register Link */}
          <p className="text-center">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-primary hover:underline">
              Register now
            </a>
          </p>
        </form>
    </div>
  );
}

export default LoginForm;
