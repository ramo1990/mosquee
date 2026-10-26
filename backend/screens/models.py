# screens/models.py
# Gère les écrans installés dans la mosquée et leur affichage.

import uuid
from django.db import models
from django.utils import timezone


class ScreenGroup(models.Model):
    name = models.CharField("nom du groupe", max_length=150, unique=True)
    description = models.TextField(
        "description",
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "groupe d’écrans"
        verbose_name_plural = "groupes d’écrans"

    def __str__(self):
        return self.name
    
class Screen(models.Model):
    name = models.CharField("nom", max_length=100)
    location = models.CharField(
        "emplacement",
        max_length=150,
        help_text="Ex : entrée principale, salle de prière, cour.",
    )
    group = models.ForeignKey(
        ScreenGroup,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="screens",
        verbose_name="groupe d’écrans",
    )
    pairing_code = models.UUIDField(
        "code d’appairage",
        default=uuid.uuid4,
        unique=True,
        editable=False,
    )
    is_online = models.BooleanField("en ligne", default=False)
    last_seen_at = models.DateTimeField(
        "dernière connexion",
        null=True,
        blank=True,
    )
    announcement_duration = models.PositiveIntegerField(
        "durée d’affichage d’une annonce (secondes)",
        default=15,
    )
    verse_duration = models.PositiveIntegerField(
        "durée d’affichage d’un verset (secondes)",
        default=30,
    )
    night_mode_start = models.TimeField(
        "début mode nuit",
        null=True,
        blank=True,
    )
    night_mode_end = models.TimeField(
        "fin mode nuit",
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "écran"
        verbose_name_plural = "écrans"

    def __str__(self):
        return f"{self.name} — {self.location}"

    def mark_online(self):
        self.is_online = True
        self.last_seen_at = timezone.now()
        self.save(update_fields=["is_online", "last_seen_at"])


class ScreenContent(models.Model):
    screen = models.ForeignKey(
        Screen,
        on_delete=models.CASCADE,
        related_name="contents",
    )
    title = models.CharField("titre", max_length=200)
    body = models.TextField("contenu", null=True, blank=True)
    image = models.ImageField(
        "image",
        upload_to="screens/%Y/%m/",
        null=True,
        blank=True,
    )
    order = models.PositiveIntegerField("ordre", default=0)
    is_active = models.BooleanField("actif", default=True)

    class Meta:
        verbose_name = "contenu d’écran"
        verbose_name_plural = "contenus d’écran"
        ordering = ["order"]

    def __str__(self):
        return f"{self.screen.name} — {self.title}"