"use client";

import { useState, useEffect } from "react";
import {
  Cpu,
  Plus,
  Trash2,
  Edit2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FolderPlus,
  Tag,
  Layers,
  X,
  ExternalLink,
} from "lucide-react";
import { adminApi } from "@/services/adminApi";
import { Skill, SkillCategory } from "@/types";

export default function AdminSkillsPage() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Skill Modal State
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [isNewSkill, setIsNewSkill] = useState(false);
  const [savingSkill, setSavingSkill] = useState(false);

  // Category Modal State
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryManageModalOpen, setCategoryManageModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState<Partial<SkillCategory>>({ name: "", display_order: 0 });
  const [isNewCategory, setIsNewCategory] = useState(true);
  const [savingCategory, setSavingCategory] = useState(false);

  // Inline Quick Add Category in Skill Modal
  const [showInlineCatInput, setShowInlineCatInput] = useState(false);
  const [inlineCatName, setInlineCatName] = useState("");
  const [savingInlineCat, setSavingInlineCat] = useState(false);

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catsRes, skillsRes] = await Promise.all([
        adminApi.getSkillCategories(),
        adminApi.getSkills(),
      ]);
      const catItems =
        (catsRes as any)?.results ||
        (catsRes as any)?.data ||
        (Array.isArray(catsRes) ? catsRes : []);
      const skillItems =
        (skillsRes as any)?.results ||
        (skillsRes as any)?.data ||
        (Array.isArray(skillsRes) ? skillsRes : []);
      setCategories(Array.isArray(catItems) ? catItems.filter(Boolean) : []);
      setSkills(Array.isArray(skillItems) ? skillItems.filter(Boolean) : []);
    } catch {
      setMessage({ type: "error", text: "Failed to load skills and categories." });
      setCategories([]);
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Save Skill
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;
    const payload = {
      ...editingSkill,
      proficiency: editingSkill.proficiency || 100,
    };

    setSavingSkill(true);
    try {
      if (isNewSkill) {
        const res = await adminApi.createSkill(payload);
        const newSkill = (res as any)?.data || res;
        if (newSkill && typeof newSkill === "object") {
          setSkills([newSkill, ...skills.filter(Boolean)]);
        }
        setMessage({ type: "success", text: `Skill "${payload.name}" added successfully!` });
      } else {
        const res = await adminApi.updateSkill(editingSkill.id!, payload);
        const updated = (res as any)?.data || res;
        setSkills(
          skills.filter(Boolean).map((s) => (s?.id === editingSkill.id ? updated : s))
        );
        setMessage({ type: "success", text: `Skill "${payload.name}" updated successfully!` });
      }
      setEditingSkill(null);
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to save skill." });
    } finally {
      setSavingSkill(false);
    }
  };

  // Delete Skill
  const handleDeleteSkill = async (id: string, name: string) => {
    if (!confirm(`Delete skill "${name}"?`)) return;
    try {
      await adminApi.deleteSkill(id);
      setSkills(skills.filter(Boolean).filter((s) => s?.id !== id));
      setMessage({ type: "success", text: `Deleted "${name}".` });
    } catch {
      setMessage({ type: "error", text: "Failed to delete skill." });
    }
  };

  // Save Category (from Category Modal)
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name?.trim()) return;
    setSavingCategory(true);
    try {
      if (isNewCategory) {
        const res = await adminApi.createSkillCategory({
          name: categoryForm.name.trim(),
          display_order: categoryForm.display_order ?? categories.length + 1,
        });
        const newCat = (res as any)?.data || res;
        if (newCat && typeof newCat === "object") {
          setCategories([...categories.filter(Boolean), newCat]);
          if (editingSkill) {
            setEditingSkill({ ...editingSkill, category: newCat.id });
          }
        }
        setMessage({
          type: "success",
          text: `Category "${categoryForm.name}" created successfully!`,
        });
      } else {
        const res = await adminApi.updateSkillCategory(categoryForm.id!, {
          name: categoryForm.name.trim(),
          display_order: categoryForm.display_order,
        });
        const updatedCat = (res as any)?.data || res;
        setCategories(
          categories.filter(Boolean).map((c) => (c?.id === categoryForm.id ? updatedCat : c))
        );
        setMessage({
          type: "success",
          text: `Category "${categoryForm.name}" updated successfully!`,
        });
      }
      setCategoryModalOpen(false);
      setCategoryForm({ name: "", display_order: 0 });
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to save category." });
    } finally {
      setSavingCategory(false);
    }
  };

  // Quick Inline Category Creation from Skill Modal
  const handleQuickAddCategory = async () => {
    if (!inlineCatName.trim()) return;
    setSavingInlineCat(true);
    try {
      const res = await adminApi.createSkillCategory({
        name: inlineCatName.trim(),
        display_order: categories.length + 1,
      });
      const newCat = (res as any)?.data || res;
      if (newCat && typeof newCat === "object") {
        setCategories([...categories.filter(Boolean), newCat]);
        if (editingSkill) {
          setEditingSkill({ ...editingSkill, category: newCat.id });
        }
      }
      setInlineCatName("");
      setShowInlineCatInput(false);
      setMessage({
        type: "success",
        text: `Category "${newCat.name || inlineCatName}" added & selected!`,
      });
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to add category." });
    } finally {
      setSavingInlineCat(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (cat: SkillCategory) => {
    const skillsInCat = skills.filter((s) => s?.category === cat.id);
    if (skillsInCat.length > 0) {
      alert(
        `Cannot delete category "${cat.name}" because it contains ${skillsInCat.length} skill(s). Please delete or reassign those skills first.`
      );
      return;
    }
    if (!confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;
    try {
      await adminApi.deleteSkillCategory(cat.id);
      setCategories(categories.filter((c) => c?.id !== cat.id));
      if (selectedCategory === cat.id) setSelectedCategory("all");
      setMessage({ type: "success", text: `Deleted category "${cat.name}".` });
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to delete category." });
    }
  };

  const safeSkills = skills.filter(Boolean);
  const filteredSkills =
    selectedCategory === "all"
      ? safeSkills
      : safeSkills.filter((s) => s?.category === selectedCategory);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            Skills & Categories Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Organize skills by domain, create custom categories, and configure icon identifiers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCategoryManageModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-gray-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
          >
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            Categories ({categories.length})
          </button>

          <button
            onClick={() => {
              setIsNewCategory(true);
              setCategoryForm({ name: "", display_order: categories.length + 1 });
              setCategoryModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors shadow-2xs"
          >
            <FolderPlus className="w-3.5 h-3.5 text-blue-600" />
            Add Category
          </button>

          <button
            onClick={() => {
              setIsNewSkill(true);
              setEditingSkill({
                name: "",
                category: categories[0]?.id || "",
                proficiency: 85,
                icon_name: "Code2",
                is_visible: true,
                display_order: skills.length + 1,
              });
              setShowInlineCatInput(false);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Skill
          </button>
        </div>
      </div>

      {/* Alert Notifications */}
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

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedCategory === "all"
              ? "bg-blue-600 text-white shadow-2xs"
              : "bg-white border border-gray-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          All Skills ({safeSkills.length})
        </button>

        {categories.filter(Boolean).map((cat) => {
          const count = safeSkills.filter((s) => s?.category === cat.id).length;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                isSelected
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-white border border-gray-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}

        <button
          onClick={() => {
            setIsNewCategory(true);
            setCategoryForm({ name: "", display_order: categories.length + 1 });
            setCategoryModalOpen(true);
          }}
          className="px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap border border-dashed border-gray-300 text-slate-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 flex items-center gap-1 transition-colors"
          title="Add New Category"
        >
          <Plus className="w-3 h-3" />
          <span>New Category</span>
        </button>
      </div>

      {/* Skills Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            Loading skills...
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No skills found in this category. Click &quot;Add Skill&quot; to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Skill Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Icon Name</th>
                  <th className="py-3 px-4">Proficiency</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSkills.map((s) => {
                  const catName =
                    categories.find((c) => c?.id === s?.category)?.name ||
                    s?.category_name ||
                    "Uncategorized";

                  return (
                    <tr key={s?.id || Math.random()} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-900">{s?.name || "Untitled"}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                          {catName}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">{s?.icon_name || "Code2"}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {s?.proficiency ? `${s.proficiency}%` : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1">
                        <button
                          onClick={() => {
                            setIsNewSkill(false);
                            setEditingSkill(s);
                            setShowInlineCatInput(false);
                          }}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded"
                          title="Edit Skill"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(s?.id || "", s?.name || "")}
                          className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete Skill"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit / Add Skill Modal */}
      {editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">
                {isNewSkill ? "Add Technical Skill" : `Edit Skill: ${editingSkill.name || "Untitled"}`}
              </h3>
              <button
                onClick={() => setEditingSkill(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingSkill.name || ""}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  placeholder="e.g. PyTorch, Docker, LangChain, Next.js"
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-gray-800">
                    Category *
                  </label>
                  {!showInlineCatInput && (
                    <button
                      type="button"
                      onClick={() => setShowInlineCatInput(true)}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> New Category
                    </button>
                  )}
                </div>

                {showInlineCatInput ? (
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg space-y-2 mb-2">
                    <div className="text-[11px] font-semibold text-blue-900 flex items-center justify-between">
                      <span>Quick Add New Category</span>
                      <button
                        type="button"
                        onClick={() => setShowInlineCatInput(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inlineCatName}
                        onChange={(e) => setInlineCatName(e.target.value)}
                        placeholder="e.g. Cloud & DevOps"
                        className="flex-1 px-2.5 py-1.5 text-xs rounded-md border border-blue-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleQuickAddCategory();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleQuickAddCategory}
                        disabled={savingInlineCat || !inlineCatName.trim()}
                        className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {savingInlineCat ? "Adding..." : "Add"}
                      </button>
                    </div>
                  </div>
                ) : null}

                <select
                  value={editingSkill.category || ""}
                  onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                >
                  <option value="" disabled>Select a category</option>
                  {categories.filter(Boolean).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-800 mb-1">
                    Proficiency (1-100)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={editingSkill.proficiency ?? 85}
                    onChange={(e) =>
                      setEditingSkill({
                        ...editingSkill,
                        proficiency: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-800 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingSkill.display_order ?? 0}
                    onChange={(e) =>
                      setEditingSkill({
                        ...editingSkill,
                        display_order: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  Icon Identifier (Lucide icon name)
                </label>
                <input
                  type="text"
                  value={editingSkill.icon_name || ""}
                  onChange={(e) => setEditingSkill({ ...editingSkill, icon_name: e.target.value })}
                  placeholder="e.g. Terminal, Cpu, Database, Cloud, Layers, Activity"
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
                  disabled={savingSkill}
                  className="px-5 py-2 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-md shadow-2xs disabled:opacity-50"
                >
                  {savingSkill ? "Saving..." : isNewSkill ? "Add Skill" : "Update Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl max-w-sm w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                <FolderPlus className="w-4 h-4 text-blue-600" />
                {isNewCategory ? "Add Skill Category" : "Edit Category"}
              </h3>
              <button
                onClick={() => setCategoryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={categoryForm.name || ""}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Cloud & DevOps, Databases, NLP"
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={categoryForm.display_order ?? 0}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      display_order: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCategory || !categoryForm.name?.trim()}
                  className="px-5 py-2 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-md shadow-2xs disabled:opacity-50"
                >
                  {savingCategory ? "Saving..." : isNewCategory ? "Create Category" : "Update Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Management Drawer / Modal */}
      {categoryManageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl max-w-lg w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-600" />
                  Manage Skill Categories
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Reorder, rename, or delete empty skill categories.
                </p>
              </div>
              <button
                onClick={() => setCategoryManageModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setIsNewCategory(true);
                  setCategoryForm({ name: "", display_order: categories.length + 1 });
                  setCategoryModalOpen(true);
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded"
              >
                <Plus className="w-3.5 h-3.5" />
                Add New Category
              </button>
            </div>

            <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg max-h-72 overflow-y-auto">
              {categories.filter(Boolean).map((cat) => {
                const count = safeSkills.filter((s) => s?.category === cat.id).length;
                return (
                  <div key={cat.id} className="p-3 flex items-center justify-between hover:bg-slate-50/70">
                    <div>
                      <div className="font-bold text-gray-900 flex items-center gap-2">
                        {cat.name}
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {count} skill{count === 1 ? "" : "s"}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        slug: {cat.slug} • order: {cat.display_order ?? 0}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setIsNewCategory(false);
                          setCategoryForm(cat);
                          setCategoryModalOpen(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit Category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setCategoryManageModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
