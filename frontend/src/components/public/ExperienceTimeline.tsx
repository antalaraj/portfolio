import { Briefcase, Calendar, MapPin, CheckCircle2 } from "lucide-react";
import { Experience } from "@/types";
import { formatDate } from "@/lib/utils";

interface ExperienceTimelineProps {
  items: Experience[];
  title?: string;
  subtitle?: string;
}

const EMPLOYMENT_TYPE_MAP: Record<string, string> = {
  "internship": "Internship",
  "full-time": "Full-time",
  "part-time": "Part-time",
  "contract": "Contract",
  "research": "Research Fellow",
  "freelance": "Freelance",
};

export function ExperienceTimeline({
  items,
  title = "Work Experience & Internships",
  subtitle = "Professional journey delivering Machine Learning and Generative AI systems.",
}: ExperienceTimelineProps) {
  return (
    <section id="experience" className="py-20 md:py-28 bg-slate-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 block">
            Career Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            {title}
          </h2>
          <p className="mt-3 text-slate-600 text-base leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Timeline Items */}
        <div className="relative pl-6 sm:pl-8 border-l border-gray-200 space-y-10">
          {items.map((exp) => {
            const dateStr = `${formatDate(exp.start_date)} — ${
              exp.is_current ? "Present" : formatDate(exp.end_date)
            }`;

            const typeLabel =
              EMPLOYMENT_TYPE_MAP[exp.employment_type?.toLowerCase()] ||
              exp.employment_type;

            return (
              <div key={exp.id} className="relative group">
                {/* Timeline Node Icon */}
                <div className="absolute -left-[35px] sm:-left-[41px] top-1 w-6 h-6 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center shadow-xs">
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-2xs hover:border-gray-300 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 pb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {exp.job_title}
                      </h3>
                      <div className="text-sm font-semibold text-blue-600 mt-0.5">
                        {exp.company}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {dateStr}
                      </span>
                      {exp.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {exp.location}
                        </span>
                      )}
                      {typeLabel && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                          {typeLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  {exp.description && (
                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                      {exp.description}
                    </p>
                  )}

                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {exp.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start text-xs text-slate-600 leading-relaxed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mr-2 shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
