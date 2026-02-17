"use client";

import { apiActions, apiMultipartActions } from "@/tools/axios";

export const createLoanDisbursement = async (values, auth) => {
  await apiActions?.post("/api/v1/loandisbursements/", values, auth);
};

export const getLoanDisbursements = async (auth) => {
  const response = await apiActions?.get("/api/v1/loandisbursements/", auth);
  return response?.data?.results;
};

export const getLoanDisbursement = async (reference, auth) => {
  const response = await apiActions?.get(
    `/api/v1/loandisbursements/${reference}/`,
    auth
  );
  return response?.data;
};

export const createBulkLoanDisbursement = async (values, auth) => {
  await apiMultipartActions?.post(
    "/api/v1/loandisbursements/bulk/",
    values,
    auth
  );
};
