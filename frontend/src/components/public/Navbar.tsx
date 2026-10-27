"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight, FileText } from "lucide-react";
import { NavigationItem } from "@/types";

interface NavbarProps {
  items?: NavigationItem[];
  resumeUrl?: string;
}

export function Navbar({ items = [], resumeUrl = "/resume" }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const defaultNav: NavigationItem[] = items.length > 0 ? items : [
    { id: "1", label: "About", destination: "/#about", is_external: false, menu_location: "header", display_order: 1, is_active: true },
    { id: "2", label: "Skills", destination: "/#skills", is_external: false, menu_location: "header", display_order: 2, is_active: true },
    { id: "3", label: "Projects", destination: "/#projects", is_external: false, menu_location: "header", display_order: 3, is_active: true },
    { id: "4", label: "Experience", destination: "/#experience", is_external: false, menu_location: "header", display_order: 4, is_active: true },
    { id: "5", label: "Contact", destination: "/#contact", is_external: false, menu_location: "header", display_order: 5, is_active: true },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-xs"
          : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-md bg-blue-600 text-white font-bold flex items-center justify-center text-sm tracking-tight shadow-xs group-hover:bg-blue-700 transition-colors">
            RA
          </div>
          <span className="font-semibold text-gray-900 tracking-tight text-base group-hover:text-blue-600 transition-colors">
            Raj Antala
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7">
          {defaultNav.map((item) => (
            <Link
              key={item.id}
              href={item.destination}
              target={item.is_external ? "_blank" : undefined}
              rel={item.is_external ? "noopener noreferrer" : undefined}
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href={resumeUrl}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md border border-gray-300 text-gray-800 bg-white hover:bg-slate-50 hover:border-gray-400 transition-all shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            Resume
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-1 px-4 py-1.5 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-2xs"
          >
            Contact
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-slate-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col gap-3">
            {defaultNav.map((item) => (
              <Link
                key={item.id}
                href={item.destination}
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-md transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              <Link
                href={resumeUrl}
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-800 bg-white hover:bg-slate-50"
              >
                View Resume
              </Link>
              <Link
                href="/#contact"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
