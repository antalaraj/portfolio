"use client";

import { useState, useEffect } from "react";
import { MenuSquare, Plus, Trash2, Edit2, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { adminApi } from "@/services/adminApi";
import { NavigationItem } from "@/types";

export default function AdminNavigationPage() {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<NavigationItem> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchNav = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getNavigation();
      const records = (res as any)?.results || (res as any)?.data || (Array.isArray(res) ? res : []);
      setItems(Array.isArray(records) ? records : []);
    } catch {
      setMessage({ type: "error", text: "Failed to load navigation items." });
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNav();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setSaving(true);
    try {
      if (isNew) {
        const res = await adminApi.createNavigation(editingItem);
        const createdNav = (res as any)?.data || res;
        if (createdNav && typeof createdNav === "object") {
          setItems([...items.filter(Boolean), createdNav]);
        }
        setMessage({ type: "success", text: "Menu item created successfully!" });
      } else {
        const res = await adminApi.updateNavigation(editingItem.id!, editingItem);
        const updatedNav = (res as any)?.data || res;
        setItems(items.filter(Boolean).map((i) => (i.id === editingItem.id ? updatedNav : i)));
        setMessage({ type: "success", text: "Menu item updated successfully!" });
      }
      setEditingItem(null);
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to save navigation item." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Delete "${label}"?`)) return;
    try {
      await adminApi.deleteNavigation(id);
      setItems(items.filter((i) => i.id !== id));
      setMessage({ type: "success", text: `Deleted "${label}".` });
    } catch {
      setMessage({ type: "error", text: "Failed to delete item." });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <MenuSquare className="w-5 h-5 text-blue-600" />
            Navigation Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage links, labels, destinations, and display order in the header navbar and footer.
          </p>
        </div>

        <button
          onClick={() => {
            setIsNew(true);
            setEditingItem({
              label: "",
              destination: "/#",
              is_external: false,
              menu_location: "header",
              display_order: items.length + 1,
              is_active: true,
            });
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Menu Item
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
            Loading navigation...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Label</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Placement</th>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.filter(Boolean).map((item) => (
                  <tr key={item?.id || Math.random()} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900">{item?.label || "Untitled"}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{item?.destination || ""}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-medium bg-slate-100 text-slate-700">
                        {item?.menu_location || "header"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">{item?.display_order ?? 0}</td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => {
                          setIsNew(false);
                          setEditingItem(item);
                        }}
                        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item?.id || "", item?.label || "")}
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

      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-gray-900">
              {isNew ? "Add Menu Item" : `Edit Item: ${editingItem.label || "Untitled"}`}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-800 mb-1">Display Label *</label>
                <input
                  type="text"
                  required
                  value={editingItem.label || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
                  placeholder="e.g. Projects"
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-800 mb-1">Destination Path or URL *</label>
                <input
                  type="text"
                  required
                  value={editingItem.destination || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, destination: e.target.value })}
                  placeholder="/#projects or /resume or https://..."
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-800 mb-1">Placement</label>
                  <select
                    value={editingItem.menu_location || "header"}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, menu_location: e.target.value as any })
                    }
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  >
                    <option value="header">Header Only</option>
                    <option value="footer">Footer Only</option>
                    <option value="both">Both Header & Footer</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-800 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingItem.display_order || 1}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, display_order: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-md shadow-2xs"
                >
                  {saving ? "Saving..." : isNew ? "Create Item" : "Update Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
