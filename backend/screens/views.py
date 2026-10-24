# screens/views.py
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from config.permissions import IsScreenManager
from .models import Screen, ScreenContent
from .serializers import ScreenContentSerializer, ScreenSerializer


class ScreenViewSet(viewsets.ModelViewSet):
    queryset = Screen.objects.prefetch_related("contents")
    serializer_class = ScreenSerializer
    permission_classes = [IsScreenManager]
    filterset_fields = ["is_online", "location"]
    search_fields = ["name", "location", "pairing_code"]

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[AllowAny],
        url_path="heartbeat",
    )
    def heartbeat(self, request, pk=None):
        screen = self.get_object()
        screen.mark_online()
        return Response(
            {
                "id": screen.id,
                "name": screen.name,
                "is_online": screen.is_online,
                "last_seen_at": screen.last_seen_at,
            }
        )


class ScreenContentViewSet(viewsets.ModelViewSet):
    queryset = ScreenContent.objects.select_related("screen")
    serializer_class = ScreenContentSerializer
    permission_classes = [IsScreenManager]
    filterset_fields = ["screen", "is_active"]
    search_fields = ["title", "body"]
    ordering_fields = ["order"]