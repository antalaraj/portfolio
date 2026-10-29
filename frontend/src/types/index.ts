export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
  total_pages?: number;
  current_page?: number;
  next?: string | null;
  previous?: string | null;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface Profile {
  id: string;
  full_name: string;
  headline: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  availability_status: string;
  avatar_url: string;
  resume_file_url: string;
  experience_badge_title?: string;
  experience_badge_subtitle?: string;
  show_experience_badge?: boolean;
}

export interface PageSection {
  id: string;
  section_type: 'hero' | 'about' | 'skills' | 'projects' | 'experience' | 'education' | 'certifications' | 'testimonials' | 'contact' | 'custom';
  title: string;
  subtitle: string;
  display_order: number;
  is_active?: boolean;
  config_data: Record<string, any>;
}

export interface PageData {
  id: string;
  title: string;
  slug: string;
  description: string;
  sections: PageSection[];
}

export interface TechTag {
  id: string;
  name: string;
  category: string;
}

export interface ProjectGalleryImage {
  id: string;
  image_url: string;
  caption: string;
  display_order: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description?: string;
  thumbnail_url: string;
  github_url: string;
  live_demo_url: string;
  technologies: TechTag[];
  technology_ids?: string[];
  gallery_images?: ProjectGalleryImage[];
  is_featured: boolean;
  display_order: number;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
}

export interface Skill {
  id: string;
  category?: string;
  category_name?: string;
  name: string;
  proficiency: number;
  icon_name: string;
  display_order: number;
  is_visible: boolean;
}

export interface SkillCategory {
  id: string;
  name: string;
  slug: string;
  display_order?: number;
  skills?: Skill[];
  skills_count?: number;
}

export interface Experience {
  id: string;
  company: string;
  job_title: string;
  employment_type: string;
  location: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string;
  responsibilities: string[];
  display_order: number;
  status: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string | null;
  grade: string;
  description: string;
  display_order: number;
  status: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  credential_url: string;
  certificate_image_url: string;
  display_order: number;
  status: string;
}

export interface Testimonial {
  id: string;
  author_name: string;
  designation: string;
  company: string;
  quote: string;
  avatar_url: string;
  is_approved: boolean;
  display_order: number;
}

export interface NavigationItem {
  id: string;
  label: string;
  destination: string;
  is_external: boolean;
  menu_location: 'header' | 'footer' | 'both';
  display_order: number;
  is_active: boolean;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface FooterSetting {
  id: string;
  description: string;
  copyright_text: string;
  is_visible: boolean;
  social_links: SocialLink[];
}

export interface SiteSetting {
  site_title: string;
  primary_email: string;
  maintenance_mode: boolean;
  resume_download_enabled: boolean;
}

export interface SEOMetadata {
  id?: string;
  page_identifier: string;
  title: string;
  meta_description: string;
  keywords: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image_url: string;
  robots_directive: string;
}

export interface ContactMessage {
  id: string;
  sender_name: string;
  sender_email: string;
  subject: string;
  message: string;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
}

export interface AnalyticsOverview {
  metrics: {
    total_views: number;
    unique_visitors: number;
    monthly_views: number;
    today_views?: number;
    views_growth_pct?: number;
    visitors_growth_pct?: number;
    unread_messages: number;
    total_messages: number;
    total_projects: number;
    published_projects: number;
    total_skills: number;
    published_pages: number;
    resume_downloads?: number;
  };
  traffic_history: { date: string; views: number; visitors?: number }[];
  popular_paths: { path: string; visits: number; percentage?: number }[];
  top_referrers?: { name: string; count: number }[];
  device_breakdown?: { device: string; count: number }[];
  recent_activity?: {
    id: number;
    path: string;
    event_type: string;
    referrer: string;
    device: string;
    time_ago: string;
    timestamp: string;
  }[];
}


export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
}
