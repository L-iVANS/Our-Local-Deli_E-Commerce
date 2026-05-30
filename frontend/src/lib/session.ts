import { cookies } from "next/headers";

export type SessionUser = {
  userId: number;
  emailAddress: string;
  role: string;
};

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const payload = JSON.parse(Buffer.from(padded, "base64").toString("utf-8"));

    if (typeof payload !== "object" || payload === null) return null;
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) return null;

  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  const userId = payload.userId;
  const emailAddress = payload.emailAddress;
  const role = payload.role;

  if (typeof userId !== "number" || typeof emailAddress !== "string" || typeof role !== "string") {
    return null;
  }

  return {
    userId,
    emailAddress,
    role,
  };
}
