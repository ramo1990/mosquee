from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from config.permissions import IsMosqueStaff
from core.permissions import MosqueScopedViewSetMixin
from content.models import MosqueProfile

from .models import Donation, DonationCampaign
from .serializers import (
    DonationCampaignSerializer,
    DonationCreateSerializer,
    DonationSerializer,
)


class DonationCampaignViewSet(
    MosqueScopedViewSetMixin,
    viewsets.ModelViewSet,
):
    queryset = DonationCampaign.objects.select_related("mosque")
    serializer_class = DonationCampaignSerializer
    permission_classes = [IsMosqueStaff]

    filterset_fields = ["mosque", "is_active"]
    search_fields = ["title", "description"]
    ordering_fields = ["created_at", "goal_amount"]

    def get_queryset(self):
        return self.get_scoped_queryset(
            DonationCampaign.objects.select_related("mosque")
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
        permission_classes=[AllowAny],
        url_path="public",
    )
    def public_list(self, request):
        queryset = DonationCampaign.objects.filter(
            is_active=True,
            mosque__isnull=False,
        )

        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)

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

        queryset = DonationCampaign.objects.filter(
            mosque=mosque,
            is_active=True,
        )

        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)


class MosqueDonationCreateView(CreateAPIView):
    serializer_class = DonationCreateSerializer
    permission_classes = [AllowAny]

    def get_mosque(self):
        if not hasattr(self, "_mosque"):
            self._mosque = get_object_or_404(
                MosqueProfile,
                slug=self.kwargs["mosque_slug"],
            )

        return self._mosque

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["mosque"] = self.get_mosque()

        return context

    def perform_create(self, serializer):
        serializer.save(mosque=self.get_mosque())


class DonationViewSet(
    MosqueScopedViewSetMixin,
    viewsets.ModelViewSet,
):
    queryset = Donation.objects.select_related(
        "mosque",
        "campaign",
    )

    serializer_class = DonationSerializer
    permission_classes = [IsMosqueStaff]

    filterset_fields = [
        "mosque",
        "status",
        "donation_type",
        "payment_method",
        "campaign",
    ]

    search_fields = [
        "reference",
        "donor_name",
        "donor_phone",
        "transaction_id",
    ]

    ordering_fields = ["amount", "created_at"]

    def get_queryset(self):
        return self.get_scoped_queryset(
            Donation.objects.select_related(
                "mosque",
                "campaign",
            )
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