import { CheckCircle, ExternalLink, Award } from "lucide-react";
import { Certification } from "@/types";
import { formatDate } from "@/lib/utils";

interface CertificationSectionProps {
  items: Certification[];
  title?: string;
  subtitle?: string;
}

export function CertificationSection({
  items,
  title = "Licenses & Certifications",
  subtitle = "Industry-recognized qualifications validating machine learning, deep learning, and cloud skills.",
}: CertificationSectionProps) {
  return (
    <section id="certifications" className="py-20 md:py-28 bg-slate-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 block">
            Credentials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            {title}
          </h2>
          <p className="mt-3 text-slate-600 text-base leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((cert) => (
            <div
              key={cert.id}
              className="bg-white p-6 rounded-lg border border-gray-200 shadow-2xs hover:border-blue-200 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <Award className="w-5 h-5" />
                </div>

                <h3 className="text-base font-bold text-gray-900">
                  {cert.title}
                </h3>
                <div className="text-xs font-semibold text-blue-600 mt-1">
                  {cert.issuer}
                </div>

                <div className="mt-3 text-[11px] text-slate-400 font-mono">
                  Issued: {formatDate(cert.issue_date)}
                </div>
              </div>

              {cert.credential_url && (
                <div className="mt-5 pt-3 border-t border-gray-100">
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-medium text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    Verify Credential
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
