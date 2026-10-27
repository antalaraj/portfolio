"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

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
          {children}
        </main>
      </div>
    </div>
  );
}
