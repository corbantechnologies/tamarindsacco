"use client";

import { apiActions } from "@/tools/axios";

export const createLoanApplication = async (values, auth) => {
  const response = await apiActions?.post(
    "/api/v1/loanapplications/list/",
    values,
    auth
  );
  return response;
};

export const getMyLoanApplications = async (auth) => {
  const response = await apiActions?.get("/api/v1/loanapplications/list/", auth);
  return response?.data?.results;
};

export const getLoanApplications = async (auth) => {
  const response = await apiActions?.get("/api/v1/loanapplications/", auth);
  return response?.data?.results;
};

export const getLoanApplication = async (reference, auth) => {
  const response = await apiActions?.get(
    `/api/v1/loanapplications/${reference}/`,
    auth
  );
  return response?.data;
};

export const updateLoanApplication = async (reference, values, auth) => {
  const response = await apiActions?.patch(
    `/api/v1/loanapplications/${reference}/`,
    values,
    auth
  );
  return response;
};

export const deleteLoanApplication = async (reference, auth) => {
  const response = await apiActions?.delete(
    `/api/v1/loanapplications/${reference}/`,
    auth
  );
  return response?.data;
};

export const submitLoanApplication = async (reference, auth) => {
  await apiActions?.post(
    `/api/v1/loanapplications/${reference}/submit/`,
    {},
    auth
  );
};

// submit for amendment / Submit for First Approval
export const submitForAmendmentLoanApplication = async (reference, auth) => {
  await apiActions?.post(
    `/api/v1/loanapplications/${reference}/submit-amendment/`,
    {},
    auth
  );
};

// accept amendment
export const acceptAmendmentLoanApplication = async (reference, auth) => {
  await apiActions?.post(
    `/api/v1/loanapplications/${reference}/accept-amendment/`,
    {},
    auth
  );
};

// decline amendment
export const cancelAmendmentLoanApplication = async (reference, auth) => {
  await apiActions?.post(
    `/api/v1/loanapplications/${reference}/cancel-amendment/`,
    {},
    auth
  );
};

// Admin actions
export const adminApproveDeclineLoanApplication = async (
  reference,
  status,
  auth
) => {
  const response = await apiActions?.patch(
    `/api/v1/loanapplications/${reference}/status/`,
    { status },
    auth
  );
  return response;
};


// amend
export const amendLoanApplication = async (reference, values, auth) => {
  const response = await apiActions?.patch(
    `/api/v1/loanapplications/${reference}/amend/`,
    values,
    auth
  );
  return response;
};
