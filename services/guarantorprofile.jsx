"use client";

import { apiActions } from "@/tools/axios";

export const createGuarantorProfile = async (values, token) => {
  await apiActions?.post("/api/v1/guarantorprofile/", values, token);
};

export const getGuarantorProfiles = async (token) => {
  const response = await apiActions?.get("/api/v1/guarantorprofile/", token);
  return response?.data?.results;
};

export const getGuarantorProfile = async (reference, token) => {
  const response = await apiActions?.get(
    `/api/v1/guarantorprofile/${reference}/`,
    token
  );
  return response?.data;
};
