import { fetchApi } from "./api";
import {
  ApiResponse,
  Profile,
  PageData,
  PageSection,
  Project,
  Skill,
  SkillCategory,
  Experience,
  Education,
  Certification,
  Testimonial,
  NavigationItem,
  FooterSetting,
  SiteSetting,
  SEOMetadata,
  ContactMessage,
  AnalyticsOverview,
  User,
} from "@/types";

export const adminApi = {
  // Auth
  getCsrf: () => fetchApi<{ success: boolean; csrfToken: string }>("/auth/csrf/"),
  login: (credentials: { username: string; password: string }) =>
    fetchApi<ApiResponse<{ user: User }>>("/auth/login/", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  logout: () =>
    fetchApi<ApiResponse<null>>("/auth/logout/", {
      method: "POST",
    }),
  getMe: () => fetchApi<ApiResponse<{ user: User }>>("/auth/me/"),

  // Analytics Overview
  getAnalyticsOverview: () => fetchApi<ApiResponse<AnalyticsOverview>>("/admin/analytics/overview/"),

  // Profile
  getProfile: () => fetchApi<ApiResponse<Profile>>("/admin/profile/"),
  updateProfile: (data: Partial<Profile>) =>
    fetchApi<ApiResponse<Profile>>("/admin/profile/", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Dynamic Pages & Builder
  getPages: () => fetchApi<ApiResponse<PageData[]>>("/admin/pages/"),
  getPage: (id: string) => fetchApi<ApiResponse<PageData>>(`/admin/pages/${id}/`),
  updatePage: (id: string, data: Partial<PageData>) =>
    fetchApi<ApiResponse<PageData>>(`/admin/pages/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  getSections: (pageSlug?: string) =>
    fetchApi<ApiResponse<PageSection[]>>("/admin/sections/", {
      params: pageSlug ? { page_slug: pageSlug } : undefined,
    }),
  createSection: (data: Partial<PageSection>) =>
    fetchApi<ApiResponse<PageSection>>("/admin/sections/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateSection: (id: string, data: Partial<PageSection>) =>
    fetchApi<ApiResponse<PageSection>>(`/admin/sections/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteSection: (id: string) =>
    fetchApi<void>(`/admin/sections/${id}/`, {
      method: "DELETE",
    }),
  reorderSections: (order: { id: string; display_order: number }[]) =>
    fetchApi<ApiResponse<null>>("/admin/pages/reorder-sections/", {
      method: "POST",
      body: JSON.stringify({ order }),
    }),

  // Projects CRUD
  getProjects: () => fetchApi<ApiResponse<Project[]>>("/admin/projects/"),
  getProject: (id: string) => fetchApi<ApiResponse<Project>>(`/admin/projects/${id}/`),
  createProject: (data: Partial<Project>) =>
    fetchApi<ApiResponse<Project>>("/admin/projects/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateProject: (id: string, data: Partial<Project>) =>
    fetchApi<ApiResponse<Project>>(`/admin/projects/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteProject: (id: string) =>
    fetchApi<void>(`/admin/projects/${id}/`, {
      method: "DELETE",
    }),

  // Skills CRUD
  getSkillCategories: () => fetchApi<ApiResponse<SkillCategory[]>>("/admin/skill-categories/"),
  createSkillCategory: (data: Partial<SkillCategory>) =>
    fetchApi<ApiResponse<SkillCategory>>("/admin/skill-categories/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateSkillCategory: (id: string, data: Partial<SkillCategory>) =>
    fetchApi<ApiResponse<SkillCategory>>(`/admin/skill-categories/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteSkillCategory: (id: string) =>
    fetchApi<void>(`/admin/skill-categories/${id}/`, {
      method: "DELETE",
    }),

  getSkills: () => fetchApi<ApiResponse<Skill[]>>("/admin/skills/"),
  createSkill: (data: Partial<Skill>) =>
    fetchApi<ApiResponse<Skill>>("/admin/skills/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateSkill: (id: string, data: Partial<Skill>) =>
    fetchApi<ApiResponse<Skill>>(`/admin/skills/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteSkill: (id: string) =>
    fetchApi<void>(`/admin/skills/${id}/`, {
      method: "DELETE",
    }),

  // Experience CRUD
  getExperience: () => fetchApi<ApiResponse<Experience[]>>("/admin/experience/"),
  createExperience: (data: Partial<Experience>) =>
    fetchApi<ApiResponse<Experience>>("/admin/experience/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateExperience: (id: string, data: Partial<Experience>) =>
    fetchApi<ApiResponse<Experience>>(`/admin/experience/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteExperience: (id: string) =>
    fetchApi<void>(`/admin/experience/${id}/`, {
      method: "DELETE",
    }),

  // Education CRUD
  getEducation: () => fetchApi<ApiResponse<Education[]>>("/admin/education/"),
  createEducation: (data: Partial<Education>) =>
    fetchApi<ApiResponse<Education>>("/admin/education/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateEducation: (id: string, data: Partial<Education>) =>
    fetchApi<ApiResponse<Education>>(`/admin/education/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteEducation: (id: string) =>
    fetchApi<void>(`/admin/education/${id}/`, {
      method: "DELETE",
    }),

  // Certifications CRUD
  getCertifications: () => fetchApi<ApiResponse<Certification[]>>("/admin/certifications/"),
  createCertification: (data: Partial<Certification>) =>
    fetchApi<ApiResponse<Certification>>("/admin/certifications/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateCertification: (id: string, data: Partial<Certification>) =>
    fetchApi<ApiResponse<Certification>>(`/admin/certifications/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteCertification: (id: string) =>
    fetchApi<void>(`/admin/certifications/${id}/`, {
      method: "DELETE",
    }),

  // Testimonials CRUD
  getTestimonials: () => fetchApi<ApiResponse<Testimonial[]>>("/admin/testimonials/"),
  createTestimonial: (data: Partial<Testimonial>) =>
    fetchApi<ApiResponse<Testimonial>>("/admin/testimonials/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateTestimonial: (id: string, data: Partial<Testimonial>) =>
    fetchApi<ApiResponse<Testimonial>>(`/admin/testimonials/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteTestimonial: (id: string) =>
    fetchApi<void>(`/admin/testimonials/${id}/`, {
      method: "DELETE",
    }),

  // Navigation CRUD
  getNavigation: () => fetchApi<ApiResponse<NavigationItem[]>>("/admin/navigation/"),
  createNavigation: (data: Partial<NavigationItem>) =>
    fetchApi<ApiResponse<NavigationItem>>("/admin/navigation/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateNavigation: (id: string, data: Partial<NavigationItem>) =>
    fetchApi<ApiResponse<NavigationItem>>(`/admin/navigation/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteNavigation: (id: string) =>
    fetchApi<void>(`/admin/navigation/${id}/`, {
      method: "DELETE",
    }),

  // Footer
  getFooter: () => fetchApi<ApiResponse<FooterSetting>>("/admin/footer/"),
  updateFooter: (data: Partial<FooterSetting>) =>
    fetchApi<ApiResponse<FooterSetting>>("/admin/footer/", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Settings
  getSettings: () => fetchApi<ApiResponse<SiteSetting>>("/admin/settings/"),
  updateSettings: (data: Partial<SiteSetting>) =>
    fetchApi<ApiResponse<SiteSetting>>("/admin/settings/", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Contact Inquiries
  getContactMessages: (params?: { is_read?: boolean; is_archived?: boolean; q?: string }) =>
    fetchApi<ApiResponse<ContactMessage[]>>("/admin/contact/", { params }),
  updateContactMessage: (id: string, data: Partial<ContactMessage>) =>
    fetchApi<ApiResponse<ContactMessage>>(`/admin/contact/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteContactMessage: (id: string) =>
    fetchApi<void>(`/admin/contact/${id}/`, {
      method: "DELETE",
    }),

  // SEO
  getSEOMetadata: () => fetchApi<ApiResponse<SEOMetadata[]>>("/admin/seo/"),
  updateSEOMetadata: (id: string, data: Partial<SEOMetadata>) =>
    fetchApi<ApiResponse<SEOMetadata>>(`/admin/seo/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Media Upload
  uploadMedia: async (file: File, title?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (title) formData.append("title", title);

    const match = typeof document !== "undefined" ? document.cookie.match(/csrftoken=([^;]+)/) : null;
    const headers: Record<string, string> = {};
    if (match) headers["X-CSRFToken"] = match[1];

    const baseUrl = typeof window !== "undefined"
      ? "/api/v1"
      : (process.env.INTERNAL_API_URL ? `${process.env.INTERNAL_API_URL.replace(/\/$/, "")}/api/v1` : "http://127.0.0.1:8000/api/v1");

    const res = await fetch(`${baseUrl}/admin/media/upload/`, {
      method: "POST",
      body: formData,
      credentials: "include",
      headers,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error?.message || data.detail || `Upload failed with status ${res.status}`);
    }
    return data;
  },
  getMedia: () => fetchApi<ApiResponse<any[]>>("/admin/media/"),
  deleteMedia: (id: string) =>
    fetchApi<void>(`/admin/media/${id}/`, {
      method: "DELETE",
    }),
};
