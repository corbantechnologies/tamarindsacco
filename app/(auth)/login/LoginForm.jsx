"use client";
import { Label } from "@radix-ui/react-label";
import { Eye, EyeOff, Lock } from "lucide-react";
import { getSession, signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import toast from "react-hot-toast";

function LoginForm() {
  const [loading, setLoading] = useTransition();
  const [member_no, setMemberNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(async () => {
      const response = await signIn("credentials", {
        redirect: false,
        member_no,
        password,
      });
      const session = await getSession();
      if (response?.error) {
        toast?.error("Invalid member number or password");
      } else {
        toast?.success("Login successful! Redirecting...");
        if (session?.user?.is_staff === true) {
          // TODO: Temporarily redirecting all staff to sacco admin dashboard
          router.push("/sacco-admin/dashboard");
        } else if (session?.user?.is_system_admin === true) {
          router.push("/sacco-admin/dashboard");
        } else if (session?.user?.is_member === true)
          router.push("/member/dashboard");
        else {
          router.push("/");
        }
      }
    });
  };

  return (
    <div>
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <Image
            src="/logoNoBg.png"
            alt="Logo"
            width={100}
            height={100}
            className="mx-auto mb-4 rounded-full"
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tamarind SACCO
          </h1>
          <p className="text-gray-600">The SACCO for everyone</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Payroll Number */}
          <div className="space-y-2">
            <Label htmlFor="member_no">Payroll Number</Label>
            <input
              type="text"
              id="member_no"
              placeholder="Enter your member number or payroll number"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={member_no}
              onChange={(e) => setMemberNo(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
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
          <button
            type="submit"
            className="w-full bg-[#cc5500] hover:bg-[#ffcc00] text-white font-semibold py-2 rounded-md"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
