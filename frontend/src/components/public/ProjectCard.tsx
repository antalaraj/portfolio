import Link from "next/link";
import { ExternalLink, ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-2xs hover:shadow-xs hover:border-gray-300 transition-all flex flex-col group">
      {/* 16:9 Thumbnail Header */}
      <div className="relative aspect-video w-full bg-slate-100 overflow-hidden border-b border-gray-100">
        {project.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-mono">
            No preview image
          </div>
        )}

        {project.is_featured && (
          <span className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white rounded shadow-xs">
            Featured
          </span>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Tech Tag Pills */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.technologies?.slice(0, 4).map((tech) => (
              <span
                key={tech.id}
                className="px-2 py-0.5 text-[11px] font-medium rounded bg-slate-50 border border-gray-200 text-slate-600"
              >
                {tech.name}
              </span>
            ))}
            {project.technologies && project.technologies.length > 4 && (
              <span className="px-1.5 py-0.5 text-[11px] font-medium rounded bg-slate-50 text-slate-400">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            <Link href={`/projects/${project.slug}`}>
              {project.title}
            </Link>
          </h3>

          <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
            {project.short_description}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Read Case Study
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>

          <div className="flex items-center gap-2">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-slate-500 hover:text-gray-900 hover:bg-slate-100 rounded transition-colors"
                aria-label="GitHub Repository"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            )}
            {project.live_demo_url && (
              <a
                href={project.live_demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
                aria-label="Live Demo"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
