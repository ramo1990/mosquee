# events/serializers.py
from rest_framework import serializers
from .models import Event, EventCategory, EventRegistration


class EventCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EventCategory
        fields = ["id", "name", "slug", "color"]


class EventRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventRegistration
        fields = [
            "id",
            "event",
            "full_name",
            "phone",
            "email",
            "created_at",
        ]
        read_only_fields = ["created_at"]


class EventSerializer(serializers.ModelSerializer):
    category_detail = EventCategorySerializer(
        source="category",
        read_only=True,
    )
    registrations_count = serializers.IntegerField(
        source="registrations.count",
        read_only=True,
    )
    available_places = serializers.IntegerField(read_only=True)

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "category",
            "category_detail",
            "image",
            "starts_at",
            "ends_at",
            "location",
            "capacity",
            "available_places",
            "registration_required",
            "status",
            "registrations_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "created_at",
            "updated_at",
            "available_places",
            "registrations_count",
        ]