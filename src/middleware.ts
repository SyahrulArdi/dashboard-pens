import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const path = req.nextUrl.pathname;

  // Jika belum login, redirect ke halaman login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = token.role as string;

  // Proteksi rute admin
  if (path.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Proteksi rute dosen wali
  if (path.startsWith("/dosenwali") && role !== "dosen_wali") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Proteksi rute mahasiswa
  if (path.startsWith("/mahasiswa") && role !== "mahasiswa") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Proteksi rute ppks
  if (path.startsWith("/ppks") && role !== "ppks") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dosenwali/:path*", "/mahasiswa/:path*", "/ppks/:path*"],
};
