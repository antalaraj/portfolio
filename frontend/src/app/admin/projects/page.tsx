"use client";

import { useState, useEffect } from "react";
import {
  FolderGit2,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
} from "lucide-react";
import { adminApi } from "@/services/adminApi";
import { Project } from "@/types";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getProjects();
      setProjects(res.data);
    } catch {
      setMessage({ type: "error", text: "Failed to fetch projects." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setSaving(true);
    setMessage(null);

    try {
      if (isNew) {
        const res = await adminApi.createProject(editingProject);
        setProjects([res.data, ...projects]);
        setMessage({ type: "success", text: "Project created successfully!" });
      } else {
        const res = await adminApi.updateProject(editingProject.id!, editingProject);
        setProjects(projects.map((p) => (p.id === editingProject.id ? res.data : p)));
        setMessage({ type: "success", text: "Project updated successfully!" });
      }
      setEditingProject(null);
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to save project." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await adminApi.deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
      setMessage({ type: "success", text: `Deleted "${title}".` });
    } catch {
      setMessage({ type: "error", text: "Failed to delete project." });
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-blue-600" />
            Project Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, tag, reorder, and publish AI & ML portfolio projects.
          </p>
        </div>

        <button
          onClick={() => {
            setIsNew(true);
            setEditingProject({
              title: "",
              slug: "",
              short_description: "",
              full_description: "",
              thumbnail_url: "",
              github_url: "",
              live_demo_url: "",
              is_featured: false,
              status: "published",
              display_order: projects.length + 1,
            });
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Project
        </button>
      </div>

      {/* Notifications */}
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

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects by title..."
          className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-gray-200 bg-white shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            Loading projects...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900">{p.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">/{p.slug}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${
                          p.status === "published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {p.is_featured ? (
                        <span className="text-blue-600 font-semibold">Yes</span>
                      ) : (
                        <span className="text-slate-400">No</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono">{p.display_order}</td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => {
                          setIsNew(false);
                          setEditingProject(p);
                        }}
                        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded"
                        title="Edit Project"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded"
                        title="Delete Project"
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

      {/* Edit / Create Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="text-base font-bold text-gray-900">
              {isNew ? "Create New Project" : `Edit Project: ${editingProject.title}`}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-800 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ""}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = isNew
                        ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
                        : editingProject.slug;
                      setEditingProject({ ...editingProject, title, slug });
                    }}
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-800 mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.slug || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  Short Description *
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.short_description || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, short_description: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  Full Description / Case Study (Markdown)
                </label>
                <textarea
                  rows={6}
                  value={editingProject.full_description || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, full_description: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs font-mono rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 resize-y"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-800 mb-1">
                    Thumbnail Image URL (Cloudinary)
                  </label>
                  <input
                    type="url"
                    value={editingProject.thumbnail_url || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, thumbnail_url: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-800 mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={editingProject.github_url || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, github_url: e.target.value })
                    }
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-gray-800 mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={editingProject.live_demo_url || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, live_demo_url: e.target.value })
                    }
                    placeholder="https://demo.example.com"
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-800 mb-1">
                    Status
                  </label>
                  <select
                    value={editingProject.status || "published"}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, status: e.target.value as any })
                    }
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-800 mb-1">
                    Featured Status
                  </label>
                  <label className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      checked={editingProject.is_featured || false}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, is_featured: e.target.checked })
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <span className="text-xs text-gray-700">Show in Featured</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-md shadow-2xs disabled:opacity-50"
                >
                  {saving ? "Saving..." : isNew ? "Create Project" : "Update Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
