"use client";

import { apiActions } from "@/tools/axios";

export const createGuarantorProfile = async (values, token) => {
  await apiActions?.post("/api/v1/guarantorprofile/", values, token);
};

export const getGuarantorProfiles = async (token) => {
  const response = await apiActions?.get("/api/v1/guarantorprofile/", token);
  return response?.data?.results;
};

export const getGuarantorProfile = async (member_no, token) => {
  const response = await apiActions?.get(
    `/api/v1/guarantorprofile/${member_no}/`,
    token
  );
  return response?.data;
};
