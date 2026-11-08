from django.shortcuts import get_object_or_404

from rest_framework.decorators import action
from rest_framework import generics, viewsets, permissions
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from config.permissions import IsScreenManager
from content.models import MosqueProfile

from .models import Screen, ScreenContent
from .serializers import ScreenContentSerializer, ScreenSerializer
from core.permissions import MosqueScopedViewSetMixin


class ScreenListView(generics.ListAPIView):
    queryset = Screen.objects.filter(is_active=True).order_by("name")
    serializer_class = ScreenSerializer
    permission_classes = [permissions.AllowAny]


class ScreenViewSet(
    MosqueScopedViewSetMixin,
    viewsets.ModelViewSet,
):
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

        if self.action in [
            "list",
            "retrieve",
            "by_mosque",
        ]:
            queryset = queryset.filter(is_active=True)

        return self.get_scoped_queryset(queryset)

    def get_permissions(self):
        if self.action in [
            "list",
            "retrieve",
            "by_mosque",
            "heartbeat",
        ]:
            return [permissions.AllowAny()]

        return [permission() for permission in self.permission_classes]

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

        queryset = (
            Screen.objects
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
        permission_classes=[permissions.AllowAny],
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


class ScreenContentViewSet(
    MosqueScopedViewSetMixin,
    viewsets.ModelViewSet,
):
    queryset = ScreenContent.objects.select_related(
        "screen",
        "screen__mosque",
    )

    serializer_class = ScreenContentSerializer
    permission_classes = [IsScreenManager]

    filterset_fields = ["screen", "is_active"]
    search_fields = ["title", "body"]
    ordering_fields = ["order"]

    def get_queryset(self):
        return self.get_scoped_queryset(
            ScreenContent.objects.select_related(
                "screen",
                "screen__mosque",
            ),
            mosque_field="screen__mosque",
        )

    def perform_create(self, serializer):
        user = self.request.user
        screen = serializer.validated_data.get("screen")

        if not user.is_super_admin:
            if not user.mosque:
                raise PermissionDenied(
                    "Vous n'êtes associé à aucune mosquée."
                )

            if not screen:
                raise PermissionDenied(
                    "Vous devez sélectionner un écran."
                )

            if screen.mosque != user.mosque:
                raise PermissionDenied(
                    "Vous ne pouvez ajouter du contenu qu’aux écrans de votre mosquée."
                )

        serializer.save()

    def perform_update(self, serializer):
        instance = self.get_object()

        self.validate_mosque_access(
            instance,
            mosque_field="screen__mosque",
        )

        serializer.save()

    def perform_destroy(self, instance):
        self.validate_mosque_access(
            instance,
            mosque_field="screen__mosque",
        )

        instance.delete()