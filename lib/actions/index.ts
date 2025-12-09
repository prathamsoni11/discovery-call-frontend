"use server";
import { cookies } from "next/headers";

export const clearCookies = async () => {
  const cookieStore = cookies();

  (await cookieStore).delete("token");

  return { message: "Cookies cleared" };
};

export async function setCookieAction() {
  (await cookies()).set("token", "1234567890", {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === "production", // Ensures cookie is only sent over HTTPS in production
    maxAge: 60 * 60 * 24 * 7, // 1 week in seconds
    path: "/", // The path for which the cookie is valid
  });
}
