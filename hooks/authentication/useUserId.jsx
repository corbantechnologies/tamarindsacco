"use client";

import { useSession } from "next-auth/react";

function useUserId() {
  const { data: session } = useSession();

  const userId = session?.user?.id;

  return userId;
}

export default useUserId;
