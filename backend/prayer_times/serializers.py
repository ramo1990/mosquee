from rest_framework import serializers

from .models import DailyPrayerTime, RamadanSchedule


class DailyPrayerTimeSerializer(serializers.ModelSerializer):
    mosque = serializers.SlugRelatedField(
        slug_field="slug",
        read_only=True,
    )

    class Meta:
        model = DailyPrayerTime
        fields = [
            "id",
            "mosque",
            "date",
            "fajr",
            "sunrise",
            "dhuhr",
            "asr",
            "maghrib",
            "isha",
            "fajr_iqama",
            "dhuhr_iqama",
            "asr_iqama",
            "maghrib_iqama",
            "isha_iqama",
            "jumuah_time",
            "jumuah_khateeb",
            "created_at",
            "updated_at",
        ]


class RamadanScheduleSerializer(serializers.ModelSerializer):
    mosque = serializers.SlugRelatedField(
        slug_field="slug",
        read_only=True,
    )

    class Meta:
        model = RamadanSchedule
        fields = [
            "id",
            "mosque",
            "date",
            "suhoor_end",
            "iftar",
            "tarawih",
            "note",
            "created_at",
            "updated_at",
        ]