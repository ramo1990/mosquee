# prayer_times/views.py
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from config.permissions import IsMosqueStaff
from .models import DailyPrayerTime, RamadanSchedule
from .serializers import (
    DailyPrayerTimeSerializer,
    RamadanScheduleSerializer,
)


class DailyPrayerTimeViewSet(viewsets.ModelViewSet):
    queryset = DailyPrayerTime.objects.all()
    serializer_class = DailyPrayerTimeSerializer
    permission_classes = [IsMosqueStaff]
    filterset_fields = ["date"]
    ordering_fields = ["date"]

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[AllowAny],
        url_path="today",
    )
    def today(self, request):
        prayer_time = DailyPrayerTime.objects.filter(
            date=timezone.localdate(),
        ).first()

        if not prayer_time:
            return Response({"detail": "Aucun horaire disponible pour aujourd’hui."})

        serializer = self.get_serializer(prayer_time)
        return Response(serializer.data)


class RamadanScheduleViewSet(viewsets.ModelViewSet):
    queryset = RamadanSchedule.objects.all()
    serializer_class = RamadanScheduleSerializer
    permission_classes = [IsMosqueStaff]
    filterset_fields = ["date"]
    ordering_fields = ["date"]