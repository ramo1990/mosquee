# pour le filtrage par mosquée.
from rest_framework.exceptions import PermissionDenied


class MosqueScopedViewSetMixin:
    """
    Filtre automatiquement les données selon la mosquée de l'utilisateur.

    - super_admin : accès à toutes les mosquées
    - autres rôles : accès uniquement à leur mosquée
    """

    mosque_field = "mosque"

    def get_scoped_queryset(self, queryset):
        user = self.request.user

        if user.is_super_admin:
            return queryset

        if not user.mosque:
            return queryset.none()

        return queryset.filter(**{self.mosque_field: user.mosque})

    def validate_mosque_access(self, instance, mosque_field=None):
        user = self.request.user

        if user.is_super_admin:
            return

        if not user.mosque:
            raise PermissionDenied(
                "Vous n'êtes associé à aucune mosquée."
            )

        field = mosque_field or self.mosque_field

        instance_mosque = instance

        for part in field.split("__"):
            instance_mosque = getattr(instance_mosque, part)

        if instance_mosque != user.mosque:
            raise PermissionDenied(
                "Vous n'avez accès qu'aux données de votre mosquée."
            )