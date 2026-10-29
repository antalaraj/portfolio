import {
  Cpu,
  Database,
  Network,
  ShieldCheck,
  Code2,
  Sparkles,
  Terminal,
  Activity,
  Brain,
  Server,
  Layers,
  Globe,
  Bot,
  Zap,
  Boxes,
  Workflow,
  CheckCircle2,
  FileCode,
  LineChart,
  LucideIcon,
} from "lucide-react";
import { Profile, PageSection } from "@/types";

const ICON_MAP: Record<string, LucideIcon> = {
  Cpu,
  Database,
  Network,
  ShieldCheck,
  Code2,
  Sparkles,
  Terminal,
  Activity,
  Brain,
  Server,
  Layers,
  Globe,
  Bot,
  Zap,
  Boxes,
  Workflow,
  CheckCircle2,
  FileCode,
  LineChart,
};

function getHighlightIcon(name?: string): LucideIcon {
  if (!name) return Cpu;
  return ICON_MAP[name] || Cpu;
}

interface AboutSectionProps {
  profile?: Profile;
  section?: PageSection;
  config?: Record<string, any>;
}

export function AboutSection({ profile, section, config = {} }: AboutSectionProps) {
  const badge = config.badge_text || section?.title || "About Me";
  const headline =
    config.headline ||
    section?.subtitle ||
    "Engineering with curiosity, mathematical foundation, and engineering precision.";

  const p1 =
    config.bio_paragraph_1 ||
    profile?.bio ||
    "My journey centers on applied Artificial Intelligence and Data Science. I bridge mathematical theory with production reality, building machine learning architectures that solve authentic industry challenges.";

  const p2 =
    config.bio_paragraph_2 ||
    "Whether fine-tuning open weights with parameter-efficient techniques, designing deterministic multi-agent RAG graphs, or optimizing edge computer vision inference, I believe in rigorous empirical evaluation, clean maintainable code, and human-centric engineering.";

  const p3 =
    config.bio_paragraph_3 ||
    config.core_philosophy ||
    "Dedicated to building transparent, high-leverage artificial intelligence systems that elevate human capability.";

  // Quick stats
  const stats =
    Array.isArray(config.stats) && config.stats.length > 0
      ? config.stats
      : [
          {
            value: config.stat_1_value || "AI / ML",
            label: config.stat_1_label || "Core Focus",
          },
          {
            value: config.stat_2_value || "94%+",
            label: config.stat_2_label || "RAG Groundedness",
          },
          {
            value: config.stat_3_value || "Active",
            label: config.stat_3_label || "Ready for Roles",
          },
        ];

  // Highlights cards
  const rawHighlights =
    Array.isArray(config.highlights) && config.highlights.length > 0
      ? config.highlights
      : [
          {
            icon: config.card_1_icon || "Cpu",
            title: config.card_1_title || "Generative AI & LLMs",
            desc:
              config.card_1_desc ||
              "Architecting multi-agent workflows, contextual retrieval (RAG), and fine-tuned open-source models.",
          },
          {
            icon: config.card_2_icon || "Network",
            title: config.card_2_title || "Deep Learning Systems",
            desc:
              config.card_2_desc ||
              "Training vision transformers and neural defect detection pipelines optimized for low-latency inference.",
          },
          {
            icon: config.card_3_icon || "Database",
            title: config.card_3_title || "Data & Vector Pipelines",
            desc:
              config.card_3_desc ||
              "Engineering scalable ETL pipelines, pgvector embeddings, and hybrid sparse/dense retrieval search.",
          },
          {
            icon: config.card_4_icon || "ShieldCheck",
            title: config.card_4_title || "Production AI Rigor",
            desc:
              config.card_4_desc ||
              "Benchmarking factual grounding, hallucination minimization, and robust Dockerized API deployment.",
          },
        ];

  return (
    <section id="about" className="py-20 md:py-28 bg-slate-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Bio & Narrative */}
          <div className="lg:col-span-7">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 block">
              {badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
              {headline}
            </h2>

            <div className="mt-6 text-slate-600 space-y-4 text-base leading-relaxed">
              {p1 && <p>{p1}</p>}
              {p2 && <p>{p2}</p>}
              {p3 && <p>{p3}</p>}
            </div>

            {/* Quick Stat Highlights */}
            {stats.length > 0 && (
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                {stats.map((stat: any, idx: number) => (
                  <div
                    key={idx}
                    className={`bg-white p-4 rounded-lg border border-gray-200 shadow-2xs ${
                      idx === 2 && stats.length === 3 ? "col-span-2 sm:col-span-1" : ""
                    }`}
                  >
                    <div
                      className={`text-2xl font-bold ${
                        idx === 1
                          ? "text-blue-600"
                          : idx === 2
                          ? "text-emerald-600"
                          : "text-gray-900"
                      }`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Key Focus Areas Grid */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {rawHighlights.map((item: any, idx: number) => {
              const Icon = getHighlightIcon(item.icon);
              return (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-lg border border-gray-200 shadow-2xs hover:border-blue-200 hover:shadow-xs transition-all"
                >
                  <div className="w-9 h-9 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
