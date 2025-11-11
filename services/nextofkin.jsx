"use client";

import { apiActions } from "@/tools/axios";

export const createNextOfKin = async (values, token) => {
  await apiActions?.post("/api/v1/nextofkin/", values, token);
};

export const getNextOfKins = async (token) => {
  const response = await apiActions?.get("/api/v1/nextofkin/", token);
  return response?.data?.results;
};

export const getNextOfKin = async (reference, token) => {
  const response = await apiActions?.get(
    `/api/v1/nextofkin/${reference}/`,
    token
  );
  return response?.data;
};

export const updateNextOfKin = async (reference, formData, token) => {
  const response = await apiActions?.patch(
    `/api/v1/nextofkin/${reference}/`,
    formData,
    token
  );
  return response?.data;
};

export const deleteNextOfKin = async (reference, token) => {
  const response = await apiActions?.delete(
    `/api/v1/nextofkin/${reference}/`,
    token
  );
  return response?.data;
};
