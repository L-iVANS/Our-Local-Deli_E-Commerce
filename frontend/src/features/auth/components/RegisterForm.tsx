"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, AlertCircle } from "lucide-react";

interface RegisterFormState {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phone: string;
  password: string;
  confirmPassword: string;
  orderType: "retail" | "wholesale" | "bulk";
  agreedToTerms: boolean;
}

interface RegisterFormProps {
  onBackToLogin?: () => void;
}

export function RegisterForm({ onBackToLogin }: RegisterFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const mountedRef = useRef(true);

  const [registerForm, setRegisterForm] = useState<RegisterFormState>({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    phone: "",
    password: "",
    confirmPassword: "",
    orderType: "wholesale",
    agreedToTerms: false,
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    if (!mountedRef.current) return;
    setLoading(false);
    router.push("/");
  };

  return (
    <>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          Apply for B2B Access
        </h1>
        <p className="text-gray-400 text-sm mt-1">Our team reviews applications within 24 hours.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm mb-5">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">First Name</label>
            <input
              type="text"
              required
              placeholder="Juan"
              value={registerForm.firstName}
              onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-400 bg-gray-50/50"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Last Name</label>
            <input
              type="text"
              required
              placeholder="Dela Cruz"
              value={registerForm.lastName}
              onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-400 bg-gray-50/50"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Business Email</label>
          <input
            type="email"
            required
            placeholder="you@company.com"
            value={registerForm.email}
            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-400 bg-gray-50/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Company</label>
            <input
              type="text"
              required
              placeholder="Your Business"
              value={registerForm.company}
              onChange={(e) => setRegisterForm({ ...registerForm, company: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-400 bg-gray-50/50"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Phone</label>
            <input
              type="tel"
              placeholder="+63 9XX XXX XXXX"
              value={registerForm.phone}
              onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-400 bg-gray-50/50"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Account Type</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: "retail", l: "Retail" },
              { v: "wholesale", l: "Wholesale" },
              { v: "bulk", l: "Bulk" },
            ].map((opt) => (
              <label
                key={opt.v}
                className="flex items-center justify-center py-2.5 rounded-xl border text-sm font-medium cursor-pointer transition-all"
                style={
                  registerForm.orderType === opt.v
                    ? { backgroundColor: "#f9e9ea", borderColor: "#bf262f", color: "#bf262f" }
                    : { borderColor: "#e5e7eb", color: "#6b7280" }
                }
              >
                <input
                  type="radio"
                  name="orderType"
                  value={opt.v}
                  checked={registerForm.orderType === opt.v}
                  onChange={(e) => setRegisterForm({ ...registerForm, orderType: e.target.value as "retail" | "wholesale" | "bulk" })}
                  className="sr-only"
                />
                {opt.l}
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Password</label>
            <input
              type="password"
              required
              placeholder="Min. 8 characters"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-400 bg-gray-50/50"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Confirm</label>
            <input
              type="password"
              required
              placeholder="Repeat password"
              value={registerForm.confirmPassword}
              onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-400 bg-gray-50/50"
            />
          </div>
        </div>

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={registerForm.agreedToTerms}
            onChange={(e) => setRegisterForm({ ...registerForm, agreedToTerms: e.target.checked })}
            className="mt-0.5 accent-red-600"
          />
          <span className="text-xs text-gray-400">
            I agree to Omega's <a href="#" style={{ color: "#bf262f" }}>Terms of Service</a> and <a href="#" style={{ color: "#bf262f" }}>Privacy Policy</a>.
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ backgroundColor: "#bf262f" }}
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>Submit Application <ArrowRight size={16} /></>
          )}
        </button>
      </form>

      {onBackToLogin && (
        <p className="text-center text-sm text-gray-400 mt-5">
          Already have an account?{" "}
          <button onClick={onBackToLogin} style={{ color: "#bf262f" }} className="font-semibold">
            Sign in
          </button>
        </p>
      )}
    </>
  );
}
