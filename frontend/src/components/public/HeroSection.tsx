"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, FileText, Sparkles, Maximize2, X } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { Profile } from "@/types";
import { resolveMediaUrl } from "@/lib/utils";

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
  const isProfileBadgeEnabled =
    profile.show_experience_badge !== undefined
      ? Boolean(profile.show_experience_badge)
      : true;

  const isConfigBadgeEnabled =
    config.show_experience_badge !== undefined
      ? Boolean(config.show_experience_badge)
      : true;

  // If the admin turned it off in Profile settings OR in the Section Builder, hide it
  const showExperienceBadge = isProfileBadgeEnabled && isConfigBadgeEnabled;

  const experienceBadgeTitle =
    profile.experience_badge_title ||
    config.experience_badge_title ||
    "3+ Years Experience";

  const experienceBadgeSubtitle =
    profile.experience_badge_subtitle ||
    config.experience_badge_subtitle ||
    "AI / ML Production Systems";


  return (
    <section id="hero" className="pt-20 pb-6 sm:pt-28 sm:pb-16 md:pt-36 md:pb-24 bg-white border-b border-gray-100 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 lg:gap-8 items-center">
          {/* 1. Profile Picture card with Active badge (First on mobile, Right on desktop) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end order-1 lg:order-2 mb-2 sm:mb-4 lg:mb-0">
            <div className="relative group w-full max-w-[185px] sm:max-w-[260px] lg:max-w-[420px]">
              {/* Outer executive frame in natural 4:5 portrait ratio */}
              <div className="relative w-full aspect-4/5 rounded-2xl sm:rounded-3xl bg-slate-50 border-2 border-gray-200/80 p-2 sm:p-3 shadow-lg sm:shadow-xl transition-all duration-300 group-hover:border-blue-300 group-hover:shadow-2xl">
                <div className="w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 relative flex items-center justify-center">
                  {profile.avatar_url ? (
                    <>
                      <Image
                        src={resolveMediaUrl(profile.avatar_url)}
                        alt={`${profile.full_name} – AI Engineer & Data Scientist`}
                        fill
                        sizes="(max-width: 640px) 185px, (max-width: 1024px) 260px, 420px"
                        quality={90}
                        priority
                        className="object-cover object-[center_20%] transition-transform duration-700 ease-out group-hover:scale-105 cursor-pointer"
                        onClick={() => setShowLightbox(true)}
                        title="Click to view full-resolution photo"
                      />

                      {/* Expand / 4K Badge */}
                      <button
                        type="button"
                        suppressHydrationWarning
                        onClick={() => setShowLightbox(true)}
                        className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 bg-gray-900/70 hover:bg-gray-900/90 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-semibold py-1 px-2 sm:py-1.5 sm:px-2.5 rounded-md sm:rounded-lg flex items-center gap-1 sm:gap-1.5 transition-all shadow-md group/btn opacity-85 hover:opacity-100"
                        title="View Ultra-HD Master Photo"
                      >
                        <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover/btn:scale-110 transition-transform" />
                        <span>Ultra-HD</span>
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-blue-600 to-indigo-700 text-white flex flex-col items-center justify-center p-4 sm:p-6 text-center">
                      <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-xl sm:text-3xl font-extrabold tracking-tight mb-2 sm:mb-3">
                        {profile.full_name ? profile.full_name.substring(0, 2).toUpperCase() : "RA"}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold tracking-wide text-white/90">
                        {profile.full_name}
                      </span>
                      <span className="text-[10px] sm:text-xs text-blue-200 mt-0.5 sm:mt-1">
                        AI Engineer
                      </span>
                    </div>
                  )}
                </div>

                {/* Floating Experience Badge */}
                {showExperienceBadge && (
                  <div className="absolute -bottom-3 left-1.5 sm:-bottom-4 sm:-left-3 bg-white/95 backdrop-blur-md rounded-xl border border-gray-200 p-1.5 sm:p-2.5 shadow-md flex items-center gap-1.5 sm:gap-2.5 transition-all animate-in fade-in duration-300">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] sm:text-xs font-bold text-gray-900 leading-tight">{experienceBadgeTitle}</div>
                      <div className="hidden sm:block text-[10px] text-slate-500">{experienceBadgeSubtitle}</div>
                    </div>
                  </div>
                )}

                {/* Floating Active Badge */}
                <div className="absolute -top-2 right-1.5 sm:-top-2.5 sm:right-2 bg-white/95 backdrop-blur-md rounded-full border border-gray-200 py-0.5 px-2.5 sm:px-3 shadow-md flex items-center gap-1 sm:gap-1.5">
                  <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-gray-800">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Text Content Column (Shown SECOND on mobile, LEFT on desktop) */}
          <div className="lg:col-span-7 order-2 lg:order-1 text-center sm:text-left">
            {/* Status Badge */}
            {badgeText && (
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 sm:mb-6 rounded-full bg-slate-50 border border-gray-200 text-xs font-medium text-slate-700 shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>{badgeText}</span>
              </div>
            )}

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-[1.15]">
              Hi, I&apos;m <span className="text-blue-600">{profile.full_name}</span>.
            </h1>

            {/* Title */}
            <p className="mt-2.5 sm:mt-4 text-base sm:text-2xl font-medium text-slate-700 tracking-tight leading-snug">
              {profile.headline}
            </p>

            {/* Whole Bio Summary (Full content showcased) */}
            <p className="mt-3 sm:mt-5 text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto sm:mx-0">
              {config.hero_bio || profile.bio || "Engineering intelligent, reliable AI architectures, multi-agent RAG pipelines, and scalable Machine Learning systems that bridge research and enterprise production."}
            </p>

            {/* Primary & Secondary CTA buttons + Recruiter Quick Access */}
            <div className="mt-3.5 sm:mt-8 flex flex-wrap items-center gap-2.5 sm:gap-3 justify-center sm:justify-start">
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <Link
                  href={ctaPrimaryLink}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 sm:px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 shadow-xs transition-all active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4 mr-2 shrink-0" />
                  {ctaPrimary}
                </Link>

                <Link
                  href="/resume"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 sm:px-5 py-2.5 rounded-lg border border-blue-200 bg-blue-50/90 text-blue-700 font-semibold text-sm hover:bg-blue-100 hover:border-blue-300 shadow-2xs transition-all active:scale-[0.98]"
                >
                  <FileText className="w-4 h-4 mr-2 text-blue-600 shrink-0" />
                  View Resume
                </Link>

                {ctaSecondaryLink !== "/resume" && (
                  <Link
                    href={ctaSecondaryLink}
                    className="hidden lg:inline-flex items-center justify-center px-4 sm:px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 font-medium text-sm hover:bg-slate-50 hover:border-gray-400 shadow-2xs transition-all active:scale-[0.98]"
                  >
                    {ctaSecondary}
                  </Link>
                )}
              </div>

              {/* Social links */}
              <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-gray-200 pt-2.5 sm:pt-0 sm:pl-3 w-full sm:w-auto justify-center sm:justify-start">
                {profile.github_url && (
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 sm:p-2 text-slate-500 hover:text-gray-900 hover:bg-slate-100 rounded-lg transition-colors"
                    aria-label="GitHub Profile"
                  >
                    <GithubIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                )}
                {profile.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 sm:p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                    aria-label="LinkedIn Profile"
                  >
                    <LinkedinIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                )}
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="p-1.5 sm:p-2 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors"
                    aria-label="Send Email"
                  >
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                )}
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
            type="button"
            suppressHydrationWarning
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
                src={resolveMediaUrl(profile.avatar_url)}
                alt={profile.full_name}
                fill
                sizes="(max-width: 800px) 90vw, 800px"
                quality={95}
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
