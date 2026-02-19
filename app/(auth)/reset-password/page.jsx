"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/services/members";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword({ code, password });
      if (response?.status === "success" || response?.message) {
        toast.success("Password reset successful! Please login.");
        router.push("/login");
      } else {
        toast.error(response?.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#cc5500] via-orange-400 to-[#ffcc00] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <Image
              src="/logoNoBg.png"
              alt="Tamarind SACCO Logo"
              width={80}
              height={80}
              className="mx-auto mb-4 rounded-full"
            />
            <h1 className="text-2xl font-bold text-black">Reset Password</h1>
            <p className="text-gray-500 text-sm">Create a new password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-black">
                Reset Code
              </Label>
              <Input
                type="text"
                id="code"
                placeholder="Enter the code sent to your email"
                className="border-black focus:ring-[#cc5500] focus:border-[#cc5500]"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-black">
                New Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="New Password"
                  className="border-black focus:ring-[#cc5500] focus:border-[#cc5500]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-black">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirm New Password"
                  className="border-black focus:ring-[#cc5500] focus:border-[#cc5500]"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
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
            </div>

            <Button
              type="submit"
              className="w-full bg-[#cc5500] hover:bg-[#e66b00] text-white"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;