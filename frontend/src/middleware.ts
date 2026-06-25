// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

type UserRole = "admin" | "partner" | "consumer"

// ─── JWT Helpers ──────────────────────────────────────────────────────────────

function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

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
    console.error("[Middleware] JWT Decode Error:", error);
    return null;
  }
}

function isTokenExpired(payload: Record<string, any>): boolean {
  if (!payload.exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

function getRoleFromRequest(request: NextRequest): UserRole | null {
  const token = request.cookies.get("access_token")?.value;
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  if (isTokenExpired(payload)) {
    console.warn("[Middleware] Token is expired");
    return null;
  }

  const role = payload?.role;
  if (typeof role !== "string") return null;

  const normalizedRole = role.toLowerCase();

  if (
    normalizedRole === "admin" ||
    normalizedRole === "partner" ||
    normalizedRole === "consumer"
  ) {
    return normalizedRole as UserRole;
  }

  return null;
}

// ─── Redirect by Role ─────────────────────────────────────────────────────────

function redirectByRole(request: NextRequest, role: UserRole): NextResponse {
  const redirectMap: Record<UserRole, string> = {
    admin: "/admin/products",
    partner: "/consumer/home",   // ✅ partner & consumer share routes
    consumer: "/consumer/home",
  };

  const destination = redirectMap[role];
  console.log(`[Middleware] Redirecting role "${role}" to "${destination}"`);
  return NextResponse.redirect(new URL(destination, request.url));
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const role = getRoleFromRequest(request);

  console.log(`[Middleware] Path: ${path} | Role: ${role ?? "none"}`);

  // ── 1. /login ─────────────────────────────────────────────────────────────
  if (path === "/login") {
    if (role) return redirectByRole(request, role);
    return NextResponse.next();
  }

  // ── 2. /admin (admin only) ────────────────────────────────────────────────
  if (path.startsWith("/admin")) {
    if (!role) {
      console.warn("[Middleware] No role, redirecting to /login");
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (role !== "admin") {
      console.warn(`[Middleware] Role "${role}" tried to access admin, redirecting`);
      return redirectByRole(request, role);
    }
    return NextResponse.next();
  }

  // ── 3. /consumer (consumer + partner allowed) ─────────────────────────────
  if (path.startsWith("/consumer")) {
    if (!role) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // ✅ Allow BOTH consumer and partner to access /consumer/* routes
    if (role !== "consumer" && role !== "partner") {
      console.warn(`[Middleware] Role "${role}" tried to access /consumer, redirecting`);
      return redirectByRole(request, role); // admin → /admin/dashboard
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

// ─── Matcher ──────────────────────────────────────────────────────────────────

export const config = {
  matcher: [
    "/login",
    "/admin/:path*",
    "/consumer/:path*",
  ],
}