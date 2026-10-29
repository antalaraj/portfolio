import datetime
import os

from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.utils.text import slugify

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

# ================================================================
# PERSONAL INFORMATION
# ================================================================

FULL_NAME = "Antala Raj"
EMAIL = "antalaraj214@gmail.com"

GITHUB_URL = "https://github.com/antalaraj"
LINKEDIN_URL = "https://www.linkedin.com/in/antalaraj/"

CURRENT_TIME = timezone.now()

# Generic temporary project artwork.
# Replace with actual project screenshots before production.
PROJECT_IMAGE = (
    "https://placehold.co/1200x800/f8fafc/475569"
    "?text=Project+Preview"
)


# ================================================================
# REAL PROJECT DATA
# Sources: Public GitHub repositories and their documentation.
# ================================================================

projects_data = [
    {
        "title": "AuraMed-AI",
        "slug": "auramed-ai",
        "short_description": (
            "An AI-assisted medical imaging application exploring "
            "wound image analysis, segmentation, measurement, "
            "classification, and visual interpretation."
        ),
        "full_description": (
            "### Overview\n"
            "AuraMed-AI is an AI-assisted medical imaging project "
            "focused on wound image analysis and tracking.\n\n"

            "### Key Features\n"
            "- Wound image processing and segmentation.\n"
            "- Wound area and perimeter measurement.\n"
            "- Image-based classification experiments.\n"
            "- Healing progress tracking concepts.\n"
            "- Grad-CAM visualization for model interpretation.\n"
            "- Mobile application interface.\n\n"

            "### Technical Implementation\n"
            "- Python and OpenCV for image processing.\n"
            "- LAB color-space K-Means segmentation.\n"
            "- PyTorch and deep learning.\n"
            "- ConvNeXt-Tiny transfer learning.\n"
            "- FastAPI backend.\n"
            "- React Native and Expo.\n\n"

            "This project is an educational and technical prototype, "
            "not a certified medical diagnostic system."
        ),
        "thumbnail_url": PROJECT_IMAGE,
        "github_url": f"{GITHUB_URL}/AuraMed-AI",
        "live_demo_url": "",
        "is_featured": True,
        "display_order": 1,
        "status": PublishableStatus.PUBLISHED,
        "tags": [
            "Python", "OpenCV", "PyTorch", "FastAPI",
            "React Native", "Expo", "Computer Vision",
            "Deep Learning", "NumPy"
        ]
    },
    {
        "title": "AI Grant Writer Assistant",
        "slug": "ai-grant-writer-assistant",
        "short_description": (
            "An AI-powered application designed to assist with "
            "grant opportunity research, information extraction, "
            "and structured grant proposal generation."
        ),
        "full_description": (
            "### Overview\n"
            "AI Grant Writer Assistant is a Generative AI application "
            "that helps users research funding opportunities and "
            "prepare structured grant proposal drafts.\n\n"

            "### Key Features\n"
            "- Grant opportunity research.\n"
            "- Opportunity information extraction.\n"
            "- AI-assisted grant writing.\n"
            "- Structured report generation.\n"
            "- Research workflow and source handling.\n"
            "- Model fallback handling.\n\n"

            "### Technical Implementation\n"
            "- Python.\n"
            "- Flask.\n"
            "- Groq API.\n"
            "- Google Gemini API.\n"
            "- Generative AI workflows.\n"
            "- Vercel deployment.\n\n"

            "The source repository contains the implementation "
            "and project documentation."
        ),
        "thumbnail_url": PROJECT_IMAGE,
        "github_url": f"{GITHUB_URL}/AI-Grant-Writer-Assistant",
        "live_demo_url": "https://grant-writer-assistant.vercel.app/",
        "is_featured": True,
        "display_order": 2,
        "status": PublishableStatus.PUBLISHED,
        "tags": [
            "Python", "Flask", "Groq", "Google Gemini",
            "Generative AI", "Vercel"
        ]
    },
    {
        "title": "Board Meeting Decisions Tracker",
        "slug": "board-meeting-decisions-tracker",
        "short_description": (
            "An AI-assisted meeting intelligence application "
            "for analyzing meeting documents, extracting decisions, "
            "summarizing discussions, and tracking action items."
        ),
        "full_description": (
            "### Overview\n"
            "Board Meeting Decisions Tracker is an AI-powered "
            "application designed to make meeting information "
            "easier to understand and manage.\n\n"

            "### Key Features\n"
            "- Meeting document analysis.\n"
            "- AI-powered document question answering.\n"
            "- Meeting summaries.\n"
            "- Decision extraction.\n"
            "- Action item identification.\n"
            "- Information retrieval from documents.\n\n"

            "### Technical Implementation\n"
            "- Python.\n"
            "- Streamlit.\n"
            "- Google Gemini API.\n"
            "- ChromaDB.\n"
            "- Retrieval-Augmented Generation concepts.\n\n"

            "The application is documented in the public GitHub "
            "repository."
        ),
        "thumbnail_url": PROJECT_IMAGE,
        "github_url": (
            f"{GITHUB_URL}/Board-Meeting-Decisions-Tracker"
        ),
        "live_demo_url": "",
        "is_featured": True,
        "display_order": 3,
        "status": PublishableStatus.PUBLISHED,
        "tags": [
            "Python", "Streamlit", "Google Gemini",
            "ChromaDB", "RAG", "Generative AI"
        ]
    },
    {
        "title": "AI Fitness Planner",
        "slug": "ai-fitness-planner",
        "short_description": (
            "An AI-powered fitness planning application that "
            "generates structured workout, nutrition, and "
            "fitness planning reports."
        ),
        "full_description": (
            "### Overview\n"
            "AI Fitness Planner is an AI-based web application "
            "designed to assist users with personalized fitness "
            "planning and structured reports.\n\n"

            "### Key Features\n"
            "- AI-assisted fitness planning.\n"
            "- Workout planning.\n"
            "- Nutrition planning.\n"
            "- Structured fitness recommendations.\n"
            "- PDF report generation.\n\n"

            "### Technical Implementation\n"
            "- Python.\n"
            "- Flask.\n"
            "- Groq API.\n"
            "- JavaScript.\n"
            "- PDF generation.\n"
            "- Vercel deployment.\n"
        ),
        "thumbnail_url": PROJECT_IMAGE,
        "github_url": f"{GITHUB_URL}/AI-Fitness-App",
        "live_demo_url": "https://ai-fitness-app.vercel.app",
        "is_featured": True,
        "display_order": 4,
        "status": PublishableStatus.PUBLISHED,
        "tags": [
            "Python", "Flask", "Groq",
            "JavaScript", "Generative AI", "Vercel"
        ]
    },
    {
        "title": "GramBazaar",
        "slug": "grambazaar",
        "short_description": (
            "A digital marketplace project focused on Self Help "
            "Groups, product management, online commerce, and "
            "digital business support."
        ),
        "full_description": (
            "### Overview\n"
            "GramBazaar is a digital marketplace concept designed "
            "to support Self Help Groups and their products.\n\n"

            "### Key Features\n"
            "- Product browsing and management.\n"
            "- SHG and product information.\n"
            "- Order and inventory workflows.\n"
            "- Sales management.\n"
            "- Business support concepts.\n\n"

            "### Technical Implementation\n"
            "- Python.\n"
            "- Django.\n"
            "- Django REST Framework.\n"
            "- HTML, CSS and JavaScript.\n"
            "- Bootstrap.\n"
            "- Machine learning and NLP-related components.\n"
        ),
        "thumbnail_url": PROJECT_IMAGE,
        "github_url": f"{GITHUB_URL}/Grambazaar",
        "live_demo_url": "",
        "is_featured": True,
        "display_order": 5,
        "status": PublishableStatus.PUBLISHED,
        "tags": [
            "Python", "Django", "Django REST Framework",
            "HTML", "CSS", "JavaScript", "Bootstrap",
            "Machine Learning"
        ]
    },
    {
        "title": "Road Surface Damage Detection",
        "slug": "road-surface-damage-detection",
        "short_description": (
            "A computer vision and machine learning project "
            "for analyzing road surface images and identifying "
            "different types of road damage."
        ),
        "full_description": (
            "### Overview\n"
            "Road Surface Damage Detection applies computer vision "
            "and machine learning techniques to road image analysis.\n\n"

            "### Key Features\n"
            "- Road image preprocessing.\n"
            "- Surface damage analysis.\n"
            "- Crack and damage segmentation.\n"
            "- Texture feature extraction.\n"
            "- Damage severity analysis.\n"
            "- Interactive dashboard.\n\n"

            "### Technical Implementation\n"
            "- Python.\n"
            "- OpenCV.\n"
            "- Local Binary Patterns.\n"
            "- Random Forest.\n"
            "- NumPy and Pandas.\n"
            "- scikit-learn.\n"
            "- Streamlit.\n"
        ),
        "thumbnail_url": PROJECT_IMAGE,
        "github_url": (
            f"{GITHUB_URL}/Road-Surface-Damage-Detection"
        ),
        "live_demo_url": "",
        "is_featured": True,
        "display_order": 6,
        "status": PublishableStatus.PUBLISHED,
        "tags": [
            "Python", "OpenCV", "NumPy", "Pandas",
            "scikit-learn", "Streamlit",
            "Computer Vision", "Machine Learning"
        ]
    },
    {
        "title": "Social Media Engagement Analysis",
        "slug": "social-media-engagement-analysis",
        "short_description": (
            "A data science project using exploratory data "
            "analysis and machine learning to study social "
            "media engagement patterns."
        ),
        "full_description": (
            "### Overview\n"
            "This project explores social media engagement data "
            "through data cleaning, visualization, statistical "
            "analysis, and machine learning.\n\n"

            "### Key Features\n"
            "- Data preprocessing.\n"
            "- Exploratory data analysis.\n"
            "- Feature engineering.\n"
            "- Data visualization.\n"
            "- Machine learning experiments.\n"
            "- Model evaluation.\n\n"

            "### Technical Implementation\n"
            "- Python.\n"
            "- Pandas.\n"
            "- NumPy.\n"
            "- Matplotlib.\n"
            "- scikit-learn.\n"
            "- Jupyter Notebook.\n"
        ),
        "thumbnail_url": PROJECT_IMAGE,
        "github_url": (
            f"{GITHUB_URL}/Social-Media-Engagement-EDA-ML"
        ),
        "live_demo_url": "",
        "is_featured": False,
        "display_order": 7,
        "status": PublishableStatus.PUBLISHED,
        "tags": [
            "Python", "Pandas", "NumPy",
            "Matplotlib", "scikit-learn",
            "Machine Learning", "Data Analysis"
        ]
    },
    {
        "title": "Board Game Engagement Analysis",
        "slug": "board-game-engagement-analysis",
        "short_description": (
            "A SQL and Python analytics project exploring "
            "board game data, ratings, popularity, playtime, "
            "and other engagement-related patterns."
        ),
        "full_description": (
            "### Overview\n"
            "This project uses SQL and Python to explore and "
            "analyze board game datasets.\n\n"

            "### Key Features\n"
            "- Data cleaning using SQL.\n"
            "- Data transformation.\n"
            "- Exploratory data analysis.\n"
            "- Statistical summaries.\n"
            "- Rating and popularity analysis.\n"
            "- Data visualization.\n\n"

            "### Technical Implementation\n"
            "- SQL Server.\n"
            "- Python.\n"
            "- Pandas.\n"
            "- Jupyter Notebook.\n"
            "- pyodbc.\n"
        ),
        "thumbnail_url": PROJECT_IMAGE,
        "github_url": (
            f"{GITHUB_URL}/Boardgame-Engagement-Analysis"
        ),
        "live_demo_url": "",
        "is_featured": False,
        "display_order": 8,
        "status": PublishableStatus.PUBLISHED,
        "tags": [
            "SQL", "SQL Server", "Python",
            "Pandas", "Jupyter Notebook", "Data Analysis"
        ]
    },
    {
        "title": "Computer Vision Learning Portfolio",
        "slug": "computer-vision-learning-portfolio",
        "short_description": (
            "A practical computer vision repository covering "
            "image processing, feature extraction, detection, "
            "classification, and deep learning experiments."
        ),
        "full_description": (
            "### Overview\n"
            "A collection of computer vision learning exercises "
            "and implementations demonstrating different image "
            "processing and deep learning concepts.\n\n"

            "### Topics Covered\n"
            "- Image preprocessing.\n"
            "- Edge detection.\n"
            "- Feature extraction.\n"
            "- Object detection.\n"
            "- Face and eye detection.\n"
            "- CNN-based image classification.\n"
            "- Image segmentation.\n"
            "- YOLO experiments.\n\n"

            "### Technical Implementation\n"
            "- Python.\n"
            "- OpenCV.\n"
            "- NumPy.\n"
            "- Matplotlib.\n"
            "- PyTorch.\n"
            "- TensorFlow.\n"
        ),
        "thumbnail_url": PROJECT_IMAGE,
        "github_url": f"{GITHUB_URL}/Computer-Vision",
        "live_demo_url": "",
        "is_featured": False,
        "display_order": 9,
        "status": PublishableStatus.PUBLISHED,
        "tags": [
            "Python", "OpenCV", "NumPy",
            "Matplotlib", "PyTorch", "TensorFlow",
            "Computer Vision", "Deep Learning"
        ]
    },
    {
        "title": "Tour and Travel Management System",
        "slug": "tour-and-travel-management-system",
        "short_description": (
            "A Django-based web application for managing "
            "tour packages, travel destinations, bookings, "
            "and travel-related information."
        ),
        "full_description": (
            "### Overview\n"
            "A web-based tour and travel management project "
            "designed to organize travel services and booking "
            "information.\n\n"

            "### Key Features\n"
            "- Tour package management.\n"
            "- Destination management.\n"
            "- Booking workflow.\n"
            "- Travel information management.\n"
            "- User-facing website.\n"
            "- Administrative functionality.\n\n"

            "### Technical Implementation\n"
            "- Python.\n"
            "- Django.\n"
            "- HTML and CSS.\n"
            "- Bootstrap.\n"
            "- JavaScript.\n"
            "- SQLite.\n"
        ),
        "thumbnail_url": PROJECT_IMAGE,
        "github_url": (
            f"{GITHUB_URL}/Tour-And-Travel-Website"
        ),
        "live_demo_url": "",
        "is_featured": False,
        "display_order": 10,
        "status": PublishableStatus.PUBLISHED,
        "tags": [
            "Python", "Django", "HTML",
            "CSS", "Bootstrap", "JavaScript", "SQLite"
        ]
    }
]


