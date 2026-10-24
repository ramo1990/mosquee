# announcements/serializers.py
from rest_framework import serializers
from .models import Announcement


class AnnouncementSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(
        source="created_by.get_full_name",
        read_only=True,
    )
    is_visible = serializers.BooleanField(
        source="is_currently_visible",
        read_only=True,
    )

    class Meta:
        model = Announcement
        fields = [
            "id",
            "title",
            "body",
            "priority",
            "image",
            "is_active",
            "show_on_screen",
            "starts_at",
            "ends_at",
            "is_visible",
            "created_by",
            "created_by_name",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "created_by",
            "created_at",
            "updated_at",
            "is_visible",
        ]


class PublicAnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = [
            "id",
            "title",
            "body",
            "priority",
            "image",
            "starts_at",
            "ends_at",
        ]