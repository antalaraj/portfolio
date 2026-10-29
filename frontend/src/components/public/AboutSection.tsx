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
    "Building practical, intelligent AI systems with modern LLMs, computer vision, and robust engineering.";

  const p1 =
    config.bio_paragraph_1 ||
    profile?.bio ||
    "I am Antala Raj, a postgraduate student pursuing a PGDM in Artificial Intelligence and Data Science at Adani Institute of Digital Technology Management (AIDTM), with a Bachelor of Computer Applications (BCA) from LJ University, Ahmedabad. I bridge mathematical foundations with production reality, building machine learning architectures that solve authentic industry challenges.";

  const p2 =
    config.bio_paragraph_2 ||
    "During my AI Engineer internship at OpenSpectrum AI Private Limited, I contributed to Luma Assistant, Google Gemini API integration, AI-powered ERP capabilities, AWS SES integration, and smart glasses functionality. From developing wound image segmentation prototypes (AuraMed-AI) using ConvNeXt and OpenCV to RAG-powered meeting intelligence and grant proposal drafting, I focus on reproducible evaluations, agentic workflows, and reliable deployment.";

  const p3 =
    config.bio_paragraph_3 ||
    config.core_philosophy ||
    "Learning through practical implementation, building useful AI applications, and continuously improving technical skills across Generative AI, Machine Learning, and scalable software systems.";

  // Quick stats
  const stats =
    Array.isArray(config.stats) && config.stats.length > 0
      ? config.stats
      : [
          {
            value: config.stat_1_value || "AI & ML",
            label: config.stat_1_label || "AIDTM (PGDM) & BCA",
          },
          {
            value: config.stat_2_value || "10+",
            label: config.stat_2_label || "Shipped AI & CV Projects",
          },
          {
            value: config.stat_3_value || "Industry Tested",
            label: config.stat_3_label || "OpenSpectrum AI Intern",
          },
        ];

  // Highlights cards
  const rawHighlights =
    Array.isArray(config.highlights) && config.highlights.length > 0
      ? config.highlights
      : [
          {
            icon: config.card_1_icon || "Bot",
            title: config.card_1_title || "Generative & Agentic AI",
            desc:
              config.card_1_desc ||
              "Architecting autonomous workflows, contextual RAG, and multi-model integrations with LangChain, LangGraph, Google Gemini, and Groq.",
          },
          {
            icon: config.card_2_icon || "Cpu",
            title: config.card_2_title || "Computer Vision & Medical AI",
            desc:
              config.card_2_desc ||
              "Developing wound segmentation (AuraMed-AI) using LAB color-space, ConvNeXt transfer learning, OpenCV, PyTorch, and defect detection.",
          },
          {
            icon: config.card_3_icon || "Server",
            title: config.card_3_title || "Full-Stack AI & Backend Systems",
            desc:
              config.card_3_desc ||
              "Engineering robust REST APIs with FastAPI, Django, and Flask, paired with responsive cross-platform apps via React Native & Expo.",
          },
          {
            icon: config.card_4_icon || "LineChart",
            title: config.card_4_title || "Data Science & Analytics",
            desc:
              config.card_4_desc ||
              "Conducting rigorous exploratory data analysis, feature engineering, and statistical modeling with Pandas, NumPy, and Scikit-Learn.",
          },
        ];

  return (
    <section id="about" className="py-14 md:py-28 bg-slate-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Bio & Narrative */}
          <div className="lg:col-span-7">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 block">
              {badge}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
              {headline}
            </h2>

            <div className="mt-5 sm:mt-6 text-slate-600 space-y-3.5 sm:space-y-4 text-sm sm:text-base leading-relaxed">
              {p1 && <p>{p1}</p>}
              {p2 && <p>{p2}</p>}
              {p3 && <p>{p3}</p>}
            </div>

            {/* Quick Stat Highlights */}
            {stats.length > 0 && (
              <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-5 sm:pt-6 border-t border-gray-200">
                {stats.map((stat: any, idx: number) => (
                  <div
                    key={idx}
                    className={`bg-white p-3.5 sm:p-4 rounded-lg border border-gray-200 shadow-2xs ${
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
