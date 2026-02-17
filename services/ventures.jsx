"use client";

import { apiActions } from "@/tools/axios";

export const getVentures = async (auth) => {
  const response = await apiActions?.get("/api/v1/ventures/", auth);
  return response?.data?.results;
};

export const getVenture = async (identity, auth) => {
  const response = await apiActions?.get(
    `/api/v1/ventures/${identity}/`,
    auth
  );
  return response?.data;
};
