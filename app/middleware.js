import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If not logged in → send to login
  if (!token) {
    return NextResponse.redirect(new URL("/Signup", req.url));
  }

  // If logged in but not admin → send to Profile
  if (token.role !== "admin") {
    return NextResponse.redirect(new URL("/Profile", req.url));
  }

  // ✅ Allow admin
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // only run on admin routes
};
