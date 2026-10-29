from django.shortcuts import get_object_or_404

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from config.permissions import IsMosqueStaff
from content.models import MosqueProfile

from .models import Donation, DonationCampaign
from .serializers import (
    DonationCampaignSerializer,
    DonationCreateSerializer,
    DonationSerializer,
)


class DonationCampaignViewSet(viewsets.ModelViewSet):
    queryset = DonationCampaign.objects.select_related("mosque")
    serializer_class = DonationCampaignSerializer
    permission_classes = [IsMosqueStaff]
    filterset_fields = ["mosque", "is_active"]
    search_fields = ["title", "description"]
    ordering_fields = ["created_at", "goal_amount"]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return DonationCampaignSerializer

        return DonationCampaignSerializer

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[AllowAny],
        url_path="public",
    )
    def public_list(self, request):
        queryset = DonationCampaign.objects.filter(
            is_active=True
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

        queryset = self.get_queryset().filter(
            mosque=mosque,
            is_active=True,
        )

        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)


class MosqueDonationCreateView(CreateAPIView):
    serializer_class = DonationCreateSerializer
    permission_classes = [AllowAny]

    def get_serializer_context(self):
        context = super().get_serializer_context()

        mosque = get_object_or_404(
            MosqueProfile,
            slug=self.kwargs["mosque_slug"],
        )

        context["mosque"] = mosque

        return context


class DonationViewSet(viewsets.ModelViewSet):
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