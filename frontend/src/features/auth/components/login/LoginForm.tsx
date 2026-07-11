"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLoginMutation } from "@/features/auth/services/mutation";
import { LoginLogo } from "./LoginLogo";
import { LoginHeader } from "./LoginHeader";
import { LoginErrorMessage } from "./LoginErrorMessage";
import { EmailField } from "./EmailField";
import { PasswordField } from "./PasswordField";
import { RememberMeField } from "./RememberMeField";
import { SubmitButton } from "./SubmitButton";
import { LoginFormData, LoginMutationData, LoginMutationVariables } from "./types";
import { toast } from "sonner";

// ─── Helper: decode JWT from cookie ───────────────────────────────────────────
function getAccessTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === "access_token") {
      return decodeURIComponent(value);
    }
  }
  return null;
}

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
    console.error("JWT Decode Error:", error);
    return null;
  }
}

function getRoleFromCookie(): string | null {
  const token = getAccessTokenFromCookie();
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  const role = payload?.role;

  if (typeof role !== "string") return null;

  return role.toLowerCase();
}

function getRedirectPathByRole(role: string | null): string {
  if (role === "admin") return "/admin/dashboard";
  if (role === "partner") return "/";
  if (role === "consumer") return "/";
  return "/login"; // fallback
}

// ──────────────────────────────────────────────────────────────────────────────

export const LoginForm = () => {
  const { isLoggedIn, user } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const mountedRef = useRef(true);

  const loginMutation = useLoginMutation();

  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: "",
    password: "",
    remember: false,
  });

  const handleInputChange = (
    field: keyof LoginFormData,
    value: string | boolean
  ) => {
    setLoginForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!loginForm.email || !loginForm.password) {
      setError("Invalid credentials. Please try again.");
      return;
    }

    try {
      await loginMutation.mutateAsync({
        emailAddress: loginForm.email,
        password: loginForm.password,
      });

      if (!mountedRef.current) return;

      // ── Give browser a tick to set the cookie, then read role ──
      await new Promise((resolve) => setTimeout(resolve, 100));

      const role = getRoleFromCookie();
      const redirectPath = getRedirectPathByRole(role);

      console.log("[LoginForm] Detected role:", role);
      console.log("[LoginForm] Redirecting to:", redirectPath);

      toast.success("Welcome back!");

      window.location.href = redirectPath;
    } catch (err: any) {
      if (!mountedRef.current) return;

      let errorMessage = "Invalid credentials. Please try again.";

      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <>
      {/* <LoginLogo /> */}

      <div className="w-full max-w-md">
        <LoginHeader />

        <LoginErrorMessage
          error={error}
          mutationError={loginMutation.error}
        />

        <form onSubmit={handleLogin} className="space-y-4">
          <EmailField
            value={loginForm.email}
            onChange={(value) => handleInputChange("email", value)}
          />

          <PasswordField
            value={loginForm.password}
            onChange={(value) => handleInputChange("password", value)}
            showPassword={showPass}
            toggleShowPassword={() => setShowPass(!showPass)}
          />

          <RememberMeField
            checked={loginForm.remember}
            onChange={(checked) => handleInputChange("remember", checked)}
          />

          <SubmitButton loading={loginMutation.isPending} />
        </form>
      </div>
    </>
  );
};