"use client";

import { apiActions } from "@/tools/axios";

// SACCO ADMINS
// create saving type
export const createSavingType = async (values, token) => {
  await apiActions?.post("/api/v1/savingstypes/", values, token);
};

// get saving types
export const getSavingTypes = async (token) => {
  const response = await apiActions?.get("/api/v1/savingstypes/", token);
  return response?.data?.results;
};

// get saving type detail by reference
export const getSavingTypeDetail = async (reference, token) => {
  const response = await apiActions?.get(
    `/api/v1/savingstypes/${reference}/`,
    token
  );
  return response?.data;
};

// update saving type: to be used rarely
export const updateSavingType = async (reference, formData, token) => {
  const response = await apiActions?.patch(
    `/api/v1/savingstypes/${reference}/`,
    formData,
    token
  );
  return response?.data;
};
