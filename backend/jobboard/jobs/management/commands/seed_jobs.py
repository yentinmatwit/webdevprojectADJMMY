"""
Management command to populate the database with fake job listings.

Usage:
    python manage.py seed_jobs
    python manage.py seed_jobs --clear   # wipe existing Job/Tag rows first

Place this file at: jobs/management/commands/seed_jobs.py
(create the jobs/management/ and jobs/management/commands/ folders,
each with an empty __init__.py, if they don't exist yet)
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from jobs.models import Job, Tag


JOBS_DATA = [
    {
        "title": "Frontend Developer",
        "company": "TechNova Inc.",
        "location": "Boston, MA",
        "job_type": "Full-Time",
        "industry": "Technology",
        "experience_level": "Entry Level",
        "description": "Build and maintain responsive UI components for our internal dashboard using React and REST APIs.",
        "tags": ["HTML", "CSS", "JavaScript", "React"],
    },
    {
        "title": "Data Analyst",
        "company": "FinEdge Corp.",
        "location": "New York, NY",
        "job_type": "Full-Time",
        "industry": "Finance",
        "experience_level": "Mid Level",
        "description": "Analyze financial datasets and build dashboards to support investment decision-making.",
        "tags": ["SQL", "Python", "Excel", "Tableau"],
    },
    {
        "title": "UX Design Intern",
        "company": "Creativa Labs",
        "location": "Remote",
        "job_type": "Internship",
        "industry": "Technology",
        "experience_level": "Entry Level",
        "description": "Assist the design team with wireframes, prototypes, and user research for a consumer mobile app.",
        "tags": ["Figma", "User Research", "Prototyping"],
    },
    {
        "title": "Marketing Coordinator",
        "company": "BrightPath Media",
        "location": "Chicago, IL",
        "job_type": "Full-Time",
        "industry": "Marketing",
        "experience_level": "Entry Level",
        "description": "Support campaign planning, content creation, and performance reporting across digital channels.",
        "tags": ["SEO", "Content", "Analytics"],
    },
    {
        "title": "Registered Nurse",
        "company": "CityHealth Hospital",
        "location": "Boston, MA",
        "job_type": "Full-Time",
        "industry": "Healthcare",
        "experience_level": "Mid Level",
        "description": "Provide direct patient care on our medical-surgical unit, including monitoring and documentation.",
        "tags": ["Patient Care", "EMR"],
    },
    {
        "title": "Backend Engineer",
        "company": "CloudSync Systems",
        "location": "San Francisco, CA",
        "job_type": "Full-Time",
        "industry": "Technology",
        "experience_level": "Senior",
        "description": "Design and scale distributed services powering our cloud storage platform.",
        "tags": ["Node.js", "AWS", "PostgreSQL"],
    },
    {
        "title": "Teaching Assistant",
        "company": "Wentworth Institute",
        "location": "Boston, MA",
        "job_type": "Part-Time",
        "industry": "Education",
        "experience_level": "Entry Level",
        "description": "Support course instructors with grading, tutoring, and lab supervision for intro CS courses.",
        "tags": ["Tutoring", "Grading"],
    },
    {
        "title": "QA Test Engineer",
        "company": "DevOps United",
        "location": "Remote",
        "job_type": "Contract",
        "industry": "Technology",
        "experience_level": "Mid Level",
        "description": "Write and maintain automated test suites and CI pipelines for a fintech SaaS product.",
        "tags": ["Selenium", "Jest", "CI/CD"],
    },
    {
        "title": "Graphic Designer",
        "company": "Studio Pixel",
        "location": "Austin, TX",
        "job_type": "Full-Time",
        "industry": "Marketing",
        "experience_level": "Entry Level",
        "description": "Create branding assets, social graphics, and print materials for a range of small business clients.",
        "tags": ["Adobe Illustrator", "Photoshop", "Branding"],
    },
    {
        "title": "DevOps Engineer",
        "company": "Nimbus Cloud Co.",
        "location": "Remote",
        "job_type": "Full-Time",
        "industry": "Technology",
        "experience_level": "Senior",
        "description": "Own our Kubernetes infrastructure and deployment pipelines, and improve system observability.",
        "tags": ["Kubernetes", "Docker", "AWS", "Terraform"],
    },
    {
        "title": "Financial Analyst Intern",
        "company": "Meridian Capital",
        "location": "New York, NY",
        "job_type": "Internship",
        "industry": "Finance",
        "experience_level": "Entry Level",
        "description": "Assist the analytics team with building financial models and preparing investor reports.",
        "tags": ["Excel", "Financial Modeling"],
    },
    {
        "title": "Product Manager",
        "company": "Lumen Software",
        "location": "Seattle, WA",
        "job_type": "Full-Time",
        "industry": "Technology",
        "experience_level": "Mid Level",
        "description": "Own the roadmap for our analytics product line, working closely with engineering and design.",
        "tags": ["Roadmapping", "Agile", "Analytics"],
    },
    {
        "title": "Physical Therapist Assistant",
        "company": "MotionWell Clinic",
        "location": "Denver, CO",
        "job_type": "Part-Time",
        "industry": "Healthcare",
        "experience_level": "Entry Level",
        "description": "Support licensed therapists in delivering rehabilitation programs for outpatient clients.",
        "tags": ["Patient Care", "Rehabilitation"],
    },
    {
        "title": "Machine Learning Engineer",
        "company": "Insight AI",
        "location": "Remote",
        "job_type": "Full-Time",
        "industry": "Technology",
        "experience_level": "Senior",
        "description": "Build and deploy production ML models for fraud detection at scale.",
        "tags": ["Python", "PyTorch", "MLOps"],
    },
    {
        "title": "HR Coordinator",
        "company": "BrightPath Media",
        "location": "Chicago, IL",
        "job_type": "Full-Time",
        "industry": "Marketing",
        "experience_level": "Entry Level",
        "description": "Support recruiting, onboarding, and employee engagement initiatives for a growing agency.",
        "tags": ["Recruiting", "Onboarding"],
    },
    {
        "title": "High School Math Teacher",
        "company": "Riverside Academy",
        "location": "Philadelphia, PA",
        "job_type": "Full-Time",
        "industry": "Education",
        "experience_level": "Mid Level",
        "description": "Teach Algebra II and Pre-Calculus to grades 10-11, including curriculum development.",
        "tags": ["Curriculum Design", "Classroom Management"],
    },
    {
        "title": "IT Support Specialist",
        "company": "Wentworth IT Services",
        "location": "Boston, MA",
        "job_type": "Part-Time",
        "industry": "Technology",
        "experience_level": "Entry Level",
        "description": "Provide first-line technical support to students and staff, and maintain lab equipment.",
        "tags": ["Troubleshooting", "Networking"],
    },
    {
        "title": "Content Marketing Specialist",
        "company": "GreenLeaf Organics",
        "location": "Remote",
        "job_type": "Contract",
        "industry": "Marketing",
        "experience_level": "Mid Level",
        "description": "Write and manage blog, email, and social content for a sustainable consumer goods brand.",
        "tags": ["Copywriting", "SEO", "Email Marketing"],
    },
    {
        "title": "Clinical Research Coordinator",
        "company": "CityHealth Hospital",
        "location": "Boston, MA",
        "job_type": "Full-Time",
        "industry": "Healthcare",
        "experience_level": "Mid Level",
        "description": "Coordinate patient enrollment and data collection for ongoing clinical trials.",
        "tags": ["Clinical Trials", "Data Collection", "EMR"],
    },
    {
        "title": "Full Stack Developer Intern",
        "company": "TechNova Inc.",
        "location": "Boston, MA",
        "job_type": "Internship",
        "industry": "Technology",
        "experience_level": "Entry Level",
        "description": "Work across the stack building features for our internal tools using React and Node.js.",
        "tags": ["JavaScript", "React", "Node.js", "MySQL"],
    },
]


class Command(BaseCommand):
    help = "Seed the database with fake job listings for development/testing."

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Delete all existing Job and Tag rows before seeding.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        if options["clear"]:
            self.stdout.write("Clearing existing Job and Tag rows...")
            Job.objects.all().delete()
            Tag.objects.all().delete()

        created_count = 0
        for entry in JOBS_DATA:
            job, was_created = Job.objects.get_or_create(
                title=entry["title"],
                company=entry["company"],
                defaults={
                    "location": entry["location"],
                    "job_type": entry["job_type"],
                    "industry": entry["industry"],
                    "experience_level": entry["experience_level"],
                    "description": entry["description"],
                },
            )

            if was_created:
                created_count += 1

            tag_objs = []
            for tag_name in entry["tags"]:
                tag_obj, _ = Tag.objects.get_or_create(name=tag_name)
                tag_objs.append(tag_obj)
            job.tags.set(tag_objs)

        self.stdout.write(
            self.style.SUCCESS(
                f"Done. {created_count} new job(s) created, "
                f"{len(JOBS_DATA) - created_count} already existed and were updated."
            )
        )
