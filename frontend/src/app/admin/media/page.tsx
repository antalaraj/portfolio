"use client";

import { useState, useEffect } from "react";
import { Image as ImageIcon, Upload, Trash2, Copy, Check, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { adminApi } from "@/services/adminApi";

export default function AdminMediaLibraryPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getMedia();
      setAssets(res.data);
    } catch {
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);
    try {
      const res = await adminApi.uploadMedia(file);
      if (res.success) {
        setAssets([res.data, ...assets]);
        setMessage({ type: "success", text: "Media uploaded and synchronized successfully!" });
      } else {
        setMessage({ type: "error", text: res.error?.message || "Upload failed." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Upload failed." });
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete media asset "${title}"?`)) return;
    try {
      await adminApi.deleteMedia(id);
      setAssets(assets.filter((a) => a.id !== id));
      setMessage({ type: "success", text: `Deleted "${title}".` });
    } catch {
      setMessage({ type: "error", text: "Failed to delete media asset." });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            Media Library
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Centralized asset management for headshots, project galleries, and downloadable PDFs.
          </p>
        </div>

        <div>
          <label className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-colors cursor-pointer">
            {uploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            <span>{uploading ? "Uploading..." : "Upload Asset"}</span>
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
              accept="image/*,application/pdf"
            />
          </label>
        </div>
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

      {/* Assets Grid */}
      {loading ? (
        <div className="bg-white p-12 text-center text-xs text-slate-500 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          Loading media library...
        </div>
      ) : assets.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-gray-200 shadow-2xs">
          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <div className="text-sm font-semibold text-gray-800">No media uploaded yet</div>
          <div className="text-xs text-slate-400 mt-1">
            Click &quot;Upload Asset&quot; to upload project screenshots, certificate scans, or profile headshots.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-2xs group flex flex-col justify-between"
            >
              <div className="aspect-square bg-slate-100 overflow-hidden relative border-b border-gray-100 flex items-center justify-center">
                {asset.file_type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset.file_url}
                    alt={asset.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-slate-400 text-xs font-mono uppercase">
                    PDF Document
                  </div>
                )}
              </div>

              <div className="p-3">
                <div className="text-xs font-bold text-gray-900 truncate">
                  {asset.title}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {(asset.file_size_bytes / 1024).toFixed(1)} KB
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => handleCopyUrl(asset.file_url, asset.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-blue-600"
                    title="Copy URL"
                  >
                    {copiedId === asset.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedId === asset.id ? "Copied" : "Copy URL"}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(asset.id, asset.title)}
                    className="p-1 text-slate-400 hover:text-rose-600"
                    title="Delete Asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
