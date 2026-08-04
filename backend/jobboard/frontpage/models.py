from django.db import models

class Job(models.Model):
    job_name = models.CharField(max_length = 100)
    company_name = models.CharField(max_length = 100, unique = True)
    description = models.CharField(max_length = 500, blank = True)
    created_at = models.DateTimeField(auto_now_add = True)
