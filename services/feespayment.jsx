"use client";
import { apiActions, apiMultipartActions } from "@/tools/axios";

// Should not be used
export const createFeesPayment = async (values, auth) => {
  await apiActions?.post("/api/v1/feespayment/", values, auth);
};

export const getFeesPayments = async (auth) => {
  const response = await apiActions?.get("/api/v1/feespayment/", auth);
  return response?.data;
};

export const getFeesPayment = async (reference, auth) => {
  const response = await apiActions?.get(
    `/api/v1/feespayment/${reference}/`,
    auth
  );
  return response?.data;
};

export const createBulkFeesPayments = async (formData, token) => {
  await apiMultipartActions.post(
    "/api/v1/feespayment/bulk/upload/",
    formData,
    token
  );
};
