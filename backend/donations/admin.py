# donations/admin.py
from django.contrib import admin
from django.db.models import Sum
from django.utils.html import format_html

from .models import Donation, DonationCampaign


class DonationInline(admin.TabularInline):
    model = Donation
    extra = 0
    fields = (
        "donor_name",
        "donor_phone",
        "amount",
        "donation_type",
        "payment_method",
        "status",
    )
    readonly_fields = ("reference", "created_at", "updated_at")


@admin.register(DonationCampaign)
class DonationCampaignAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "goal_amount",
        "total_raised_display",
        "progress_display",
        "is_active",
        "starts_at",
        "ends_at",
    )
    list_filter = ("is_active", "starts_at")
    search_fields = ("title", "description")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at",)
    inlines = [DonationInline]

    @admin.display(description="Total collecté")
    def total_raised_display(self, obj):
        return f"{obj.total_raised} FCFA"

    @admin.display(description="Progression")
    def progress_display(self, obj):
        if not obj.goal_amount:
            return "—"

        percentage = min(
            int((obj.total_raised / obj.goal_amount) * 100),
            100,
        )
        return format_html(
            """
            <div style="width:150px;background:#e5e7eb;border-radius:999px;">
              <div style="width:{}%;background:#10b981;height:10px;border-radius:999px;"></div>
            </div>
            <small>{}%</small>
            """,
            percentage,
            percentage,
        )


@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = (
        "reference",
        "donor_name",
        "donor_phone",
        "amount",
        "donation_type",
        "payment_method",
        "status",
        "campaign",
        "created_at",
    )
    list_filter = (
        "status",
        "donation_type",
        "payment_method",
        "campaign",
        "created_at",
    )
    search_fields = (
        "reference",
        "donor_name",
        "donor_phone",
        "donor_email",
        "transaction_id",
    )
    readonly_fields = (
        "reference",
        "created_at",
        "updated_at",
    )
    date_hierarchy = "created_at"
    list_per_page = 25

    fieldsets = (
        (
            "Donateur",
            {
                "fields": (
                    "donor_name",
                    "donor_phone",
                    "donor_email",
                )
            },
        ),
        (
            "Don",
            {
                "fields": (
                    "reference",
                    "campaign",
                    "amount",
                    "donation_type",
                )
            },
        ),
        (
            "Paiement",
            {
                "fields": (
                    "payment_method",
                    "status",
                    "transaction_id",
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