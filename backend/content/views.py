# content/views.py
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from config.permissions import IsMosqueStaff
from .models import (
    ContactMessage,
    GalleryAlbum,
    GalleryImage,
    MosqueProfile,
    NewsArticle,
    QuranVerse,
)
from .serializers import (
    ContactMessageSerializer,
    GalleryAlbumSerializer,
    GalleryImageSerializer,
    MosqueProfileSerializer,
    NewsArticleSerializer,
    QuranVerseSerializer,
)


class MosqueProfileViewSet(viewsets.ModelViewSet):
    queryset = MosqueProfile.objects.all()
    serializer_class = MosqueProfileSerializer
    permission_classes = [IsMosqueStaff]

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[AllowAny],
        url_path="public",
    )
    def public_profile(self, request):
        profile = MosqueProfile.objects.first()
        serializer = self.get_serializer(profile)
        return Response(serializer.data)


class NewsArticleViewSet(viewsets.ModelViewSet):
    queryset = NewsArticle.objects.select_related("created_by")
    serializer_class = NewsArticleSerializer
    permission_classes = [IsMosqueStaff]
    filterset_fields = ["is_published"]
    search_fields = ["title", "excerpt", "body"]
    ordering_fields = ["published_at", "created_at"]

    def get_permissions(self):
        if self.action in ["list", "retrieve", "public_list"]:
            return [AllowAny()]
        return super().get_permissions()

    @action(
        detail=False,
        methods=["get"],
        url_path="public",
    )
    def public_list(self, request):
        queryset = NewsArticle.objects.filter(is_published=True)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class GalleryAlbumViewSet(viewsets.ModelViewSet):
    queryset = GalleryAlbum.objects.prefetch_related("images")
    serializer_class = GalleryAlbumSerializer
    permission_classes = [IsMosqueStaff]
    search_fields = ["title", "description"]


class GalleryImageViewSet(viewsets.ModelViewSet):
    queryset = GalleryImage.objects.select_related("album")
    serializer_class = GalleryImageSerializer
    permission_classes = [IsMosqueStaff]
    filterset_fields = ["album"]


class QuranVerseViewSet(viewsets.ModelViewSet):
    queryset = QuranVerse.objects.all()
    serializer_class = QuranVerseSerializer
    permission_classes = [IsMosqueStaff]
    filterset_fields = ["is_active"]
    search_fields = ["reference", "translation"]

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[AllowAny],
        url_path="random",
    )
    def random_verse(self, request):
        verse = QuranVerse.objects.filter(is_active=True).order_by("?").first()
        serializer = self.get_serializer(verse)
        return Response(serializer.data)


class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [IsMosqueStaff]
    filterset_fields = ["is_read"]
    search_fields = ["full_name", "subject", "message"]

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[AllowAny],
        url_path="send",
    )
    def send_message(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"detail": "Votre message a bien été envoyé."},
            status=201,
        )