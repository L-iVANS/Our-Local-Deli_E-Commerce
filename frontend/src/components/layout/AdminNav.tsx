'use client';

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard, Package, ClipboardList, FileText,
  User, ChevronLeft, ChevronRight,
  LogOut, BarChart3, Layers,
  Menu, X, Settings,
} from "lucide-react";

// ✅ 1. Import your logout mutation (Adjust the path if your file is located elsewhere)
import { useLogoutMutation } from "@/features/auth/services/mutation";

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    ],
  },
  {
    label: "Management",
    items: [
      { icon: Package, label: "Products", path: "/admin/products" },
      { icon: ClipboardList, label: "Sales Order", path: "/admin/sales-order" },
      { icon: FileText, label: "Invoices", path: "/admin/invoices" },
    ],
  },
  {
    label: "Tools",
    items: [
      { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
      { icon: User, label: "Users", path: "/admin/users" },
      { icon: Settings, label: "Settings", path: "/admin/settings" },
    ],
  },
];

const ADMIN_NAV_BG = "linear-gradient(180deg, #ffffff 0%, #f9e9ea 100%)";
const ADMIN_NAV_BORDER = "rgba(191, 38, 47, 0.15)";
const ADMIN_NAV_TEXT = "#334155";
const ADMIN_NAV_MUTED = "#64748b";
const ADMIN_NAV_SECTION = "#94a3b8";

export default function AdminNav({ children }: { children?: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname() || "/admin/dashboard";
  const router = useRouter();

  // ✅ 2. Initialize the logout mutation
  const logoutMutation = useLogoutMutation();

  const isActive = (path: string) =>
    path === "/admin/dashboard"
      ? pathname === "/admin/dashboard"
      : pathname.startsWith(path);

  // ✅ 3. Create the logout handler
  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Always redirect to login, even if the backend call failed, 
      // so the user isn't stuck on the page.
      router.replace("/login");
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-5 flex-shrink-0"
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        {sidebarOpen && (
          <Image
            src="/omega_logo_456x150_1_456x150.avif"
            alt="Omega Logo"
            width={100}
            height={33}
            className="h-auto w-auto"
            loading="eager"
          />
        )}
        {!sidebarOpen && (
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg"
            style={{ backgroundColor: "#bf262f" }}
          >
            <Layers size={18} />
          </div>
        )}
        {sidebarOpen && (
          <div className="text-xs font-medium" style={{ color: "#bf262f" }}>Admin Portal</div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="ml-auto flex-shrink-0 w-6 h-6 items-center justify-center rounded-md transition-colors hover:bg-slate-100 hidden lg:inline-flex"
          style={{ color: "#64748b" }}
        >
          {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
        <button
          onClick={() => setMobileOpen(false)}
          className="ml-auto flex-shrink-0 lg:hidden"
          style={{ color: "#64748b" }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Account Badge */}
      {sidebarOpen && (
        <div
          className="mx-3 mt-4 p-3 rounded-xl flex-shrink-0"
          style={{
            backgroundColor: "rgba(191,38,47,0.12)",
            border: "1px solid rgba(191,38,47,0.2)",
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: "#bf262f" }}
            >
              AD
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold truncate" style={{ color: "#1f2937" }}>Admin Account</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className="text-xs px-1.5 py-0.5 rounded font-bold tracking-wide"
                  style={{ backgroundColor: "#d97706", color: "#fff", fontSize: "0.6rem" }}
                >
                  ADMIN
                </span>
                <span className="text-xs" style={{ color: ADMIN_NAV_MUTED }}>
                  System Admin
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!sidebarOpen && (
        <div className="mx-auto mt-4 flex-shrink-0">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: "#bf262f" }}
          >
            AD
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            {sidebarOpen && (
              <div
                className="text-xs font-semibold uppercase tracking-widest mb-2 px-3"
                style={{ color: ADMIN_NAV_SECTION }}
              >
                {section.label}
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map(({ icon: Icon, label, path }) => {
                const active = isActive(path);
                return (
                  <Link
                    key={`${path}-${label}`}
                    href={path}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group"
                    style={{
                      backgroundColor: active ? "#bf262f" : "transparent",
                      color: active ? "#fff" : ADMIN_NAV_TEXT,
                    }}
                    title={!sidebarOpen ? label : undefined}
                  >
                    <Icon size={17} className="flex-shrink-0 transition-transform group-hover:scale-105" />
                    {sidebarOpen && (
                      <span className="text-sm font-medium">{label}</span>
                    )}
                    {active && sidebarOpen && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div
        className="px-3 pb-4 space-y-0.5 flex-shrink-0"
        style={{ borderTop: `1px solid ${ADMIN_NAV_BORDER}`, paddingTop: "12px" }}
      >
        {/* ✅ 4. Replaced <Link> with <button> to trigger the mutation */}
        <button
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors w-full text-left disabled:opacity-50 hover:bg-black/5"
          style={{ color: ADMIN_NAV_MUTED }}
          title={!sidebarOpen ? "Logout" : undefined}
        >
          <LogOut size={17} className="flex-shrink-0" />
          {sidebarOpen && (
            <span className="text-sm">
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </span>
          )}
        </button>

        {sidebarOpen && (
          <div
            className="mx-3 mt-2 flex items-center gap-1.5 text-xs"
            style={{ color: ADMIN_NAV_MUTED }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            OHW_PRD · Live
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: "#f1f5f9", fontFamily: "'Inter', sans-serif" }}
    >
      {/* Desktop Sidebar */}
      <aside
        className="fixed top-0 left-0 h-full z-40 hidden lg:flex flex-col transition-all duration-300"
        style={{
          width: sidebarOpen ? "240px" : "68px",
          background: ADMIN_NAV_BG,
          borderRight: `1px solid ${ADMIN_NAV_BORDER}`,
          boxShadow: "4px 0 24px rgba(15, 23, 42, 0.08)",
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="absolute top-0 left-0 h-full w-64 flex flex-col"
            style={{
              background: ADMIN_NAV_BG,
              borderRight: `1px solid ${ADMIN_NAV_BORDER}`,
            }}
          >
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div
        className="flex-1 flex flex-col w-full min-w-0 transition-all duration-300 h-screen"
        style={{ marginLeft: sidebarOpen ? "240px" : "68px" }}
      >
        {/* Top bar */}
        <header
          className="sticky top-0 z-30 bg-white flex items-center gap-4 px-5 py-3 flex-shrink-0"
          style={{ borderBottom: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
        >
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto">
            <div
              className="flex items-center gap-2.5 pl-3 ml-1"
              style={{ borderLeft: "1px solid #e2e8f0" }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: "#bf262f" }}
              >
                AD
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-gray-800 leading-tight">Admin</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span
                    className="text-xs px-1.5 rounded font-bold"
                    style={{ backgroundColor: "#fef3c7", color: "#92400e", fontSize: "0.6rem" }}
                  >
                    ADMIN
                  </span>
                  <span className="text-gray-400" style={{ fontSize: "0.7rem" }}>System</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </div>
      </div>
    </div>
  );
}