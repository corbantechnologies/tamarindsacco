"use client";
import { apiActions } from "@/tools/axios";

export const createSavingsDeposit = async (values, token) => {
  await apiActions?.post("/api/v1/savingsdeposits/", values, token);
};

export const getSavingsDeposits = async (token) => {
  const response = await apiActions?.get("/api/v1/savingsdeposits/", token);
  return response?.data;
};

export const getSavingsDeposit = async (reference, token) => {
  const response = await apiActions?.get(
    `/api/v1/savingsdeposits/${reference}/`,
    token
  );
  return response?.data;
};
