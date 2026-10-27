"use client";

import { useState, useEffect } from "react";
import { PanelBottom, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
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
      .then((res) => setFooter(res.data))
      .catch(() => setMessage({ type: "error", text: "Failed to load footer settings." }))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await adminApi.updateFooter(footer);
      setFooter(res.data);
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
