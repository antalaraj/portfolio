"use client";

import { useState, useEffect } from "react";
import { Search, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { adminApi } from "@/services/adminApi";
import { SEOMetadata } from "@/types";

export default function AdminSEOPage() {
  const [seoList, setSeoList] = useState<SEOMetadata[]>([]);
  const [selectedSeo, setSelectedSeo] = useState<SEOMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchSEO = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getSEOMetadata();
      setSeoList(res.data);
      if (res.data.length > 0) setSelectedSeo(res.data[0]);
    } catch {
      setMessage({ type: "error", text: "Failed to load SEO metadata." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSEO();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeo) return;
    setSaving(true);
    try {
      await adminApi.updateSEOMetadata(selectedSeo.id!, selectedSeo);
      setMessage({ type: "success", text: "SEO configuration updated successfully!" });
    } catch {
      setMessage({ type: "error", text: "Failed to save SEO metadata." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-600" />
          SEO & Meta Tags Manager
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Configure search engine optimization titles, OpenGraph social preview cards, and indexing directives.
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
          Loading SEO configurations...
        </div>
      ) : selectedSeo ? (
        <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-2xs space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-800 mb-1">Page Scope</label>
            <input
              type="text"
              disabled
              value={selectedSeo.page_identifier.toUpperCase()}
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 bg-slate-50 font-mono text-slate-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-800 mb-1">Meta Title Tag *</label>
            <input
              type="text"
              required
              value={selectedSeo.title}
              onChange={(e) => setSelectedSeo({ ...selectedSeo, title: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-800 mb-1">Meta Description *</label>
            <textarea
              rows={3}
              required
              value={selectedSeo.meta_description}
              onChange={(e) => setSelectedSeo({ ...selectedSeo, meta_description: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-800 mb-1">Keywords (Comma separated)</label>
            <input
              type="text"
              value={selectedSeo.keywords}
              onChange={(e) => setSelectedSeo({ ...selectedSeo, keywords: e.target.value })}
              placeholder="AI Engineer, Data Scientist, Machine Learning..."
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-800 mb-1">OpenGraph Title</label>
              <input
                type="text"
                value={selectedSeo.og_title}
                onChange={(e) => setSelectedSeo({ ...selectedSeo, og_title: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-800 mb-1">OpenGraph Image URL</label>
              <input
                type="url"
                value={selectedSeo.og_image_url}
                onChange={(e) => setSelectedSeo({ ...selectedSeo, og_image_url: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
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
                  Saving SEO...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Save SEO Settings
                </>
              )}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
