"use client";

import { useState, useEffect } from "react";
import { User, Save, Loader2, CheckCircle2, AlertCircle, Camera, Upload, Trash2, Sparkles } from "lucide-react";
import { adminApi } from "@/services/adminApi";
import { Profile } from "@/types";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    adminApi
      .getProfile()
      .then((res) => setProfile(res.data))
      .catch(() => setMessage({ type: "error", text: "Failed to load profile." }))
      .finally(() => setLoading(false));
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setMessage(null);

    try {
      const res = await adminApi.uploadMedia(file, `${profile.full_name || "Profile"} Avatar`);
      const url = res.data?.file_url;
      if (url) {
        setProfile((prev) => ({ ...prev, avatar_url: url }));
        setMessage({
          type: "success",
          text: "Profile picture uploaded! Click 'Save Profile Changes' below to update the live website.",
        });
      } else {
        throw new Error(res.error?.message || "Failed to retrieve uploaded image URL.");
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to upload image." });
    } finally {
      setUploadingAvatar(false);
    }
  };

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

  const handleToggleExperienceBadge = async (enabled: boolean) => {
    setProfile((prev) => ({ ...prev, show_experience_badge: enabled }));
    try {
      await adminApi.updateProfile({ show_experience_badge: enabled });
      setMessage({
        type: "success",
        text: `Hero Experience Badge ${enabled ? "enabled" : "hidden"} successfully!`,
      });
    } catch {
      setMessage({
        type: "error",
        text: "Failed to update badge visibility.",
      });
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

        {/* Profile Picture / Headshot Card */}
        <div className="p-5 rounded-xl border border-blue-100 bg-blue-50/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-2xl bg-white border-2 border-blue-500/20 shadow-sm overflow-hidden shrink-0 flex items-center justify-center">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || "Profile Picture"}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-blue-600 to-indigo-700 text-white font-bold flex items-center justify-center text-xl">
                    {profile.full_name ? profile.full_name.substring(0, 2).toUpperCase() : "RA"}
                  </div>
                )}
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <Camera className="w-4 h-4 text-blue-600" />
                  Profile Picture / Headshot
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Upload your photo to showcase on the hero banner and about section of your public website.
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold shadow-2xs transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingAvatar ? "Uploading..." : "Upload Photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingAvatar}
                      onChange={handleAvatarUpload}
                    />
                  </label>

                  {profile.avatar_url && (
                    <button
                      type="button"
                      onClick={() => setProfile({ ...profile, avatar_url: "" })}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-gray-300 text-slate-600 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 text-xs font-semibold transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-blue-100">
            <label className="block font-medium text-slate-700 text-xs mb-1">
              Direct Image URL (or pasted Cloudinary / web link)
            </label>
            <input
              type="url"
              value={profile.avatar_url || ""}
              onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 text-xs rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>
        </div>

        {/* Floating Experience Badge Settings */}
        <div className="p-5 rounded-xl border border-gray-200 bg-slate-50/60 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Hero Experience Highlight Badge
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Configure or toggle the floating badge displayed on your hero profile portrait.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={profile.show_experience_badge ?? true}
                onChange={(e) => handleToggleExperienceBadge(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-2 text-xs font-semibold text-gray-700">
                {profile.show_experience_badge ?? true ? "Visible" : "Hidden"}
              </span>
            </label>
          </div>

          {(profile.show_experience_badge ?? true) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-200/60">
              <div>
                <label className="block font-medium text-gray-700 text-xs mb-1">
                  Primary Title
                </label>
                <input
                  type="text"
                  value={profile.experience_badge_title ?? "3+ Years Experience"}
                  onChange={(e) =>
                    setProfile({ ...profile, experience_badge_title: e.target.value })
                  }
                  placeholder="e.g. 3+ Years Experience"
                  className="w-full px-3 py-2 text-xs rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 text-xs mb-1">
                  Secondary Subtitle
                </label>
                <input
                  type="text"
                  value={profile.experience_badge_subtitle ?? "AI / ML Production Systems"}
                  onChange={(e) =>
                    setProfile({ ...profile, experience_badge_subtitle: e.target.value })
                  }
                  placeholder="e.g. AI / ML Production Systems"
                  className="w-full px-3 py-2 text-xs rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 font-medium"
                />
              </div>

              {/* Live Preview Pill */}
              <div className="sm:col-span-2 pt-2">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Live Badge Preview
                </div>
                <div className="inline-flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-2.5 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">
                      {profile.experience_badge_title || "3+ Years Experience"}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {profile.experience_badge_subtitle || "AI / ML Production Systems"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