# ================================================================
# TECHNICAL TAGS
# ================================================================

tech_tags = {
    "Python": "Programming",
    "C": "Programming",
    "PHP": "Programming",
    "JavaScript": "Programming",
    "TypeScript": "Programming",
    "SQL": "Programming",

    "Pandas": "Data Science",
    "NumPy": "Data Science",
    "Matplotlib": "Data Science",
    "scikit-learn": "Machine Learning",
    "Jupyter Notebook": "Data Science",

    "PyTorch": "Deep Learning",
    "TensorFlow": "Deep Learning",
    "OpenCV": "Computer Vision",
    "Computer Vision": "AI/ML",
    "Deep Learning": "AI/ML",
    "Machine Learning": "AI/ML",

    "Google Gemini": "Generative AI",
    "Groq": "Generative AI",
    "LangChain": "Generative AI",
    "LangGraph": "Generative AI",
    "ChromaDB": "Vector Database",
    "RAG": "Generative AI",
    "Sentence Transformers": "Generative AI",

    "Django": "Backend",
    "Flask": "Backend",
    "FastAPI": "Backend",
    "Django REST Framework": "Backend",
    "React Native": "Frontend",
    "Expo": "Frontend",
    "HTML": "Frontend",
    "CSS": "Frontend",
    "Bootstrap": "Frontend",

    "MySQL": "Database",
    "SQLite": "Database",
    "DynamoDB": "Database",

    "AWS SES": "Cloud",
    "Vercel": "Deployment",
    "Streamlit": "Deployment",
    "Git": "Development Tools",
    "GitHub": "Development Tools"
}


