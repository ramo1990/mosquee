from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from config.permissions import IsMosqueStaff
from core.permissions import MosqueScopedViewSetMixin
from content.models import MosqueProfile
from screens.models import Screen

from .models import (
    Event,
    EventCategory,
    EventRegistration,
    EventTarget,
)
from .serializers import (
    EventCategorySerializer,
    EventRegistrationSerializer,
    EventSerializer,
)


class EventCategoryViewSet(viewsets.ModelViewSet):
    queryset = EventCategory.objects.all()
    serializer_class = EventCategorySerializer
    permission_classes = [IsMosqueStaff]

    search_fields = ["name"]
    ordering_fields = ["name"]


class EventViewSet(
    MosqueScopedViewSetMixin,
    viewsets.ModelViewSet,
):
    queryset = Event.objects.select_related("category")
    serializer_class = EventSerializer
    permission_classes = [IsMosqueStaff]

    filterset_fields = [
        "status",
        "category",
        "registration_required",
    ]

    search_fields = ["title", "description", "location"]
    ordering_fields = ["starts_at", "created_at", "title"]

    def get_queryset(self):
        return self.get_scoped_queryset(
            Event.objects.select_related("category")
        )

    def get_permissions(self):
        if self.action in [
            "list",
            "retrieve",
            "upcoming_all",
            "upcoming_for_screen",
            "register",
            "by_mosque",
        ]:
            return [AllowAny()]

        return super().get_permissions()

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
        permission_classes=[AllowAny],
        url_path="upcoming",
    )
    def upcoming_all(self, request):
        queryset = (
            Event.objects
            .filter(
                starts_at__gte=timezone.now(),
                status=Event.Status.PUBLISHED,
            )
            .order_by("starts_at")
        )

        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[AllowAny],
        url_path=r"upcoming/(?P<screen_slug>[-\w]+)",
    )
    def upcoming_for_screen(self, request, screen_slug=None):
        screen = get_object_or_404(
            Screen,
            slug=screen_slug,
            is_active=True,
        )

        queryset = (
            Event.objects
            .filter(
                starts_at__gte=timezone.now(),
                status=Event.Status.PUBLISHED,
            )
            .filter(
                Q(target_type=EventTarget.ALL)
                | Q(target_screens=screen)
            )
            .order_by("starts_at")
        )

        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)

    @action(
        detail=True,
        methods=["post"],
        url_path="register",
    )
    def register(self, request, pk=None):
        event = self.get_object()

        if not event.registration_required:
            return Response(
                {"detail": "L’inscription n’est pas requise pour cet événement."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if event.available_places is not None and event.available_places <= 0:
            return Response(
                {"detail": "Toutes les places sont déjà réservées."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = EventRegistrationSerializer(
            data=request.data,
            context={"request": request},
        )

        serializer.is_valid(raise_exception=True)
        serializer.save(event=event)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )

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
            Event.objects
            .filter(
                mosque=mosque,
                starts_at__gte=timezone.now(),
                status=Event.Status.PUBLISHED,
            )
            .order_by("starts_at")
        )

        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)


class EventRegistrationViewSet(
    MosqueScopedViewSetMixin,
    viewsets.ModelViewSet,
):
    queryset = EventRegistration.objects.select_related("event")
    serializer_class = EventRegistrationSerializer
    permission_classes = [IsMosqueStaff]

    filterset_fields = ["event"]
    search_fields = ["full_name", "phone", "email"]

    def get_queryset(self):
        return self.get_scoped_queryset(
            EventRegistration.objects.select_related(
                "event",
                "event__mosque",
            )
        )

    def perform_update(self, serializer):
        instance = self.get_object()
        self.validate_mosque_access(
            instance,
            mosque_field="event__mosque",
        )

        serializer.save()

    def perform_destroy(self, instance):
        self.validate_mosque_access(
            instance,
            mosque_field="event__mosque",
        )

        instance.delete()