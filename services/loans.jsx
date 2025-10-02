"use client";

import { apiActions } from "@/tools/axios";

export const createLoanAccount = async (values, token) => {
  const response = await apiActions?.post("/api/v1/loans/", values, token);
  return response?.data;
};

export const getLoans = async (token) => {
  const response = await apiActions?.get("/api/v1/loans/", token);
  return response?.data?.results;
};

export const getLoan = async (identity, token) => {
  const response = await apiActions?.get(`/api/v1/loans/${identity}/`, token);
  return response?.data;
};

// Admin creates a loan for a member
export const adminCreateLoanForMember = async (values, token) => {
  const response = await apiActions?.post(
    `/api/v1/loans/create/loan/`,
    values,
    token
  );
  return response?.data;
};
