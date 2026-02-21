"use client";

import { apiActions, apiMultipartActions } from "@/tools/axios";

export const signUpSaccoAdmin = async (values) => {
  const response = await apiActions?.post(
    "/api/v1/auth/signup/system-admin/",
    values
  );
  return response;
};

// Members create their accounts
export const signUpMember = async (values) => {
  const response = await apiActions?.post(
    "/api/v1/auth/signup/member/",
    values
  );
  return response;
};

// Password Reset
export const forgotPassword = async (values) => {
  const response = await apiActions?.post(
    "/api/v1/auth/password/forgot/",
    values
  );
  return response?.data;
};

export const resetPassword = async (values) => {
  const response = await apiActions?.post(
    "/api/v1/auth/password/reset/",
    values
  );
  return response?.data;
};

// ---------------------------------------------------------------------------------------------------------------------------------------------------
// SACCO Admins
// Add new member
export const addMember = async (values, token) => {
  const response = await apiActions?.post(
    "/api/v1/auth/new-member/create/",
    values,
    token
  );
  return response;
};


// View all members
export const getMembers = async (auth, page = 1, pageSize = 20, search = "") => {
  const response = await apiActions?.get(
    `/api/v1/auth/members/all/?page=${page}&page_size=${pageSize}&search=${search}`,
    auth
  );
  return response?.data;
};

// View member details
export const getMemberDetail = async (member_no, token) => {
  const response = await apiActions?.get(
    `/api/v1/auth/member/${member_no}/`,
    token
  );
  return response?.data;
};

// Approve members
export const approveMember = async (member_no, token) => {
  await apiActions?.patch(`/api/v1/auth/approve-member/${member_no}/`, token);
};

// Bulk upload
export const createBulkMembers = async (formData, token) => {
  await apiActions.post("api/v1/auth/new-members/bulk-create/upload/", formData, token);
};

// Reset a member's password
export const resetMemberPassword = async (member_no, password, token) => {
  await apiActions?.patch(`/api/v1/auth/member/${member_no}/reset-password/`, password, token);
};

// ---------------------------------------------------------------------------------------------------------------------------------------------------
// Member Views
export const getMember = async (userId, token) => {
  const response = await apiActions?.get(`/api/v1/auth/${userId}/`, token);
  return response?.data;
};

export const updateMember = async (userId, formData, token) => {
  const response = await apiMultipartActions?.patch(
    `/api/v1/auth/${userId}/`,
    formData,
    token
  );
  return response?.data;
};

export const changePassword = async (values, token) => {
  const response = await apiActions?.patch(
    `/api/v1/auth/password/change/`,
    values,
    token
  );
  return response?.data;
};

// Activate Account
export const activateAccount = async (values) => {
  const response = await apiActions?.patch(
    `/api/v1/auth/password/activate-account/`,
    values
  );
  return response?.data;
};
