from django.contrib import admin
from django.utils.html import format_html

from .models import Screen, ScreenContent, ScreenGroup


@admin.register(ScreenGroup)
class ScreenGroupAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "screens_count",
        "created_at",
    )
    search_fields = ("name", "description")
    readonly_fields = ("created_at", "updated_at")

    @admin.display(description="Écrans")
    def screens_count(self, obj):
        return obj.screens.count()


class ScreenContentInline(admin.TabularInline):
    model = ScreenContent
    extra = 0
    fields = (
        "title",
        "body",
        "image",
        "order",
        "is_active",
    )


@admin.register(Screen)
class ScreenAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "slug",
        "location",
        "group",
        "screen_url",
        "is_online",
        "last_seen_at",
        "announcement_duration",
        "verse_duration",
    )
    list_filter = (
        "group",
        "is_online",
        "location",
    )
    search_fields = (
        "name",
        "slug",
        "location",
        "pairing_code",
    )
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = (
        "pairing_code",
        "last_seen_at",
        "created_at",
        "updated_at",
        "screen_url",
    )
    inlines = [ScreenContentInline]
    list_per_page = 25

    fieldsets = (
        (
            "Écran",
            {
                "fields": (
                    "name",
                    "slug",
                    "location",
                    "group",
                    "pairing_code",
                    "screen_url",
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

    @admin.display(description="URL de l’écran")
    def screen_url(self, obj):
        url = f"http://localhost:3004/ecran/{obj.id}"

        return format_html(
            '<a href="{}" target="_blank">{}</a>',
            url,
            url,
        )


@admin.register(ScreenContent)
class ScreenContentAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "screen",
        "order",
        "is_active",
    )
    list_filter = (
        "screen",
        "is_active",
    )
    search_fields = ("title", "body")