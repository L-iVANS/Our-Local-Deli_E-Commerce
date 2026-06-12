import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

type UserRole = "admin" | "partner" | "consumer"

function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    // Use a URL-safe Base64 decoder logic
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("JWT Decode Error:", error);
    return null;
  }
}

function getRoleFromRequest(request: NextRequest): UserRole | null {
  const token = request.cookies.get("access_token")?.value
  if (!token) return null

  const payload = decodeJwtPayload(token)
  const role = payload?.role

  if (typeof role !== "string") return null

  const normalizedRole = role.toLowerCase()
  if (normalizedRole === "admin" || normalizedRole === "partner" || normalizedRole === "consumer") {
    return normalizedRole
  }

  return null
}

function redirectByRole(request: NextRequest, role: UserRole): NextResponse {
  if (role === "admin") return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  if (role === "partner") return NextResponse.redirect(new URL("/b2b/home", request.url))
  return NextResponse.redirect(new URL("/consumer", request.url))
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const role = getRoleFromRequest(request)

  if (path === "/login" && role) {
    return redirectByRole(request, role)
  }

  if (path.startsWith("/admin")) {
    if (!role || role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  if (path.startsWith("/b2b")) {
    if (!role || role !== "partner") {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  if (path.startsWith("/consumer")) {
    if (!role || role !== "consumer") {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/login", "/admin/:path*", "/b2b/:path*", "/consumer/:path*"],
}