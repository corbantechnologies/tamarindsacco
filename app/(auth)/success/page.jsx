"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-green-600 to-[#78e08f] relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-8">
        <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Image
                  src="/logoNoBg.png"
                  width={96}
                  height={96}
                  alt="Mzedu SACCO Logo"
                  className="w-24 h-24 rounded-full shadow-2xl"
                />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                Mzedu SACCO
              </h1>
              <p className="text-lg text-gray-500">The SACCO for everyone</p>
            </div>
            <div className="flex flex-col items-center space-y-6">
              <CheckCircle2
                className="w-12 h-12 text-primary"
                aria-hidden="true"
              />
              <h2 className="text-2xl font-bold text-primary">
                Application Received
              </h2>
              <p className="text-base sm:text-lg text-gray-700 text-center">
                Your application has been received and is being reviewed. You
                will receive an email upon approval.
              </p>
              <Button
                asChild
                className="w-full sm:w-auto h-12 text-lg font-semibold bg-primary hover:bg-[#067a46] text-white transition-colors"
              >
                <Link href="/" aria-label="Return to home page">
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SuccessPage;
