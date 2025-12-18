"use server";

import { getToken } from "./auth";

export const getCompanies = async ({ industryId }: { industryId?: string }) => {
  try {
    const token = await getToken();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/industries/${industryId}/companies`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch companies:", res.statusText);
      return [];
    }

    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error("Error fetching companies:", err);
    return [];
  }
};


export const getCallsByCompanyId = async ({ companyId }: { companyId: string }) => {
  try {
    const token = await getToken();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/companies/${companyId}/calls`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch company by ID:", res.statusText);
      return null;
    }

    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error("Error fetching company by ID:", err);
    return null;
  }
};