import datetime
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.profiles.models import Profile
from apps.pages.models import Page, PageSection, SectionType
from apps.projects.models import Project, TechTag
from apps.skills.models import SkillCategory, Skill
from apps.experience.models import Experience
from apps.education.models import Education
from apps.certifications.models import Certification
from apps.testimonials.models import Testimonial
from apps.navigation.models import NavigationItem
from apps.footer.models import FooterSetting
from apps.seo.models import SEOMetadata
from apps.site_settings.models import SiteSetting
from apps.core.models import PublishableStatus

User = get_user_model()

class Command(BaseCommand):
    help = "Seeds the database with initial portfolio structure and content for Raj Antala"

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Beginning portfolio data seeding..."))

        # 1. Super Admin Account
        admin_user, created = User.objects.get_or_create(
            username="rajantala",
            defaults={
                "email": "admin@rajantala.com",
                "first_name": "Raj",
                "last_name": "Antala",
                "is_staff": True,
                "is_superuser": True
            }
        )
        if created:
            admin_user.set_password("RajPortfolio2026!")
            admin_user.save()
            self.stdout.write(self.style.SUCCESS("[OK] SuperAdmin user 'rajantala' created."))
        else:
            self.stdout.write(self.style.NOTICE("[OK] SuperAdmin user 'rajantala' already exists."))

        # 2. Profile Management
        profile, _ = Profile.objects.get_or_create(
            id="00000000-0000-0000-0000-000000000001",
            defaults={
                "full_name": "Raj Antala",
                "headline": "AI Engineer | Data Science | Generative AI",
                "bio": (
                    "I am a forward-looking AI Engineer and Data Scientist driven by the challenge of transforming "
                    "complex machine learning research into robust, high-performance production systems. Specializing in "
                    "Large Language Model architectures, Retrieval-Augmented Generation (RAG), and scalable deep learning pipelines, "
                    "I design intelligent software solutions that bridge cutting-edge theory with enterprise reliability."
                ),
                "email": "contact@rajantala.com",
                "phone": "+91 98765 43210",
                "location": "Ahmedabad, Gujarat, India",
                "github_url": "https://github.com/rajantala",
                "linkedin_url": "https://linkedin.com/in/rajantala",
                "availability_status": "Open to AI & Machine Learning Opportunities",
                "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
                "resume_file_url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
            }
        )
        self.stdout.write(self.style.SUCCESS("[OK] Personal Profile record seeded."))

        # 3. Dynamic Homepage & Builder Sections
        home_page, _ = Page.objects.get_or_create(
            slug="home",
            defaults={
                "title": "Home",
                "description": "Raj Antala — AI Engineer & Data Scientist Portfolio",
                "status": PublishableStatus.PUBLISHED,
                "published_at": datetime.datetime.now(datetime.timezone.utc)
            }
        )

        sections_data = [
            (SectionType.HERO, "Hero Section", "AI Engineer | Data Science | Generative AI", 1, {
                "badge_text": "Available for AI / ML Roles & Projects",
                "cta_primary_label": "Explore AI Projects",
                "cta_primary_link": "/#projects",
                "cta_secondary_label": "Download Resume",
                "cta_secondary_link": "/resume"
            }),
            (SectionType.ABOUT, "About Me", "Engineering Intelligent, Scalable Systems", 2, {
                "career_focus": "Generative AI, Large Language Models, Multi-Agent Orchestration, and Computer Vision",
                "years_experience": "Aspiring AI Specialist & Data Scientist",
                "core_philosophy": "Building reliable systems with rigorous evaluation, clean architectures, and ethical AI safeguards."
            }),
            (SectionType.SKILLS, "Technical Expertise", "Core competencies across Machine Learning, Engineering, and Cloud", 3, {}),
            (SectionType.PROJECTS, "Featured Projects", "Selected AI, Machine Learning, and Deep Learning Applications", 4, {
                "max_display": 6
            }),
            (SectionType.EXPERIENCE, "Work Experience & Internships", "Professional journey building scalable AI solutions", 5, {}),
            (SectionType.EDUCATION, "Education & Academics", "Academic foundation in Computer Science and Artificial Intelligence", 6, {}),
            (SectionType.CERTIFICATIONS, "Licenses & Certifications", "Verified credentials and specialized industry certifications", 7, {}),
            (SectionType.TESTIMONIALS, "Endorsements & Recommendations", "What mentors, colleagues, and team leads say", 8, {}),
            (SectionType.CONTACT, "Get in Touch", "Let's collaborate on transformative AI initiatives", 9, {
                "contact_prompt": "Have an exciting AI project, research opportunity, or full-time position? Send a message."
            }),
        ]

        for s_type, title, subtitle, order, config in sections_data:
            PageSection.objects.get_or_create(
                page=home_page,
                section_type=s_type,
                defaults={
                    "title": title,
                    "subtitle": subtitle,
                    "display_order": order,
                    "is_active": True,
                    "config_data": config
                }
            )
        self.stdout.write(self.style.SUCCESS("[OK] Homepage dynamic builder sections seeded."))

        # 4. Tech Tags
        tech_tags = {
            "Python": "Programming",
            "PyTorch": "AI/ML",
            "TensorFlow": "AI/ML",
            "LangChain": "Generative AI",
            "LlamaIndex": "Generative AI",
            "Hugging Face": "Generative AI",
            "Scikit-Learn": "Data Science",
            "FastAPI": "Backend",
            "Django": "Backend",
            "PostgreSQL": "Database",
            "Docker": "DevOps",
            "Next.js": "Frontend",
            "TypeScript": "Frontend"
        }
        tag_objs = {}
        for name, cat in tech_tags.items():
            tag, _ = TechTag.objects.get_or_create(name=name, defaults={"category": cat})
            tag_objs[name] = tag

        # 5. Featured Projects
        projects_data = [
            {
                "title": "Autonomous Multi-Agent RAG Knowledge System",
                "slug": "autonomous-multi-agent-rag-system",
                "short_description": "Enterprise-grade Retrieval-Augmented Generation platform orchestrating autonomous LangGraph agents with vector database retrieval.",
                "full_description": (
                    "### Overview\n"
                    "Engineered a production-ready multi-agent RAG system capable of processing heterogeneous corporate knowledge bases (PDFs, Confluence, CSVs) "
                    "and providing factual, cited answers with zero hallucination.\n\n"
                    "### Technical Highlights\n"
                    "- Designed self-corrective query expansion and recursive chunking pipelines.\n"
                    "- Integrated hybrid dense-sparse vector search using pgvector and BM25.\n"
                    "- Evaluated system performance using Ragas metrics, reaching 94.2% factual consistency."
                ),
                "thumbnail_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
                "github_url": "https://github.com/rajantala/autonomous-agent-rag",
                "live_demo_url": "https://demo.example.com/rag-system",
                "is_featured": True,
                "display_order": 1,
                "status": PublishableStatus.PUBLISHED,
                "tags": ["Python", "PyTorch", "LangChain", "Hugging Face", "PostgreSQL", "FastAPI"]
            },
            {
                "title": "Enterprise Financial Document Intelligence Engine",
                "slug": "financial-document-intelligence",
                "short_description": "Automated pipeline for extracting structured balance sheets, income statements, and KPI trends from quarterly earnings reports.",
                "full_description": (
                    "### Overview\n"
                    "Developed an end-to-end OCR and layout-aware transformer model for financial documentation analysis.\n\n"
                    "### Technical Highlights\n"
                    "- Fine-tuned LayoutLMv3 for complex tabular structure extraction.\n"
                    "- Reduced manual financial audit time by over 78%.\n"
                    "- Implemented asynchronous batch processing with Celery and Redis."
                ),
                "thumbnail_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
                "github_url": "https://github.com/rajantala/financial-doc-intelligence",
                "live_demo_url": "https://demo.example.com/financial-nlp",
                "is_featured": True,
                "display_order": 2,
                "status": PublishableStatus.PUBLISHED,
                "tags": ["Python", "PyTorch", "Transformers", "FastAPI", "Docker"]
            },
            {
                "title": "Real-Time Computer Vision Defect Detection",
                "slug": "real-time-defect-detection",
                "short_description": "Edge-optimized deep learning vision model detecting micro-surface defects in manufacturing components at 60 FPS.",
                "full_description": (
                    "### Overview\n"
                    "Designed and deployed a lightweight YOLOv8 / TensorRT object detection model targeting industrial defect inspection.\n\n"
                    "### Technical Highlights\n"
                    "- Quantized FP32 weights to INT8 with TensorRT, achieving sub-16ms inference latency on NVIDIA Jetson.\n"
                    "- Formulated synthetic defect augmentation using Stable Diffusion for rare defect samples.\n"
                    "- Maintained 97.8% mAP@0.5 across 12 distinct defect classes."
                ),
                "thumbnail_url": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
                "github_url": "https://github.com/rajantala/edge-defect-detection",
                "live_demo_url": "https://demo.example.com/vision-defect",
                "is_featured": True,
                "display_order": 3,
                "status": PublishableStatus.PUBLISHED,
                "tags": ["Python", "PyTorch", "Docker"]
            },
            {
                "title": "Generative Code Assistant with LoRA Fine-Tuning",
                "slug": "generative-code-assistant-lora",
                "short_description": "Parameter-efficient fine-tuned LLM specialized for proprietary framework code completion and automated test generation.",
                "full_description": (
                    "### Overview\n"
                    "Fine-tuned open-source 7B code models using QLoRA for domain-adapted software engineering workflows.\n\n"
                    "### Technical Highlights\n"
                    "- Trained using Unsloth and Hugging Face TRL on custom synthetic instruction pairs.\n"
                    "- Deployed with vLLM for high-throughput continuous batching.\n"
                    "- Integrated VSCode extension for contextual code completions."
                ),
                "thumbnail_url": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
                "github_url": "https://github.com/rajantala/code-assistant-lora",
                "live_demo_url": "https://demo.example.com/code-ai",
                "is_featured": False,
                "display_order": 4,
                "status": PublishableStatus.PUBLISHED,
                "tags": ["Python", "PyTorch", "Hugging Face", "FastAPI"]
            }
        ]

        for p_data in projects_data:
            tags = p_data.pop("tags", [])
            proj, _ = Project.objects.get_or_create(
                slug=p_data["slug"],
                defaults={**p_data, "published_at": datetime.datetime.now(datetime.timezone.utc)}
            )
            for t_name in tags:
                if t_name in tag_objs:
                    proj.technologies.add(tag_objs[t_name])
        self.stdout.write(self.style.SUCCESS("[OK] Projects and technology tags seeded."))

        # 6. Skill Categories & Skills
        skills_structure = [
            ("Programming Languages", "languages", 1, [
                ("Python", 95, "Terminal"),
                ("TypeScript", 85, "Code2"),
                ("JavaScript", 88, "FileCode"),
                ("SQL", 90, "Database"),
                ("C++", 75, "Cpu")
            ]),
            ("Machine Learning & Deep Learning", "ml-dl", 2, [
                ("PyTorch", 92, "Activity"),
                ("TensorFlow & Keras", 85, "Layers"),
                ("Scikit-Learn", 94, "LineChart"),
                ("Computer Vision (OpenCV, YOLO)", 86, "Eye"),
                ("Data Analysis (Pandas, NumPy)", 95, "Binary")
            ]),
            ("Generative AI & LLM Systems", "gen-ai", 3, [
                ("RAG Architecture", 95, "BookOpen"),
                ("LangChain & LangGraph", 90, "Workflow"),
                ("LlamaIndex", 88, "Share2"),
                ("Hugging Face Transformers", 92, "Sparkles"),
                ("Prompt Engineering & Evaluation", 94, "MessageSquareCode")
            ]),
            ("Backend & Databases", "backend-db", 4, [
                ("Django & DRF", 90, "Server"),
                ("FastAPI", 92, "Zap"),
                ("PostgreSQL & pgvector", 90, "Database"),
                ("Redis", 82, "HardDrive"),
                ("REST & GraphQL APIs", 92, "Network")
            ]),
            ("Cloud, DevOps & Tools", "devops", 5, [
                ("Docker & Containers", 88, "Container"),
                ("Git & GitHub Actions", 92, "GitBranch"),
                ("AWS Cloud (S3, EC2, SageMaker)", 82, "Cloud"),
                ("Linux Administration", 88, "TerminalSquare"),
                ("Vercel & Render", 90, "ExternalLink")
            ])
        ]

        for cat_name, cat_slug, cat_order, skill_list in skills_structure:
            category, _ = SkillCategory.objects.get_or_create(
                slug=cat_slug,
                defaults={"name": cat_name, "display_order": cat_order}
            )
            for idx, (s_name, prof, icon) in enumerate(skill_list, start=1):
                Skill.objects.get_or_create(
                    category=category,
                    name=s_name,
                    defaults={
                        "proficiency": prof,
                        "icon_name": icon,
                        "display_order": idx,
                        "is_visible": True
                    }
                )
        self.stdout.write(self.style.SUCCESS("[OK] Skill categories and skills seeded."))

        # 7. Work Experience
        Experience.objects.get_or_create(
            company="NeuralTech Solutions",
            job_title="Associate AI / ML Engineer",
            defaults={
                "employment_type": "full-time",
                "location": "Bengaluru / Remote",
                "start_date": datetime.date(2025, 6, 1),
                "is_current": True,
                "description": "Leading development of generative AI pipelines, automated knowledge extraction, and production model serving.",
                "responsibilities": [
                    "Architected enterprise RAG system with multi-stage reranking and hybrid vector search, accelerating document retrieval by 40%.",
                    "Deployed containerized LLM microservices with FastAPI and Docker, handling 150k+ daily inference queries under 200ms p95 latency.",
                    "Implemented comprehensive CI/CD evaluation test suite measuring hallucination rate and groundedness with Ragas."
                ],
                "display_order": 1,
                "status": PublishableStatus.PUBLISHED,
                "published_at": datetime.datetime.now(datetime.timezone.utc)
            }
        )

        Experience.objects.get_or_create(
            company="Cognitive Systems Research Lab",
            job_title="Machine Learning Research Intern",
            defaults={
                "employment_type": "internship",
                "location": "Ahmedabad, India",
                "start_date": datetime.date(2024, 7, 1),
                "end_date": datetime.date(2025, 5, 1),
                "is_current": False,
                "description": "Conducted applied ML research on semi-supervised computer vision models and contrastive learning for industrial anomaly detection.",
                "responsibilities": [
                    "Curated and preprocessed multi-modal vision datasets consisting of 120,000+ labeled images.",
                    "Trained contrastive visual representations (SimCLR) yielding 6.8% accuracy boost on few-shot industrial benchmarks.",
                    "Authored technical research paper and reproducible GitHub benchmark repository."
                ],
                "display_order": 2,
                "status": PublishableStatus.PUBLISHED,
                "published_at": datetime.datetime.now(datetime.timezone.utc)
            }
        )
        self.stdout.write(self.style.SUCCESS("[OK] Work experience records seeded."))

        # 8. Education
        Education.objects.get_or_create(
            institution="Gujarat Technological University",
            degree="Bachelor of Technology (B.Tech)",
            defaults={
                "field_of_study": "Computer Science & Engineering (AI & ML Specialization)",
                "start_date": datetime.date(2021, 8, 1),
                "end_date": datetime.date(2025, 5, 1),
                "grade": "CGPA 8.8 / 10",
                "description": "Graduated with honors. Coursework covered Deep Learning, Natural Language Processing, Linear Algebra, Probability & Statistics, Advanced Data Structures, and Distributed Computing.",
                "display_order": 1,
                "status": PublishableStatus.PUBLISHED,
                "published_at": datetime.datetime.now(datetime.timezone.utc)
            }
        )
        self.stdout.write(self.style.SUCCESS("[OK] Education history seeded."))

        # 9. Certifications
        certifications_data = [
            ("Deep Learning Specialization", "DeepLearning.AI / Coursera", datetime.date(2024, 3, 15), "https://coursera.org/verify/specialization/sample"),
            ("AWS Certified Machine Learning – Specialty", "Amazon Web Services", datetime.date(2024, 8, 20), "https://aws.amazon.com/verification"),
            ("TensorFlow Developer Certificate", "Google", datetime.date(2023, 11, 10), "https://certificate.google.dev")
        ]
        for idx, (title, issuer, dt, url) in enumerate(certifications_data, start=1):
            Certification.objects.get_or_create(
                title=title,
                defaults={
                    "issuer": issuer,
                    "issue_date": dt,
                    "credential_url": url,
                    "display_order": idx,
                    "status": PublishableStatus.PUBLISHED,
                    "published_at": datetime.datetime.now(datetime.timezone.utc)
                }
            )
        self.stdout.write(self.style.SUCCESS("[OK] Industry certifications seeded."))

        # 10. Testimonials
        Testimonial.objects.get_or_create(
            author_name="Dr. Sarah Jenkins",
            designation="Principal AI Research Scientist",
            defaults={
                "company": "Neural Innovations",
                "quote": "Raj demonstrated an exceptional grasp of modern LLM architectures and RAG paradigms. His work on multi-agent retrieval drastically improved our research throughput.",
                "is_approved": True,
                "display_order": 1
            }
        )
        Testimonial.objects.get_or_create(
            author_name="Michael Chen",
            designation="Engineering Lead",
            defaults={
                "company": "Cognitive Lab",
                "quote": "A standout engineer who doesn't just train models, but designs reliable, production-grade microservices around them with speed and precision.",
                "is_approved": True,
                "display_order": 2
            }
        )
        self.stdout.write(self.style.SUCCESS("[OK] Testimonials seeded."))

        # 11. Navigation Items
        nav_items = [
            ("Home", "/#hero", False, "header", 1),
            ("About", "/#about", False, "header", 2),
            ("Skills", "/#skills", False, "header", 3),
            ("Projects", "/#projects", False, "header", 4),
            ("Experience", "/#experience", False, "header", 5),
            ("Education", "/#education", False, "header", 6),
            ("Certifications", "/#certifications", False, "header", 7),
            ("Contact", "/#contact", False, "header", 8),
            ("Resume", "/resume", False, "both", 9),
        ]
        for label, dest, is_ext, loc, ordr in nav_items:
            NavigationItem.objects.get_or_create(
                label=label,
                destination=dest,
                defaults={
                    "is_external": is_ext,
                    "menu_location": loc,
                    "display_order": ordr,
                    "is_active": True
                }
            )
        self.stdout.write(self.style.SUCCESS("[OK] Navigation menu items seeded."))

        # 12. Footer Settings
        FooterSetting.objects.get_or_create(
            id="00000000-0000-0000-0000-000000000002",
            defaults={
                "description": "Raj Antala — AI Engineer, Data Scientist, and Generative AI enthusiast dedicated to building intelligent, reliable, and scalable software systems.",
                "copyright_text": f"© {datetime.date.today().year} Raj Antala. All rights reserved.",
                "is_visible": True,
                "social_links": [
                    {"platform": "GitHub", "url": "https://github.com/rajantala", "icon": "Github"},
                    {"platform": "LinkedIn", "url": "https://linkedin.com/in/rajantala", "icon": "Linkedin"},
                    {"platform": "Email", "url": "mailto:contact@rajantala.com", "icon": "Mail"}
                ]
            }
        )
        self.stdout.write(self.style.SUCCESS("[OK] Footer settings seeded."))

        # 13. SEO Metadata
        SEOMetadata.objects.get_or_create(
            page_identifier="global",
            defaults={
                "title": "Raj Antala | AI Engineer & Data Scientist Portfolio",
                "meta_description": "Explore the portfolio of Raj Antala — AI Engineer specializing in Machine Learning, Generative AI, RAG systems, and Deep Learning applications.",
                "keywords": "Raj Antala, AI Engineer, Data Scientist, Generative AI, Machine Learning, Deep Learning, Python, PyTorch, RAG",
                "og_title": "Raj Antala — AI Engineer & Data Scientist",
                "og_description": "Personal portfolio showcasing artificial intelligence research, generative AI applications, and scalable machine learning systems.",
                "robots_directive": "index, follow"
            }
        )
        self.stdout.write(self.style.SUCCESS("[OK] SEO metadata seeded."))

        # 14. Site Settings
        SiteSetting.objects.get_or_create(
            id="00000000-0000-0000-0000-000000000003",
            defaults={
                "site_title": "Raj Antala | AI Engineer Portfolio",
                "primary_email": "contact@rajantala.com",
                "maintenance_mode": False,
                "analytics_enabled": True,
                "resume_download_enabled": True
            }
        )
        self.stdout.write(self.style.SUCCESS("[OK] Global Site Settings seeded."))

        self.stdout.write(self.style.SUCCESS("\nPortfolio database seeding completed successfully!"))
