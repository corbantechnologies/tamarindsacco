"use client";

import Image from "next/image";
import LoginForm from "./LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <Image
                  src="/mzeduLogo-noBg.png"
                  alt="Mzedu SACCO Logo"
                  width={100}
                  height={100}
                  className="mx-auto absolute top-4 left-4"
                />
      {/* <div className="absolute inset-0 bg-black/20"></div> */}
      <div className="relative z-10 w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
