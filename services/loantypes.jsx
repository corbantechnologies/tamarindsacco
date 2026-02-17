"use client";

import { apiActions } from "@/tools/axios";

// SACCO Admins
// create loan type
export const createLoanType = async (values, auth) => {
  await apiActions?.post("/api/v1/loantypes/", values, auth);
};

// get loan types
export const getLoanTypes = async (auth) => {
  const response = await apiActions?.get("/api/v1/loantypes/", auth);
  return response?.data?.results;
};

// get loan type detail by reference
export const getLoanTypeDetail = async (reference, auth) => {
  const response = await apiActions?.get(
    `/api/v1/loantypes/${reference}/`,
    auth
  );
  return response?.data;
};

// update loan type: to be used rarely
export const updateLoanType = async (reference, formData, auth) => {
  const response = await apiActions?.patch(
    `/api/v1/loantypes/${reference}/`,
    formData,
    auth
  );
  return response?.data;
};
