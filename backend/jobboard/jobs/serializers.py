from rest_framework import serializers
from .models import Job, Tag, SavedJob

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["name"]


class JobSerializer(serializers.ModelSerializer):
    tags = serializers.SlugRelatedField(many=True, read_only=True, slug_field="name")
    is_saved = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            "id", "title", "company", "location", "job_type", "industry", "experience_level", "description", "tags", "posted_at", "is_saved",
        ]


    def get_is_saved(self, obj):
        user = self.context["request"].user
        if not user.is_authenticated:
            return False
        return obj.saved_by.filter(user=user).exists()


class SavedJobSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    job_id = serializers.PrimaryKeyRelatedField(
        queryset=Job.objects.all(), source="job", write_only=True
    )

    class Meta:
        model = SavedJob
        fields = ["id", "job", "job_id", "saved_at"]