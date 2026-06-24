"use client";

import Link from "next/link";
import Image from "next/image";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { LoginLeftPanel } from "@/features/auth/components/LoginLeftPanel";
import omegaLogo from "../../assets/omega_logo.png";

export default function Login() {
  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Left Panel - Branding & Marketing */}
      <LoginLeftPanel />

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        {/* Mobile Logo */}
        <div className="w-full max-w-md">
          <Link href="/" className="inline-block mb-10 lg:hidden">
            {/* <Image 
              src={omegaLogo}
              alt="Omega Logo"
              width={150}
              height={50}
              className="h-auto w-auto"
              loading="eager"
            /> */}
          </Link>

          {/* Login Form Component */}
          <LoginForm />
        </div>
      </div>
    </div>
  );
}