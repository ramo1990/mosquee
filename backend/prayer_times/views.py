from django.http import Http404
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from config.permissions import IsMosqueStaff
from core.permissions import MosqueScopedViewSetMixin
from content.models import MosqueProfile

from .models import DailyPrayerTime, RamadanSchedule
from .serializers import (
    DailyPrayerTimeSerializer,
    RamadanScheduleSerializer,
)


def get_fallback_prayer_time(mosque=None):
    today = timezone.localdate()

    queryset = DailyPrayerTime.objects.all()

    if mosque:
        prayer_time = queryset.filter(
            mosque=mosque,
            date=today,
        ).first()

        if not prayer_time:
            prayer_time = (
                queryset.filter(mosque=mosque)
                .order_by("-date")
                .first()
            )

        if prayer_time:
            return prayer_time

    prayer_time = queryset.filter(
        mosque__isnull=True,
        date=today,
    ).first()

    if not prayer_time:
        prayer_time = (
            queryset.filter(mosque__isnull=True)
            .order_by("-date")
            .first()
        )

    if not prayer_time:
        raise Http404("Aucun horaire de prière disponible.")

    return prayer_time


class DailyPrayerTimeViewSet(
    MosqueScopedViewSetMixin,
    viewsets.ModelViewSet,
):
    queryset = DailyPrayerTime.objects.select_related("mosque")
    serializer_class = DailyPrayerTimeSerializer

    filterset_fields = ["mosque", "date"]
    ordering_fields = ["date"]

    def get_permissions(self):
        if self.action in [
            "list",
            "retrieve",
            "today",
            "mosque_today",
        ]:
            return [permissions.AllowAny()]

        return [IsMosqueStaff()]

    def get_queryset(self):
        return self.get_scoped_queryset(
            DailyPrayerTime.objects.select_related("mosque")
        )

    def perform_create(self, serializer):
        user = self.request.user

        if not user.is_super_admin:
            if not user.mosque:
                raise PermissionDenied(
                    "Vous n'êtes associé à aucune mosquée."
                )

            serializer.save(mosque=user.mosque)
        else:
            serializer.save()

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
        permission_classes=[permissions.AllowAny],
        url_path="today",
    )
    def today(self, request):
        prayer_time = get_fallback_prayer_time()

        serializer = self.get_serializer(prayer_time)

        return Response(serializer.data)

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[permissions.AllowAny],
        url_path=r"mosque/(?P<mosque_slug>[-\w]+)/today",
    )
    def mosque_today(self, request, mosque_slug=None):
        mosque = get_object_or_404(
            MosqueProfile,
            slug=mosque_slug,
        )

        prayer_time = get_fallback_prayer_time(mosque=mosque)

        serializer = self.get_serializer(prayer_time)

        return Response(serializer.data)


class RamadanScheduleViewSet(
    MosqueScopedViewSetMixin,
    viewsets.ModelViewSet,
):
    queryset = RamadanSchedule.objects.select_related("mosque")
    serializer_class = RamadanScheduleSerializer

    filterset_fields = ["mosque", "date"]
    ordering_fields = ["date"]

    def get_permissions(self):
        if self.action in [
            "list",
            "retrieve",
            "by_mosque",
            "today_for_mosque",
        ]:
            return [permissions.AllowAny()]

        return [IsMosqueStaff()]

    def get_queryset(self):
        return self.get_scoped_queryset(
            RamadanSchedule.objects.select_related("mosque")
        )

    def perform_create(self, serializer):
        user = self.request.user

        if not user.is_super_admin:
            if not user.mosque:
                raise PermissionDenied(
                    "Vous n'êtes associé à aucune mosquée."
                )

            serializer.save(mosque=user.mosque)
        else:
            serializer.save()

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
        permission_classes=[permissions.AllowAny],
        url_path=r"mosquee/(?P<mosque_slug>[-\w]+)",
    )
    def by_mosque(self, request, mosque_slug=None):
        mosque = get_object_or_404(
            MosqueProfile,
            slug=mosque_slug,
        )

        queryset = RamadanSchedule.objects.filter(
            mosque=mosque,
        ).order_by("date")

        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[permissions.AllowAny],
        url_path=r"mosquee/(?P<mosque_slug>[-\w]+)/today",
    )
    def today_for_mosque(self, request, mosque_slug=None):
        mosque = get_object_or_404(
            MosqueProfile,
            slug=mosque_slug,
        )

        today = timezone.localdate()

        schedule = (
            RamadanSchedule.objects
            .filter(mosque=mosque, date=today)
            .first()
        )

        if not schedule:
            schedule = (
                RamadanSchedule.objects
                .filter(mosque=mosque, date__gte=today)
                .order_by("date")
                .first()
            )

        if not schedule:
            return Response(
                {"detail": "Aucun programme Ramadan disponible."},
                status=404,
            )

        serializer = self.get_serializer(schedule)

        return Response(serializer.data)