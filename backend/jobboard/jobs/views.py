import django_filters
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q

from .models import Job, SavedJob
from .serializers import JobSerializer, SavedJobSerializer
from applications.models import Application, Activity


class JobFilter(django_filters.FilterSet):
    keyword = django_filters.CharFilter(method="filter_keyword")

    class Meta:
        model = Job
        fields = ["location", "industry", "job_type", "experience_level"]


    def filter_keyword(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value)
            | Q(company__icontains=value)
            | Q(tags__name__icontains=value)
        ).distinct()


class JobListView(generics.ListAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]
    filterset_class = JobFilter

    def get_serializer_context(self):
        return {"request": self.request}


class JobDetailView(generics.RetrieveAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_context(self):
        return {"request": self.request}


class ApplyToJobView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
             job = Job.objects.get(pk=pk)
        except Job.DoesNotExits:
            return Response({"detail": "Job not found."}, status=status.HTTP_404_NOT_FOUND)

        application, created = Application.objects.get_or_create(
            user=request.user, job=job
        )
        if not created:
            return Response(
                {"detail", "You've already applied to this job."},
                status=status.HTTP_400_BAD_REQUEST
            )

        Activity.objects.create(
            user=request.user,
            application=application,
            message=f"Applied to {job.title} - {job.company}",
            color="blue",
        )
        return Response({"detail": "Application submitted."}, status=status.HTTP_201_CREATED)


class SaveJobView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            job = Job.objects.get(pk=pk)
        except Job.DoesNotExist:
            return Response({"detail": "Job not found."}, status=status.HTTP_404_NOT_FOUND)

        saved, created = SavedJob.objects.get_or_create(user=request.user, job=job)
        if not created:
            return Response({"detail": "Job already saved."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Job saved."}, status=status.HTTP_201_CREATED)


class SavedJobListView(generics.ListAPIView):
    serializer_class = SavedJobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SavedJob.objects.filter(user=self.request.user).select_related("job")


class SavedJobDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        deleted, _ = SavedJob.objects.filter(user=request.user, job_id=pk).delete()
        if not deleted:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)