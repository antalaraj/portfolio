"use client";

import { useState, useEffect } from "react";
import {
  UserCheck,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
  EyeOff,
  Cpu,
  Network,
  Database,
  ShieldCheck,
  Brain,
  Bot,
  Terminal,
  Zap,
  Workflow,
  Boxes,
  Layers,
  Globe,
  LineChart,
  Sparkles,
  Plus,
  Trash2,
} from "lucide-react";
import { adminApi } from "@/services/adminApi";
import { PageSection } from "@/types";

const AVAILABLE_ICONS = [
  { name: "Cpu", label: "Processor (AI/ML)" },
  { name: "Brain", label: "Neural / Cognitive" },
  { name: "Bot", label: "Agents & LLMs" },
  { name: "Network", label: "Deep Learning" },
  { name: "Database", label: "Vector & Data" },
  { name: "ShieldCheck", label: "Production & Rigor" },
  { name: "Terminal", label: "Systems & CLI" },
  { name: "Workflow", label: "Pipelines & Orchestration" },
  { name: "Zap", label: "Fast & Optimized" },
  { name: "Boxes", label: "Microservices & Docker" },
  { name: "Layers", label: "Full Stack AI" },
  { name: "Globe", label: "Cloud & Web" },
  { name: "LineChart", label: "Data Science & Metrics" },
];

interface HighlightCard {
  icon: string;
  title: string;
  desc: string;
}

interface StatItem {
  value: string;
  label: string;
}

