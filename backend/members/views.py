
from rest_framework import viewsets
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.exceptions import PermissionDenied, ValidationError

from .models import Member
from .serializers import MemberSerializer


class CanManageMembers(BasePermission):

    allowed_roles = {
        "super_admin",
        "mosque_admin",
        "committee",
    }

    def has_permission(self, request, view):
        user = request.user

        return (
            user.is_authenticated
            and user.role in self.allowed_roles
        )


class MemberViewSet(viewsets.ModelViewSet):

    serializer_class = MemberSerializer
    permission_classes = [
        IsAuthenticated,
        CanManageMembers,
    ]

    def get_queryset(self):
        user = self.request.user

        queryset = Member.objects.select_related(
            "mosque",
            "user",
        )

        if user.is_super_admin:
            return queryset

        if not user.mosque:
            return Member.objects.none()

        return queryset.filter(mosque=user.mosque)

    def perform_create(self, serializer):
        user = self.request.user

        if not user.is_authenticated:
            raise PermissionDenied("Connexion requise.")

        if user.is_super_admin:
            mosque = serializer.validated_data.get("mosque")

            if not mosque:
                raise ValidationError({
                    "mosque": "Veuillez sélectionner une mosquée."
                })
        else:
            if not user.mosque:
                raise PermissionDenied(
                    "Vous n'êtes associé à aucune mosquée."
                )

            mosque = user.mosque

        serializer.save(mosque=mosque)

    def perform_update(self, serializer):
        user = self.request.user

        if not user.is_super_admin:
            if not user.mosque:
                raise PermissionDenied(
                    "Vous n'êtes associé à aucune mosquée."
                )

            serializer.save(mosque=user.mosque)
            return

        serializer.save()
