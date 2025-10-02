"use client";

import { apiActions } from "@/tools/axios";

// SACCO Admins
// create loan type
export const createLoanType = async (values, token) => {
  await apiActions?.post("/api/v1/loantypes/", values, token);
};

// get loan types
export const getLoanTypes = async (token) => {
  const response = await apiActions?.get("/api/v1/loantypes/", token);
  return response?.data?.results;
};

// get loan type detail by reference
export const getLoanTypeDetail = async (reference, token) => {
  const response = await apiActions?.get(
    `/api/v1/loantypes/${reference}/`,
    token
  );
  return response?.data;
};

// update loan type: to be used rarely
export const updateLoanType = async (reference, formData, token) => {
  const response = await apiActions?.patch(
    `/api/v1/loantypes/${reference}/`,
    formData,
    token
  );
  return response?.data;
};
