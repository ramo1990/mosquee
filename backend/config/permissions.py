# config/permissions.py
from rest_framework.permissions import BasePermission


class IsMosqueStaff(BasePermission):
    message = "Seuls les responsables de la mosquée peuvent effectuer cette action."

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and (
                user.is_superuser
                or getattr(user, "is_mosque_staff", False)
            )
        )


class IsScreenManager(BasePermission):
    message = "Seuls les responsables des écrans peuvent effectuer cette action."

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and (
                user.is_superuser
                or getattr(user, "can_manage_screens", False)
            )
        )