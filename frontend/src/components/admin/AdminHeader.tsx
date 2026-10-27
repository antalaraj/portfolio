"use client";

import { useRouter } from "next/navigation";
import { Menu, LogOut, ShieldCheck, User } from "lucide-react";
import { adminApi } from "@/services/adminApi";

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
  title?: string;
}

export function AdminHeader({ onToggleSidebar, title = "CMS Dashboard" }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await adminApi.logout();
    } catch {}
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_user");
    }
    router.replace("/admin/login");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-md text-slate-600 hover:text-gray-900 hover:bg-slate-100"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-gray-900 tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Superadmin badge */}
        <div className="hidden sm:flex items-center gap-2 pl-3 py-1 pr-2 rounded-full bg-slate-50 border border-gray-200">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-xs font-semibold text-gray-800">Raj Antala</span>
          <span className="text-[10px] text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded">SuperAdmin</span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-300 text-xs font-semibold text-slate-700 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors shadow-2xs"
          title="Sign out of Admin CMS"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
