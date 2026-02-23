"use client";

import { apiActions } from "@/tools/axios";

// For all members

export const getMemberFees = async (auth) => {
  const response = await apiActions?.get("/api/v1/memberfees/", auth);
  return response?.data?.results;
};

export const getMemberFee = async (reference, auth) => {
  const response = await apiActions?.get(`/api/v1/memberfees/${reference}/`, auth);
  return response?.data;
};
