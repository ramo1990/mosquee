
from rest_framework import serializers

from .models import Member
from content.models import MosqueProfile


class MemberSerializer(serializers.ModelSerializer):
    mosque = serializers.PrimaryKeyRelatedField(
        queryset=MosqueProfile.objects.all(),
        required=False,
    )

    mosque_name = serializers.CharField(
        source="mosque.name",
        read_only=True,
    )

    class Meta:
        model = Member
        fields = "__all__"

        read_only_fields = [
            "id",
            "member_number",
            "created_at",
            "updated_at",
        ]
