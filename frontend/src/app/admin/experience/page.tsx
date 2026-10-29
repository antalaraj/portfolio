"use client";

import { useState, useEffect } from "react";
import { Briefcase, Plus, Trash2, Edit2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { adminApi } from "@/services/adminApi";
import { Experience } from "@/types";

export default function AdminExperiencePage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExp, setEditingExp] = useState<Partial<Experience> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [responsibilitiesText, setResponsibilitiesText] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchExperience = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getExperience();
      const records = (res as any)?.results || (res as any)?.data || (Array.isArray(res) ? res : []);
      setItems(Array.isArray(records) ? records : []);
    } catch {
      setMessage({ type: "error", text: "Failed to load experience records." });
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  const handleEdit = (exp: Experience) => {
    setIsNew(false);
    setEditingExp(exp);
    setResponsibilitiesText((exp.responsibilities || []).join("\n"));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;
    setSaving(true);

    const responsibilities = responsibilitiesText
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const payload = {
      ...editingExp,
      responsibilities,
    };

    try {
      if (isNew) {
        const res = await adminApi.createExperience(payload);
        const createdExp = (res as any)?.data || res;
        if (createdExp && typeof createdExp === "object") {
          setItems([createdExp, ...items.filter(Boolean)]);
        }
        setMessage({ type: "success", text: "Experience added successfully!" });
      } else {
        const res = await adminApi.updateExperience(editingExp.id!, payload);
        const updatedExp = (res as any)?.data || res;
        setItems(items.filter(Boolean).map((i) => (i.id === editingExp.id ? updatedExp : i)));
        setMessage({ type: "success", text: "Experience updated successfully!" });
      }
      setEditingExp(null);
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to save experience." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, role: string) => {
    if (!confirm(`Delete "${role}"?`)) return;
    try {
      await adminApi.deleteExperience(id);
      setItems(items.filter((i) => i.id !== id));
      setMessage({ type: "success", text: `Deleted "${role}".` });
    } catch {
      setMessage({ type: "error", text: "Failed to delete experience." });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            Work Experience Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage roles, research internships, contributions, and career timelines.
          </p>
        </div>

        <button
          onClick={() => {
            setIsNew(true);
            setEditingExp({
              company: "",
              job_title: "",
              employment_type: "full-time",
              location: "India / Remote",
              start_date: new Date().toISOString().split("T")[0],
              end_date: null,
              is_current: true,
              description: "",
              display_order: items.length + 1,
              status: "published",
            });
            setResponsibilitiesText("");
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Experience
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

      {/* Experience Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            Loading experience records...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Role & Company</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.filter(Boolean).map((exp) => (
                  <tr key={exp.id || Math.random()} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900">{exp.job_title || "Untitled Role"}</div>
                      <div className="text-xs text-blue-600 font-medium">{exp.company || ""}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase bg-slate-100 text-slate-700">
                        {exp.employment_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                      {exp.start_date} – {exp.is_current ? "Present" : exp.end_date}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleEdit(exp)}
                        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(exp.id, exp.job_title)}
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

      {/* Edit Modal */}
      {editingExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-4 text-xs">
            <h3 className="text-base font-bold text-gray-900">
              {isNew ? "Add Work Experience" : `Edit Experience: ${editingExp.job_title || "Untitled"}`}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-800 mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    value={editingExp.company || ""}
                    onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-800 mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={editingExp.job_title || ""}
                    onChange={(e) => setEditingExp({ ...editingExp, job_title: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-800 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={editingExp.start_date || ""}
                    onChange={(e) => setEditingExp({ ...editingExp, start_date: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-800 mb-1">End Date</label>
                  <input
                    type="date"
                    disabled={editingExp.is_current}
                    value={editingExp.end_date || ""}
                    onChange={(e) => setEditingExp({ ...editingExp, end_date: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                  <label className="flex items-center gap-1.5 mt-1.5">
                    <input
                      type="checkbox"
                      checked={editingExp.is_current || false}
                      onChange={(e) => setEditingExp({ ...editingExp, is_current: e.target.checked, end_date: null })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <span className="text-[11px] text-slate-600">Currently Working Here</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-800 mb-1">Overview Description</label>
                <textarea
                  rows={2}
                  value={editingExp.description || ""}
                  onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  Key Achievements / Responsibilities (One per line)
                </label>
                <textarea
                  rows={4}
                  value={responsibilitiesText}
                  onChange={(e) => setResponsibilitiesText(e.target.value)}
                  placeholder="Architected enterprise RAG system with multi-stage reranking...&#10;Deployed containerized LLM microservices with FastAPI..."
                  className="w-full px-3 py-2 text-xs rounded-md border border-gray-300 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingExp(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-md shadow-2xs disabled:opacity-50"
                >
                  {saving ? "Saving..." : isNew ? "Create Record" : "Update Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
