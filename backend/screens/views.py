from django.shortcuts import get_object_or_404

from rest_framework import generics, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from config.permissions import IsScreenManager
from content.models import MosqueProfile

from .models import Screen, ScreenContent
from .serializers import ScreenContentSerializer, ScreenSerializer


class ScreenListView(generics.ListAPIView):
    queryset = Screen.objects.filter(is_active=True).order_by("name")
    serializer_class = ScreenSerializer
    permission_classes = [AllowAny]


class ScreenViewSet(viewsets.ModelViewSet):
    serializer_class = ScreenSerializer
    permission_classes = [IsScreenManager]
    lookup_field = "slug"
    lookup_url_kwarg = "slug"
    
    filterset_fields = [
        "mosque",
        "is_online",
        "location",
    ]
    search_fields = [
        "name",
        "location",
        "pairing_code",
    ]

    def get_queryset(self):
        queryset = Screen.objects.prefetch_related("contents")

        if self.action in ["list", "retrieve", "by_mosque"]:
            return queryset.filter(is_active=True)

        return queryset

    def get_permissions(self):
        if self.action in ["list", "retrieve", "by_mosque", "heartbeat"]:
            return [AllowAny()]

        return [permission() for permission in self.permission_classes]

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[AllowAny],
        url_path=r"mosquee/(?P<mosque_slug>[-\w]+)",
    )
    def by_mosque(self, request, mosque_slug=None):
        mosque = get_object_or_404(
            MosqueProfile,
            slug=mosque_slug,
        )

        queryset = (
            self.get_queryset()
            .filter(
                mosque=mosque,
                is_active=True,
            )
            .order_by("name")
        )

        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)

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