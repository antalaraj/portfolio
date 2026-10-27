"use client";

import { useState } from "react";
import { Send, Mail, MapPin, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Profile } from "@/types";
import { publicApi } from "@/services/publicApi";

interface ContactSectionProps {
  profile: Profile;
  title?: string;
  subtitle?: string;
  config?: Record<string, any>;
}

export function ContactSection({
  profile,
  title = "Get in Touch",
  subtitle = "Have a challenging AI engineering role, research collaboration, or project inquiry? Let's talk.",
  config = {},
}: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await publicApi.submitContact(formData);
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setError(err?.message || "Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-slate-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 block">
              Contact
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
              {title}
            </h2>
            <p className="mt-4 text-slate-600 text-base leading-relaxed">
              {subtitle}
            </p>

            <div className="mt-8 space-y-4">
              {profile.email && (
                <div className="flex items-center gap-3 p-3.5 bg-white rounded-lg border border-gray-200 shadow-2xs">
                  <div className="w-9 h-9 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Direct Email
                    </div>
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>
              )}

              {profile.location && (
                <div className="flex items-center gap-3 p-3.5 bg-white rounded-lg border border-gray-200 shadow-2xs">
                  <div className="w-9 h-9 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Location
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {profile.location}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-2xs">
              {success && (
                <div className="mb-6 p-4 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Message sent successfully!</div>
                    <div className="text-xs text-emerald-700 mt-0.5">
                      Thank you for reaching out. I will respond to your email shortly.
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Unable to send message</div>
                    <div className="text-xs text-rose-700 mt-0.5">{error}</div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-semibold text-gray-800 mb-1.5"
                    >
                      Your Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-3.5 py-2 text-sm rounded-md border border-gray-300 bg-white text-gray-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-semibold text-gray-800 mb-1.5"
                    >
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full px-3.5 py-2 text-sm rounded-md border border-gray-300 bg-white text-gray-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-semibold text-gray-800 mb-1.5"
                  >
                    Subject <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="AI Engineering Consultation / Job Opportunity"
                    className="w-full px-3.5 py-2 text-sm rounded-md border border-gray-300 bg-white text-gray-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-semibold text-gray-800 mb-1.5"
                  >
                    Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please share details about your team, project, or opportunity..."
                    className="w-full px-3.5 py-2 text-sm rounded-md border border-gray-300 bg-white text-gray-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-md bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 shadow-2xs transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
