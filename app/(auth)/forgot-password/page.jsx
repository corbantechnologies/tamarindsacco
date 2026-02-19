"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword } from "@/services/members";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await forgotPassword({ email });
      if (response?.status === "success" || response?.message) {
        toast.success(response?.message || "Reset code sent to your email!");
        router.push("/reset-password");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reset code.");
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
            <h1 className="text-2xl font-bold text-black">Forgot Password</h1>
            <p className="text-gray-500 text-sm">
              Enter your email to receive a reset code
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-black">
                Email Address
              </Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="border-black focus:ring-[#cc5500] focus:border-[#cc5500]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#cc5500] hover:bg-[#e66b00] text-white"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-gray-600 hover:text-[#cc5500] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;