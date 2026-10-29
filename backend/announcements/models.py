# announcements/models.py
# Gère les annonces affichées sur le site et l’écran.

from django.db import models
from django.utils import timezone
from django.conf import settings


class AnnouncementTarget(models.TextChoices):
    ALL = "all", "Tous les écrans"
    GROUP = "group", "Groupe d’écrans"
    SCREEN = "screen", "Écran précis"

class Announcement(models.Model):
    class Priority(models.TextChoices):
        LOW = "low", "Basse"
        NORMAL = "normal", "Normale"
        HIGH = "high", "Urgente"

    mosque = models.ForeignKey(
        "content.MosqueProfile",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="announcements",
        verbose_name="mosquée",
    )
    target_type = models.CharField(
        "cible",
        max_length=10,
        choices=AnnouncementTarget.choices,
        default=AnnouncementTarget.ALL,
    )
    target_group = models.ForeignKey(
        "screens.ScreenGroup",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="announcements",
        verbose_name="groupe ciblé",
    )
    target_screen = models.ForeignKey(
        "screens.Screen",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="announcements",
        verbose_name="écran ciblé",
    )

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

    def is_visible_for_screen(self, screen) -> bool:
        if self.target_type == AnnouncementTarget.ALL:
            return True

        if self.target_type == AnnouncementTarget.GROUP:
            return screen.group_id == self.target_group_id

        if self.target_type == AnnouncementTarget.SCREEN:
            return screen.id == self.target_screen_id

        return False
    
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