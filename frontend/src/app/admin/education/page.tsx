"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Plus, Trash2, Edit2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { adminApi } from "@/services/adminApi";
import { Education } from "@/types";

export default function AdminEducationPage() {
  const [items, setItems] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEdu, setEditingEdu] = useState<Partial<Education> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchEducation = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getEducation();
      const records = (res as any)?.results || (res as any)?.data || (Array.isArray(res) ? res : []);
      setItems(Array.isArray(records) ? records : []);
    } catch {
      setMessage({ type: "error", text: "Failed to load education." });
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu) return;
    setSaving(true);
    try {
      if (isNew) {
        const res = await adminApi.createEducation(editingEdu);
        const createdEdu = (res as any)?.data || res;
        if (createdEdu && typeof createdEdu === "object") {
          setItems([createdEdu, ...items.filter(Boolean)]);
        }
        setMessage({ type: "success", text: "Education added successfully!" });
      } else {
        const res = await adminApi.updateEducation(editingEdu.id!, editingEdu);
        const updatedEdu = (res as any)?.data || res;
        setItems(items.filter(Boolean).map((i) => (i.id === editingEdu.id ? updatedEdu : i)));
        setMessage({ type: "success", text: "Education updated successfully!" });
      }
      setEditingEdu(null);
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to save education." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, degree: string) => {
    if (!confirm(`Delete "${degree}"?`)) return;
    try {
      await adminApi.deleteEducation(id);
      setItems(items.filter((i) => i.id !== id));
      setMessage({ type: "success", text: `Deleted "${degree}".` });
    } catch {
      setMessage({ type: "error", text: "Failed to delete education." });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            Education Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage academic degrees, institutions, GPA scores, and coursework summaries.
          </p>
        </div>

        <button
          onClick={() => {
            setIsNew(true);
            setEditingEdu({
              institution: "",
              degree: "",
              field_of_study: "",
              start_date: new Date().toISOString().split("T")[0],
              end_date: null,
              grade: "",
              description: "",
              display_order: items.length + 1,
              status: "published",
            });
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Education
        </button>
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

      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            Loading education records...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Degree & Field</th>
                  <th className="py-3 px-4">Institution</th>
                  <th className="py-3 px-4">Grade / GPA</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.filter(Boolean).map((edu) => (
                  <tr key={edu.id || Math.random()} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      <div>{edu.degree || "Untitled Degree"}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{edu.field_of_study || ""}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{edu.institution}</td>
                    <td className="py-3.5 px-4 font-mono text-emerald-600 font-semibold">{edu.grade || "—"}</td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => {
                          setIsNew(false);
                          setEditingEdu(edu);
                        }}
                        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(edu.id, edu.degree)}
                        className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingEdu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl max-w-lg w-full p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-gray-900">
              {isNew ? "Add Education" : `Edit Education: ${editingEdu.degree || "Untitled"}`}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-800 mb-1">Institution *</label>
                <input
                  type="text"
                  required
                  value={editingEdu.institution || ""}
                  onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-800 mb-1">Degree *</label>
                  <input
                    type="text"
                    required
                    value={editingEdu.degree || ""}
                    onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-800 mb-1">Field of Study</label>
                  <input
                    type="text"
                    value={editingEdu.field_of_study || ""}
                    onChange={(e) => setEditingEdu({ ...editingEdu, field_of_study: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-gray-800 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={editingEdu.start_date || ""}
                    onChange={(e) => setEditingEdu({ ...editingEdu, start_date: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-800 mb-1">End Date</label>
                  <input
                    type="date"
                    value={editingEdu.end_date || ""}
                    onChange={(e) => setEditingEdu({ ...editingEdu, end_date: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-800 mb-1">Grade / GPA</label>
                  <input
                    type="text"
                    value={editingEdu.grade || ""}
                    onChange={(e) => setEditingEdu({ ...editingEdu, grade: e.target.value })}
                    placeholder="e.g. 8.8 / 10"
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-800 mb-1">Description / Honors</label>
                <textarea
                  rows={3}
                  value={editingEdu.description || ""}
                  onChange={(e) => setEditingEdu({ ...editingEdu, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingEdu(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-md shadow-2xs"
                >
                  {saving ? "Saving..." : isNew ? "Create Education" : "Update Education"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
