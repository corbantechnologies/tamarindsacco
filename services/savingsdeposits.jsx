"use client";
import { apiActions, apiMultipartActions } from "@/tools/axios";

// Should not be used
export const createSavingsDeposit = async (values, auth) => {
  await apiActions?.post("/api/v1/savingsdeposits/", values, auth);
};

export const getSavingsDeposits = async (auth) => {
  const response = await apiActions?.get("/api/v1/savingsdeposits/", auth);
  return response?.data;
};

export const getSavingsDeposit = async (reference, auth) => {
  const response = await apiActions?.get(
    `/api/v1/savingsdeposits/${reference}/`,
    auth
  );
  return response?.data;
};

export const createBulkSavingsDeposits = async (formData, token) => {
  await apiMultipartActions.post(
    "/api/v1/savingsdeposits/bulk/upload/",
    formData,
    token
  );
};
