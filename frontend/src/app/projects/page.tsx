import { publicApi } from "@/services/publicApi";
import { Navbar } from "@/components/public/Navbar";
import { ProjectCard } from "@/components/public/ProjectCard";
import { Footer } from "@/components/public/Footer";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";



export default async function ProjectsPage() {
  const [profile, projects, navItems, footerSetting] = await Promise.all([
    publicApi.getProfile().catch(() => ({
      full_name: "Raj Antala",
      resume_file_url: "/resume",
    } as any)),
    publicApi.getProjects().catch(() => []),
    publicApi.getNavigation("header").catch(() => []),
    publicApi.getFooter().catch(() => undefined),
  ]);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Navbar items={navItems} resumeUrl={profile.resume_file_url || "/resume"} avatarUrl={profile.avatar_url} />

      <main className="flex-1 pt-32 pb-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 block">
            Portfolio Archive
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
            All AI & Engineering Projects
          </h1>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            A comprehensive catalog of autonomous agent architectures, computer vision systems, financial document models, and parameter-efficient LLMs engineered by Raj Antala.
          </p>
        </div>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center border border-gray-200 rounded-lg bg-slate-50">
            <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-3" />
            <div className="text-sm font-semibold text-gray-900">No projects currently available</div>
            <div className="text-xs text-slate-500 mt-1">Check back soon for new case studies.</div>
          </div>
        )}
      </main>

      <Footer setting={footerSetting} navItems={navItems} profile={profile} />
    </div>
  );
}
