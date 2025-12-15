"use server";

import { getToken } from "./auth";

export const getIndustries = async () => {
  try {
    const token = await getToken();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/industries`,
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
      console.error("Failed to fetch industries:", res.statusText);
      return [];
    }

    const data = await res.json();
    // console.log("Fetched industries data:", data);
    return data.data;
  } catch (err) {
    console.error("Error fetching industries:", err);
    return [];
  }
};
