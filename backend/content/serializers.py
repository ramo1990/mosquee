# content/serializers.py
from rest_framework import serializers

from .models import (
    ContactMessage,
    GalleryAlbum,
    GalleryImage,
    MosqueProfile,
    NewsArticle,
    QuranVerse,
)


class MosqueProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = MosqueProfile
        fields = [
            "id",
            "name",
            "slug",
            "slogan",
            "description",
            "address",
            "city",
            "latitude",
            "longitude",
            "phone",
            "whatsapp",
            "email",
            "facebook",
            "youtube",
            "logo",
            "cover_image",
        ]


class NewsArticleListSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsArticle
        fields = [
            "id",
            "title",
            "slug",
            "excerpt",
            "image",
            "is_published",
            "published_at",
            "created_at",
        ]

class NewsArticleDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsArticle
        fields = [
            "id",
            "title",
            "slug",
            "excerpt",
            "body",
            "image",
            "is_published",
            "published_at",
            "created_at",
            "updated_at",
        ]


class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = [
            "id",
            "image",
            "caption",
            "uploaded_at",
        ]


class GalleryAlbumListSerializer(serializers.ModelSerializer):
    cover_image = serializers.SerializerMethodField()
    images_count = serializers.SerializerMethodField()

    class Meta:
        model = GalleryAlbum
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "event",
            "created_at",
            "cover_image",
            "images_count",
        ]

    def get_cover_image(self, obj):
        first_image = obj.images.first()

        return first_image.image.url if first_image else None

    def get_images_count(self, obj):
        return obj.images.count()


class GalleryAlbumDetailSerializer(serializers.ModelSerializer):
    images = GalleryImageSerializer(many=True, read_only=True)

    class Meta:
        model = GalleryAlbum
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "event",
            "created_at",
            "images",
        ]


class QuranVerseSerializer(serializers.ModelSerializer):
    target_screens = serializers.PrimaryKeyRelatedField(
        many=True,
        read_only=True,
    )

    class Meta:
        model = QuranVerse
        fields = [
            "id",
            "arabic",
            "translation",
            "reference",
            "is_active",
            "order",
            "target_type",
            "target_screens",
        ]


class ContactMessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = [
            "full_name",
            "phone",
            "email",
            "subject",
            "message",
        ]

    def create(self, validated_data):
        mosque = self.context.get("mosque")

        validated_data["mosque"] = mosque

        return super().create(validated_data)


class ContactMessageAdminSerializer(serializers.ModelSerializer):
    mosque = serializers.SlugRelatedField(
        slug_field="slug",
        read_only=True,
    )
    class Meta:
        model = ContactMessage
        fields = [
            "id",
            "mosque",
            "full_name",
            "phone",
            "email",
            "subject",
            "message",
            "is_read",
            "created_at",
        ]