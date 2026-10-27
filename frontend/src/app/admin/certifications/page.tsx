"use client";

import { useState, useEffect } from "react";
import { Award, Plus, Trash2, Edit2, ExternalLink, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { adminApi } from "@/services/adminApi";
import { Certification } from "@/types";

export default function AdminCertificationsPage() {
  const [items, setItems] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCert, setEditingCert] = useState<Partial<Certification> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchCertifications = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getCertifications();
      const records = (res as any)?.results || (res as any)?.data || (Array.isArray(res) ? res : []);
      setItems(Array.isArray(records) ? records : []);
    } catch {
      setMessage({ type: "error", text: "Failed to load certifications." });
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;
    setSaving(true);
    try {
      if (isNew) {
        const res = await adminApi.createCertification(editingCert);
        setItems([res.data, ...items]);
        setMessage({ type: "success", text: "Certification created successfully!" });
      } else {
        const res = await adminApi.updateCertification(editingCert.id!, editingCert);
        setItems(items.map((c) => (c.id === editingCert.id ? res.data : c)));
        setMessage({ type: "success", text: "Certification updated successfully!" });
      }
      setEditingCert(null);
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to save certification." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await adminApi.deleteCertification(id);
      setItems(items.filter((c) => c.id !== id));
      setMessage({ type: "success", text: `Deleted "${title}".` });
    } catch {
      setMessage({ type: "error", text: "Failed to delete certification." });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            Certifications Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage industry certifications, credential verification links, and issue dates.
          </p>
        </div>

        <button
          onClick={() => {
            setIsNew(true);
            setEditingCert({
              title: "",
              issuer: "",
              issue_date: new Date().toISOString().split("T")[0],
              credential_url: "",
              status: "published",
              display_order: items.length + 1,
            });
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Certification
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
            Loading certifications...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Title & Issuer</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      <div>{cert.title}</div>
                      <div className="text-xs text-blue-600 font-medium">{cert.issuer}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">{cert.issue_date}</td>
                    <td className="py-3.5 px-4">
                      {cert.credential_url ? (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:underline gap-1 text-[11px]"
                        >
                          Verify <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => {
                          setIsNew(false);
                          setEditingCert(cert);
                        }}
                        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cert.id, cert.title)}
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

      {editingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-gray-900">
              {isNew ? "Add Certification" : `Edit Certification: ${editingCert.title}`}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-800 mb-1">Certificate Title *</label>
                <input
                  type="text"
                  required
                  value={editingCert.title || ""}
                  onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-800 mb-1">Issuing Organization *</label>
                <input
                  type="text"
                  required
                  value={editingCert.issuer || ""}
                  onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                  placeholder="e.g. DeepLearning.AI / AWS / Google"
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-800 mb-1">Issue Date</label>
                  <input
                    type="date"
                    required
                    value={editingCert.issue_date || ""}
                    onChange={(e) => setEditingCert({ ...editingCert, issue_date: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-800 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingCert.display_order || 1}
                    onChange={(e) =>
                      setEditingCert({ ...editingCert, display_order: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-800 mb-1">Credential URL</label>
                <input
                  type="url"
                  value={editingCert.credential_url || ""}
                  onChange={(e) => setEditingCert({ ...editingCert, credential_url: e.target.value })}
                  placeholder="https://coursera.org/verify/..."
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingCert(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-md shadow-2xs"
                >
                  {saving ? "Saving..." : isNew ? "Create Certification" : "Update Certification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
