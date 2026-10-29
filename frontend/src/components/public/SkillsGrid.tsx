"use client";

import { useState } from "react";
import {
  Terminal,
  Code2,
  FileCode,
  Database,
  Cpu,
  Activity,
  Layers,
  LineChart,
  Eye,
  Binary,
  BookOpen,
  Workflow,
  Share2,
  Sparkles,
  MessageSquareCode,
  Server,
  Zap,
  HardDrive,
  Network,
  Container,
  GitBranch,
  Cloud,
  TerminalSquare,
  ExternalLink,
  Wrench,
} from "lucide-react";
import { SkillCategory } from "@/types";

interface SkillsGridProps {
  categories: SkillCategory[];
  title?: string;
  subtitle?: string;
}

const ICON_MAP: Record<string, any> = {
  Terminal,
  Code2,
  FileCode,
  Database,
  Cpu,
  Activity,
  Layers,
  LineChart,
  Eye,
  Binary,
  BookOpen,
  Workflow,
  Share2,
  Sparkles,
  MessageSquareCode,
  Server,
  Zap,
  HardDrive,
  Network,
  Container,
  GitBranch,
  Cloud,
  TerminalSquare,
  ExternalLink,
};

export function SkillsGrid({
  categories,
  title = "Technical Expertise",
  subtitle = "Proficiency in programming languages, AI frameworks, and cloud infrastructure.",
}: SkillsGridProps) {
  const [selectedSlug, setSelectedSlug] = useState<string>("all");

  const filteredCategories =
    selectedSlug === "all"
      ? categories
      : categories.filter((c) => c.slug === selectedSlug);

  return (
    <section id="skills" className="py-14 md:py-28 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 block">
            Skills & Stack
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            {title}
          </h2>
          <p className="mt-3 text-slate-600 text-base leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Filter Tabs */}
        {categories.length > 1 && (
          <div className="mt-6 sm:mt-8 flex gap-2 pb-2 overflow-x-auto sm:flex-wrap no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setSelectedSlug("all")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md shrink-0 transition-all ${
                selectedSlug === "all"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-gray-200"
              }`}
            >
              All Domains
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                suppressHydrationWarning
                onClick={() => setSelectedSlug(cat.slug)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md shrink-0 transition-all ${
                  selectedSlug === cat.slug
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-gray-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Categorized Cards Grid */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg border border-gray-200 p-5 sm:p-6 shadow-2xs hover:border-gray-300 transition-all"
            >
              <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center justify-between">
                <span>{category.name}</span>
                <span className="text-xs font-medium text-slate-400">
                  {category.skills?.length || 0} skills
                </span>
              </h3>

              <div className="mt-4 flex flex-wrap gap-2">
                {category.skills?.map((skill) => {
                  const Icon = ICON_MAP[skill.icon_name] || Wrench;
                  return (
                    <div
                      key={skill.id}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-50 border border-gray-200 text-xs font-medium text-gray-800 hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-900 transition-all shadow-2xs group"
                    >
                      <Icon className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
                      <span>{skill.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
