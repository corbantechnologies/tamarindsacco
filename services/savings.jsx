"use client";

import { apiActions } from "@/tools/axios";

// For all members
export const createSavingAccount = async (values, auth) => {
  const response = await apiActions?.post("/api/v1/savings/", values, auth);
  return response?.data;
};

export const getSavings = async (auth) => {
  const response = await apiActions?.get("/api/v1/savings/", auth);
  return response?.data?.results;
};

export const getSaving = async (identity, auth) => {
  const response = await apiActions?.get(`/api/v1/savings/${identity}/`, auth);
  return response?.data;
};
