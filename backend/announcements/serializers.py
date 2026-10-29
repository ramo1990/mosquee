from rest_framework import serializers

from content.models import MosqueProfile
from screens.models import Screen, ScreenGroup

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

    mosque = serializers.SlugRelatedField(
        slug_field="slug",
        read_only=True,
    )

    class Meta:
        model = Announcement
        fields = [
            "id",
            "mosque",
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


class AnnouncementCreateSerializer(serializers.ModelSerializer):
    mosque = serializers.SlugRelatedField(
        slug_field="slug",
        queryset=MosqueProfile.objects.all(),
        required=False,
        allow_null=True,
    )

    target_group = serializers.PrimaryKeyRelatedField(
        queryset=ScreenGroup.objects.all(),
        required=False,
        allow_null=True,
    )

    target_screen = serializers.PrimaryKeyRelatedField(
        queryset=Screen.objects.all(),
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Announcement
        fields = [
            "mosque",
            "target_type",
            "target_group",
            "target_screen",
            "title",
            "body",
            "priority",
            "image",
            "is_active",
            "show_on_screen",
            "starts_at",
            "ends_at",
        ]

    def validate(self, attrs):
        target_type = attrs.get(
            "target_type",
            getattr(self.instance, "target_type", None),
        )

        target_group = attrs.get(
            "target_group",
            getattr(self.instance, "target_group", None),
        )

        target_screen = attrs.get(
            "target_screen",
            getattr(self.instance, "target_screen", None),
        )

        if (
            target_type == Announcement.AnnouncementTarget.GROUP
            and not target_group
        ):
            raise serializers.ValidationError(
                {
                    "target_group": "Un groupe d’écrans est requis pour ce type de cible."
                }
            )

        if (
            target_type == Announcement.AnnouncementTarget.SCREEN
            and not target_screen
        ):
            raise serializers.ValidationError(
                {
                    "target_screen": "Un écran est requis pour ce type de cible."
                }
            )

        if target_type == Announcement.AnnouncementTarget.ALL:
            attrs["target_group"] = None
            attrs["target_screen"] = None

        starts_at = attrs.get(
            "starts_at",
            getattr(self.instance, "starts_at", None),
        )

        ends_at = attrs.get(
            "ends_at",
            getattr(self.instance, "ends_at", None),
        )

        if starts_at and ends_at and ends_at <= starts_at:
            raise serializers.ValidationError(
                {
                    "ends_at": "La fin d’affichage doit être postérieure au début."
                }
            )

        return attrs


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