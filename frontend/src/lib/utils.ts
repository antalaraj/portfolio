import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return ""
  try {
    const d = new Date(dateString)
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  } catch {
    return dateString
  }
}

export function resolveMediaUrl(url?: string): string {
  if (!url) return "";
  // Convert full backend URLs (localhost or *.onrender.com) to same-origin /media/ path
  return url.replace(/^https?:\/\/(127\.0\.0\.1|localhost|.*\.onrender\.com)(:\d+)?(\/media\/.*)$/, "$3");
}
