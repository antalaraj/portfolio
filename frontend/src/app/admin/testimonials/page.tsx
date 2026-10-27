"use client";

import { useState, useEffect } from "react";
import { MessageSquareQuote, Plus, Trash2, Edit2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { adminApi } from "@/services/adminApi";
import { Testimonial } from "@/types";

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTest, setEditingTest] = useState<Partial<Testimonial> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getTestimonials();
      setItems(res.data);
    } catch {
      setMessage({ type: "error", text: "Failed to load testimonials." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTest) return;
    setSaving(true);
    try {
      if (isNew) {
        const res = await adminApi.createTestimonial(editingTest);
        setItems([res.data, ...items]);
        setMessage({ type: "success", text: "Testimonial added successfully!" });
      } else {
        const res = await adminApi.updateTestimonial(editingTest.id!, editingTest);
        setItems(items.map((t) => (t.id === editingTest.id ? res.data : t)));
        setMessage({ type: "success", text: "Testimonial updated successfully!" });
      }
      setEditingTest(null);
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to save testimonial." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete recommendation from "${name}"?`)) return;
    try {
      await adminApi.deleteTestimonial(id);
      setItems(items.filter((t) => t.id !== id));
      setMessage({ type: "success", text: `Deleted testimonial from "${name}".` });
    } catch {
      setMessage({ type: "error", text: "Failed to delete testimonial." });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <MessageSquareQuote className="w-5 h-5 text-blue-600" />
            Testimonials & Recommendations
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage endorsements, approval statuses, and colleague recommendations.
          </p>
        </div>

        <button
          onClick={() => {
            setIsNew(true);
            setEditingTest({
              author_name: "",
              designation: "",
              company: "",
              quote: "",
              is_approved: true,
              display_order: items.length + 1,
            });
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Endorsement
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
            Loading recommendations...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Designation & Company</th>
                  <th className="py-3 px-4">Approved</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((test) => (
                  <tr key={test.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900">{test.author_name}</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {test.designation}{test.company ? ` • ${test.company}` : ""}
                    </td>
                    <td className="py-3.5 px-4">
                      {test.is_approved ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Approved
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => {
                          setIsNew(false);
                          setEditingTest(test);
                        }}
                        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(test.id, test.author_name)}
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

      {editingTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl max-w-lg w-full p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-gray-900">
              {isNew ? "Add Endorsement" : `Edit Endorsement: ${editingTest.author_name}`}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-800 mb-1">Author Name *</label>
                <input
                  type="text"
                  required
                  value={editingTest.author_name || ""}
                  onChange={(e) => setEditingTest({ ...editingTest, author_name: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-800 mb-1">Designation *</label>
                  <input
                    type="text"
                    required
                    value={editingTest.designation || ""}
                    onChange={(e) => setEditingTest({ ...editingTest, designation: e.target.value })}
                    placeholder="e.g. Principal AI Scientist"
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-800 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={editingTest.company || ""}
                    onChange={(e) => setEditingTest({ ...editingTest, company: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-800 mb-1">Recommendation Quote *</label>
                <textarea
                  rows={4}
                  required
                  value={editingTest.quote || ""}
                  onChange={(e) => setEditingTest({ ...editingTest, quote: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingTest.is_approved ?? true}
                    onChange={(e) => setEditingTest({ ...editingTest, is_approved: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                  />
                  <span className="text-xs font-semibold text-gray-800">
                    Approve for Public Portfolio Display
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingTest(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-md shadow-2xs"
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
