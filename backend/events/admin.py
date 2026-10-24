# events/admin.py
from django.contrib import admin
from django.utils.html import format_html

from .models import Event, EventCategory, EventRegistration


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
        "registration_required",
        "capacity",
        "registrations_count",
        "image_preview",
    )
    list_filter = (
        "status",
        "category",
        "registration_required",
        "starts_at",
    )
    search_fields = ("title", "description", "location")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at", "updated_at", "image_preview")
    autocomplete_fields = ("category", "created_by")
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

    @admin.display(description="Inscriptions")
    def registrations_count(self, obj):
        return obj.registrations.count()

    @admin.display(description="Aperçu")
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="height:60px;border-radius:6px;" />',
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