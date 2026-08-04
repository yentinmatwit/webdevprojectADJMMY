from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    JOB_TYPE_CHOICES = [
        ("Full-Time", "Full-Time"),
        ("Part-Time", "Part-Time"),
        ("Internship", "Internship"),
        ("Contract", "Contract"),    
    ]

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20, blank=True)
    location = models.CharField(max_length=100, blank=True)
    school = models.CharField(max_length=150, blank=True)
    bio = models.TextField(blank=True)
    preferred_job_type = models.CharField(
        max_length=20, choices=JOB_TYPE_CHOICES, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email


class Skill(models.Model):
    user = models.ForeignKey(User, related_name="skills", on_delete=models.CASCADE)
    name = models.CharField(max_length=50)


class Education(models.Model):
    user = models.ForeignKey(User, related_name="education", on_delete=models.CASCADE)
    degree = models.CharField(max_length=150)
    institution = models.CharField(max_length=150)
    expected_grad = models.CharField(max_length=50, blank=True)

class Experience(models.Model):
    user = models.ForeignKey(User, related_name="experience", on_delete=models.CASCADE)
    title = models.CharField(max_length=150)
    company = models.CharField(max_length=150)
    date_range = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order"]