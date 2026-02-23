"use client";

import { apiActions } from "@/tools/axios";

// SACCO ADMINS
// create fee type
export const createFeeType = async (values, token) => {
  await apiActions?.post("/api/v1/feetypes/", values, token);
};

// get fee types
export const getFeeTypes = async (auth) => {
  const response = await apiActions?.get("/api/v1/feetypes/", auth);
  return response?.data?.results;
};

// get fee type detail by reference
export const getFeeTypeDetail = async (reference, auth) => {
  const response = await apiActions?.get(
    `/api/v1/feetypes/${reference}/`,
    auth
  );
  return response?.data;
};

// update fee type: to be used rarely
export const updateFeeType = async (reference, formData, token) => {
  const response = await apiActions?.patch(
    `/api/v1/feetypes/${reference}/`,
    formData,
    token
  );
  return response?.data;
};
