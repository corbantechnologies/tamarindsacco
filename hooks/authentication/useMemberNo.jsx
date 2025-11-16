"use client";

import { useSession } from "next-auth/react";
import React from "react";

function useMemberNo() {
  const { data: session } = useSession();
  const memberNo = session?.user?.member_no;
  return memberNo;
}

export default useMemberNo;
