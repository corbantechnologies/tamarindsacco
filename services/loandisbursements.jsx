"use client";

import { apiActions, apiMultipartActions } from "@/tools/axios";

export const createLoanDisbursement = async (values, token) => {
  await apiActions?.post("/api/v1/loandisbursements/", values, token);
};

export const getLoanDisbursements = async (token) => {
  const response = await apiActions?.get("/api/v1/loandisbursements/", token);
  return response?.data?.results;
};

export const getLoanDisbursement = async (reference, token) => {
  const response = await apiActions?.get(
    `/api/v1/loandisbursements/${reference}/`,
    token
  );
  return response?.data;
};

export const createBulkLoanDisbursement = async (values, token) => {
  await apiMultipartActions?.post(
    "/api/v1/loandisbursements/bulk/",
    values,
    token
  );
};
