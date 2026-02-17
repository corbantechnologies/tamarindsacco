"use client";

import { useSession } from "next-auth/react";

function useAxiosAuth() {
  const { data: session } = useSession();

  const tokens = session?.user?.token;

  return {
    headers: {
      Authorization: "Token " + tokens,
      "Content-Type": "multipart/form-data",
    },
    isEnabled: !!tokens,
  };
}

export default useAxiosAuth;
