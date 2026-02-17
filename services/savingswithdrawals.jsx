"use client";

import { apiActions } from "@/tools/axios";

export const createSavingsWithdrawals = async (values, token) => {
  await apiActions?.post("/api/v1/savingswithdrawals/", values, token);
};

export const getSavingsWithdrawals = async (auth) => {
  const response = await apiActions?.get("/api/v1/savingswithdrawals/", auth);
  return response?.data?.results;
};

export const getSavingsWithdrawal = async (reference, auth) => {
  const response = await apiActions?.get(
    `/api/v1/savingswithdrawals/${reference}/`,
    auth
  );
  return response?.data;
};

// SACCO Admins
export const updateWithdrawal = async (identity, values, token) => {
  const response = await apiActions?.patch(
    `/api/v1/savingswithdrawals/${identity}/update/`,
    values,
    token
  );
  return response?.data;
};
