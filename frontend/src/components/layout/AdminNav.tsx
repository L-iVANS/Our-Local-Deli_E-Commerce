'use client';

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  FileText,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
  BarChart3,
  Layers,
  Menu,
  X,
  Settings,
} from "lucide-react";
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
      { icon: Package,        label: "Products",    path: "/admin/products"    },
      { icon: ClipboardList,  label: "Sales Order", path: "/admin/sales-order" },
      { icon: FileText,       label: "Invoices",    path: "/admin/invoices"    },
    ],
  },
  {
    label: "Tools",
    items: [
      { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
      { icon: User,      label: "Users",     path: "/admin/users"     },
      { icon: Settings,  label: "Settings",  path: "/admin/settings"  },
    ],
  },
];

export default function AdminNav({ children }: { children?: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const pathname      = usePathname() || "/admin/dashboard";
  const router        = useRouter();
  const logoutMutation = useLogoutMutation();

  const isActive = (path: string) =>
    path === "/admin/dashboard"
      ? pathname === "/admin/dashboard"
      : pathname.startsWith(path);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      router.replace("/login");
    }
  };

  const SidebarContent = ({ expanded }: { expanded: boolean }) => (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">

      {/* ── Logo ── */}
      <div className="flex items-center gap-3 border-b border-sidebar-border px-4 py-5 flex-shrink-0">
        {expanded ? (
          <Image
            src="/omega_logo_456x150_1_456x150.avif"
            alt="Omega Logo"
            width={100}
            height={33}
            className="h-auto w-auto"
            loading="eager"
          />
        ) : (
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary shadow-lg">
            {/* force white icon when collapsed */}
            <Layers size={18} className="text-[#F4F4F0]" />
          </div>
        )}

        {expanded && (
          <div className="text-xs font-medium text-gold">Admin Portal</div>
        )}

        {/* Desktop collapse toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="ml-auto hidden h-6 w-6 items-center justify-center rounded-md
                     text-muted-foreground transition-colors
                     hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
                     lg:inline-flex"
        >
          {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="ml-auto flex-shrink-0 text-muted-foreground lg:hidden"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Account Badge ── */}
      {expanded ? (
        <div className="mx-3 mt-4 rounded-xl border border-sidebar-border bg-card p-3 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center
                            rounded-full bg-primary text-xs font-bold text-[#F4F4F0]">
              AD
            </div>
            <div className="min-w-0">
              <div className="truncate text-xs font-semibold text-foreground">
                Admin Account
              </div>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="rounded px-1.5 py-0.5 text-[0.6rem] font-bold
                                 tracking-wide bg-accent text-accent-foreground">
                  ADMIN
                </span>
                <span className="text-xs text-muted-foreground">System Admin</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto mt-4 flex-shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-full
                          bg-primary text-xs font-bold text-[#F4F4F0]">
            AD
          </div>
        </div>
      )}

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            {expanded && (
              <div className="mb-2 px-3 text-[11px] font-semibold uppercase
                              tracking-[0.18em] text-muted-foreground">
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
                    title={!expanded ? label : undefined}
                    className={[
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5",
                      "transition-all duration-150",
                      active
                        // ✅ force white text + icon on the green active bg
                        ? "bg-primary text-[#F4F4F0] shadow-sm"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    ].join(" ")}
                  >
                    {/* Icon inherits the text color set above */}
                    <Icon
                      size={17}
                      className="flex-shrink-0 transition-transform group-hover:scale-105"
                    />

                    {expanded && (
                      <span className="text-sm font-medium">{label}</span>
                    )}

                    {/* Gold dot indicator on active item */}
                    {active && expanded && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-gold" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Bottom / Logout ── */}
      <div className="space-y-0.5 border-t border-sidebar-border px-3 pb-4 pt-3 flex-shrink-0">
        <button
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          title={!expanded ? "Logout" : undefined}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left
                     text-muted-foreground transition-colors
                     hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
                     disabled:opacity-50"
        >
          <LogOut size={17} className="flex-shrink-0" />
          {expanded && (
            <span className="text-sm">
              {logoutMutation.isPending ? "Logging out…" : "Logout"}
            </span>
          )}
        </button>

        {expanded && (
          <div className="mx-3 mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            OHW_PRD · Live
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="dark flex min-h-screen bg-background text-foreground">

      {/* ── Desktop Sidebar ── */}
      <aside
        className={[
          "fixed left-0 top-0 z-40 hidden h-full flex-col",
          "border-r border-sidebar-border bg-sidebar",
          "shadow-[4px_0_24px_rgba(0,0,0,0.18)]",
          "transition-all duration-300 lg:flex",
          sidebarOpen ? "w-[240px]" : "w-[68px]",
        ].join(" ")}
      >
        <SidebarContent expanded={sidebarOpen} />
      </aside>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 border-r border-sidebar-border bg-sidebar">
            <SidebarContent expanded={true} />
          </aside>
        </div>
      )}

      {/* ── Main area ── */}
      <div
        className={[
          "ml-0 flex h-screen min-w-0 flex-1 flex-col transition-all duration-300",
          sidebarOpen ? "lg:ml-[240px]" : "lg:ml-[68px]",
        ].join(" ")}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex flex-shrink-0 items-center gap-4
                           border-b border-border bg-card px-5 py-3 shadow-sm">
          <button
            className="rounded-lg p-1.5 text-muted-foreground transition-colors
                       hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="ml-auto flex items-center gap-2">
            <div className="ml-1 flex items-center gap-2.5 border-l border-border pl-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center
                              rounded-full bg-primary text-xs font-bold text-[#F4F4F0]">
                AD
              </div>
              <div className="hidden text-left sm:block">
                <div className="text-xs font-semibold leading-tight text-foreground">
                  Admin
                </div>
                <div className="mt-0.5 flex items-center gap-1">
                  <span className="rounded bg-accent px-1.5 text-[0.6rem]
                                   font-bold text-accent-foreground">
                    ADMIN
                  </span>
                  <span className="text-[0.7rem] text-muted-foreground">System</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto bg-background">
          {children}
        </div>
      </div>
    </div>
  );
}