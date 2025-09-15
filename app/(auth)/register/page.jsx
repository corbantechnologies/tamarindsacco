"use client";

import React from "react";
import RegisterForm from "./RegisterForm";

function MemberSignUp() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#cc5500] via-orange-400 to-[#ffcc00] relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-8">
        <RegisterForm />
      </div>
    </div>
  );
}

export default MemberSignUp;
