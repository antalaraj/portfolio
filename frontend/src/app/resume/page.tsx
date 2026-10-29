import { publicApi } from "@/services/publicApi";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { PdfDocumentViewer } from "@/components/public/PdfDocumentViewer";
import Link from "next/link";
import { ArrowLeft, Download, ExternalLink, FileText, Sparkles, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function resolveMediaUrl(url?: string): string {
  if (!url) return "";
  return url.replace(/^https?:\/\/(127\.0\.0\.1|localhost):8000(\/media\/.*)$/, "$2");
}

export default async function ResumePage() {
  const [profile, navItems, footerSetting] = await Promise.all([
    publicApi.getProfile().catch(() => ({
      full_name: "Raj Antala",
      headline: "AI Engineer | Data Science | Generative AI",
      resume_file_url: "",
    } as any)),
    publicApi.getNavigation("header").catch(() => []),
    publicApi.getFooter().catch(() => undefined),
  ]);

  const hasResume = Boolean(profile.resume_file_url && profile.resume_file_url.trim().length > 0);

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 flex flex-col">
      <Navbar items={navItems} resumeUrl="/resume" avatarUrl={profile.avatar_url} />

      <main className="flex-1 pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Bold Header & Action Controls */}
        <div className="mb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                href="/"
                className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors mr-1"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Home
              </Link>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Curriculum Vitae
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900">
              {profile.full_name}
            </h1>
            <p className="mt-1 text-xs sm:text-sm font-medium text-slate-600">
              {profile.headline}
            </p>
          </div>

          {hasResume && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
              <a
                href={resolveMediaUrl(profile.resume_file_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-gray-300 text-slate-700 hover:bg-slate-50 hover:text-blue-600 hover:border-gray-400 shadow-2xs transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                Open Fullscreen
              </a>

              <a
                href={resolveMediaUrl(profile.resume_file_url)}
                download={`${(profile.full_name || "Raj_Antala").replace(/\s+/g, "_")}_Resume.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-5 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/25 transition-all"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Download PDF Resume
              </a>
            </div>
          )}
        </div>

        {/* Bezel-Less White Border PDF Showcase */}
        {hasResume ? (
          <div className="w-full">
            <PdfDocumentViewer
              url={resolveMediaUrl(profile.resume_file_url)}
              title={`${profile.full_name} Resume`}
            />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 sm:p-16 text-center max-w-2xl mx-auto shadow-2xs">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Resume Document Being Updated
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
              The official PDF resume will be uploaded by the administrator shortly. In the meantime, you can review technical skills and project case studies directly on the portfolio.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                View Projects Portfolio
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-md border border-gray-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Get in Touch Directly
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer setting={footerSetting} navItems={navItems} profile={profile} />
    </div>
  );
}
