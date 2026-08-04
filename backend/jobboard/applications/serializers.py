from rest_framework import serializers
from .models import Application, Activity
from jobs.serializers import JobSerializer


class ApplicationSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)

    class Meta:
        model = Application
        fields = ["id", "job", "status", "date_applied", "notes"]


class ApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ["status"]


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ["id", "message", "color", "created_at"]


class DashboardSummarySerializer(serializers.Serializer):
    applications_sent = serializers.IntegerField()
    interviews_scheduled = serializers.IntegerField()
    saved_jobs = serializers.IntegerField()
    offers_received = serializers.IntegerField()