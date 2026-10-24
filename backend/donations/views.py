# donations/views.py
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from config.permissions import IsMosqueStaff
from .models import Donation, DonationCampaign
from .serializers import DonationCampaignSerializer, DonationSerializer


class DonationCampaignViewSet(viewsets.ModelViewSet):
    queryset = DonationCampaign.objects.all()
    serializer_class = DonationCampaignSerializer
    permission_classes = [IsMosqueStaff]
    filterset_fields = ["is_active"]
    search_fields = ["title", "description"]
    ordering_fields = ["created_at", "goal_amount"]

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[AllowAny],
        url_path="public",
    )
    def public_list(self, request):
        queryset = DonationCampaign.objects.filter(is_active=True)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class DonationViewSet(viewsets.ModelViewSet):
    queryset = Donation.objects.select_related("campaign")
    serializer_class = DonationSerializer
    permission_classes = [IsMosqueStaff]
    filterset_fields = [
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

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[AllowAny],
        url_path="create-intent",
    )
    def create_intent(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        donation = serializer.save(status="pending")
        return Response(
            DonationSerializer(donation).data,
            status=201,
        )