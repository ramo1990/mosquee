# prayer_times/admin.py


from django.contrib import admin
from django.utils.html import format_html

from .models import DailyPrayerTime, RamadanSchedule


@admin.register(DailyPrayerTime)
class DailyPrayerTimeAdmin(admin.ModelAdmin):

    list_display = (
        "date",
        "mosque_display",
        "fajr_display",
        "dhuhr_display",
        "asr_display",
        "maghrib_display",
        "isha_display",
        "jumuah_time",
    )

    list_filter = (
        "date",
        "mosque",
    )

    search_fields = (
        "mosque__name",
        "jumuah_khateeb",
    )

    date_hierarchy = "date"

    ordering = ("-date",)

    list_per_page = 25

    autocomplete_fields = ("mosque",)

    fieldsets = (
        (
            "Informations générales",
            {
                "fields": (
                    "mosque",
                    "date",
                ),
            },
        ),
        (
            "Horaires des prières",
            {
                "fields": (
                    ("fajr", "fajr_iqama"),
                    ("sunrise",),
                    ("dhuhr", "dhuhr_iqama"),
                    ("asr", "asr_iqama"),
                    ("maghrib", "maghrib_iqama"),
                    ("isha", "isha_iqama"),
                ),
                "description": (
                    "Renseignez l'heure de chaque prière "
                    "ainsi que son heure d'Iqama."
                ),
            },
        ),
        (
            "Prière du vendredi (Jumu'a)",
            {
                "fields": (
                    "jumuah_time",
                    "jumuah_khateeb",
                ),
                "classes": ("collapse",),
            },
        ),
        (
            "Informations système",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                ),
                "classes": ("collapse",),
            },
        ),
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    @admin.display(description="Mosquée", ordering="mosque__name")
    def mosque_display(self, obj):
        if obj.mosque:
            return obj.mosque.name

        return format_html(
            '<span style="color: #059669; font-weight: bold;">{}</span>',
            "Horaires généraux",
        )

    @admin.display(description="Fajr")
    def fajr_display(self, obj):
        return self.format_prayer(obj.fajr, obj.fajr_iqama)

    @admin.display(description="Dhuhr")
    def dhuhr_display(self, obj):
        return self.format_prayer(obj.dhuhr, obj.dhuhr_iqama)

    @admin.display(description="Asr")
    def asr_display(self, obj):
        return self.format_prayer(obj.asr, obj.asr_iqama)

    @admin.display(description="Maghrib")
    def maghrib_display(self, obj):
        return self.format_prayer(obj.maghrib, obj.maghrib_iqama)

    @admin.display(description="Isha")
    def isha_display(self, obj):
        return self.format_prayer(obj.isha, obj.isha_iqama)

    @staticmethod
    def format_prayer(prayer_time, iqama_time):
        prayer = prayer_time.strftime("%H:%M")
        iqama = (
            iqama_time.strftime("%H:%M")
            if iqama_time
            else "—"
        )

        return format_html(
            '<strong>{}</strong><br>'
            '<small style="color: #059669;">Iqama : {}</small>',
            prayer,
            iqama,
        )


@admin.register(RamadanSchedule)
class RamadanScheduleAdmin(admin.ModelAdmin):

    list_display = (
        "date",
        "mosque_display",
        "suhoor_display",
        "iftar_display",
        "tarawih_display",
    )

    list_filter = (
        "date",
        "mosque",
    )

    search_fields = (
        "mosque__name",
        "note",
    )

    date_hierarchy = "date"

    ordering = ("date",)

    list_per_page = 25

    autocomplete_fields = ("mosque",)

    fieldsets = (
        (
            "Informations générales",
            {
                "fields": (
                    "mosque",
                    "date",
                ),
            },
        ),
        (
            "Horaires du Ramadan",
            {
                "fields": (
                    "suhoor_end",
                    "iftar",
                    "tarawih",
                ),
            },
        ),
        (
            "Informations complémentaires",
            {
                "fields": (
                    "note",
                ),
                "classes": ("collapse",),
            },
        ),
        (
            "Informations système",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                ),
                "classes": ("collapse",),
            },
        ),
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    @admin.display(description="Mosquée", ordering="mosque__name")
    def mosque_display(self, obj):
        if obj.mosque:
            return obj.mosque.name

        return format_html(
            '<span style="color: #059669; font-weight: bold;">{}</span>',
            "Programme général",
        )

    @admin.display(description="Fin Suhoor")
    def suhoor_display(self, obj):
        return (
            obj.suhoor_end.strftime("%H:%M")
            if obj.suhoor_end
            else "—"
        )

    @admin.display(description="Iftar")
    def iftar_display(self, obj):
        return obj.iftar.strftime("%H:%M")

    @admin.display(description="Tarawih")
    def tarawih_display(self, obj):
        return (
            obj.tarawih.strftime("%H:%M")
            if obj.tarawih
            else "—"
        )