"use client";

import { useState, useEffect } from "react";
import { Cpu, Plus, Trash2, Edit2, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { adminApi } from "@/services/adminApi";
import { Skill, SkillCategory } from "@/types";

export default function AdminSkillsPage() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catsRes, skillsRes] = await Promise.all([
        adminApi.getSkillCategories(),
        adminApi.getSkills(),
      ]);
      setCategories(catsRes.data);
      setSkills(skillsRes.data);
    } catch {
      setMessage({ type: "error", text: "Failed to load skills." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;
    setSaving(true);
    try {
      if (isNew) {
        const res = await adminApi.createSkill(editingSkill);
        setSkills([...skills, res.data]);
        setMessage({ type: "success", text: "Skill added successfully!" });
      } else {
        const res = await adminApi.updateSkill(editingSkill.id!, editingSkill);
        setSkills(skills.map((s) => (s.id === editingSkill.id ? res.data : s)));
        setMessage({ type: "success", text: "Skill updated successfully!" });
      }
      setEditingSkill(null);
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to save skill." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete skill "${name}"?`)) return;
    try {
      await adminApi.deleteSkill(id);
      setSkills(skills.filter((s) => s.id !== id));
      setMessage({ type: "success", text: `Deleted "${name}".` });
    } catch {
      setMessage({ type: "error", text: "Failed to delete skill." });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            Skills Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage technical proficiencies, categories, and Lucide icon mappings.
          </p>
        </div>

        <button
          onClick={() => {
            setIsNew(true);
            setEditingSkill({
              name: "",
              category: categories[0]?.id || "",
              proficiency: 85,
              icon_name: "Code2",
              is_visible: true,
              display_order: skills.length + 1,
            });
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Skill
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

      {/* Skills Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            Loading skills...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Skill Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Proficiency</th>
                  <th className="py-3 px-4">Icon Name</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {skills.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-gray-900">{s.name}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {s.category_name || "Uncategorized"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: `${s.proficiency}%` }}
                          />
                        </div>
                        <span className="font-mono text-slate-500 text-[11px]">{s.proficiency}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{s.icon_name}</td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => {
                          setIsNew(false);
                          setEditingSkill(s);
                        }}
                        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded"
                        title="Edit Skill"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id, s.name)}
                        className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded"
                        title="Delete Skill"
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
      {editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-gray-900">
              {isNew ? "Add Technical Skill" : `Edit Skill: ${editingSkill.name}`}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingSkill.name || ""}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  placeholder="e.g. PyTorch"
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  Category *
                </label>
                <select
                  value={editingSkill.category || ""}
                  onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-gray-800">
                    Proficiency: {editingSkill.proficiency}%
                  </label>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={editingSkill.proficiency || 80}
                  onChange={(e) =>
                    setEditingSkill({ ...editingSkill, proficiency: parseInt(e.target.value) })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  Icon Identifier (Lucide)
                </label>
                <input
                  type="text"
                  value={editingSkill.icon_name || ""}
                  onChange={(e) => setEditingSkill({ ...editingSkill, icon_name: e.target.value })}
                  placeholder="e.g. Terminal, Cpu, Database, Activity"
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingSkill(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-md shadow-2xs disabled:opacity-50"
                >
                  {saving ? "Saving..." : isNew ? "Add Skill" : "Update Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
