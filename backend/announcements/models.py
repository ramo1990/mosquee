# announcements/models.py
# Gère les annonces affichées sur le site et l’écran.

from django.db import models
from django.utils import timezone
from django.conf import settings


class Announcement(models.Model):
    class Priority(models.TextChoices):
        LOW = "low", "Basse"
        NORMAL = "normal", "Normale"
        HIGH = "high", "Urgente"

    title = models.CharField("titre", max_length=200)
    body = models.TextField("contenu")
    priority = models.CharField(
        "priorité",
        max_length=10,
        choices=Priority.choices,
        default=Priority.NORMAL,
    )
    image = models.ImageField(
        "image",
        upload_to="announcements/%Y/%m/",
        null=True,
        blank=True,
    )
    is_active = models.BooleanField("active", default=True)
    show_on_screen = models.BooleanField("afficher sur l’écran", default=True)
    starts_at = models.DateTimeField("début d’affichage", default=timezone.now)
    ends_at = models.DateTimeField("fin d’affichage", null=True, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="announcements",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "annonce"
        verbose_name_plural = "annonces"
        ordering = ["-priority", "-created_at"]

    def __str__(self):
        return self.title

    @property
    def is_currently_visible(self):
        now = timezone.now()
        if not self.is_active:
            return False
        if self.starts_at and self.starts_at > now:
            return False
        if self.ends_at and self.ends_at < now:
            return False
        return True