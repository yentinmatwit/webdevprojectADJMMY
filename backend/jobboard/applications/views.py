from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Application, Activity
from .serializers import (
    ApplicationSerializer, ApplicationStatusUpdateSerializer, ActivitySerializer, DashboardSummarySerializer,
)
from jobs.models import SavedJob


class ApplicationListView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Application.objects.filter(user=self.request.user).select_related("job")
        status_param = self.request.query_params.get("status")
        if status_param:
            qs = qs.filter(status=status_param)
        return qs


class ApplicationDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(user=self.request.user).select_related("job")

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return ApplicationStatusUpdateSerializer
        return ApplicationSerializer

    def perform_update(self, serializer):
        application = serializer.save()
        Activity.objects.create(
            user = self.request.user,
            application = application,
            message = f"Status updated to {application.status} - {application.job.company}",
            color = "orange"
        )


class WithdrawApplicationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        try:
            application = Application.objects.get(pk=pk, user=request.user)
        except Application.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        job_title, company = application.job.title, application.job.company
        application.delete()

        Activity.objects.create(
            user=request.user,
            message=f"Withdrew applicaiton - {job_title} at {company}",
            color="orange"
        )
        return Response(status=status.HTTP_204_NO_CONTENT)


class DashboardSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            "application_sent": Application.objects.filter(user=user).count(),
            "interviews_scheduled": Application.objects.filter(user=user, status = "Interview").count(),
            "saved_jobs": SavedJob.objects.filter(user=user).count(),
            "offers_received": Application.objects.filter(user=user, status="Offered").count()
        }
        serializer = DashboardSummarySerializer(data)
        return Response(serializer.data)


class ActivityListView(generics.ListAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Activity.objects.filter(user=self.request.user)[:20]