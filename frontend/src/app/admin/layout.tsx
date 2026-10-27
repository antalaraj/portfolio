"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { adminApi } from "@/services/adminApi";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (pathname === "/admin/login") {
      setCheckingAuth(false);
      return;
    }

    const storedUser = typeof window !== "undefined" ? localStorage.getItem("admin_user") : null;
    if (!storedUser) {
      router.replace("/admin/login");
      return;
    }

    setCheckingAuth(false);

    // Silently verify with backend in background
    adminApi.getMe().catch((err: any) => {
      if (err?.status === 401 || err?.status === 403) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("admin_user");
        }
        router.replace("/admin/login");
      }
    });
  }, [pathname, router]);

  // If on the login page, render clean full screen without admin chrome
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Derive human readable page title from route
  const getPageTitle = (path: string) => {
    if (path === "/admin") return "Overview & Analytics";
    const segment = path.replace("/admin/", "");
    return segment.charAt(0).toUpperCase() + segment.slice(1) + " Management";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 h-full z-10">
            <AdminSidebar onCloseMobile={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Body */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onToggleSidebar={() => setMobileOpen(!mobileOpen)}
          title={getPageTitle(pathname)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {!mounted || checkingAuth ? (
            <div className="flex flex-col items-center justify-center py-28">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
              <p className="text-sm font-medium text-slate-500">Verifying admin session...</p>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
