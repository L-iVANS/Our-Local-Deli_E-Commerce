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

export const LoginForm = () => {
  const router = useRouter();
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

  const handleInputChange = (field: keyof LoginFormData, value: string | boolean) => {
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

      toast.success("Welcome back!");

      // ✅ Simple: Just do a hard redirect to /
      // Middleware will automatically redirect based on role
      window.location.href = "/";
      
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

        <LoginErrorMessage error={error} mutationError={loginMutation.error} />

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