from django.utils import timezone

from rest_framework import generics, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from config.permissions import IsAdminOrStaff

from .models import (
    ContactMessage,
    GalleryAlbum,
    MosqueProfile,
    NewsArticle,
    QuranVerse,
)
from .serializers import (
    ContactMessageAdminSerializer,
    ContactMessageCreateSerializer,
    GalleryAlbumDetailSerializer,
    GalleryAlbumListSerializer,
    MosqueProfileSerializer,
    NewsArticleDetailSerializer,
    NewsArticleListSerializer,
    QuranVerseSerializer,
)


class MosqueProfileListView(generics.ListAPIView):
    queryset = MosqueProfile.objects.order_by("name")
    serializer_class = MosqueProfileSerializer
    permission_classes = [permissions.AllowAny]


class MosqueProfileDetailView(generics.RetrieveAPIView):
    queryset = MosqueProfile.objects.all()
    serializer_class = MosqueProfileSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"


class MosqueProfileView(generics.RetrieveAPIView):
    queryset = MosqueProfile.objects.all()
    serializer_class = MosqueProfileSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        return MosqueProfile.objects.first()


class NewsArticleViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"
    filterset_fields = ["is_published"]
    search_fields = ["title", "excerpt", "body"]
    ordering_fields = ["published_at", "created_at"]

    def get_queryset(self):
        queryset = NewsArticle.objects.all()

        if not self.request.user.is_authenticated:
            queryset = queryset.filter(is_published=True)

        return queryset.order_by("-published_at", "-created_at")

    def get_serializer_class(self):
        if self.action == "list":
            return NewsArticleListSerializer

        return NewsArticleDetailSerializer


class GalleryAlbumViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"
    filterset_fields = ["event"]
    search_fields = ["title", "description"]
    ordering_fields = ["created_at"]

    def get_queryset(self):
        return GalleryAlbum.objects.prefetch_related("images").order_by(
            "-created_at"
        )

    def get_serializer_class(self):
        if self.action == "list":
            return GalleryAlbumListSerializer

        return GalleryAlbumDetailSerializer


class QuranVerseViewSet(viewsets.ModelViewSet):
    queryset = QuranVerse.objects.all()
    serializer_class = QuranVerseSerializer
    permission_classes = [IsAdminOrStaff]
    filterset_fields = ["is_active", "target_type"]
    search_fields = ["reference", "arabic", "translation"]
    ordering_fields = ["order"]

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[permissions.AllowAny],
        url_path=r"screen/(?P<screen_slug>[-\w]+)",
    )
    def for_screen(self, request, screen_slug=None):
        from django.db.models import Q
        from django.shortcuts import get_object_or_404
        from screens.models import Screen

        screen = get_object_or_404(
            Screen,
            slug=screen_slug,
            is_active=True,
        )

        queryset = (
            QuranVerse.objects.filter(is_active=True)
            .filter(
                Q(target_type=QuranVerse.QuranVerseTarget.ALL)
                | Q(target_screens=screen)
            )
            .order_by("order")
        )

        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)


class ContactMessageView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageCreateSerializer
    permission_classes = [permissions.AllowAny]


class ContactMessageAdminViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.order_by("-created_at")
    serializer_class = ContactMessageAdminSerializer
    permission_classes = [IsAdminOrStaff]
    filterset_fields = ["is_read"]
    search_fields = [
        "full_name",
        "phone",
        "email",
        "subject",
        "message",
    ]


class MosqueNewsListView(generics.ListAPIView):
    serializer_class = NewsArticleListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        mosque = get_object_or_404(
            MosqueProfile,
            slug=self.kwargs["slug"],
        )

        return (
            NewsArticle.objects
            .filter(mosque=mosque, is_published=True)
            .order_by("-published_at", "-created_at")
        )


class MosqueAlbumsListView(generics.ListAPIView):
    serializer_class = GalleryAlbumListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        mosque = get_object_or_404(
            MosqueProfile,
            slug=self.kwargs["slug"],
        )

        return (
            GalleryAlbum.objects
            .filter(mosque=mosque)
            .prefetch_related("images")
            .order_by("-created_at")
        )


class MosqueContactMessageView(generics.CreateAPIView):
    serializer_class = ContactMessageCreateSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_context(self):
        context = super().get_serializer_context()

        mosque = get_object_or_404(
            MosqueProfile,
            slug=self.kwargs["slug"],
        )

        context["mosque"] = mosque

        return context