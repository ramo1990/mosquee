# prayer_times/serializers.py
from rest_framework import serializers
from .models import DailyPrayerTime, RamadanSchedule


class DailyPrayerTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyPrayerTime
        fields = "__all__"


class RamadanScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = RamadanSchedule
        fields = "__all__"