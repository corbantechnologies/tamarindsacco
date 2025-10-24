"use client";

import { apiActions, apiMultipartActions } from "@/tools/axios";

// SACCO Admins
export const createLoanRepayment = async (values, token) => {
  const response = await apiActions?.post(
    "/api/v1/loanrepayments/",
    values,
    token
  );
  return response?.data;
};

export const getLoanRepayments = async (token) => {
  const response = await apiActions?.get("/api/v1/loanrepayments/", token);
  return response?.data?.results;
};

export const getLoanRepayment = async (reference, token) => {
  const response = await apiActions?.get(
    `/api/v1/loanrepayments/${reference}/`,
    token
  );
  return response?.data;
};

export const createBulkLoanRepayment = async (values, token) => {
  await apiMultipartActions?.post(
    "/api/v1/loanrepayments/bulk/upload/",
    values,
    token
  );
};
