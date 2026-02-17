"use client";

import { apiActions, apiMultipartActions } from "@/tools/axios";

// create
export const createVentureDeposit = async (values, token) => {
  await apiActions?.post("/api/v1/venturedeposits/", values, token);
};

// get
export const getVentureDeposits = async (auth) => {
  const response = await apiActions?.get("/api/v1/venturedeposits/", auth);
  return response?.data;
};

// get
export const getVentureDeposit = async (reference, auth) => {
  const response = await apiActions?.get(
    `/api/v1/venturedeposits/${reference}/`,
    auth
  );
  return response?.data;
};

// bulk create
export const createBulkVentureDeposits = async (formData, token) => {
  return apiMultipartActions.post(
    "/api/v1/venturedeposits/bulk/upload/",
    formData,
    token
  );
};
