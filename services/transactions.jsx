"use client";

import { apiActions } from "@/tools/axios";

export const getAccountsList = async (token) => {
  const response = await apiActions?.get("api/v1/transactions/", token);
  return response?.data?.results;
};

export const downloadAccountsListCSV = async (token) => {
  const response = await apiActions?.get(
    "api/v1/transactions/list/download/",
    token
  );
  return response?.data;
};
