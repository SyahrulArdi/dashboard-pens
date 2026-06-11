import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const secureCookie = process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_VERCEL_ENV === "production";
  
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie,
  });

  const path = req.nextUrl.pathname;

  // Izinkan akses bebas ke assets dan api (biasanya sudah di-exclude matcher, tapi just in case)
  if (path.startsWith("/api") || path.startsWith("/_next") || path.includes(".")) {
    return NextResponse.next();
  }

  // Jika BELUM login
  if (!token) {
    if (path === "/login" || path === "/") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = token.role as string;

  // Jika SUDAH login tapi mencoba buka halaman /login atau root /, arahkan langsung ke dashboardnya
  if (path === "/login" || path === "/") {
    if (role === "admin") return NextResponse.redirect(new URL("/admin", req.url));
    if (role === "dosen_wali") return NextResponse.redirect(new URL("/dosenwali", req.url));
    if (role === "mahasiswa") return NextResponse.redirect(new URL("/mahasiswa", req.url));
    if (role === "ppks") return NextResponse.redirect(new URL("/ppks", req.url));
  }

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
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)"],
};