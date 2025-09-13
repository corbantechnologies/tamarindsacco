"use client";

// For all members
export const getSavings = async (token) => {
  const response = await apiActions?.get("/api/v1/savings/", token);
  return response?.data?.results;
};

export const getSaving = async (identity, token) => {
  const response = await apiActions?.get(`/api/v1/savings/${identity}/`, token);
  return response?.data;
};
