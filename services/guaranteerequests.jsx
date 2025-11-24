"use client";

import { apiActions } from "@/tools/axios";

export const createGuaranteeRequest = async (values, token) => {
  await apiActions?.post("/api/v1/guaranteerequests/", values, token);
};

export const getGuaranteeRequests = async (token) => {
  const response = await apiActions?.get("/api/v1/guaranteerequests/", token);
  return response?.data?.results;
};

export const getGuaranteeRequest = async (reference, token) => {
  const response = await apiActions?.get(
    `/api/v1/guaranteerequests/${reference}/`,
    token
  );
  return response?.data;
};

export const acceptDeclineGuaranteeRequest = async (
  reference,
  values,
  token
) => {
  const response = await apiActions?.patch(
    `/api/v1/guaranteerequests/${reference}/status/`,
    values,
    token
  );
  return response?.data;
};
