"use client";

import { apiActions } from "@/tools/axios";

export const createGuarantorProfile = async (values, auth) => {
  await apiActions?.post("/api/v1/guarantorprofile/", values, auth);
};

export const getGuarantorProfiles = async (auth) => {
  const response = await apiActions?.get("/api/v1/guarantorprofile/", auth);
  return response?.data?.results;
};

export const getGuarantorProfile = async (member_no, auth) => {
  const response = await apiActions?.get(
    `/api/v1/guarantorprofile/${member_no}/`,
    auth
  );
  return response?.data;
};
