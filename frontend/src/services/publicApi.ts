import { fetchApi } from "./api";
import {
  ApiResponse,
  Profile,
  PageData,
  Project,
  SkillCategory,
  Experience,
  Education,
  Certification,
  Testimonial,
  NavigationItem,
  FooterSetting,
  SiteSetting,
  SEOMetadata,
} from "@/types";

export const publicApi = {
  getProfile: async (): Promise<Profile> => {
    const res = await fetchApi<ApiResponse<Profile>>("/public/profile/", {
      next: { revalidate: 60, tags: ["profile"] },
    });
    return res.data;
  },

  getSettings: async (): Promise<SiteSetting> => {
    const res = await fetchApi<ApiResponse<SiteSetting>>("/public/settings/", {
      next: { revalidate: 60, tags: ["settings"] },
    });
    return res.data;
  },

  getNavigation: async (location: "header" | "footer" = "header"): Promise<NavigationItem[]> => {
    const res = await fetchApi<ApiResponse<NavigationItem[]>>("/public/navigation/", {
      params: { location },
      next: { revalidate: 60, tags: ["navigation"] },
    });
    return res.data;
  },

  getFooter: async (): Promise<FooterSetting> => {
    const res = await fetchApi<ApiResponse<FooterSetting>>("/public/footer/", {
      next: { revalidate: 60, tags: ["footer"] },
    });
    return res.data;
  },

  getPage: async (slug: string): Promise<PageData> => {
    const res = await fetchApi<ApiResponse<PageData>>(`/public/pages/${slug}/`, {
      next: { revalidate: 60, tags: [`page-${slug}`] },
    });
    return res.data;
  },

  getProjects: async (params?: { featured?: boolean; tech?: string; q?: string }): Promise<Project[]> => {
    const res = await fetchApi<ApiResponse<Project[]>>("/public/projects/", {
      params,
      next: { revalidate: 60, tags: ["projects"] },
    });
    return res.data;
  },

  getProjectBySlug: async (slug: string): Promise<Project> => {
    const res = await fetchApi<ApiResponse<Project>>(`/public/projects/${slug}/`, {
      next: { revalidate: 60, tags: [`project-${slug}`] },
    });
    return res.data;
  },

  getSkills: async (): Promise<SkillCategory[]> => {
    const res = await fetchApi<ApiResponse<SkillCategory[]>>("/public/skills/", {
      next: { revalidate: 60, tags: ["skills"] },
    });
    return res.data;
  },

  getExperience: async (): Promise<Experience[]> => {
    const res = await fetchApi<ApiResponse<Experience[]>>("/public/experience/", {
      next: { revalidate: 60, tags: ["experience"] },
    });
    return res.data;
  },

  getEducation: async (): Promise<Education[]> => {
    const res = await fetchApi<ApiResponse<Education[]>>("/public/education/", {
      next: { revalidate: 60, tags: ["education"] },
    });
    return res.data;
  },

  getCertifications: async (): Promise<Certification[]> => {
    const res = await fetchApi<ApiResponse<Certification[]>>("/public/certifications/", {
      next: { revalidate: 60, tags: ["certifications"] },
    });
    return res.data;
  },

  getTestimonials: async (): Promise<Testimonial[]> => {
    const res = await fetchApi<ApiResponse<Testimonial[]>>("/public/testimonials/", {
      next: { revalidate: 60, tags: ["testimonials"] },
    });
    return res.data;
  },

  getSEO: async (pageIdentifier: string = "global"): Promise<SEOMetadata> => {
    const res = await fetchApi<ApiResponse<SEOMetadata>>(`/public/seo/${pageIdentifier}/`, {
      next: { revalidate: 60, tags: [`seo-${pageIdentifier}`] },
    });
    return res.data;
  },

  submitContact: async (data: { name: string; email: string; subject: string; message: string }) => {
    return fetchApi<ApiResponse<{ id: string }>>("/public/contact/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  trackEvent: async (path: string, referrer?: string) => {
    try {
      await fetchApi("/public/analytics/event/", {
        method: "POST",
        body: JSON.stringify({ path, referrer }),
      });
    } catch {
      // Non-blocking telemetry
    }
  },
};
