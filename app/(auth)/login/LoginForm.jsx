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
      console.log("signIn response:", response); // Log the response
      const session = await getSession();
      console.log("Session:", session); // Log the session
      if (response?.error) {
        toast?.error("Invalid member number or password");
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
      console.error("Login error:", error);
      toast?.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <Image
            src="/logoNoBg.png"
            alt="Tamarind SACCO Logo"
            width={100}
            height={100}
            className="mx-auto mb-4 rounded-full"
          />
          <h1 className="text-3xl font-bold text-black">Tamarind SACCO</h1>
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
              className="border-black focus:ring-[#cc5500] focus:border-[#cc5500]"
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
                className="border-black focus:ring-[#cc5500] focus:border-[#cc5500]"
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
            className="w-full bg-[#cc5500] hover:bg-[#e66b00] text-white"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
