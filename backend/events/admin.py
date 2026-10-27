# events/admin.py
from django.contrib import admin
from django.utils.html import format_html

from .models import Event, EventCategory, EventRegistration, EventTarget


@admin.register(EventCategory)
class EventCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "color")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


class EventRegistrationInline(admin.TabularInline):
    model = EventRegistration
    extra = 0
    readonly_fields = ("created_at",)
    autocomplete_fields = ("event",)


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "category",
        "starts_at",
        "ends_at",
        "status",
        "target_type",
        "target_screens_count",
        "registration_required",
        "capacity",
        "registrations_count",
        "image_preview",
    )

    list_filter = (
        "status",
        "category",
        "target_type",
        "target_screens",
        "registration_required",
        "starts_at",
    )

    search_fields = (
        "title",
        "description",
        "location",
    )

    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = (
        "created_at",
        "updated_at",
        "image_preview",
    )
    autocomplete_fields = (
        "category",
        "created_by",
        "target_screens",
    )
    filter_horizontal = ("target_screens",)
    date_hierarchy = "starts_at"
    inlines = [EventRegistrationInline]

    fieldsets = (
        (
            "Événement",
            {
                "fields": (
                    "title",
                    "slug",
                    "description",
                    "category",
                    "image",
                    "image_preview",
                )
            },
        ),
        (
            "Planification",
            {
                "fields": (
                    "starts_at",
                    "ends_at",
                    "location",
                    "status",
                )
            },
        ),
        (
            "Affichage sur les écrans",
            {
                "fields": (
                    "target_type",
                    "target_screens",
                )
            },
        ),
        (
            "Inscriptions",
            {
                "fields": (
                    "registration_required",
                    "capacity",
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

    
    @admin.display(description="Écrans ciblés")
    def target_screens_count(self, obj):
        if obj.target_type == EventTarget.ALL:
            return "Tous"

        return obj.target_screens.count()

    @admin.display(description="Inscriptions")
    def registrations_count(self, obj):
        return obj.registrations.count()

    @admin.display(description="Aperçu")
    def image_preview(self, obj):
        if obj and obj.image:
            return format_html(
                '<img src="{}" style="height:60px; border-radius:6px;" />',
                obj.image.url,
            )
        return "—"


@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
    list_display = (
        "full_name",
        "phone",
        "email",
        "event",
        "created_at",
    )
    list_filter = ("event", "created_at")
    search_fields = ("full_name", "phone", "email")
    readonly_fields = ("created_at",)