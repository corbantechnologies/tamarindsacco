"use client";

import { apiActions } from "@/tools/axios";

// SACCO Admins
export const createVentureType = async (values, token) => {
  await apiActions?.post("/api/v1/venturetypes/", values, token);
};

// Get venture types
export const getVentureTypes = async (auth) => {
  const response = await apiActions?.get("/api/v1/venturetypes/", auth);
  return response?.data?.results;
};

// Get venture type detail by reference
export const getVentureTypeDetail = async (reference, auth) => {
  const response = await apiActions?.get(
    `/api/v1/venturetypes/${reference}/`,
    auth
  );
  return response?.data;
};

// Update venture type: to be used rarely
export const updateVentureType = async (reference, formData, token) => {
  const response = await apiActions?.patch(
    `/api/v1/venturetypes/${reference}/`,
    formData,
    token
  );
  return response?.data;
};
