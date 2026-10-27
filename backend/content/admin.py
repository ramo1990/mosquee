# content/admin.py
from django.contrib import admin
from django.utils.html import format_html

from .models import (
    ContactMessage,
    GalleryAlbum,
    GalleryImage,
    MosqueProfile,
    NewsArticle,
    QuranVerse,
    QuranVerseTarget
)


@admin.register(MosqueProfile)
class MosqueProfileAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "city",
        "phone",
        "whatsapp",
        "email",
        "logo_preview",
    )
    search_fields = ("name", "city", "address", "email")
    readonly_fields = ("logo_preview", "cover_preview")

    fieldsets = (
        (
            "Identité",
            {
                "fields": (
                    "name",
                    "slogan",
                    "description",
                    "logo",
                    "logo_preview",
                    "cover_image",
                    "cover_preview",
                )
            },
        ),
        (
            "Localisation",
            {
                "fields": (
                    "address",
                    "city",
                    "latitude",
                    "longitude",
                )
            },
        ),
        (
            "Contacts",
            {
                "fields": (
                    "phone",
                    "whatsapp",
                    "email",
                    "facebook",
                    "youtube",
                )
            },
        ),
    )

    @admin.display(description="Logo")
    def logo_preview(self, obj):
        if obj and obj.logo:
            return format_html(
                '<img src="{}" style="height:60px;border-radius:8px;" />',
                obj.logo.url,
            )
        return "—"

    @admin.display(description="Couverture")
    def cover_preview(self, obj):
        if obj and obj.cover_image:
            return format_html(
                '<img src="{}" style="height:80px;border-radius:8px;" />',
                obj.cover_image.url,
            )
        return "—"


@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "is_published",
        "published_at",
        "created_by",
        "image_preview",
    )
    list_filter = ("is_published", "published_at", "created_by")
    search_fields = ("title", "excerpt", "body")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at", "updated_at", "image_preview")
    autocomplete_fields = ("created_by",)
    date_hierarchy = "published_at"

    fieldsets = (
        (
            "Article",
            {
                "fields": (
                    "title",
                    "slug",
                    "excerpt",
                    "body",
                    "image",
                    "image_preview",
                )
            },
        ),
        (
            "Publication",
            {
                "fields": (
                    "is_published",
                    "published_at",
                    "created_by",
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

    @admin.display(description="Aperçu")
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="height:60px;border-radius:6px;" />',
                obj.image.url,
            )
        return "—"


class GalleryImageInline(admin.TabularInline):
    model = GalleryImage
    extra = 1
    fields = ("image", "caption", "image_preview")
    readonly_fields = ("image_preview",)

    @admin.display(description="Aperçu")
    def image_preview(self, obj):
        if obj and obj.image:
            return format_html(
                '<img src="{}" style="height:50px;border-radius:6px;" />',
                obj.image.url,
            )
        return "—"


@admin.register(GalleryAlbum)
class GalleryAlbumAdmin(admin.ModelAdmin):
    list_display = ("title", "event", "created_at", "images_count")
    list_filter = ("event", "created_at")
    search_fields = ("title", "description")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [GalleryImageInline]

    @admin.display(description="Images")
    def images_count(self, obj):
        return obj.images.count()


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ("caption", "album", "uploaded_at", "image_preview")
    list_filter = ("album", "uploaded_at")
    search_fields = ("caption",)
    readonly_fields = ("uploaded_at", "image_preview")

    @admin.display(description="Aperçu")
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="height:60px;border-radius:6px;" />',
                obj.image.url,
            )
        return "—"


@admin.register(QuranVerse)
class QuranVerseAdmin(admin.ModelAdmin):
    list_display = (
        "reference",
        "translation",
        "is_active",
        "order",
        "target_type",
        "target_screens_count",
    )

    list_filter = (
        "is_active",
        "target_type",
        "target_screens",
    )

    search_fields = (
        "reference",
        "arabic",
        "translation",
    )

    list_editable = (
        "is_active",
        "order",
    )

    autocomplete_fields = ("target_screens",)
    filter_horizontal = ("target_screens",)

    fieldsets = (
        (
            "Verset",
            {
                "fields": (
                    "arabic",
                    "translation",
                    "reference",
                )
            },
        ),
        (
            "Affichage",
            {
                "fields": (
                    "is_active",
                    "order",
                    "target_type",
                    "target_screens",
                )
            },
        ),
    )

    @admin.display(description="Écrans ciblés")
    def target_screens_count(self, obj):
        if obj.target_type == QuranVerseTarget.ALL:
            return "Tous"

        return obj.target_screens.count()


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = (
        "full_name",
        "subject",
        "phone",
        "email",
        "is_read",
        "created_at",
    )
    list_filter = ("is_read", "created_at")
    search_fields = ("full_name", "subject", "message", "phone", "email")
    readonly_fields = (
        "full_name",
        "phone",
        "email",
        "subject",
        "message",
        "created_at",
    )
    date_hierarchy = "created_at"

    def has_add_permission(self, request):
        return False