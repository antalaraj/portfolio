import Image from "next/image";
import { Cpu, Database, Network, ShieldCheck } from "lucide-react";
import { Profile } from "@/types";

interface AboutSectionProps {
  profile: Profile;
  config?: Record<string, any>;
}

export function AboutSection({ profile, config = {} }: AboutSectionProps) {
  const highlights = [
    {
      icon: Cpu,
      title: "Generative AI & LLMs",
      desc: "Architecting multi-agent workflows, contextual retrieval (RAG), and fine-tuned open-source models.",
    },
    {
      icon: Network,
      title: "Deep Learning Systems",
      desc: "Training vision transformers and neural defect detection pipelines optimized for low-latency inference.",
    },
    {
      icon: Database,
      title: "Data & Vector Pipelines",
      desc: "Engineering scalable ETL pipelines, pgvector embeddings, and hybrid sparse/dense retrieval search.",
    },
    {
      icon: ShieldCheck,
      title: "Production AI Rigor",
      desc: "Benchmarking factual grounding, hallucination minimization, and robust Dockerized API deployment.",
    },
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-slate-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Bio & Narrative */}
          <div className="lg:col-span-7">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 block">
              About Me
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
              Engineering with curiosity, mathematical foundation, and engineering precision.
            </h2>

            <div className="mt-6 text-slate-600 space-y-4 text-base leading-relaxed">
              <p>
                My journey centers on applied Artificial Intelligence and Data Science. I bridge mathematical theory with production reality, building machine learning architectures that solve authentic industry challenges.
              </p>
              <p>
                Whether fine-tuning open weights with parameter-efficient techniques, designing deterministic multi-agent RAG graphs, or optimizing edge computer vision inference, I believe in rigorous empirical evaluation, clean maintainable code, and human-centric engineering.
              </p>
              <p>
                {config.core_philosophy || "Dedicated to building transparent, high-leverage artificial intelligence systems that elevate human capability."}
              </p>
            </div>

            {/* Quick Stat Highlights */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-2xs">
                <div className="text-2xl font-bold text-gray-900">AI / ML</div>
                <div className="text-xs text-slate-500 mt-1">Core Focus</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-2xs">
                <div className="text-2xl font-bold text-blue-600">94%+</div>
                <div className="text-xs text-slate-500 mt-1">RAG Groundedness</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-2xs col-span-2 sm:col-span-1">
                <div className="text-2xl font-bold text-emerald-600">Active</div>
                <div className="text-xs text-slate-500 mt-1">Ready for Roles</div>
              </div>
            </div>
          </div>

          {/* Right Column: Key Focus Areas Grid */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-lg border border-gray-200 shadow-2xs hover:border-blue-200 hover:shadow-xs transition-all"
                >
                  <div className="w-9 h-9 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
