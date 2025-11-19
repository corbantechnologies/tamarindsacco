"use client";

import { apiActions } from "@/tools/axios";

export const createLoanApplication = async (values, token) => {
  const response = await apiActions?.post(
    "/api/v1/loanapplications/list/",
    values,
    token
  );
  return response;
};

export const getMyLoanApplications = async (token) => {
  const response = await apiActions?.get("/api/v1/loanapplications/list/", token);
  return response?.data?.results;
};

export const getLoanApplications = async (token) => {
  const response = await apiActions?.get("/api/v1/loanapplications/", token);
  return response?.data?.results;
};

export const getLoanApplication = async (reference, token) => {
  const response = await apiActions?.get(
    `/api/v1/loanapplications/${reference}/`,
    token
  );
  return response?.data;
};

export const updateLoanApplication = async (reference, values, token) => {
  const response = await apiActions?.patch(
    `/api/v1/loanapplications/${reference}/`,
    values,
    token
  );
  return response;
};

export const deleteLoanApplication = async (reference, token) => {
  const response = await apiActions?.delete(
    `/api/v1/loanapplications/${reference}/`,
    token
  );
  return response?.data;
};

export const submitLoanApplication = async (reference, token) => {
  await apiActions?.post(
    `/api/v1/loanapplications/${reference}/submit/`,
    {},
    token
  );
};

// Admin actions
export const adminApproveDeclineLoanApplication = async (
  reference,
  status,
  token
) => {
  const response = await apiActions?.patch(
    `/api/v1/loanapplications/${reference}/status/`,
    { status },
    token
  );
  return response;
};
