"use client";

import { apiActions } from "@/tools/axios";

// For all members
export const createSavingAccount = async (values, token) => {
  const response = await apiActions?.post("/api/v1/savings/", values, token);
  return response?.data;
};

export const getSavings = async (token) => {
  const response = await apiActions?.get("/api/v1/savings/", token);
  return response?.data?.results;
};

export const getSaving = async (identity, token) => {
  const response = await apiActions?.get(`/api/v1/savings/${identity}/`, token);
  return response?.data;
};
