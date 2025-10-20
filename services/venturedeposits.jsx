"use client";

import { apiActions } from "@/tools/axios";

// create
export const createVentureDeposit = async (values, token) => {
  await apiActions?.post("/api/v1/venturedeposits/", values, token);
};

// get
export const getVentureDeposits = async (token) => {
  const response = await apiActions?.get("/api/v1/venturedeposits/", token);
  return response?.data;
};

// get
export const getVentureDeposit = async (reference, token) => {
  const response = await apiActions?.get(
    `/api/v1/venturedeposits/${reference}/`,
    token
  );
  return response?.data;
};
