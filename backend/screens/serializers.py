from rest_framework import serializers

from .models import Screen, ScreenContent


class ScreenContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScreenContent
        fields = [
            "id",
            "screen",
            "title",
            "body",
            "image",
            "order",
            "is_active",
        ]


class ScreenSerializer(serializers.ModelSerializer):
    mosque = serializers.SlugRelatedField(
        slug_field="slug",
        read_only=True,
    )

    contents = ScreenContentSerializer(many=True, read_only=True)

    class Meta:
        model = Screen
        fields = [
            "id",
            "mosque",
            "name",
            "slug",
            "location",
            "pairing_code",
            "is_online",
            "last_seen_at",
            "announcement_duration",
            "verse_duration",
            "night_mode_start",
            "night_mode_end",
            "group",
            "contents",
        ]
        read_only_fields = [
            "pairing_code",
            "is_online",
            "last_seen_at",
        ]