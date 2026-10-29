"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  User,
  UserCheck,
  FileText,
  Briefcase,
  FolderGit2,
  Cpu,
  GraduationCap,
  Award,
  MessageSquareQuote,
  MenuSquare,
  PanelBottom,
  Image as ImageIcon,
  Mail,
  Search,
  Settings,
  ExternalLink,
} from "lucide-react";

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Website Builder", href: "/admin/builder", icon: Layers },
    { label: "Profile", href: "/admin/profile", icon: User },
    { label: "Resume Upload", href: "/admin/resume", icon: FileText },
    { label: "About Me", href: "/admin/about", icon: UserCheck },
    { label: "Projects", href: "/admin/projects", icon: FolderGit2 },
    { label: "Skills", href: "/admin/skills", icon: Cpu },
    { label: "Experience", href: "/admin/experience", icon: Briefcase },
    { label: "Education", href: "/admin/education", icon: GraduationCap },
    { label: "Certifications", href: "/admin/certifications", icon: Award },
    { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
    { label: "Navigation", href: "/admin/navigation", icon: MenuSquare },
    { label: "Footer", href: "/admin/footer", icon: PanelBottom },
    { label: "Media Library", href: "/admin/media", icon: ImageIcon },
    { label: "Contact Inbox", href: "/admin/contact", icon: Mail },
    { label: "SEO Manager", href: "/admin/seo", icon: Search },
    { label: "Site Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-50 border-r border-gray-200 flex flex-col h-full shrink-0">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200 bg-white">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
            RA
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900 leading-none">Portfolio CMS</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Admin Control</div>
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? "bg-white text-blue-600 font-semibold border border-gray-200 shadow-2xs"
                  : "text-slate-600 hover:text-gray-900 hover:bg-slate-100"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer Quick Link to Public Site */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center gap-1.5 w-full py-2 px-3 text-xs font-semibold rounded-md border border-gray-300 text-gray-800 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
          View Live Website
        </Link>
      </div>
    </aside>
  );
}
