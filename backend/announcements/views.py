# announcements/views.py
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from config.permissions import IsMosqueStaff
from .models import Announcement
from .serializers import (
    AnnouncementSerializer,
    PublicAnnouncementSerializer,
)

from django.db.models import Q

def models_q_ends_at_null_or_future(now):
    return Q(ends_at__isnull=True) | Q(ends_at__gte=now)

class AnnouncementViewSet(viewsets.ModelViewSet):
    serializer_class = AnnouncementSerializer
    permission_classes = [IsMosqueStaff]
    filterset_fields = [
        "priority",
        "is_active",
        "show_on_screen",
    ]
    search_fields = ["title", "body"]
    ordering_fields = [
        "priority",
        "starts_at",
        "created_at",
    ]

    def get_queryset(self):
        return Announcement.objects.all()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[AllowAny],
        url_path="public",
    )
    def public_list(self, request):
        now = timezone.now()
        queryset = Announcement.objects.filter(
            is_active=True,
            starts_at__lte=now,
        ).filter(
            models_q_ends_at_null_or_future(now)
        ).order_by("-priority", "-created_at")

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
        url_path="screen",
    )
    def screen_list(self, request):
        now = timezone.now()
        queryset = Announcement.objects.filter(
            is_active=True,
            show_on_screen=True,
            starts_at__lte=now,
        ).filter(
            models_q_ends_at_null_or_future(now)
        ).order_by("-priority", "-created_at")

        serializer = PublicAnnouncementSerializer(
            queryset,
            many=True,
            context={"request": request},
        )
        return Response(serializer.data)