# announcements/admin.py
from django.contrib import admin
from django.utils.html import format_html

from .models import Announcement


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "priority",
        "is_active",
        "show_on_screen",
        "starts_at",
        "ends_at",
        "created_by",
        "image_preview",
    )
    list_filter = (
        "priority",
        "is_active",
        "show_on_screen",
        "starts_at",
        "created_by",
    )
    search_fields = ("title", "body")
    readonly_fields = ("created_at", "updated_at", "image_preview")
    autocomplete_fields = ("created_by",)
    date_hierarchy = "starts_at"
    list_per_page = 25

    fieldsets = (
        (
            "Contenu",
            {
                "fields": (
                    "title",
                    "body",
                    "image",
                    "image_preview",
                )
            },
        ),
        (
            "Affichage",
            {
                "fields": (
                    "priority",
                    "is_active",
                    "show_on_screen",
                    "starts_at",
                    "ends_at",
                )
            },
        ),
        (
            "Informations",
            {
                "fields": (
                    "created_by",
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )

    @admin.display(description="Aperçu")
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="height:60px;border-radius:6px;" />',
                obj.image.url,
            )
        return "—"

    def save_model(self, request, obj, form, change):
        if not change and not obj.created_by:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)