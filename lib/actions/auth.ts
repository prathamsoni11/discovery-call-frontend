"use server";
import { cookies } from "next/headers";

export const loginAction = async (data: {
  email: string;
  password: string;
}) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      }
    );

    if (!res.ok) return { error: "Login Failed!!" };
    const rawSetCookie = res.headers.get("set-cookie");

    console.log("Raw Set-Cookie Header:", rawSetCookie);
    if (rawSetCookie) {
      const tokenMatch = rawSetCookie.match(/token=([^;]+)/);
      const token = tokenMatch ? tokenMatch[1] : null;

      if (token) {
        (await cookies()).set("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",
          maxAge: 86400,
        });
      }
    }

    return { success: "Login Success" };
  } catch (err) {
    console.error("Login failed:", err);
    return { error: "Something went wrong" };
  }
};

export const getToken = async () => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  return token || null;
};

export const getProfileAction = async () => {
  const token = await getToken();

  if (!token) {
    return null;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/getMyProfile`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch profile:", res);
      return null;
    }

    const data = await res.json();

    return data.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};

export const clearCookies = async () => {
  (await cookies()).delete("token");
};
