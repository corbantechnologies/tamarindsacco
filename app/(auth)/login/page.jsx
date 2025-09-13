"use client";

import LoginForm from "./LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#cc5500] via-orange-400 to-[#ffcc00] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
