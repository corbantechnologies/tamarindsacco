"use client";

import React from "react";
// import RegisterForm from "./RegisterForm";
import Image from "next/image";
import RegisterForm from "./NewForm";

function MemberSignUp() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Image
                        src="/mzeduLogo-noBg.png"
                        alt="Mzedu SACCO Logo"
                        width={100}
                        height={100}
                        className="mx-auto absolute top-4 left-4"
                      />
      <div className="relative h-screen p-4 overflow-y-auto">
        <RegisterForm />
      </div>
    </div>
  );
}

export default MemberSignUp;
