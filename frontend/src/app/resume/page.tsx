import { publicApi } from "@/services/publicApi";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import Link from "next/link";
import { ArrowLeft, Download, Mail, Phone, MapPin, Globe } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { formatDate } from "@/lib/utils";

export default async function ResumePage() {
  const [profile, experience, education, skills, certifications, navItems, footerSetting] = await Promise.all([
    publicApi.getProfile().catch(() => ({
      full_name: "Raj Antala",
      headline: "AI Engineer | Data Science | Generative AI",
      email: "contact@rajantala.com",
      phone: "+91 98765 43210",
      location: "India",
      github_url: "https://github.com/rajantala",
      linkedin_url: "https://linkedin.com/in/rajantala",
      bio: "Passionate AI Engineer and Data Scientist specializing in Machine Learning, Deep Learning, and Generative AI applications.",
      resume_file_url: "",
    } as any)),
    publicApi.getExperience().catch(() => []),
    publicApi.getEducation().catch(() => []),
    publicApi.getSkills().catch(() => []),
    publicApi.getCertifications().catch(() => []),
    publicApi.getNavigation("header").catch(() => []),
    publicApi.getFooter().catch(() => undefined),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 flex flex-col">
      <Navbar items={navItems} resumeUrl="/resume" />

      <main className="flex-1 pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Home
          </Link>

          {profile.resume_file_url ? (
            <a
              href={profile.resume_file_url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-all"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download PDF Resume
            </a>
          ) : (
            <button
              onClick={undefined}
              className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-all"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download Resume
            </button>
          )}
        </div>

        {/* Structured Resume Canvas */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 shadow-xs">
          {/* Header */}
          <div className="border-b border-gray-200 pb-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              {profile.full_name}
            </h1>
            <p className="text-base font-semibold text-blue-600 mt-1">
              {profile.headline}
            </p>

            <div className="mt-4 flex flex-wrap gap-y-2 gap-x-6 text-xs text-slate-600">
              {profile.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {profile.email}
                </span>
              )}
              {profile.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {profile.phone}
                </span>
              )}
              {profile.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {profile.location}
                </span>
              )}
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-blue-600"
                >
                  <GithubIcon className="w-3.5 h-3.5 text-slate-400" />
                  GitHub
                </a>
              )}
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-blue-600"
                >
                  <LinkedinIcon className="w-3.5 h-3.5 text-slate-400" />
                  LinkedIn
                </a>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          <div className="mt-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
              Professional Summary
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {profile.bio}
            </p>
          </div>

          {/* Work Experience */}
          {experience.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">
                Work Experience & Internships
              </h2>
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                      <div>
                        <span className="text-sm font-bold text-gray-900">{exp.job_title}</span>
                        <span className="text-xs font-medium text-slate-500"> — {exp.company}</span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        {formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                    {exp.responsibilities && (
                      <ul className="mt-2 list-disc list-inside space-y-1 text-xs text-slate-600">
                        {exp.responsibilities.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                    <div>
                      <div className="text-sm font-bold text-gray-900">{edu.degree}</div>
                      <div className="text-xs text-slate-500">{edu.institution} • {edu.field_of_study}</div>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {formatDate(edu.start_date)} – {edu.end_date ? formatDate(edu.end_date) : "Present"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Skills */}
          {skills.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">
                Technical Skills
              </h2>
              <div className="space-y-3">
                {skills.map((category) => (
                  <div key={category.id} className="text-xs">
                    <span className="font-semibold text-gray-800">{category.name}: </span>
                    <span className="text-slate-600">
                      {category.skills?.map((s) => s.name).join(", ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
                Certifications
              </h2>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {certifications.map((c) => (
                  <li key={c.id}>
                    <span className="font-semibold text-gray-900">{c.title}</span> — {c.issuer} ({formatDate(c.issue_date)})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>

      <Footer setting={footerSetting} navItems={navItems} />
    </div>
  );
}
