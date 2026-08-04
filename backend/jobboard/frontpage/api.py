from frontpage.models import Job
from rest_framework import viewsets, permissions
from .serializers import JobSerializer

# Job Viewset
class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = JobSerializer