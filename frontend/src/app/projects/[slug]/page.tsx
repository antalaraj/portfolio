import { publicApi } from "@/services/publicApi";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Calendar, CheckCircle2 } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { formatDate } from "@/lib/utils";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;

  const [project, profile, navItems, footerSetting] = await Promise.all([
    publicApi.getProjectBySlug(slug).catch(() => null),
    publicApi.getProfile().catch(() => ({
      full_name: "Raj Antala",
      resume_file_url: "/resume",
    } as any)),
    publicApi.getNavigation("header").catch(() => []),
    publicApi.getFooter().catch(() => undefined),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Navbar items={navItems} resumeUrl={profile.resume_file_url || "/resume"} />

      <main className="flex-1 pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Projects Archive
          </Link>
        </div>

        {/* Project Header */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {project.technologies?.map((tech) => (
              <span
                key={tech.id}
                className="px-2.5 py-0.5 text-xs font-medium rounded bg-blue-50 text-blue-700 border border-blue-200"
              >
                {tech.name}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
            {project.title}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {project.short_description}
          </p>

          {/* Action Links */}
          <div className="mt-6 flex flex-wrap items-center gap-3 pt-6 border-t border-gray-100">
            {project.live_demo_url && (
              <a
                href={project.live_demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 text-white font-medium text-xs hover:bg-blue-700 shadow-2xs transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                Launch Live Demo
              </a>
            )}

            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-800 font-medium text-xs hover:bg-slate-50 shadow-2xs transition-all"
              >
                <GithubIcon className="w-3.5 h-3.5 mr-1.5" />
                View Source Code
              </a>
            )}
          </div>
        </div>

        {/* Hero Image */}
        {project.thumbnail_url && (
          <div className="mt-10 rounded-xl overflow-hidden border border-gray-200 shadow-2xs aspect-video bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.thumbnail_url}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Case Study Full Narrative */}
        <article className="mt-12 prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600">
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-2xs whitespace-pre-line text-sm sm:text-base leading-relaxed text-slate-700">
            {project.full_description || project.short_description}
          </div>
        </article>

        {/* Gallery Images if available */}
        {project.gallery_images && project.gallery_images.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Architecture & Screenshots</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.gallery_images.map((img) => (
                <div key={img.id} className="rounded-lg overflow-hidden border border-gray-200 shadow-2xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.image_url} alt={img.caption || project.title} className="w-full h-48 object-cover" />
                  {img.caption && (
                    <div className="p-2 text-xs text-slate-500 bg-slate-50 border-t border-gray-100">
                      {img.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer setting={footerSetting} navItems={navItems} />
    </div>
  );
}
