# prayer_times/admin.py
from django.contrib import admin

from .models import DailyPrayerTime, RamadanSchedule


@admin.register(DailyPrayerTime)
class DailyPrayerTimeAdmin(admin.ModelAdmin):
    list_display = (
        "date",
        "fajr",
        "dhuhr",
        "asr",
        "maghrib",
        "isha",
        "jumuah_time",
        "jumuah_khateeb",
    )
    list_filter = ("date",)
    search_fields = ("jumuah_khateeb",)
    date_hierarchy = "date"
    list_per_page = 31

    fieldsets = (
        (
            "Date",
            {"fields": ("date",)},
        ),
        (
            "Adhan",
            {
                "fields": (
                    "fajr",
                    "sunrise",
                    "dhuhr",
                    "asr",
                    "maghrib",
                    "isha",
                )
            },
        ),
        (
            "Iqama",
            {
                "fields": (
                    "fajr_iqama",
                    "dhuhr_iqama",
                    "asr_iqama",
                    "maghrib_iqama",
                    "isha_iqama",
                )
            },
        ),
        (
            "Jumu‘a",
            {
                "fields": (
                    "jumuah_time",
                    "jumuah_khateeb",
                )
            },
        ),
    )


@admin.register(RamadanSchedule)
class RamadanScheduleAdmin(admin.ModelAdmin):
    list_display = (
        "date",
        "suhoor_end",
        "iftar",
        "tarawih",
    )
    list_filter = ("date",)
    search_fields = ("note",)
    date_hierarchy = "date"