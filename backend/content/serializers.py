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
        fields = "__all__"


class NewsArticleSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(
        source="created_by.get_full_name",
        read_only=True,
    )

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
            "author_name",
            "created_at",
            "updated_at",
        ]


class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = [
            "id",
            "album",
            "image",
            "caption",
            "uploaded_at",
        ]


class GalleryAlbumSerializer(serializers.ModelSerializer):
    images = GalleryImageSerializer(many=True, read_only=True)

    class Meta:
        model = GalleryAlbum
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "event",
            "images",
            "created_at",
        ]


class QuranVerseSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuranVerse
        fields = [
            "id",
            "arabic",
            "translation",
            "reference",
            "is_active",
            "order",
        ]


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = [
            "id",
            "full_name",
            "phone",
            "email",
            "subject",
            "message",
            "is_read",
            "created_at",
        ]
        read_only_fields = ["is_read", "created_at"]