"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, FileText, Sparkles, Maximize2, X } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { Profile } from "@/types";

interface HeroSectionProps {
  profile: Profile;
  config?: Record<string, any>;
}

export function HeroSection({ profile, config = {} }: HeroSectionProps) {
  const [showLightbox, setShowLightbox] = useState(false);
  const badgeText = config.badge_text || profile.availability_status || "Available for AI / ML Roles & Projects";
  const ctaPrimary = config.cta_primary_label || "Explore AI Projects";
  const ctaPrimaryLink = config.cta_primary_link || "/#projects";
  const ctaSecondary = config.cta_secondary_label || "Download Resume";
  const ctaSecondaryLink = config.cta_secondary_link || "/resume";

  // Experience highlight badge on hero photo (configurable & toggleable by admin)
  const showExperienceBadge =
    config.show_experience_badge !== undefined
      ? Boolean(config.show_experience_badge)
      : profile.show_experience_badge !== undefined
      ? Boolean(profile.show_experience_badge)
      : true;

  const experienceBadgeTitle =
    config.experience_badge_title ||
    profile.experience_badge_title ||
    "3+ Years Experience";

  const experienceBadgeSubtitle =
    config.experience_badge_subtitle ||
    profile.experience_badge_subtitle ||
    "AI / ML Production Systems";

  return (
    <section id="hero" className="pt-32 pb-20 md:pt-40 md:pb-28 bg-white border-b border-gray-100 overflow-hidden">
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

          {/* Right Column: Ultra-HD Profile Picture Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative group w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[440px]">
              {/* Outer executive frame in natural 4:5 portrait ratio */}
              <div className="relative w-full aspect-4/5 rounded-3xl bg-slate-50 border-2 border-gray-200/80 p-2.5 sm:p-3 shadow-xl transition-all duration-300 group-hover:border-blue-300 group-hover:shadow-2xl">
                <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-100 relative flex items-center justify-center">
                  {profile.avatar_url ? (
                    <>
                      <Image
                        src={profile.avatar_url}
                        alt={`${profile.full_name} – AI Engineer & Data Scientist`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 880px"
                        quality={95}
                        priority
                        className="object-cover object-[center_20%] transition-transform duration-700 ease-out group-hover:scale-105 cursor-pointer"
                        onClick={() => setShowLightbox(true)}
                        title="Click to view full-resolution photo"
                      />

                      {/* Expand / 4K Badge */}
                      <button
                        type="button"
                        onClick={() => setShowLightbox(true)}
                        className="absolute bottom-3 right-3 bg-gray-900/70 hover:bg-gray-900/90 backdrop-blur-md text-white text-[11px] font-semibold py-1.5 px-2.5 rounded-lg flex items-center gap-1.5 transition-all shadow-md group/btn opacity-85 hover:opacity-100"
                        title="View Ultra-HD Master Photo"
                      >
                        <Maximize2 className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                        <span>Ultra-HD</span>
                      </button>
                    </>
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
                {showExperienceBadge && (
                  <div className="absolute -bottom-4 -left-3 sm:-bottom-5 sm:-left-4 bg-white/95 backdrop-blur-md rounded-xl border border-gray-200 p-3 shadow-lg flex items-center gap-3 transition-all animate-in fade-in duration-300">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">{experienceBadgeTitle}</div>
                      <div className="text-[11px] text-slate-500">{experienceBadgeSubtitle}</div>
                    </div>
                  </div>
                )}

                {/* Floating Active Badge */}
                <div className="absolute -top-3 -right-2 bg-white/95 backdrop-blur-md rounded-full border border-gray-200 py-1 px-3 shadow-md flex items-center gap-2">
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

      {/* Ultra-HD Master Resolution Lightbox Modal */}
      {showLightbox && profile.avatar_url && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowLightbox(false)}
        >
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close Preview"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-[min(90vw,800px)] h-[min(85vh,960px)]">
              <Image
                src={profile.avatar_url}
                alt={profile.full_name}
                fill
                sizes="100vw"
                quality={100}
                className="object-contain rounded-xl shadow-2xl"
                priority
              />
            </div>
            <div className="mt-3 text-center text-xs font-medium text-slate-300 flex items-center gap-2">
              <span className="bg-blue-600/80 px-2 py-0.5 rounded text-[11px] font-bold text-white">4K Master Resolution</span>
              <span>{profile.full_name} — Original Studio Portrait</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
