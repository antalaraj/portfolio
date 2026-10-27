import { GraduationCap, Calendar, Award } from "lucide-react";
import { Education } from "@/types";
import { formatDate } from "@/lib/utils";

interface EducationSectionProps {
  items: Education[];
  title?: string;
  subtitle?: string;
}

export function EducationSection({
  items,
  title = "Education & Academic Foundation",
  subtitle = "Rigorous coursework in Computer Science, Artificial Intelligence, and Applied Mathematics.",
}: EducationSectionProps) {
  return (
    <section id="education" className="py-20 md:py-28 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 block">
            Academic Background
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            {title}
          </h2>
          <p className="mt-3 text-slate-600 text-base leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((edu) => (
            <div
              key={edu.id}
              className="bg-white p-6 rounded-lg border border-gray-200 shadow-2xs hover:border-gray-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <GraduationCap className="w-5 h-5" />
                </div>

                <h3 className="text-lg font-bold text-gray-900">
                  {edu.degree}
                </h3>
                <div className="text-sm font-semibold text-blue-600 mt-1">
                  {edu.institution}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {edu.field_of_study}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-3 border-t border-gray-100">
                  <span className="inline-flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {formatDate(edu.start_date)} — {edu.end_date ? formatDate(edu.end_date) : "Present"}
                  </span>
                  {edu.grade && (
                    <span className="inline-flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      {edu.grade}
                    </span>
                  )}
                </div>

                {edu.description && (
                  <p className="mt-4 text-xs text-slate-600 leading-relaxed">
                    {edu.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
