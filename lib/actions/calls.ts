"use server";

import { getToken } from "./auth";

export const getCallById = async ({ callId }: { callId: string }) => {
  try {
    const token = await getToken();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/calls/${callId}`,
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
