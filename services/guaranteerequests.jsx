"use client";

import { apiActions } from "@/tools/axios";

export const createGuaranteeRequest = async (values, auth) => {
  await apiActions?.post("/api/v1/guaranteerequests/", values, auth);
};

export const getGuaranteeRequests = async (auth) => {
  const response = await apiActions?.get("/api/v1/guaranteerequests/", auth);
  return response?.data?.results;
};

export const getGuaranteeRequest = async (reference, auth) => {
  const response = await apiActions?.get(
    `/api/v1/guaranteerequests/${reference}/`,
    auth
  );
  return response?.data;
};

export const acceptDeclineGuaranteeRequest = async (
  reference,
  values,
  auth
) => {
  const response = await apiActions?.patch(
    `/api/v1/guaranteerequests/${reference}/status/`,
    values,
    auth
  );
  return response?.data;
};
