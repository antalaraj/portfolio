"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { publicApi } from "@/services/publicApi";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  // Track page views on route changes
  useEffect(() => {
    if (!pathname) return;

    // Skip admin panel visits so owner dashboard management doesn't distort visitor metrics
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    // Prevent duplicate events for the same path in immediate succession
    if (lastTrackedPath.current === pathname) {
      return;
    }
    lastTrackedPath.current = pathname;

    // Small delay to ensure document.referrer and title are fully set
    const timer = setTimeout(() => {
      publicApi.trackEvent(pathname, typeof document !== "undefined" ? document.referrer : "", "pageview", {
        title: typeof document !== "undefined" ? document.title : "",
      });
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Global click listener for conversion tracking (Resume Downloads, External Links)
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href") || "";

      // Track Resume Downloads
      if (href.includes("/resume") || href.endsWith(".pdf") || target.innerText?.toLowerCase().includes("resume")) {
        publicApi.trackEvent("/resume", "", "resume_download", {
          label: "Download Resume",
          href,
        });
      }

      // Track Outbound GitHub/LinkedIn clicks
      if (href.startsWith("http") && !href.includes(window.location.host)) {
        if (href.includes("github.com") || href.includes("linkedin.com") || href.includes("twitter.com")) {
          publicApi.trackEvent(href, "", "outbound_click", {
            platform: href.includes("github") ? "GitHub" : href.includes("linkedin") ? "LinkedIn" : "Social",
          });
        }
      }
    };

    document.addEventListener("click", handleDocumentClick, { passive: true });
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  return null;
}
