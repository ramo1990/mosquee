
from django.conf import settings
from django.db import models
from django.db.models import Q

from django.db import transaction
from django.utils import timezone
from django.core.exceptions import ValidationError


class Member(models.Model):

    class Status(models.TextChoices):
        ACTIVE = "active", "Actif"
        INACTIVE = "inactive", "Inactif"
        PENDING = "pending", "En attente"

    mosque = models.ForeignKey(
        "content.MosqueProfile",
        on_delete=models.CASCADE,
        related_name="faithful_members",
        verbose_name="mosquée",
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="member_profile",
        verbose_name="compte utilisateur",
    )

    first_name = models.CharField("prénom", max_length=100)
    last_name = models.CharField("nom", max_length=100)

    email = models.EmailField(
        "e-mail",
        blank=True,
        null=True,
    )

    phone = models.CharField(
        "téléphone",
        max_length=30,
        blank=True,
    )

    member_number = models.CharField(
        "numéro de membre",
        max_length=50,
        blank=True,
        editable=False,
    )

    address = models.CharField(
        "adresse",
        max_length=255,
        blank=True,
    )

    status = models.CharField(
        "statut",
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "fidèle"
        verbose_name_plural = "fidèles"
        ordering = ["last_name", "first_name"]

        constraints = [
            models.UniqueConstraint(
                fields=["mosque", "member_number"],
                condition=~Q(member_number=""),
                name="unique_member_number_per_mosque",
            )
        ]

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    def save(self, *args, **kwargs):
        if not self.member_number:
            if not self.mosque_id:
                raise ValidationError(
                    "Une mosquée doit être sélectionnée."
                )

            with transaction.atomic():
                # Verrouille la mosquée pour éviter les doublons
                from content.models import MosqueProfile

                MosqueProfile.objects.select_for_update().get(
                    pk=self.mosque_id
                )

                year = timezone.now().year
                prefix = f"FID-{year}-"

                last_member = (
                    Member.objects
                    .filter(
                        mosque_id=self.mosque_id,
                        member_number__startswith=prefix,
                    )
                    .order_by("-member_number")
                    .first()
                )

                last_number = 0

                if last_member:
                    try:
                        last_number = int(
                            last_member.member_number.split("-")[-1]
                        )
                    except (ValueError, IndexError):
                        last_number = 0

                self.member_number = (
                    f"{prefix}{last_number + 1:04d}"
                )

                super().save(*args, **kwargs)
        else:
            super().save(*args, **kwargs)
