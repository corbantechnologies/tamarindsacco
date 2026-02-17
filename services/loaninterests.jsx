"use client";

import { apiMultipartActions } from "@/tools/axios";

export const createBulkInterest = async (formData, auth) => {
  await apiMultipartActions?.post(
    "/api/v1/tamarindloaninterests/bulk/upload/",
    formData,
    auth
  );
};
