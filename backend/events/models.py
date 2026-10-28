# events/models.py
# Gère les événements, les inscriptions et les catégories.

from django.db import models
from django.utils import timezone
from django.conf import settings


class EventCategory(models.Model):
    name = models.CharField("nom", max_length=100, unique=True)
    slug = models.SlugField("slug", max_length=120, unique=True)
    color = models.CharField("couleur", max_length=20, default="#10b981")

    class Meta:
        verbose_name = "catégorie d’événement"
        verbose_name_plural = "catégories d’événements"

    def __str__(self):
        return self.name

class EventTarget(models.TextChoices):
    ALL = "all", "Tous les écrans"
    SELECTED = "selected", "Écrans sélectionnés"
    
class Event(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Brouillon"
        PUBLISHED = "published", "Publié"
        CANCELLED = "cancelled", "Annulé"
        POSTPONED = "postponed", "Reporté"

    title = models.CharField("titre", max_length=200)
    slug = models.SlugField("slug", max_length=220, unique=True)
    description = models.TextField("description")
    category = models.ForeignKey(
        EventCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="events",
    )
    mosque = models.ForeignKey(
        "content.MosqueProfile",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="events",
        verbose_name="mosquée",
    )
    image = models.ImageField(
        "image",
        upload_to="events/%Y/%m/",
        null=True,
        blank=True,
    )
    starts_at = models.DateTimeField("début")
    ends_at = models.DateTimeField("fin", null=True, blank=True)
    location = models.CharField("lieu", max_length=255, null=True, blank=True)
    capacity = models.PositiveIntegerField(
        "capacité",
        null=True,
        blank=True,
        help_text="Laisser vide si l’événement est ouvert à tous.",
    )
    registration_required = models.BooleanField("inscription requise", default=False)
    target_type = models.CharField(
        "affichage sur les écrans",
        max_length=10,
        choices=EventTarget.choices,
        default=EventTarget.ALL,
    )

    target_screens = models.ManyToManyField(
        "screens.Screen",
        blank=True,
        related_name="events",
        verbose_name="écrans ciblés",
    )
    status = models.CharField(
        "statut",
        max_length=15,
        choices=Status.choices,
        default=Status.DRAFT,
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="events",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "événement"
        verbose_name_plural = "événements"
        ordering = ["starts_at"]

    def __str__(self):
        return self.title

    @property
    def is_upcoming(self):
        return self.starts_at > timezone.now()

    @property
    def available_places(self):
        if self.capacity is None:
            return None
        return max(self.capacity - self.registrations.count(), 0)


class EventRegistration(models.Model):
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="registrations",
    )
    full_name = models.CharField("nom complet", max_length=150)
    phone = models.CharField("téléphone", max_length=30)
    email = models.EmailField("e-mail", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "inscription à un événement"
        verbose_name_plural = "inscriptions aux événements"
        unique_together = ("event", "phone")

    def __str__(self):
        return f"{self.full_name} — {self.event}"