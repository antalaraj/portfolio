"use client";

import { useState, useEffect } from "react";
import {
  Layers,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Edit2,
  ExternalLink,
} from "lucide-react";
import { adminApi } from "@/services/adminApi";
import { PageSection } from "@/types";

export default function WebsiteBuilderPage() {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getSections("home");
      setSections(res.data.sort((a, b) => a.display_order - b.display_order));
    } catch {
      setMessage({ type: "error", text: "Failed to load sections from backend." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  // Move section Up
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index - 1];
    newSections[index - 1] = temp;

    // Update display_order values
    const updated = newSections.map((sec, i) => ({ ...sec, display_order: i + 1 }));
    setSections(updated);
  };

  // Move section Down
  const moveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index + 1];
    newSections[index + 1] = temp;

    const updated = newSections.map((sec, i) => ({ ...sec, display_order: i + 1 }));
    setSections(updated);
  };

  // Toggle active/hidden
  const toggleActive = async (section: PageSection) => {
    try {
      const updatedActive = !section.is_active;
      await adminApi.updateSection(section.id, { is_active: updatedActive });
      setSections(
        sections.map((s) => (s.id === section.id ? { ...s, is_active: updatedActive } : s))
      );
      setMessage({ type: "success", text: `Section "${section.title}" visibility toggled.` });
    } catch {
      setMessage({ type: "error", text: "Failed to update section visibility." });
    }
  };

  // Save full reordered list
  const handleSaveOrder = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const orderPayload = sections.map((s) => ({
        id: s.id,
        display_order: s.display_order,
      }));
      await adminApi.reorderSections(orderPayload);
      setMessage({ type: "success", text: "Homepage section ordering published successfully!" });
    } catch {
      setMessage({ type: "error", text: "Failed to publish section ordering." });
    } finally {
      setSaving(false);
    }
  };

  // Save single section edit
  const handleSaveEdit = async () => {
    if (!editingSection) return;
    setSaving(true);
    try {
      await adminApi.updateSection(editingSection.id, {
        title: editingSection.title,
        subtitle: editingSection.subtitle,
      });
      setSections(
        sections.map((s) => (s.id === editingSection.id ? editingSection : s))
      );
      setEditingSection(null);
      setMessage({ type: "success", text: "Section configuration saved successfully!" });
    } catch {
      setMessage({ type: "error", text: "Failed to save section changes." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            Dynamic Website Builder
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Reorder, toggle, and configure homepage sections without modifying code.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md border border-gray-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
            Preview Live
          </a>
          <button
            onClick={handleSaveOrder}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-2xs disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            Save Order
          </button>
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
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
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

      {/* Sections List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
            Homepage Sections ({sections.length})
          </span>
          <span className="text-[11px] text-slate-500">
            Use arrows to reorder layout flow
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            Loading homepage section schema...
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sections.map((section, idx) => (
              <div
                key={section.id}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  section.is_active ? "bg-white hover:bg-slate-50/50" : "bg-slate-50 opacity-60"
                }`}
              >
                {/* Section Info */}
                <div className="flex items-center gap-4">
                  <div className="w-7 h-7 rounded bg-slate-100 text-slate-600 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-gray-200">
                    {section.display_order}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">
                        {section.title || section.section_type.toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase bg-slate-100 text-slate-600 border border-gray-200">
                        {section.section_type}
                      </span>
                      {!section.is_active && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-200">
                          Hidden
                        </span>
                      )}
                    </div>
                    {section.subtitle && (
                      <p className="text-xs text-slate-500 mt-0.5 max-w-md truncate">
                        {section.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Section Controls */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="p-1.5 rounded border border-gray-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                    title="Move section up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx === sections.length - 1}
                    className="p-1.5 rounded border border-gray-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                    title="Move section down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setEditingSection(section)}
                    className="p-1.5 rounded border border-gray-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Edit section titles"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => toggleActive(section)}
                    className={`p-1.5 rounded border transition-colors ${
                      section.is_active
                        ? "border-gray-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50"
                        : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                    }`}
                    title={section.is_active ? "Hide section from public site" : "Show section on public site"}
                  >
                    {section.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Section Modal */}
      {editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg max-w-lg w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-gray-900">
              Configure Section: {editingSection.section_type.toUpperCase()}
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Display Title
              </label>
              <input
                type="text"
                value={editingSection.title}
                onChange={(e) =>
                  setEditingSection({ ...editingSection, title: e.target.value })
                }
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Subtitle / Description
              </label>
              <input
                type="text"
                value={editingSection.subtitle}
                onChange={(e) =>
                  setEditingSection({ ...editingSection, subtitle: e.target.value })
                }
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => setEditingSection(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-md shadow-2xs"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
