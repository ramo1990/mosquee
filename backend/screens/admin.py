# screens/admin.py
from django.contrib import admin
from django.utils.html import format_html

from .models import Screen, ScreenContent


class ScreenContentInline(admin.TabularInline):
    model = ScreenContent
    extra = 1
    fields = (
        "title",
        "body",
        "image",
        "image_preview",
        "order",
        "is_active",
    )
    readonly_fields = ("image_preview",)

    @admin.display(description="Aperçu")
    def image_preview(self, obj):
        if obj and obj.image:
            return format_html(
                '<img src="{}" style="height:50px;border-radius:6px;" />',
                obj.image.url,
            )
        return "—"


@admin.register(Screen)
class ScreenAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "location",
        "is_online",
        "last_seen_at",
        "announcement_duration",
        "verse_duration",
    )
    list_filter = ("is_online", "location")
    search_fields = ("name", "location", "pairing_code")
    readonly_fields = (
        "pairing_code",
        "last_seen_at",
        "created_at",
        "updated_at",
    )
    inlines = [ScreenContentInline]

    fieldsets = (
        (
            "Écran",
            {
                "fields": (
                    "name",
                    "location",
                    "pairing_code",
                )
            },
        ),
        (
            "Statut",
            {
                "fields": (
                    "is_online",
                    "last_seen_at",
                )
            },
        ),
        (
            "Affichage",
            {
                "fields": (
                    "announcement_duration",
                    "verse_duration",
                    "night_mode_start",
                    "night_mode_end",
                )
            },
        ),
        (
            "Dates",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )


@admin.register(ScreenContent)
class ScreenContentAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "screen",
        "order",
        "is_active",
    )
    list_filter = ("screen", "is_active")
    search_fields = ("title", "body")