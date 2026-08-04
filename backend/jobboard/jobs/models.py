from django.conf import settings
from django.db import models

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Job(models.Model):
    JOB_TYPE_CHOICES = [
        ("Full-Time", "Full-Time"),
        ("Part-Time", "Part-Time"),
        ("Internship", "Internship"),
        ("Contract", "Contract"),    
    ]
    EXPERIENCE_CHOICES = [
        ("Entry Level", "Entry Level"),
        ("Mid Level", "Mid Level"),
        ("Senior", "Senior"),
    ]

    title = models.CharField(max_length=150)
    company = models.CharField(max_length=150)
    location = models.CharField(max_length=100)
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES)
    industry = models.CharField(max_length=150)
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_CHOICES)
    description = models.TextField(blank=True)
    tags = models.ManyToManyField(Tag, related_name="jobs", blank=True)
    posted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-posted_at"]

    def __str__(self):
        return f"{self.title} @ {self.company}"


class SavedJob(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="saved_jobs", on_delete=models.CASCADE)
    job = models.ForeignKey(Job, related_name="saved_by", on_delete=models.CASCADE)
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "job")