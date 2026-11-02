"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import { adminApi } from "@/services/adminApi";
import { SiteSetting } from "@/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Partial<SiteSetting>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Password reset state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    adminApi
      .getSettings()
      .then((res) => setSettings((res as any)?.data || res || {}))
      .catch(() => setMessage({ type: "error", text: "Failed to load settings." }))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await adminApi.updateSettings(settings);
      const updated = (res as any)?.data || res;
      if (updated && typeof updated === "object") setSettings(updated);
      setMessage({ type: "success", text: "Site settings saved successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to save settings." });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword.length < 8) {
      setPasswordMessage({
        type: "error",
        text: "New password must be at least 8 characters long.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "New password and confirmation password do not match.",
      });
      return;
    }

    setResettingPassword(true);
    try {
      await adminApi.changePassword({
        current_password: currentPassword || undefined,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      setPasswordMessage({
        type: "success",
        text: "Admin password successfully updated! Your active session has been securely refreshed.",
      });
      // Clear password fields on success
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordMessage({
        type: "error",
        text: err?.message || "Failed to reset password. Please check your inputs.",
      });
    } finally {
      setResettingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      {/* Page Title Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          System & Account Settings
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage website operational configurations, communication preferences, and admin credentials.
        </p>
      </div>

      {/* SECTION 1: GLOBAL WEBSITE SETTINGS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Settings className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-bold text-gray-900">Website Configuration</h3>
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
          <div className="p-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2 bg-white rounded-xl border border-gray-200 shadow-2xs">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            Loading settings...
          </div>
        ) : (
          <form
            onSubmit={handleSave}
            className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-2xs space-y-5 text-xs"
          >
            <div>
              <label className="block font-semibold text-gray-800 mb-1">Global Site Title</label>
              <input
                type="text"
                required
                value={settings.site_title || ""}
                onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-800 mb-1">
                Primary Notification Email
              </label>
              <input
                type="email"
                required
                value={settings.primary_email || ""}
                onChange={(e) => setSettings({ ...settings, primary_email: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.resume_download_enabled ?? true}
                  onChange={(e) =>
                    setSettings({ ...settings, resume_download_enabled: e.target.checked })
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                />
                <span className="text-xs font-medium text-gray-800">
                  Allow Public Visitors to Download Resume PDF
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.maintenance_mode || false}
                  onChange={(e) =>
                    setSettings({ ...settings, maintenance_mode: e.target.checked })
                  }
                  className="rounded border-gray-300 text-rose-600 focus:ring-rose-600"
                />
                <span className="text-xs font-medium text-rose-700">
                  Maintenance Mode (Show maintenance banner on public site)
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
                    Saving Settings...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* SECTION 2: ADMIN SECURITY & PASSWORD RESET */}
      <div id="security" className="space-y-4 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-gray-900">Admin Security & Password Reset</h3>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3 h-3" />
            SuperAdmin Rights Active
          </span>
        </div>

        {passwordMessage && (
          <div
            className={`p-4 rounded-md text-xs flex items-center justify-between ${
              passwordMessage.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                : "bg-rose-50 border border-rose-200 text-rose-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {passwordMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              <span>{passwordMessage.text}</span>
            </div>
            <button
              onClick={() => setPasswordMessage(null)}
              className="text-[11px] font-bold opacity-60"
            >
              Dismiss
            </button>
          </div>
        )}

        <form
          onSubmit={handlePasswordReset}
          className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-2xs space-y-5 text-xs"
        >
          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3.5 flex items-start gap-3">
            <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-600 leading-relaxed">
              <span className="font-semibold text-gray-800">Master Password Rights:</span> As an authenticated SuperAdmin, you can update your master credentials at any time. Session cookies are automatically refreshed upon update so you stay signed in seamlessly.
            </div>
          </div>

          {/* Current Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-gray-800">
                Current Password <span className="text-slate-400 font-normal">(optional for SuperAdmin)</span>
              </label>
            </div>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Leave blank to directly reset password"
                className="w-full pl-3 pr-10 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                title={showCurrentPassword ? "Hide password" : "Show password"}
                aria-label={showCurrentPassword ? "Hide password" : "Show password"}
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-gray-800">New Password</label>
              {newPassword && (
                <span
                  className={`text-[10px] font-medium ${
                    newPassword.length >= 8 ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {newPassword.length >= 8 ? "✓ Min length met (8+ chars)" : "Must be at least 8 characters"}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter strong new password (min. 8 characters)"
                className="w-full pl-3 pr-10 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                title={showNewPassword ? "Hide password" : "Show password"}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-gray-800">Confirm New Password</label>
              {confirmPassword && (
                <span
                  className={`text-[10px] font-medium ${
                    newPassword === confirmPassword ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {newPassword === confirmPassword ? "✓ Passwords match" : "✕ Passwords do not match"}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password to confirm"
                className="w-full pl-3 pr-10 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                title={showConfirmPassword ? "Hide password" : "Show password"}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Reset Action */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="text-[11px] text-slate-400">
              Credentials: <span className="font-semibold text-slate-600">rajantala</span>
            </div>
            <button
              type="submit"
              disabled={resettingPassword || !newPassword || !confirmPassword}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-colors disabled:opacity-50"
            >
              {resettingPassword ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5" />
                  Reset Admin Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