class Command(BaseCommand):
    help = (
        "Seeds the database with authentic portfolio structure "
        "and content for Antala Raj."
    )

    def handle(self, *args, **options):

        self.stdout.write(
            self.style.NOTICE(
                "\nBeginning Antala Raj portfolio data seeding..."
            )
        )

        # ========================================================
        # 1. SUPER ADMIN ACCOUNT
        # ========================================================

        admin_username = os.getenv(
            "DJANGO_SUPERUSER_USERNAME",
            "rajantala"
        )

        admin_email = os.getenv(
            "DJANGO_SUPERUSER_EMAIL",
            EMAIL
        )

        admin_password = os.getenv(
            "DJANGO_SUPERUSER_PASSWORD"
        )

        if os.getenv("SEED_ADMIN", "false").lower() == "true":

            if not admin_password:
                raise CommandError(
                    "Set DJANGO_SUPERUSER_PASSWORD before "
                    "creating the superuser."
                )

            admin_user, created = User.objects.get_or_create(
                username=admin_username,
                defaults={
                    "email": admin_email,
                    "first_name": "Antala",
                    "last_name": "Raj",
                    "is_staff": True,
                    "is_superuser": True
                }
            )

            if created:
                admin_user.set_password(admin_password)
                admin_user.save()

                self.stdout.write(
                    self.style.SUCCESS(
                        "[OK] SuperAdmin account created."
                    )
                )
            else:
                self.stdout.write(
                    self.style.NOTICE(
                        "[OK] Existing SuperAdmin preserved."
                    )
                )
        else:
            self.stdout.write(
                self.style.NOTICE(
                    "[SKIP] SuperAdmin creation disabled."
                )
            )

        # ========================================================
        # 2. PROFILE MANAGEMENT
        # ========================================================

        profile, created = Profile.objects.update_or_create(
            id="00000000-0000-0000-0000-000000000001",
            defaults={
                "full_name": FULL_NAME,

                "headline": (
                    "AI Engineer | Generative AI | "
                    "Machine Learning | Data Science"
                ),

                "bio": (
                    "I am Antala Raj, a postgraduate student "
                    "pursuing PGDM in Artificial Intelligence "
                    "and Data Science at Adani Institute of "
                    "Digital Technology Management (AIDTM). "
                    "I have completed my Bachelor of Computer "
                    "Applications (BCA) from LJ University, "
                    "Ahmedabad.\n\n"

                    "I am interested in Artificial Intelligence, "
                    "Machine Learning, Generative AI, Agentic AI, "
                    "and Data Science. I enjoy developing practical "
                    "AI applications that combine intelligent "
                    "workflows, data-driven insights, and software "
                    "engineering.\n\n"

                    "During my AI Engineer internship at "
                    "OpenSpectrum AI Private Limited, I worked "
                    "on Luma Assistant, Google Gemini API "
                    "integration, AI-powered ERP capabilities, "
                    "AWS SES integration, and Smart Glasses "
                    "functionality.\n\n"

                    "My GitHub portfolio includes projects in "
                    "Generative AI, computer vision, machine "
                    "learning, data analysis, and application "
                    "development."
                ),

                "email": EMAIL,
                "phone": "",

                "location": "Gujarat, India",

                "github_url": GITHUB_URL,
                "linkedin_url": LINKEDIN_URL,

                "availability_status": (
                    "Open to AI Engineering and Data Science "
                    "Opportunities"
                ),

                # Actual photo and resume will be added later.
                "avatar_url": "",
                "resume_file_url": "",

                # No fabricated experience badge.
                "experience_badge_title": "",
                "experience_badge_subtitle": "",
                "show_experience_badge": False
            }
        )

        self.stdout.write(
            self.style.SUCCESS(
                "[OK] Personal Profile record created/updated."
            )
        )

        # ========================================================
        # 3. DYNAMIC HOMEPAGE & BUILDER SECTIONS
        # ========================================================

        home_page, _ = Page.objects.update_or_create(
            slug="home",
            defaults={
                "title": "Home",

                "description": (
                    "Antala Raj — AI Engineer, Generative AI "
                    "and Data Science Portfolio"
                ),

                "status": PublishableStatus.PUBLISHED,
                "published_at": CURRENT_TIME
            }
        )

        sections_data = [
            (
                SectionType.HERO,
                "Hero Section",
                "AI Engineer | Generative AI | Data Science",
                1,
                {
                    "badge_text": (
                        "PGDM in AI & Data Science"
                    ),
                    "cta_primary_label": "Explore Projects",
                    "cta_primary_link": "/#projects",
                    "cta_secondary_label": "Contact Me",
                    "cta_secondary_link": "/#contact"
                }
            ),

            (
                SectionType.ABOUT,
                "About Me",
                "Building practical, intelligent AI systems with modern LLMs, computer vision, and robust engineering.",
                2,
                {
                    "badge_text": "About Me",
                    "headline": "Building practical, intelligent AI systems with modern LLMs, computer vision, and robust engineering.",
                    "bio_paragraph_1": (
                        "I am Antala Raj, a postgraduate student pursuing a PGDM in Artificial Intelligence "
                        "and Data Science at Adani Institute of Digital Technology Management (AIDTM), with a "
                        "Bachelor of Computer Applications (BCA) from LJ University, Ahmedabad. I bridge mathematical "
                        "foundations with production reality, building machine learning architectures that solve authentic industry challenges."
                    ),
                    "bio_paragraph_2": (
                        "During my AI Engineer internship at OpenSpectrum AI Private Limited, I contributed to Luma Assistant, "
                        "Google Gemini API integration, AI-powered ERP capabilities, AWS SES integration, and smart glasses functionality. "
                        "From developing wound image segmentation prototypes (AuraMed-AI) using ConvNeXt and OpenCV to RAG-powered "
                        "meeting intelligence and grant proposal drafting, I focus on reproducible evaluations, agentic workflows, "
                        "and reliable deployment."
                    ),
                    "bio_paragraph_3": (
                        "Learning through practical implementation, building useful AI applications, and continuously "
                        "improving technical skills across Generative AI, Machine Learning, and scalable software systems."
                    ),
                    "career_focus": (
                        "Artificial Intelligence, Generative AI, "
                        "Agentic AI, Machine Learning, Data Science, "
                        "and Computer Vision"
                    ),
                    "years_experience": (
                        "AI Engineer Intern and PGDM Student"
                    ),
                    "core_philosophy": (
                        "Learning through practical implementation, "
                        "building useful AI applications, and "
                        "continuously improving technical skills."
                    ),
                    "stats": [
                        {"value": "AI & ML", "label": "AIDTM (PGDM) & BCA"},
                        {"value": "10+", "label": "Shipped AI & CV Projects"},
                        {"value": "Industry Tested", "label": "OpenSpectrum AI Intern"}
                    ],
                    "highlights": [
                        {
                            "icon": "Bot",
                            "title": "Generative & Agentic AI",
                            "desc": "Architecting autonomous workflows, contextual RAG, and multi-model integrations with LangChain, LangGraph, Google Gemini, and Groq."
                        },
                        {
                            "icon": "Cpu",
                            "title": "Computer Vision & Medical AI",
                            "desc": "Developing wound segmentation (AuraMed-AI) using LAB color-space, ConvNeXt transfer learning, OpenCV, PyTorch, and defect detection."
                        },
                        {
                            "icon": "Server",
                            "title": "Full-Stack AI & Backend Systems",
                            "desc": "Engineering robust REST APIs with FastAPI, Django, and Flask, paired with responsive cross-platform apps via React Native & Expo."
                        },
                        {
                            "icon": "LineChart",
                            "title": "Data Science & Analytics",
                            "desc": "Conducting rigorous exploratory data analysis, feature engineering, and statistical modeling with Pandas, NumPy, and Scikit-Learn."
                        }
                    ]
                }
            ),

            (
                SectionType.SKILLS,
                "Technical Skills",
                "Technologies and tools I work with",
                3,
                {}
            ),

            (
                SectionType.PROJECTS,
                "Featured Projects",
                "Selected AI, Machine Learning and Software Projects",
                4,
                {
                    "max_display": 10
                }
            ),

            (
                SectionType.EXPERIENCE,
                "Professional Experience",
                "My internship and practical AI engineering experience",
                5,
                {}
            ),

            (
                SectionType.EDUCATION,
                "Education",
                "My academic background",
                6,
                {}
            ),

            (
                SectionType.CERTIFICATIONS,
                "Certifications",
                "Verified professional certifications",
                7,
                {}
            ),

            (
                SectionType.TESTIMONIALS,
                "Testimonials",
                "Professional recommendations",
                8,
                {}
            ),

            (
                SectionType.CONTACT,
                "Get in Touch",
                "Let's connect and build something meaningful",
                9,
                {
                    "contact_prompt": (
                        "For AI projects, professional opportunities, "
                        "and collaborations, feel free to contact me."
                    ),
                    "email": EMAIL
                }
            )
        ]

        for section_type, title, subtitle, order, config in sections_data:

            is_active = section_type not in (
                SectionType.CERTIFICATIONS,
                SectionType.TESTIMONIALS
            )

            PageSection.objects.update_or_create(
                page=home_page,
                section_type=section_type,
                defaults={
                    "title": title,
                    "subtitle": subtitle,
                    "display_order": order,
                    "is_active": is_active,
                    "config_data": config
                }
            )

        self.stdout.write(
            self.style.SUCCESS(
                "[OK] Homepage dynamic builder sections updated."
            )
        )

        # ========================================================
        # 4. TECH TAGS
        # ========================================================

        tag_objs = {}

        for name, category in tech_tags.items():

            tag, _ = TechTag.objects.update_or_create(
                name=name,
                defaults={
                    "category": category
                }
            )

            tag_objs[name] = tag

        self.stdout.write(
            self.style.SUCCESS(
                "[OK] Technology tags created/updated."
            )
        )

        # ========================================================
        # 5. FEATURED PROJECTS
        # ========================================================

        # Remove fictional projects from the original seed.
        fake_project_slugs = [
            "autonomous-multi-agent-rag-system",
            "financial-document-intelligence",
            "real-time-defect-detection",
            "generative-code-assistant-lora"
        ]

        Project.objects.filter(
            slug__in=fake_project_slugs
        ).delete()

        for project_data in projects_data:

            project_tags = project_data.get("tags", [])

            project, _ = Project.objects.update_or_create(
                slug=project_data["slug"],
                defaults={
                    "title": project_data["title"],
                    "short_description": (
                        project_data["short_description"]
                    ),
                    "full_description": (
                        project_data["full_description"]
                    ),
                    "thumbnail_url": (
                        project_data["thumbnail_url"]
                    ),
                    "github_url": project_data["github_url"],
                    "live_demo_url": (
                        project_data["live_demo_url"]
                    ),
                    "is_featured": project_data["is_featured"],
                    "display_order": project_data["display_order"],
                    "status": PublishableStatus.PUBLISHED,
                    "published_at": CURRENT_TIME
                }
            )

            selected_tags = [
                tag_objs[tag_name]
                for tag_name in project_tags
                if tag_name in tag_objs
            ]

            # Replace old fake project technology relationships.
            project.technologies.set(selected_tags)

        self.stdout.write(
            self.style.SUCCESS(
                "[OK] Actual GitHub projects and technologies seeded."
            )
        )

        # ========================================================
        # 6. SKILL CATEGORIES & SKILLS
        # ========================================================

        # The database requires proficiency from 1 to 100.
        # The value 1 is only a schema placeholder.
        # Display skills as technology tags, not fake percentages.

        skills_structure = [
            (
                "Programming Languages",
                "languages",
                1,
                [
                    ("Python", "Terminal"),
                    ("SQL", "Database"),
                    ("JavaScript", "Code"),
                    ("PHP", "Code"),
                    ("C", "Cpu"),
                    ("HTML", "Code"),
                    ("CSS", "Palette")
                ]
            ),

            (
                "Data Science & Machine Learning",
                "data-science-ml",
                2,
                [
                    ("Pandas", "ChartNoAxesCombined"),
                    ("NumPy", "Binary"),
                    ("Scikit-Learn", "Brain"),
                    ("Jupyter Notebook", "Notebook"),
                    ("Machine Learning", "Brain"),
                    ("Exploratory Data Analysis", "ChartBar"),
                    ("Statistics", "ChartLine")
                ]
            ),

            (
                "Generative AI & Agentic AI",
                "generative-agentic-ai",
                3,
                [
                    ("Google Gemini API", "Sparkles"),
                    ("Groq API", "Zap"),
                    ("LangChain", "Workflow"),
                    ("LangGraph", "Workflow"),
                    ("ChromaDB", "Database"),
                    ("RAG", "BookOpen"),
                    ("Sentence Transformers", "Brain"),
                    ("Prompt Engineering", "MessageSquare")
                ]
            ),

            (
                "Computer Vision & Deep Learning",
                "computer-vision-deep-learning",
                4,
                [
                    ("OpenCV", "Eye"),
                    ("PyTorch", "Brain"),
                    ("TensorFlow", "Layers"),
                    ("YOLO", "Scan"),
                    ("Image Processing", "Image"),
                    ("Computer Vision", "Eye")
                ]
            ),

            (
                "Backend & Application Development",
                "backend-development",
                5,
                [
                    ("Django", "Server"),
                    ("Flask", "Server"),
                    ("FastAPI", "Zap"),
                    ("Laravel", "Code"),
                    ("React Native", "Smartphone"),
                    ("Expo", "Smartphone"),
                    ("REST APIs", "Network")
                ]
            ),

            (
                "Databases, Cloud & Tools",
                "databases-cloud-tools",
                6,
                [
                    ("MySQL", "Database"),
                    ("SQLite", "Database"),
                    ("DynamoDB", "Database"),
                    ("AWS SES", "Cloud"),
                    ("Git", "GitBranch"),
                    ("GitHub", "Github"),
                    ("Vercel", "Cloud"),
                    ("Streamlit", "LayoutDashboard")
                ]
            )
        ]

        for cat_name, cat_slug, cat_order, skill_list in skills_structure:

            category, _ = SkillCategory.objects.update_or_create(
                slug=cat_slug,
                defaults={
                    "name": cat_name,
                    "display_order": cat_order
                }
            )

            for idx, (skill_name, icon) in enumerate(
                skill_list,
                start=1
            ):

                Skill.objects.update_or_create(
                    category=category,
                    name=skill_name,
                    defaults={
                        "proficiency": 1,
                        "icon_name": icon,
                        "display_order": idx,
                        "is_visible": True
                    }
                )

        self.stdout.write(
            self.style.SUCCESS(
                "[OK] Skill categories and skills seeded."
            )
        )

        # ========================================================
        # 7. WORK EXPERIENCE
        # ========================================================

        # Remove fictional experience from the original seed.
        Experience.objects.filter(
            company__in=[
                "NeuralTech Solutions",
                "Cognitive Systems Research Lab"
            ]
        ).delete()

        Experience.objects.update_or_create(
            company="OpenSpectrum AI Private Limited",
            job_title="AI Engineer Intern",
            defaults={
                "employment_type": "internship",

                "location": "India",

                "start_date": datetime.date(2026, 3, 1),

                # Exact completion date has not been confirmed.
                "end_date": None,

                # Internship is completed.
                "is_current": False,

                "description": (
                    "Worked as an AI Engineer Intern at "
                    "OpenSpectrum AI Private Limited, contributing "
                    "to Luma Assistant and AI-powered ERP "
                    "functionality."
                ),

                "responsibilities": [
                    (
                        "Worked on the design and development "
                        "of Luma Assistant."
                    ),
                    (
                        "Integrated Google Gemini API into "
                        "AI assistant workflows."
                    ),
                    (
                        "Worked on AI-powered features for "
                        "the Luma ERP / FarmERP application."
                    ),
                    (
                        "Contributed to AWS SES email integration "
                        "for application workflows."
                    ),
                    (
                        "Worked on Smart Glasses integration "
                        "with AI-powered functionality."
                    ),
                    (
                        "Worked on improving assistant response "
                        "formatting, business context retrieval, "
                        "and multi-module interactions."
                    )
                ],

                "status": PublishableStatus.PUBLISHED,
                "published_at": CURRENT_TIME
            }
        )

        self.stdout.write(
            self.style.SUCCESS(
                "[OK] OpenSpectrum AI internship record seeded."
            )
        )

        # ========================================================
        # 8. EDUCATION
        # ========================================================

        # Remove fictional B.Tech education.
        Education.objects.filter(
            institution="Gujarat Technological University",
            degree="Bachelor of Technology (B.Tech)"
        ).delete()

        # Remove fake education records if present.
        Education.objects.filter(
            institution__in=[
                "Fake University",
                "Demo Institute"
            ]
        ).delete()

        education_data = [
            {
                "institution": "LJ University",
                "degree": "Bachelor of Computer Applications (BCA)",
                "field_of_study": "Computer Applications",

                # Academic-year dates; confirm exact dates.
                "start_date": datetime.date(2022, 8, 1),
                "end_date": datetime.date(2025, 5, 31),

                "grade": "",

                "description": (
                    "Completed Bachelor of Computer Applications "
                    "(BCA) from LJ University, Ahmedabad. "
                    "Developed an academic foundation in "
                    "programming, databases, web development, "
                    "and software applications."
                )
            },
            {
                "institution": (
                    "Adani Institute of Digital Technology "
                    "Management (AIDTM)"
                ),

                "degree": (
                    "Post Graduate Diploma in Management (PGDM)"
                ),

                "field_of_study": (
                    "Artificial Intelligence & Data Science"
                ),

                # Confirm exact admission and expected completion.
                "start_date": datetime.date(2025, 8, 1),
                "end_date": None,

                "grade": "",

                "description": (
                    "Pursuing postgraduate studies in "
                    "Artificial Intelligence and Data Science, "
                    "with an academic focus on AI, machine "
                    "learning, data analytics, and related "
                    "technologies."
                )
            },
            {
                "institution": "Gangotri School, Gondal",
                "degree": "Higher Secondary (Class XII)",
                "field_of_study": "",

                # Approximate academic-year dates.
                "start_date": datetime.date(2021, 6, 1),
                "end_date": datetime.date(2022, 3, 31),

                "grade": "",

                "description": (
                    "Completed Higher Secondary education "
                    "in 2022."
                )
            }
        ]

        for education in education_data:

            Education.objects.update_or_create(
                institution=education["institution"],
                degree=education["degree"],
                defaults={
                    **education,
                    "status": PublishableStatus.PUBLISHED,
                    "published_at": CURRENT_TIME
                }
            )

        self.stdout.write(
            self.style.SUCCESS(
                "[OK] Actual education records seeded."
            )
        )

        # ========================================================
        # 9. CERTIFICATIONS
        # ========================================================

        # Remove fabricated certifications from the old seed.
        Certification.objects.filter(
            title__in=[
                "Deep Learning Specialization",
                "AWS Certified Machine Learning – Specialty",
                "TensorFlow Developer Certificate"
            ]
        ).delete()

        # No certification is added without a verified certificate.
        self.stdout.write(
            self.style.WARNING(
                "[SKIP] Certifications not seeded. "
                "Add only verified certificates."
            )
        )

        # ========================================================
        # 10. TESTIMONIALS
        # ========================================================

        # Remove fictional testimonials.
        Testimonial.objects.filter(
            author_name__in=[
                "Dr. Sarah Jenkins",
                "Michael Chen"
            ]
        ).delete()

        # No fabricated recommendations.
        Testimonial.objects.update(
            is_approved=False
        )

        self.stdout.write(
            self.style.WARNING(
                "[SKIP] Testimonials disabled until genuine "
                "recommendations are provided."
            )
        )

        # ========================================================
        # 11. NAVIGATION ITEMS
        # ========================================================

        nav_items = [
            ("Home", "/#hero", False, "header", 1),
            ("About", "/#about", False, "header", 2),
            ("Skills", "/#skills", False, "header", 3),
            ("Projects", "/#projects", False, "header", 4),
            ("Experience", "/#experience", False, "header", 5),
            ("Education", "/#education", False, "header", 6),
            ("Contact", "/#contact", False, "header", 7),
            ("GitHub", GITHUB_URL, True, "footer", 8),
            ("LinkedIn", LINKEDIN_URL, True, "footer", 9)
        ]

        for label, destination, is_external, location, order in nav_items:

            NavigationItem.objects.update_or_create(
                label=label,
                destination=destination,
                menu_location=location,
                defaults={
                    "is_external": is_external,
                    "display_order": order,
                    "is_active": True
                }
            )

        # Disable old fake navigation items.
        NavigationItem.objects.filter(
            label__in=["Certifications", "Resume"]
        ).update(is_active=False)

        self.stdout.write(
            self.style.SUCCESS(
                "[OK] Navigation menu items seeded."
            )
        )

        # ========================================================
        # 12. FOOTER SETTINGS
        # ========================================================

        FooterSetting.objects.update_or_create(
            id="00000000-0000-0000-0000-000000000002",
            defaults={
                "description": (
                    "Antala Raj — AI Engineer and PGDM student "
                    "in Artificial Intelligence and Data Science. "
                    "Interested in Generative AI, Agentic AI, "
                    "Machine Learning, Computer Vision, and "
                    "building practical AI applications."
                ),

                "copyright_text": (
                    f"© {datetime.date.today().year} "
                    "Antala Raj. All rights reserved."
                ),

                "is_visible": True,

                "social_links": [
                    {
                        "platform": "GitHub",
                        "url": GITHUB_URL,
                        "icon": "Github"
                    },
                    {
                        "platform": "LinkedIn",
                        "url": LINKEDIN_URL,
                        "icon": "Linkedin"
                    },
                    {
                        "platform": "Email",
                        "url": f"mailto:{EMAIL}",
                        "icon": "Mail"
                    }
                ]
            }
        )

        self.stdout.write(
            self.style.SUCCESS(
                "[OK] Footer settings seeded."
            )
        )

        # ========================================================
        # 13. SEO METADATA
        # ========================================================

        SEOMetadata.objects.update_or_create(
            page_identifier="global",
            defaults={
                "title": (
                    "Antala Raj | AI Engineer | "
                    "Generative AI & Data Science"
                ),

                "meta_description": (
                    "Explore the portfolio of Antala Raj, "
                    "an AI and Data Science postgraduate student "
                    "with practical experience in AI engineering, "
                    "Generative AI, Machine Learning, and "
                    "software development."
                ),

                "keywords": (
                    "Antala Raj, Raj Antala, AI Engineer, "
                    "Generative AI, Agentic AI, Machine Learning, "
                    "Data Science, Python, LangChain, LangGraph, "
                    "Computer Vision, AI Portfolio"
                ),

                "canonical_url": "",

                "og_title": (
                    "Antala Raj | AI Engineer & Data Science"
                ),

                "og_description": (
                    "Personal portfolio showcasing practical "
                    "AI applications, Generative AI projects, "
                    "machine learning, and software development."
                ),

                "og_image_url": "",

                "robots_directive": "index, follow"
            }
        )

        self.stdout.write(
            self.style.SUCCESS(
                "[OK] SEO metadata seeded."
            )
        )

        # ========================================================
        # 14. SITE SETTINGS
        # ========================================================

        SiteSetting.objects.update_or_create(
            id="00000000-0000-0000-0000-000000000003",
            defaults={
                "site_title": (
                    "Antala Raj | AI Engineer Portfolio"
                ),

                "primary_email": EMAIL,

                "maintenance_mode": False,

                "analytics_enabled": True,

                # Resume is not available yet.
                "resume_download_enabled": False
            }
        )

        self.stdout.write(
            self.style.SUCCESS(
                "[OK] Global Site Settings seeded."
            )
        )

        # ========================================================
        # COMPLETION
        # ========================================================

        self.stdout.write(
            self.style.SUCCESS(
                "\n"
                "====================================================\n"
                " ANTALA RAJ PORTFOLIO SEEDING COMPLETED SUCCESSFULLY\n"
                "====================================================\n"
                f"Name: {FULL_NAME}\n"
                f"Email: {EMAIL}\n"
                f"GitHub: {GITHUB_URL}\n"
                f"LinkedIn: {LINKEDIN_URL}\n"
                f"Projects: {len(projects_data)}\n"
                "Fake projects: Removed\n"
                "Fake experience: Removed\n"
                "Fake certifications: Removed\n"
                "Fake testimonials: Disabled\n"
                "Profile photo: Pending\n"
                "Resume: Pending\n"
                "===================================================="
            )
        )
