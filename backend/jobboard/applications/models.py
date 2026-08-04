from django.conf import settings
from django.db import models
from jobs.models import Job


class Application(models.Model):
    STATUS_CHOICES = [
        ("Applied", "Applied"),
        ("Interview", "Interview"),
        ("Offered", "Offered"),
        ("Rejected", "Rejected"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="applications", on_delete=models.CASCADE)
    job = models.ForeignKey(Job, related_name="applications", on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Applied")
    date_applied = models.DateField(auto_now_add=True)
    notes = models.TextField(blank=True)

    class Meta:
        unique_together = ("user", "job")
        ordering = ["-date_applied"]


class Activity(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="activities", on_delete=models.CASCADE)
    application = models.ForeignKey(Application, null=True, blank=True, on_delete=models.CASCADE)
    message = models.CharField(max_length=225)
    color = models.CharField(max_length=10, default="blue")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]