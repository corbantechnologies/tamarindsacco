"use client";

import { apiActions } from "@/tools/axios";

export const createLoanAccount = async (values, auth) => {
  const response = await apiActions?.post("/api/v1/loans/", values, auth);
  return response?.data;
};

export const getLoans = async (auth) => {
  const response = await apiActions?.get("/api/v1/loans/", auth);
  return response?.data?.results;
};

export const getLoan = async (identity, auth) => {
  const response = await apiActions?.get(`/api/v1/loans/${identity}/`, auth);
  return response?.data;
};

// Admin creates a loan for a member
export const adminCreateLoanForMember = async (values, auth) => {
  const response = await apiActions?.post(
    `/api/v1/loans/create/loan/`,
    values,
    auth
  );
  return response?.data;
};
