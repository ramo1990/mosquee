from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from config.permissions import IsMosqueStaff
from core.permissions import MosqueScopedViewSetMixin
from content.models import MosqueProfile
from screens.models import Screen

from .models import Announcement
from .serializers import (
    AnnouncementCreateSerializer,
    AnnouncementSerializer,
    PublicAnnouncementSerializer,
)


def ends_at_null_or_future(now):
    return Q(ends_at__isnull=True) | Q(ends_at__gte=now)


class AnnouncementViewSet(
    MosqueScopedViewSetMixin,
    viewsets.ModelViewSet,
):
    queryset = Announcement.objects.select_related(
        "mosque",
        "target_group",
        "target_screen",
    )

    permission_classes = [IsMosqueStaff]

    filterset_fields = [
        "mosque",
        "priority",
        "is_active",
        "show_on_screen",
        "target_type",
    ]

    search_fields = ["title", "body"]
    ordering_fields = [
        "priority",
        "starts_at",
        "created_at",
    ]

    def get_serializer_class(self):
        if self.action in [
            "create",
            "update",
            "partial_update",
        ]:
            return AnnouncementCreateSerializer

        return AnnouncementSerializer

    def get_queryset(self):
        queryset = self.get_scoped_queryset(
            Announcement.objects.all()
        )

        if not self.request.user.is_authenticated:
            queryset = queryset.filter(is_active=True)

        return queryset

    def perform_create(self, serializer):
        user = self.request.user

        if not user.is_super_admin:
            if not user.mosque:
                raise PermissionDenied(
                    "Vous n'êtes associé à aucune mosquée."
                )

            serializer.save(
                created_by=user,
                mosque=user.mosque,
            )
        else:
            serializer.save(created_by=user)

    def perform_update(self, serializer):
        instance = self.get_object()
        self.validate_mosque_access(instance)

        serializer.save()

    def perform_destroy(self, instance):
        self.validate_mosque_access(instance)
        instance.delete()

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[AllowAny],
        url_path="public",
    )
    def public_list(self, request):
        now = timezone.now()

        queryset = (
            Announcement.objects
            .filter(
                is_active=True,
                starts_at__lte=now,
            )
            .filter(ends_at_null_or_future(now))
            .order_by("-priority", "-created_at")
        )

        serializer = PublicAnnouncementSerializer(
            queryset,
            many=True,
            context={"request": request},
        )

        return Response(serializer.data)

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[AllowAny],
        url_path=r"mosquee/(?P<mosque_slug>[-\w]+)",
    )
    def mosque_list(self, request, mosque_slug=None):
        now = timezone.now()

        mosque = get_object_or_404(
            MosqueProfile,
            slug=mosque_slug,
        )

        queryset = (
            Announcement.objects
            .filter(
                mosque=mosque,
                is_active=True,
                starts_at__lte=now,
            )
            .filter(ends_at_null_or_future(now))
            .order_by("-priority", "-created_at")
        )

        serializer = PublicAnnouncementSerializer(
            queryset,
            many=True,
            context={"request": request},
        )

        return Response(serializer.data)

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[AllowAny],
        url_path=r"screen/(?P<screen_slug>[-\w]+)",
    )
    def screen_list(self, request, screen_slug=None):
        now = timezone.now()

        screen = get_object_or_404(
            Screen,
            slug=screen_slug,
            is_active=True,
        )

        announcements = [
            announcement
            for announcement in Announcement.objects
            .filter(
                is_active=True,
                show_on_screen=True,
                starts_at__lte=now,
            )
            .filter(ends_at_null_or_future(now))
            .order_by("-priority", "-created_at")
            if announcement.is_visible_for_screen(screen)
        ]

        serializer = PublicAnnouncementSerializer(
            announcements,
            many=True,
            context={"request": request},
        )

        return Response(serializer.data)