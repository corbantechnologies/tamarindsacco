"use client";

import { apiActions } from "@/tools/axios";


// Reports
export const getSaccoYearlySummary = async (auth, year) => {
  const query = year ? `?year=${year}` : "";
  const response = await apiActions?.get(
    `/api/v1/transactions/sacco/reports/${query}`,
    auth
  );
  return response?.data;
};

export const downloadSaccoYearlySummary = async (auth, year) => {
  try {
    const query = year ? `?year=${year}` : "";
    const response = await apiActions.get(
      `/api/v1/transactions/sacco/reports/download/${query}`,
      { ...auth, responseType: "blob" }
    );

    // Create a Blob from the response data
    const blob = new Blob([response.data], { type: "application/pdf" });

    // Extract filename from Content-Disposition header, if available
    const contentDisposition = response.headers["content-disposition"];
    let fileName = `Sacco_Summary_${new Date().getFullYear()}.pdf`;
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


export const getSaccoCashBook = async (auth, year) => {
  const query = year ? `?year=${year}` : "";
  const response = await apiActions?.get(
    `/api/v1/transactions/sacco/cashbook/${query}`,
    auth
  );
  return response?.data;
};

export const getMemberStatement = async (member_no, auth, year) => {
  const query = year ? `?year=${year}` : "";
  const response = await apiActions?.get(
    `/api/v1/transactions/${member_no}/statement/${query}`,
    auth
  );
  return response?.data;
};

export const getSaccoBalanceSheet = async (auth, date) => {
  const query = date ? `?date=${date}` : "";
  const response = await apiActions?.get(
    `/api/v1/finances/balance-sheet/${query}`,
    auth
  );
  return response?.data;
};

export const getSaccoIncomeStatement = async (auth, startDate, endDate) => {
  const params = new URLSearchParams();
  if (startDate) params.append("start_date", startDate);
  if (endDate) params.append("end_date", endDate);
  const query = params.toString() ? `?${params.toString()}` : "";
  
  const response = await apiActions?.get(
    `/api/v1/finances/income-statement/${query}`,
    auth
  );
  return response?.data;
};

export const getSaccoTrialBalance = async (auth, date) => {
  const query = date ? `?date=${date}` : "";
  const response = await apiActions?.get(
    `/api/v1/finances/trial-balance/${query}`,
    auth
  );
  return response?.data;
};
