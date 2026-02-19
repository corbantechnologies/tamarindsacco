"use client";

import { apiActions } from "@/tools/axios";

export const getAccountsList = async (auth) => {
  const response = await apiActions?.get("api/v1/transactions/", auth);
  return response?.data?.results;
};

export const downloadAccountsListCSV = async (auth) => {
  try {
    const response = await apiActions.get(
      "api/v1/transactions/list/download/",
      { ...auth, responseType: "blob" }
    );

    // Create a Blob from the response data
    const blob = new Blob([response.data], { type: "text/csv" });

    // Extract filename from Content-Disposition header, if available
    const contentDisposition = response.headers["content-disposition"];
    let fileName = `account_list_${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}.csv`;
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
      if (fileNameMatch && fileNameMatch[1]) {
        fileName = fileNameMatch[1];
      }
    }

    // Create a temporary URL and trigger download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createBulkCombinedUpdates = async (formData, auth) => {
  await apiActions.post("api/v1/transactions/bulk/upload/", formData, auth);
};

// Reports
export const getMemberYearlySummary = async (member_no, auth, year) => {
  const query = year ? `?year=${year}` : "";
  const response = await apiActions?.get(
    `/api/v1/transactions/${member_no}/summary/${query}`,
    auth
  );
  return response?.data;
};

export const downloadMemberYearlySummary = async (member_no, auth, year) => {
  try {
    const query = year ? `?year=${year}` : "";
    const response = await apiActions.get(
      `/api/v1/transactions/${member_no}/summary/download/${query}`,
      { ...auth, responseType: "blob" }
    );

    // Create a Blob from the response data
    const blob = new Blob([response.data], { type: "application/pdf" });

    // Extract filename from Content-Disposition header, if available
    const contentDisposition = response.headers["content-disposition"];
    let fileName = `${member_no}_Summary_${new Date().getFullYear()}.pdf`;
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
      if (fileNameMatch && fileNameMatch[1]) {
        fileName = fileNameMatch[1];
      }
    }

    // Create a temporary URL and trigger download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return response.data;
  } catch (error) {
    throw error;
  }
};