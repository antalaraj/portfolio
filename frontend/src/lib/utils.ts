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