export default function AdminAboutPage() {
  const [section, setSection] = useState<PageSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form Fields
  const [badgeText, setBadgeText] = useState("About Me");
  const [headline, setHeadline] = useState(
    "Engineering with curiosity, mathematical foundation, and engineering precision."
  );
  const [paragraph1, setParagraph1] = useState(
    "My journey centers on applied Artificial Intelligence and Data Science. I bridge mathematical theory with production reality, building machine learning architectures that solve authentic industry challenges."
  );
  const [paragraph2, setParagraph2] = useState(
    "Whether fine-tuning open weights with parameter-efficient techniques, designing deterministic multi-agent RAG graphs, or optimizing edge computer vision inference, I believe in rigorous empirical evaluation, clean maintainable code, and human-centric engineering."
  );
  const [corePhilosophy, setCorePhilosophy] = useState(
    "Dedicated to building transparent, high-leverage artificial intelligence systems that elevate human capability."
  );
  const [isActive, setIsActive] = useState(true);

  // Stats (3 items)
  const [stats, setStats] = useState<StatItem[]>([
    { value: "AI / ML", label: "Core Focus" },
    { value: "94%+", label: "RAG Groundedness" },
    { value: "Active", label: "Ready for Roles" },
  ]);

  // Highlight capability cards (4 items)
  const [highlights, setHighlights] = useState<HighlightCard[]>([
    {
      icon: "Cpu",
      title: "Generative AI & LLMs",
      desc: "Architecting multi-agent workflows, contextual retrieval (RAG), and fine-tuned open-source models.",
    },
    {
      icon: "Network",
      title: "Deep Learning Systems",
      desc: "Training vision transformers and neural defect detection pipelines optimized for low-latency inference.",
    },
    {
      icon: "Database",
      title: "Data & Vector Pipelines",
      desc: "Engineering scalable ETL pipelines, pgvector embeddings, and hybrid sparse/dense retrieval search.",
    },
    {
      icon: "ShieldCheck",
      title: "Production AI Rigor",
      desc: "Benchmarking factual grounding, hallucination minimization, and robust Dockerized API deployment.",
    },
  ]);

  useEffect(() => {
    fetchAboutSection();
  }, []);

  const fetchAboutSection = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getSections("home");
      const records =
        (res as any)?.results || (res as any)?.data || (Array.isArray(res) ? res : []);
      const items: PageSection[] = Array.isArray(records) ? records.filter(Boolean) : [];
      const aboutSec = items.find((s) => s.section_type === "about");

      if (aboutSec) {
        setSection(aboutSec);
        setIsActive(aboutSec.is_active ?? true);
        const config = aboutSec.config_data || {};

        setBadgeText(config.badge_text || aboutSec.title || "About Me");
        setHeadline(
          config.headline ||
            aboutSec.subtitle ||
            "Engineering with curiosity, mathematical foundation, and engineering precision."
        );
        if (config.bio_paragraph_1) setParagraph1(config.bio_paragraph_1);
        if (config.bio_paragraph_2) setParagraph2(config.bio_paragraph_2);
        if (config.bio_paragraph_3 || config.core_philosophy) {
          setCorePhilosophy(config.bio_paragraph_3 || config.core_philosophy);
        }

        // Stats
        if (Array.isArray(config.stats) && config.stats.length > 0) {
          setStats(config.stats);
        } else if (config.stat_1_value) {
          setStats([
            { value: config.stat_1_value, label: config.stat_1_label || "Core Focus" },
            { value: config.stat_2_value || "94%+", label: config.stat_2_label || "RAG Groundedness" },
            { value: config.stat_3_value || "Active", label: config.stat_3_label || "Ready for Roles" },
          ]);
        }

        // Highlights
        if (Array.isArray(config.highlights) && config.highlights.length > 0) {
          setHighlights(config.highlights);
        }
      }
    } catch {
      setMessage({ type: "error", text: "Failed to load About Me section data." });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const configPayload = {
      badge_text: badgeText,
      headline,
      bio_paragraph_1: paragraph1,
      bio_paragraph_2: paragraph2,
      bio_paragraph_3: corePhilosophy,
      core_philosophy: corePhilosophy,
      stats,
      highlights,
    };

    try {
      if (section?.id) {
        const res = await adminApi.updateSection(section.id, {
          title: badgeText,
          subtitle: headline,
          is_active: isActive,
          config_data: configPayload,
        });
        const updated = (res as any)?.data || res;
        if (updated && typeof updated === "object") {
          setSection(updated);
        }
        setMessage({
          type: "success",
          text: "About Me section successfully updated and published to live website!",
        });
      } else {
        // Fallback: create section if not found
        const res = await adminApi.createSection({
          section_type: "about",
          title: badgeText,
          subtitle: headline,
          display_order: 2,
          is_active: isActive,
          config_data: configPayload,
        });
        const created = (res as any)?.data || res;
        if (created && typeof created === "object") {
          setSection(created);
        }
        setMessage({
          type: "success",
          text: "About Me section created and published successfully!",
        });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to save About Me section." });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStat = (index: number, field: "value" | "label", val: string) => {
    const next = [...stats];
    next[index] = { ...next[index], [field]: val };
    setStats(next);
  };

  const handleUpdateHighlight = (index: number, field: keyof HighlightCard, val: string) => {
    const next = [...highlights];
    next[index] = { ...next[index], [field]: val };
    setHighlights(next);
  };

  const handleAddHighlight = () => {
    setHighlights([
      ...highlights,
      {
        icon: "Cpu",
        title: "New Capability",
        desc: "Description of your technical approach or specialization.",
      },
    ]);
  };

  const handleRemoveHighlight = (index: number) => {
    if (highlights.length <= 1) {
      alert("You need at least 1 focus area card.");
      return;
    }
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
        Loading About Me configuration...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            About Me Section Editor
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Edit the public narrative, headline, quantitative stats, and technical focus cards on your portfolio homepage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/#about"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-gray-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
            Preview Live
          </a>

          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors shadow-2xs ${
              isActive
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
            title="Toggle section visibility on the live website"
          >
            {isActive ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
            {isActive ? "Visible on Site" : "Hidden"}
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save About Section
          </button>
        </div>
      </div>

      {/* Alert Notification */}
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

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Eyebrow Badge & Main Headline */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-900">1. Section Header & Headline</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              The eyebrow tag and main mission statement displayed prominently at the top of the About section.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1">
                Eyebrow Badge Text *
              </label>
              <input
                type="text"
                required
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="About Me"
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-800 mb-1">
                Main Section Headline *
              </label>
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Engineering with curiosity, mathematical foundation, and engineering precision."
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Narrative & Story Paragraphs */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-900">2. Story & Technical Narrative Paragraphs</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Three-paragraph narrative detailing your background, technical principles, and core engineering philosophy.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1">
                Paragraph 1: Technical Focus & Background *
              </label>
              <textarea
                rows={3}
                required
                value={paragraph1}
                onChange={(e) => setParagraph1(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1">
                Paragraph 2: Implementation Principles & Architecture *
              </label>
              <textarea
                rows={3}
                required
                value={paragraph2}
                onChange={(e) => setParagraph2(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1">
                Paragraph 3: Core Philosophy & Vision *
              </label>
              <textarea
                rows={2}
                required
                value={corePhilosophy}
                onChange={(e) => setCorePhilosophy(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Quick Metric Stats */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-900">3. Quick Stat Highlight Metrics (3 Boxes)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Highlight cards displayed directly below the story paragraphs (e.g. Focus domain, benchmark metric, and availability status).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="p-4 rounded-lg border border-gray-200 bg-slate-50/50 space-y-3">
                <div className="text-xs font-bold text-gray-700">Stat Card #{idx + 1}</div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Metric Value</label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleUpdateStat(idx, "value", e.target.value)}
                    placeholder="e.g. 94%+"
                    className="w-full px-2.5 py-1.5 text-xs font-bold rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Metric Label</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleUpdateStat(idx, "label", e.target.value)}
                    placeholder="e.g. RAG Groundedness"
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Key Focus Areas (Capability Cards) */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900">4. Key Focus Areas (Capability Cards)</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Right-hand grid cards highlighting your AI domains, engineering disciplines, and production practices.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddHighlight}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Card
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((item, idx) => (
              <div key={idx} className="p-4 rounded-lg border border-gray-200 bg-slate-50/50 space-y-3 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">Card #{idx + 1}</span>
                  {highlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded"
                      title="Remove Card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Icon</label>
                    <select
                      value={item.icon}
                      onChange={(e) => handleUpdateHighlight(idx, "icon", e.target.value)}
                      className="w-full px-2 py-1.5 text-xs rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                    >
                      {AVAILABLE_ICONS.map((icon) => (
                        <option key={icon.name} value={icon.name}>
                          {icon.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Card Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleUpdateHighlight(idx, "title", e.target.value)}
                      placeholder="e.g. Generative AI & LLMs"
                      className="w-full px-2.5 py-1.5 text-xs font-bold rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={item.desc}
                    onChange={(e) => handleUpdateHighlight(idx, "desc", e.target.value)}
                    placeholder="Short description of your expertise or achievements in this area."
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Preview Box */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-4">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Live Preview (Public Website Appearance)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Visual rendering matching the exact layout and typography on the homepage.
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-100 text-slate-600">
              Interactive Preview
            </span>
          </div>

          <div className="p-6 bg-slate-50 rounded-xl border border-gray-200/80">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column Preview */}
              <div className="lg:col-span-7">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 block">
                  {badgeText || "About Me"}
                </span>
                <h4 className="text-2xl font-bold tracking-tight text-gray-900 leading-tight">
                  {headline || "Your headline goes here"}
                </h4>

                <div className="mt-4 text-slate-600 space-y-3 text-xs leading-relaxed">
                  {paragraph1 && <p>{paragraph1}</p>}
                  {paragraph2 && <p>{paragraph2}</p>}
                  {corePhilosophy && <p className="font-medium text-slate-700">{corePhilosophy}</p>}
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 shadow-2xs">
                      <div
                        className={`text-lg font-bold ${
                          idx === 1 ? "text-blue-600" : idx === 2 ? "text-emerald-600" : "text-gray-900"
                        }`}
                      >
                        {stat.value || "—"}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{stat.label || "Label"}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column Preview */}
              <div className="lg:col-span-5 grid grid-cols-1 gap-3">
                {highlights.map((item, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 shadow-2xs">
                    <div className="w-7 h-7 rounded bg-blue-50 text-blue-600 font-mono text-[11px] font-bold flex items-center justify-center mb-2">
                      {item.icon.slice(0, 3)}
                    </div>
                    <div className="text-xs font-bold text-gray-900">{item.title || "Untitled Card"}</div>
                    <div className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      {item.desc || "No description"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <span className="text-xs text-slate-500">
            Changes save directly to the homepage &quot;about&quot; section configuration.
          </span>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save & Publish About Me Section
          </button>
        </div>
      </form>
    </div>
  );
}
