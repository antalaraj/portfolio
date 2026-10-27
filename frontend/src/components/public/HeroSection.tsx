import Link from "next/link";
import { ArrowDown, Mail, FileText, Sparkles } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { Profile } from "@/types";

interface HeroSectionProps {
  profile: Profile;
  config?: Record<string, any>;
}

export function HeroSection({ profile, config = {} }: HeroSectionProps) {
  const badgeText = config.badge_text || profile.availability_status || "Available for AI / ML Roles & Projects";
  const ctaPrimary = config.cta_primary_label || "Explore AI Projects";
  const ctaPrimaryLink = config.cta_primary_link || "/#projects";
  const ctaSecondary = config.cta_secondary_label || "Download Resume";
  const ctaSecondaryLink = config.cta_secondary_link || "/resume";

  return (
    <section id="hero" className="pt-32 pb-20 md:pt-40 md:pb-28 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Bio & CTAs */}
          <div className="lg:col-span-7">
            {/* Availability Indicator Badge */}
            {badgeText && (
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-slate-50 border border-gray-200 text-xs font-medium text-slate-700 shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>{badgeText}</span>
              </div>
            )}

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-[1.12]">
              Hi, I&apos;m <span className="text-blue-600">{profile.full_name}</span>.
            </h1>

            <p className="mt-4 text-xl sm:text-2xl font-medium text-slate-700 tracking-tight">
              {profile.headline}
            </p>

            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              {profile.bio || "Engineering intelligent, reliable AI architectures, multi-agent RAG pipelines, and scalable Machine Learning systems that bridge research and enterprise production."}
            </p>

            {/* Action CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={ctaPrimaryLink}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 shadow-xs transition-all"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {ctaPrimary}
              </Link>

              <Link
                href={ctaSecondaryLink}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-md border border-gray-300 bg-white text-gray-800 font-medium text-sm hover:bg-slate-50 hover:border-gray-400 shadow-2xs transition-all"
              >
                <FileText className="w-4 h-4 mr-2 text-slate-600" />
                {ctaSecondary}
              </Link>

              {/* Social Profile Links */}
              <div className="flex items-center gap-2 ml-1 sm:ml-4 border-l border-gray-200 pl-4 py-1">
                {profile.github_url && (
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-500 hover:text-gray-900 hover:bg-slate-100 rounded-md transition-colors"
                    aria-label="GitHub Profile"
                  >
                    <GithubIcon className="w-5 h-5" />
                  </a>
                )}
                {profile.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors"
                    aria-label="LinkedIn Profile"
                  >
                    <LinkedinIcon className="w-5 h-5" />
                  </a>
                )}
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-md transition-colors"
                    aria-label="Send Email"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Profile Picture Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative group">
              {/* Outer frame */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-88 md:h-88 rounded-3xl bg-slate-50 border-2 border-gray-200 p-2.5 shadow-xl transition-all duration-300 group-hover:border-blue-300 group-hover:shadow-2xl">
                <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-100 relative flex items-center justify-center">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-blue-600 to-indigo-700 text-white flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-3xl font-extrabold tracking-tight mb-3">
                        {profile.full_name ? profile.full_name.substring(0, 2).toUpperCase() : "RA"}
                      </div>
                      <span className="text-sm font-semibold tracking-wide text-white/90">
                        {profile.full_name}
                      </span>
                      <span className="text-xs text-blue-200 mt-1">
                        AI & Machine Learning Engineer
                      </span>
                    </div>
                  )}
                </div>

                {/* Floating Experience Badge */}
                <div className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-5 bg-white/95 backdrop-blur-md rounded-xl border border-gray-200 p-3 shadow-lg flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">3+ Years Experience</div>
                    <div className="text-[11px] text-slate-500">AI / ML Production Systems</div>
                  </div>
                </div>

                {/* Floating Active Badge */}
                <div className="absolute -top-3 -right-3 bg-white/95 backdrop-blur-md rounded-full border border-gray-200 py-1 px-3 shadow-md flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[11px] font-semibold text-gray-800">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
