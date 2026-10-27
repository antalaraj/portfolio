"use client";

import { useState, useEffect } from "react";
import { User, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { adminApi } from "@/services/adminApi";
import { Profile } from "@/types";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    adminApi
      .getProfile()
      .then((res) => setProfile(res.data))
      .catch(() => setMessage({ type: "error", text: "Failed to load profile." }))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await adminApi.updateProfile(profile);
      setProfile(res.data);
      setMessage({ type: "success", text: "Profile information updated successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to save profile." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
        Loading profile configuration...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Personal & Professional Profile
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Update public biography, professional positioning headline, contact channels, and resume link.
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

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-2xs space-y-6 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-800 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={profile.full_name || ""}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-800 mb-1">Availability Indicator</label>
            <input
              type="text"
              value={profile.availability_status || ""}
              onChange={(e) => setProfile({ ...profile, availability_status: e.target.value })}
              placeholder="e.g. Open to AI & Machine Learning Opportunities"
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-gray-800 mb-1">Professional Positioning Headline</label>
          <input
            type="text"
            required
            value={profile.headline || ""}
            onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
            className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-800 mb-1">Professional Biography & Summary</label>
          <textarea
            rows={5}
            value={profile.bio || ""}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold text-gray-800 mb-1">Contact Email</label>
            <input
              type="email"
              required
              value={profile.email || ""}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-800 mb-1">Phone Number</label>
            <input
              type="text"
              value={profile.phone || ""}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-800 mb-1">Location</label>
            <input
              type="text"
              value={profile.location || ""}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-800 mb-1">GitHub Profile URL</label>
            <input
              type="url"
              value={profile.github_url || ""}
              onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-800 mb-1">LinkedIn Profile URL</label>
            <input
              type="url"
              value={profile.linkedin_url || ""}
              onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-800 mb-1">Headshot / Avatar URL</label>
            <input
              type="url"
              value={profile.avatar_url || ""}
              onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-800 mb-1">Downloadable Resume PDF URL</label>
            <input
              type="url"
              value={profile.resume_file_url || ""}
              onChange={(e) => setProfile({ ...profile, resume_file_url: e.target.value })}
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
                Saving Profile...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                Save Profile Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
