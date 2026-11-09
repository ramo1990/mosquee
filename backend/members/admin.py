
from django.contrib import admin

from .models import Member


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):

    list_display = (
        "first_name",
        "last_name",
        "phone",
        "member_number",
        "mosque",
        "status",
    )

    list_filter = (
        "status",
        "mosque",
    )

    search_fields = (
        "first_name",
        "last_name",
        "phone",
        "email",
        "member_number",
    )

    ordering = (
        "last_name",
        "first_name",
    )
