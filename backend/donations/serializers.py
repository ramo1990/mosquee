from rest_framework import serializers

from content.models import MosqueProfile

from .models import Donation, DonationCampaign


class DonationCampaignSerializer(serializers.ModelSerializer):
    mosque = serializers.SlugRelatedField(
        slug_field="slug",
        read_only=True,
    )

    total_raised = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        read_only=True,
    )

    class Meta:
        model = DonationCampaign
        fields = [
            "id",
            "mosque",
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
    mosque = serializers.SlugRelatedField(
        slug_field="slug",
        read_only=True,
    )

    campaign = serializers.SlugRelatedField(
        slug_field="slug",
        read_only=True,
    )

    class Meta:
        model = Donation
        fields = [
            "id",
            "mosque",
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


class DonationCreateSerializer(serializers.ModelSerializer):
    campaign = serializers.SlugRelatedField(
        slug_field="slug",
        queryset=DonationCampaign.objects.all(),
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Donation
        fields = [
            "campaign",
            "donor_name",
            "donor_phone",
            "donor_email",
            "amount",
            "donation_type",
            "payment_method",
        ]

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Le montant du don doit être supérieur à zéro."
            )

        return value

    def validate(self, attrs):
        mosque = self.context.get("mosque")
        campaign = attrs.get("campaign")

        if campaign and campaign.mosque_id != mosque.pk:
            raise serializers.ValidationError({
                "campaign": (
                    "Cette campagne n'appartient pas à cette mosquée."
                )
            })

        return attrs