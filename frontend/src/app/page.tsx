import { publicApi } from "@/services/publicApi";
import { Navbar } from "@/components/public/Navbar";
import { HeroSection } from "@/components/public/HeroSection";
import { AboutSection } from "@/components/public/AboutSection";
import { SkillsGrid } from "@/components/public/SkillsGrid";
import { ProjectCard } from "@/components/public/ProjectCard";
import { ExperienceTimeline } from "@/components/public/ExperienceTimeline";
import { EducationSection } from "@/components/public/EducationCard";
import { CertificationSection } from "@/components/public/CertificationCard";
import { TestimonialSection } from "@/components/public/TestimonialSection";
import { ContactSection } from "@/components/public/ContactForm";
import { Footer } from "@/components/public/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";


export default async function HomePage() {
  // Gracefully fetch all dynamic data from Django backend
  const [
    profile,
    homePageData,
    projects,
    skills,
    experience,
    education,
    certifications,
    testimonials,
    navigationItems,
    footerSetting,
  ] = await Promise.all([
    publicApi.getProfile().catch(() => ({
      id: "1",
      full_name: "Raj Antala",
      headline: "AI Engineer | Data Science | Generative AI",
      bio: "Engineering intelligent, reliable AI architectures, multi-agent RAG pipelines, and scalable Machine Learning systems that bridge research and enterprise production.",
      email: "contact@rajantala.com",
      phone: "+91 98765 43210",
      location: "India",
      github_url: "https://github.com/rajantala",
      linkedin_url: "https://linkedin.com/in/rajantala",
      twitter_url: "",
      availability_status: "Available for AI / ML Roles & Projects",
      avatar_url: "",
      resume_file_url: "/resume",
    })),
    publicApi.getPage("home").catch(() => null),
    publicApi.getProjects({ featured: true }).catch(() => []),
    publicApi.getSkills().catch(() => []),
    publicApi.getExperience().catch(() => []),
    publicApi.getEducation().catch(() => []),
    publicApi.getCertifications().catch(() => []),
    publicApi.getTestimonials().catch(() => []),
    publicApi.getNavigation("header").catch(() => []),
    publicApi.getFooter().catch(() => undefined),
  ]);

  // Section lookup map from dynamic builder
  const sections = homePageData?.sections || [];
  const getSection = (type: string) => sections.find((s) => s.section_type === type);

  const heroConfig = getSection("hero")?.config_data || {};
  const aboutConfig = getSection("about")?.config_data || {};
  const projectsSection = getSection("projects");
  const experienceSection = getSection("experience");
  const educationSection = getSection("education");
  const certSection = getSection("certifications");
  const testSection = getSection("testimonials");
  const contactSection = getSection("contact");

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Navbar items={navigationItems} resumeUrl={profile.resume_file_url || "/resume"} />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection profile={profile} config={heroConfig} />

        {/* About Section */}
        <AboutSection profile={profile} config={aboutConfig} />

        {/* Skills Section */}
        {skills.length > 0 && (
          <SkillsGrid
            categories={skills}
            title={getSection("skills")?.title || "Technical Expertise"}
            subtitle={getSection("skills")?.subtitle || "Core competencies across Machine Learning, Engineering, and Cloud."}
          />
        )}

        {/* Featured Projects Section */}
        {projects.length > 0 && (
          <section id="projects" className="py-20 md:py-28 bg-white border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 block">
                    Portfolio
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                    {projectsSection?.title || "Featured Projects"}
                  </h2>
                  <p className="mt-3 text-slate-600 text-base leading-relaxed max-w-xl">
                    {projectsSection?.subtitle || "Selected AI, Machine Learning, and Deep Learning Applications."}
                  </p>
                </div>
                <Link
                  href="/projects"
                  className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  View All Projects
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.slice(0, 6).map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Experience Section */}
        {experience.length > 0 && (
          <ExperienceTimeline
            items={experience}
            title={experienceSection?.title || "Work Experience & Internships"}
            subtitle={experienceSection?.subtitle || "Professional journey building scalable AI solutions."}
          />
        )}

        {/* Education Section */}
        {education.length > 0 && (
          <EducationSection
            items={education}
            title={educationSection?.title || "Education & Academics"}
            subtitle={educationSection?.subtitle || "Academic foundation in Computer Science and Artificial Intelligence."}
          />
        )}

        {/* Certifications Section */}
        {certifications.length > 0 && (
          <CertificationSection
            items={certifications}
            title={certSection?.title || "Licenses & Certifications"}
            subtitle={certSection?.subtitle || "Verified credentials and specialized industry certifications."}
          />
        )}

        {/* Testimonials Section */}
        {testimonials.length > 0 && (
          <TestimonialSection
            items={testimonials}
            title={testSection?.title || "Endorsements & Recommendations"}
            subtitle={testSection?.subtitle || "What mentors, colleagues, and team leads say."}
          />
        )}

        {/* Contact Section */}
        <ContactSection
          profile={profile}
          title={contactSection?.title || "Get in Touch"}
          subtitle={contactSection?.subtitle || "Have an exciting AI project, research opportunity, or full-time position? Send a message."}
          config={contactSection?.config_data}
        />
      </main>

      <Footer setting={footerSetting} navItems={navigationItems} />
    </div>
  );
}
