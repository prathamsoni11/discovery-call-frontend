"use server";

import { getToken } from "./auth";

export const getCompanies = async ({ industryId }: { industryId?: string }) => {
  try {
    console.log(industryId);
    const token = await getToken();

    const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/companies`);

    if (industryId) {
      url.searchParams.append("industry", industryId);
    }

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      cache: "no-store",
    });

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
