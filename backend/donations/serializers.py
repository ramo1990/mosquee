# donations/serializers.py
from rest_framework import serializers
from .models import Donation, DonationCampaign


class DonationCampaignSerializer(serializers.ModelSerializer):
    total_raised = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        read_only=True,
    )

    class Meta:
        model = DonationCampaign
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "goal_amount",
            "total_raised",
            "is_active",
            "starts_at",
            "ends_at",
        ]


class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = [
            "id",
            "reference",
            "campaign",
            "donor_name",
            "donor_phone",
            "donor_email",
            "amount",
            "donation_type",
            "payment_method",
            "status",
            "transaction_id",
            "created_at",
        ]
        read_only_fields = [
            "reference",
            "status",
            "transaction_id",
            "created_at",
        ]