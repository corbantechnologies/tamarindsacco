"use client";

import { apiActions, apiMultipartActions } from "@/tools/axios";

// SACCO Admins
export const createLoanRepayment = async (values, auth) => {
  const response = await apiActions?.post(
    "/api/v1/loanrepayments/",
    values,
    auth
  );
  return response?.data;
};

export const getLoanRepayments = async (auth) => {
  const response = await apiActions?.get("/api/v1/loanrepayments/", auth);
  return response?.data?.results;
};

export const getLoanRepayment = async (reference, auth) => {
  const response = await apiActions?.get(
    `/api/v1/loanrepayments/${reference}/`,
    auth
  );
  return response?.data;
};

export const createBulkLoanRepayment = async (values, auth) => {
  await apiMultipartActions?.post(
    "/api/v1/loanrepayments/bulk/upload/",
    values,
    auth
  );
};
