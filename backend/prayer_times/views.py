
from django.utils import timezone
from rest_framework import status, viewsets
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
        today = timezone.localdate()

        prayer_time = (
            DailyPrayerTime.objects
            .filter(date__lte=today)
            .order_by("-date")
            .first()
        )

        if prayer_time is None:
            return Response(
                {
                    "detail": (
                        "Aucun horaire de prière disponible "
                        "pour aujourd’hui."
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(prayer_time)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RamadanScheduleViewSet(viewsets.ModelViewSet):
    queryset = RamadanSchedule.objects.all()
    serializer_class = RamadanScheduleSerializer
    permission_classes = [IsMosqueStaff]
    filterset_fields = ["date"]
    ordering_fields = ["date"]
