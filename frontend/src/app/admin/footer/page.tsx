"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PanelBottom, Save, Loader2, CheckCircle2, AlertCircle, Mail, Sparkles } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { adminApi } from "@/services/adminApi";
import { FooterSetting } from "@/types";

export default function AdminFooterPage() {
  const [footer, setFooter] = useState<Partial<FooterSetting>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    adminApi
      .getFooter()
      .then((res) => setFooter((res as any)?.data || res || {}))
      .catch(() => setMessage({ type: "error", text: "Failed to load footer settings." }))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await adminApi.updateFooter(footer);
      const updated = (res as any)?.data || res;
      if (updated && typeof updated === "object") setFooter(updated);
      setMessage({ type: "success", text: "Footer configuration updated successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to save footer." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <PanelBottom className="w-5 h-5 text-blue-600" />
          Footer Manager
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Customize the footer description, copyright statement, and public footer visibility.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-md text-xs flex items-center justify-between ${
            message.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-rose-50 border border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-[11px] font-bold opacity-60">
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          Loading footer data...
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-2xs space-y-5 text-xs">
          <div>
            <label className="block font-semibold text-gray-800 mb-1">
              Footer Bio / Summary
            </label>
            <textarea
              rows={3}
              required
              value={footer.description || ""}
              onChange={(e) => setFooter({ ...footer, description: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-800 mb-1">
              Copyright Text
            </label>
            <input
              type="text"
              required
              value={footer.copyright_text || ""}
              onChange={(e) => setFooter({ ...footer, copyright_text: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>

          {/* Synced Contact & Social Information from Profile Management */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="font-semibold text-xs text-blue-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Synced Contact & Social Profiles (Controlled via Profile Management)</span>
              </div>
              <Link
                href="/admin/profile"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1"
              >
                Edit in Profile Management &rarr;
              </Link>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Footer Contact Email, GitHub Profile URL, and LinkedIn Profile URL are managed centrally from <strong className="text-gray-800">Profile Management</strong> to keep the public site completely consistent.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-white p-3 rounded-lg border border-blue-200/70 shadow-2xs">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  Contact Email
                </div>
                <div className="text-xs font-semibold text-gray-900 truncate" title={footer.contact_email || "Not set"}>
                  {footer.contact_email || "Not configured"}
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-blue-200/70 shadow-2xs">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  <GithubIcon className="w-3.5 h-3.5 text-slate-500" />
                  GitHub URL
                </div>
                <div className="text-xs font-semibold text-gray-900 truncate" title={footer.github_url || "Not set"}>
                  {footer.github_url || "Not configured"}
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-blue-200/70 shadow-2xs">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  <LinkedinIcon className="w-3.5 h-3.5 text-slate-500" />
                  LinkedIn URL
                </div>
                <div className="text-xs font-semibold text-gray-900 truncate" title={footer.linkedin_url || "Not set"}>
                  {footer.linkedin_url || "Not configured"}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={footer.is_visible ?? true}
                onChange={(e) => setFooter({ ...footer, is_visible: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <span className="text-xs font-semibold text-gray-800">
                Display Footer on Public Website
              </span>
            </label>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving Footer...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Save Footer Settings
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
