# events/views.py
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db.models import Q
from django.shortcuts import get_object_or_404
from screens.models import Screen

from config.permissions import IsMosqueStaff
from .models import Event, EventCategory, EventRegistration, EventTarget
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


class EventViewSet(viewsets.ModelViewSet):
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

    def get_permissions(self):
        if self.action in ["list", "retrieve", "upcoming", "register"]:
            return [AllowAny()]

        return super().get_permissions()

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[AllowAny],
        url_path=r"upcoming/(?P<screen_slug>[-\w]+)",
    )
    def upcoming(self, request, screen_slug=None):
        now = timezone.now()

        screen = get_object_or_404(
            Screen,
            slug=screen_slug,
            is_active=True,
        )

        queryset = (
            self.get_queryset()
            .filter(
                starts_at__gte=now,
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
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class EventRegistrationViewSet(viewsets.ModelViewSet):
    queryset = EventRegistration.objects.select_related("event")
    serializer_class = EventRegistrationSerializer
    permission_classes = [IsMosqueStaff]
    filterset_fields = ["event"]
    search_fields = ["full_name", "phone", "email"]