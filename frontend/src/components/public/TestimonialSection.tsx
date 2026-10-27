import { Quote } from "lucide-react";
import { Testimonial } from "@/types";

interface TestimonialSectionProps {
  items: Testimonial[];
  title?: string;
  subtitle?: string;
}

export function TestimonialSection({
  items,
  title = "Endorsements & Recommendations",
  subtitle = "Feedback from engineering leads, research mentors, and colleagues.",
}: TestimonialSectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 block">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            {title}
          </h2>
          <p className="mt-3 text-slate-600 text-base leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((test) => (
            <div
              key={test.id}
              className="bg-slate-50 p-6 rounded-lg border border-gray-200 shadow-2xs hover:border-gray-300 transition-all flex flex-col justify-between"
            >
              <div>
                <Quote className="w-6 h-6 text-blue-600 mb-4 opacity-75" />
                <p className="text-sm text-slate-700 italic leading-relaxed">
                  &ldquo;{test.quote}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                  {test.author_name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">
                    {test.author_name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {test.designation}{test.company ? ` • ${test.company}` : ""}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
