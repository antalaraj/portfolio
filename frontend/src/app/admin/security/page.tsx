"use client";

import { useState } from "react";
import Link from "next/link";
import {
  KeyRound,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { adminApi } from "@/services/adminApi";

export default function AdminSecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "New password must contain at least 8 characters.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({
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

      setMessage({
        type: "success",
        text: "Master admin password successfully reset! Your active session has been securely refreshed.",
      });
      // Clear inputs upon success
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.message || "Failed to reset password. Please check your inputs.",
      });
    } finally {
      setResettingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-blue-600" />
              Admin Security & Access Rights
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Manage master administrator credentials, session persistence, and password reset rights.
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            SuperAdmin Rights Active
          </span>
        </div>
      </div>

      {/* Account Info Card */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-bold flex items-center justify-center text-sm shadow-2xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                Raj Antala
                <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded font-semibold">
                  Primary Owner
                </span>
              </div>
              <div className="text-xs text-slate-500">
                Username: <span className="font-mono text-gray-700">rajantala</span> • Access: <span className="text-emerald-700 font-medium">Unrestricted SuperAdmin</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200/80">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Session: Authenticated Cookie
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
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
          <button
            onClick={() => setMessage(null)}
            className="text-[11px] font-bold opacity-60 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Password Reset Form Card */}
      <form
        onSubmit={handlePasswordReset}
        className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-2xs space-y-5 text-xs"
      >
        <div className="border-b border-gray-100 pb-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-600" />
            Reset Master Password
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Resetting your password updates the database credentials immediately. Django session auth hash is refreshed so you stay signed in without interruption.
          </p>
        </div>

        {/* Current Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
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
              className="w-full pl-3 pr-10 py-2.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword((prev) => !prev)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
              title={showCurrentPassword ? "Hide password" : "Show password"}
              aria-label={showCurrentPassword ? "Hide password" : "Show password"}
            >
              {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            As SuperAdmin, you can leave this empty to directly override your password.
          </p>
        </div>

        {/* New Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
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
              className="w-full pl-3 pr-10 py-2.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
              title={showNewPassword ? "Hide password" : "Show password"}
              aria-label={showNewPassword ? "Hide password" : "Show password"}
            >
              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
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
              className="w-full pl-3 pr-10 py-2.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
              title={showConfirmPassword ? "Hide password" : "Show password"}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-[11px] text-slate-400">
            Account: <span className="font-semibold text-slate-700">rajantala</span>
          </div>
          <button
            type="submit"
            disabled={resettingPassword || !newPassword || !confirmPassword}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-colors disabled:opacity-50"
          >
            {resettingPassword ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Resetting Password...
              </>
            ) : (
              <>
                <KeyRound className="w-3.5 h-3.5" />
                Reset Master Password
              </>
            )}
          </button>
        </div>
      </form>

      {/* Helpful Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/settings"
          className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-colors shadow-2xs flex items-center justify-between group"
        >
          <div>
            <div className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              Global Site Settings
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Site title, communication email & maintenance mode
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          href="/admin/profile"
          className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-colors shadow-2xs flex items-center justify-between group"
        >
          <div>
            <div className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              Admin Profile & Bio
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Avatar photo, personal bio & social media links
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>
    </div>
  );
}
