import Link from "next/link";
import { Mail, Shield } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { FooterSetting, NavigationItem } from "@/types";

interface FooterProps {
  setting?: FooterSetting;
  navItems?: NavigationItem[];
}

export function Footer({ setting, navItems = [] }: FooterProps) {
  if (setting && setting.is_visible === false) return null;

  const currentYear = new Date().getFullYear();
  const description =
    setting?.description ||
    "Raj Antala — AI Engineer, Data Scientist, and Generative AI enthusiast dedicated to building intelligent, reliable, and scalable software systems.";
  const copyright = setting?.copyright_text || `© ${currentYear} Raj Antala. All rights reserved.`;

  return (
    <footer className="bg-white border-t border-gray-200 py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand & Summary */}
          <div className="md:col-span-6">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-md bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                RA
              </div>
              <span className="font-bold text-gray-900 tracking-tight text-base">
                Raj Antala
              </span>
            </Link>
            <p className="mt-3 text-xs text-slate-500 max-w-sm leading-relaxed">
              {description}
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-3">
              Navigation
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/#about" className="text-slate-500 hover:text-blue-600 transition-colors">
                  About Me
                </Link>
              </li>
              <li>
                <Link href="/#skills" className="text-slate-500 hover:text-blue-600 transition-colors">
                  Skills & Tech
                </Link>
              </li>
              <li>
                <Link href="/#projects" className="text-slate-500 hover:text-blue-600 transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/#experience" className="text-slate-500 hover:text-blue-600 transition-colors">
                  Experience
                </Link>
              </li>
              <li>
                <Link href="/resume" className="text-slate-500 hover:text-blue-600 transition-colors">
                  Resume PDF
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials & Admin Link */}
          <div className="md:col-span-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-3">
              Connect
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/rajantala"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md bg-slate-50 text-slate-600 hover:text-gray-900 hover:bg-slate-100 border border-gray-200 transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/in/rajantala"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md bg-slate-50 text-slate-600 hover:text-blue-600 hover:bg-slate-100 border border-gray-200 transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@rajantala.com"
                className="p-2 rounded-md bg-slate-50 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 border border-gray-200 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

            <div className="mt-6">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400 hover:text-blue-600 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                CMS Admin Panel
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div>{copyright}</div>
          <div className="flex items-center gap-4">
            <span>Built with Next.js, Django & Neon PostgreSQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
