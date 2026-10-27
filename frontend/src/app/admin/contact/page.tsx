"use client";

import { useState, useEffect } from "react";
import { Mail, Trash2, CheckCircle2, Archive, Search, Loader2, AlertCircle, Reply } from "lucide-react";
import { adminApi } from "@/services/adminApi";
import { ContactMessage } from "@/types";
import { formatDate } from "@/lib/utils";

export default function AdminContactInboxPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterUnread, setFilterUnread] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getContactMessages();
      const records = (res as any)?.results || (res as any)?.data || (Array.isArray(res) ? res : []);
      setMessages(Array.isArray(records) ? records : []);
    } catch {
      // offline fallback
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (msg: ContactMessage) => {
    try {
      const updated = !msg.is_read;
      await adminApi.updateContactMessage(msg.id, { is_read: updated });
      setMessages(messages.map((m) => (m.id === msg.id ? { ...m, is_read: updated } : m)));
      if (selectedMsg?.id === msg.id) {
        setSelectedMsg({ ...selectedMsg, is_read: updated });
      }
    } catch {
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this message?")) return;
    try {
      await adminApi.deleteContactMessage(id);
      setMessages(messages.filter((m) => m.id !== id));
      if (selectedMsg?.id === id) setSelectedMsg(null);
    } catch {
      alert("Failed to delete message.");
    }
  };

  const filtered = messages
    .filter((m) => (!filterUnread ? true : !m.is_read))
    .filter(
      (m) =>
        m.sender_name.toLowerCase().includes(search.toLowerCase()) ||
        m.sender_email.toLowerCase().includes(search.toLowerCase()) ||
        m.subject.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            Contact Messages & Inquiries
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review incoming inquiries from prospective recruiters, companies, and collaborators.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterUnread(!filterUnread)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filterUnread
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {filterUnread ? "Showing Unread Only" : "Filter Unread"}
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or subject..."
          className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-gray-200 bg-white shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
        />
      </div>

      {/* Inbox Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Messages List */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              Loading inquiries...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              No inquiries found matching criteria.
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {filtered.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMsg(msg);
                    if (!msg.is_read) handleToggleRead(msg);
                  }}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedMsg?.id === msg.id
                      ? "bg-blue-50/60 border-l-4 border-blue-600"
                      : !msg.is_read
                      ? "bg-white font-semibold"
                      : "bg-slate-50/50 hover:bg-slate-50 opacity-80"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-900 font-bold truncate max-w-[180px]">
                      {msg.sender_name}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {formatDate(msg.created_at)}
                    </span>
                  </div>
                  <div className="text-xs text-blue-600 font-medium truncate mb-1">
                    {msg.subject}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Inspector Pane */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 shadow-2xs p-6 min-h-[400px]">
          {selectedMsg ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-gray-100 pb-4 gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 leading-snug">
                    {selectedMsg.subject}
                  </h3>
                  <div className="text-xs text-slate-500 mt-1">
                    From: <span className="font-semibold text-gray-900">{selectedMsg.sender_name}</span>{" "}
                    &lt;{selectedMsg.sender_email}&gt;
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Received: {new Date(selectedMsg.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={`mailto:${selectedMsg.sender_email}?subject=Re: ${encodeURIComponent(selectedMsg.subject)}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-2xs"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    Reply
                  </a>
                  <button
                    onClick={() => handleToggleRead(selectedMsg)}
                    className="p-1.5 rounded border border-gray-200 text-slate-600 hover:bg-slate-100"
                    title={selectedMsg.is_read ? "Mark as unread" : "Mark as read"}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${selectedMsg.is_read ? "text-emerald-600" : ""}`} />
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMsg.id)}
                    className="p-1.5 rounded border border-gray-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="whitespace-pre-line text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-gray-100">
                {selectedMsg.message}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 text-slate-400">
              <Mail className="w-10 h-10 stroke-1 mb-2 text-slate-300" />
              <div className="text-sm font-semibold text-slate-600">Select an inquiry</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Choose a message from the list to view its complete details and reply.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
