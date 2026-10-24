# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    class Role(models.TextChoices):
        SUPER_ADMIN = "super_admin", "Super administrateur"
        MOSQUE_ADMIN = "mosque_admin", "Administrateur mosquée"
        COMMITTEE = "committee", "Membre du comité"
        IMAM = "imam", "Imam"
        TEACHER = "teacher", "Enseignant"
        SCREEN_MANAGER = "screen_manager", "Responsable écran"
        MEMBER = "member", "Fidèle"

    phone = models.CharField(
        _("téléphone"),
        max_length=30,
        null=True,
        blank=True,
    )
    role = models.CharField(
        _("rôle"),
        max_length=20,
        choices=Role.choices,
        default=Role.MEMBER,
        db_index=True,
    )
    photo = models.ImageField(
        _("photo"),
        upload_to="accounts/%Y/%m/",
        null=True,
        blank=True,
    )
    mosque = models.ForeignKey(
        "content.MosqueProfile",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="members",
    )

    class Meta:
        verbose_name = _("utilisateur")
        verbose_name_plural = _("utilisateurs")

    def __str__(self):
        return self.get_full_name() or self.username

    @property
    def is_mosque_staff(self):
        return self.role in {
            self.Role.SUPER_ADMIN,
            self.Role.MOSQUE_ADMIN,
            self.Role.COMMITTEE,
            self.Role.IMAM,
        }

    @property
    def can_manage_content(self):
        return self.role in {
            self.Role.SUPER_ADMIN,
            self.Role.MOSQUE_ADMIN,
            self.Role.COMMITTEE,
        }

    @property
    def can_manage_screens(self):
        return self.role in {
            self.Role.SUPER_ADMIN,
            self.Role.MOSQUE_ADMIN,
            self.Role.SCREEN_MANAGER,
        }