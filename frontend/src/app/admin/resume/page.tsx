"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FileText,
  Upload,
  Download,
  ExternalLink,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";
import { adminApi } from "@/services/adminApi";
import { Profile } from "@/types";

function resolveMediaUrl(url?: string): string {
  if (!url) return "";
  return url.replace(/^https?:\/\/(127\.0\.0\.1|localhost):8000(\/media\/.*)$/, "$2");
}

export default function AdminResumePage() {
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getProfile();
      const prof = (res as any)?.data || res || {};
      setProfile(prof);
      setManualUrl(prof.resume_file_url || "");
    } catch {
      setMessage({ type: "error", text: "Failed to load profile data." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (15MB limit)
    if (file.size > 15 * 1024 * 1024) {
      setMessage({ type: "error", text: "File size exceeds 15MB. Please upload a smaller document." });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const uploadRes = await adminApi.uploadMedia(file, `${profile.full_name || "candidate"}_resume`);
      const fileUrl = uploadRes.data?.file_url;

      if (!fileUrl) {
        throw new Error("No URL returned from media server.");
      }

      // Update profile with the new resume URL
      const updateRes = await adminApi.updateProfile({ resume_file_url: fileUrl });
      const updated = (updateRes as any)?.data || updateRes;

      setProfile(updated);
      setManualUrl(fileUrl);
      setMessage({
        type: "success",
        text: "Resume uploaded successfully! It is now live for all visitors on the public site.",
      });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.message || "Failed to upload resume file.",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSaveManualUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await adminApi.updateProfile({ resume_file_url: manualUrl.trim() });
      const updated = (res as any)?.data || res;
      setProfile(updated);
      setMessage({ type: "success", text: "Resume URL updated and saved successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to update resume URL." });
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveResume = async () => {
    if (!confirm("Are you sure you want to remove the current resume? Visitors will no longer be able to view or download it until a new one is uploaded.")) {
      return;
    }

    setSaving(true);
    try {
      await adminApi.updateProfile({ resume_file_url: "" });
      setProfile((prev) => ({ ...prev, resume_file_url: "" }));
      setManualUrl("");
      setMessage({ type: "success", text: "Resume removed successfully." });
    } catch {
      setMessage({ type: "error", text: "Failed to remove resume." });
    } finally {
      setSaving(false);
    }
  };

  const handleCopyUrl = () => {
    if (!profile.resume_file_url) return;
    navigator.clipboard.writeText(profile.resume_file_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Resume Upload & Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Upload your official PDF resume for recruiters and employers to view online and download.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/resume"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md border border-gray-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            View Live /resume
          </Link>
        </div>
      </div>

      {/* Status Notifications */}
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
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
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
          Loading resume settings...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Upload Box & URL Editor */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct Upload Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Upload New Resume File</h3>
                  <p className="text-[11px] text-slate-500">Supports PDF, DOC, DOCX up to 15MB</p>
                </div>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="resume-file-input"
              />

              <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`border-2 border-dashed border-gray-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/40 rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                  uploading ? "opacity-60 pointer-events-none" : ""
                }`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                    <span className="text-xs font-semibold text-gray-900">Uploading and publishing resume...</span>
                    <span className="text-[11px] text-slate-500 mt-1">Please wait a moment</span>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-white shadow-2xs border border-gray-200 flex items-center justify-center text-blue-600 mb-3">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-gray-900 block">
                      Click to choose PDF file
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      or drag and drop your updated resume here
                    </span>
                  </>
                )}
              </div>

              <div className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-lg border border-gray-200/60">
                <strong className="text-gray-800">Note:</strong> When you upload a resume, it instantly updates the public <code className="bg-white px-1 py-0.5 rounded border border-gray-200 text-blue-600">/resume</code> page, the navbar link, and hero section download button.
              </div>
            </div>

            {/* Direct URL Overwrite Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Or Set External File URL</h3>
              <p className="text-[11px] text-slate-500">
                Paste a direct link to a PDF hosted on Google Drive, AWS S3, or Cloudinary.
              </p>

              <form onSubmit={handleSaveManualUrl} className="space-y-3">
                <input
                  type="url"
                  placeholder="https://example.com/raj_antala_resume.pdf"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
                <button
                  type="submit"
                  disabled={saving || !manualUrl.trim()}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md bg-slate-800 text-white hover:bg-slate-900 shadow-2xs transition-colors disabled:opacity-40"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  Save URL Manually
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Live Status & Embedded Preview */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">Active Public Resume</h3>
                    {profile.resume_file_url ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Live on Website
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        No Resume Uploaded
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Live document served to visitors and recruiters.
                  </p>
                </div>

                {profile.resume_file_url && (
                  <div className="flex items-center gap-2">
                    <a
                      href={resolveMediaUrl(profile.resume_file_url)}
                      download={`${(profile.full_name || "Raj_Antala").replace(/\s+/g, "_")}_Resume.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </a>
                    <button
                      onClick={handleRemoveResume}
                      disabled={saving}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      title="Remove current resume"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {profile.resume_file_url ? (
                <div className="space-y-4">
                  {/* File URL Bar with Copy Button */}
                  <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-gray-200 text-xs">
                    <span className="font-mono text-slate-600 truncate flex-1 text-[11px]">
                      {profile.resume_file_url}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyUrl}
                      className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-blue-600 bg-white border border-gray-200 rounded shadow-2xs inline-flex items-center gap-1 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy Link
                        </>
                      )}
                    </button>
                    <a
                      href={resolveMediaUrl(profile.resume_file_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-blue-600 bg-white border border-gray-200 rounded shadow-2xs inline-flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Open
                    </a>
                  </div>

                  {/* Document Live Preview */}
                  <div className="rounded-xl border border-gray-200 overflow-hidden bg-slate-100 shadow-inner">
                    <div className="bg-slate-200/80 px-3 py-1.5 text-[11px] font-medium text-slate-700 flex items-center justify-between border-b border-gray-300/80">
                      <span>Live Embedded Document Preview</span>
                      <a
                        href={resolveMediaUrl(profile.resume_file_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Fullscreen View &rarr;
                      </a>
                    </div>
                    <object
                      data={`${resolveMediaUrl(profile.resume_file_url)}#toolbar=0&navpanes=0`}
                      type="application/pdf"
                      className="w-full h-[540px] border-0 bg-white"
                    >
                      <iframe
                        src={`${resolveMediaUrl(profile.resume_file_url)}#toolbar=0&navpanes=0`}
                        className="w-full h-[540px] border-0 bg-white"
                        title="Current Resume Preview"
                      />
                    </object>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-xl bg-slate-50/50">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <div className="text-xs font-semibold text-gray-700">No Resume File Uploaded</div>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                    Use the upload box on the left to upload your PDF resume so visitors and recruiters can view and download it.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
