# content/models.py
# Regroupe les pages, actualités, galerie, versets et contacts.

from django.db import models
from django.conf import settings


class MosqueProfile(models.Model):
    name = models.CharField("nom de la mosquée", max_length=200)
    slogan = models.CharField("slogan", max_length=200, null=True, blank=True)
    description = models.TextField("présentation")
    address = models.CharField("adresse", max_length=255)
    city = models.CharField("ville", max_length=100, default="Abidjan")
    latitude = models.DecimalField(
        "latitude",
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
    )
    longitude = models.DecimalField(
        "longitude",
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
    )
    phone = models.CharField("téléphone", max_length=30, null=True, blank=True)
    whatsapp = models.CharField("WhatsApp", max_length=30, null=True, blank=True)
    email = models.EmailField("e-mail", null=True, blank=True)
    facebook = models.URLField("Facebook", null=True, blank=True)
    youtube = models.URLField("YouTube", null=True, blank=True)
    logo = models.ImageField("logo", upload_to="mosque/", null=True, blank=True)
    cover_image = models.ImageField(
        "image de couverture",
        upload_to="mosque/",
        null=True,
        blank=True,
    )

    class Meta:
        verbose_name = "profil de la mosquée"
        verbose_name_plural = "profils de la mosquée"

    def __str__(self):
        return self.name


class NewsArticle(models.Model):
    title = models.CharField("titre", max_length=200)
    slug = models.SlugField("slug", max_length=220, unique=True)
    excerpt = models.TextField("résumé", null=True, blank=True)
    body = models.TextField("contenu")
    image = models.ImageField(
        "image",
        upload_to="news/%Y/%m/",
        null=True,
        blank=True,
    )
    is_published = models.BooleanField("publié", default=False)
    published_at = models.DateTimeField("date de publication", null=True, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="articles",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "actualité"
        verbose_name_plural = "actualités"
        ordering = ["-published_at", "-created_at"]

    def __str__(self):
        return self.title


class GalleryAlbum(models.Model):
    title = models.CharField("titre", max_length=200)
    slug = models.SlugField("slug", max_length=220, unique=True)
    description = models.TextField("description", null=True, blank=True)
    event = models.ForeignKey(
        "events.Event",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="albums",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "album photo"
        verbose_name_plural = "albums photo"

    def __str__(self):
        return self.title


class GalleryImage(models.Model):
    album = models.ForeignKey(
        GalleryAlbum,
        on_delete=models.CASCADE,
        related_name="images",
    )
    image = models.ImageField("image", upload_to="gallery/%Y/%m/")
    caption = models.CharField("légende", max_length=255, null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "image"
        verbose_name_plural = "images"

    def __str__(self):
        return self.caption or f"Image {self.id}"


class QuranVerseTarget(models.TextChoices):
    ALL = "all", "Tous les écrans"
    SELECTED = "selected", "Écrans sélectionnés"

class QuranVerse(models.Model):
    arabic = models.TextField("texte arabe")
    translation = models.TextField("traduction")
    reference = models.CharField(
        "référence",
        max_length=100,
        help_text="Ex : Sourate Al-Baqarah, verset 152",
    )
    is_active = models.BooleanField("actif", default=True)
    order = models.PositiveIntegerField("ordre", default=0)

    target_type = models.CharField(
        "affichage sur les écrans",
        max_length=10,
        choices=QuranVerseTarget.choices,
        default=QuranVerseTarget.ALL,
    )

    target_screens = models.ManyToManyField(
        "screens.Screen",
        blank=True,
        related_name="quran_verses",
        verbose_name="écrans ciblés",
    )

    class Meta:
        verbose_name = "verset"
        verbose_name_plural = "versets"
        ordering = ["order"]

    def __str__(self):
        return self.reference


class ContactMessage(models.Model):
    full_name = models.CharField("nom complet", max_length=150)
    phone = models.CharField("téléphone", max_length=30, null=True, blank=True)
    email = models.EmailField("e-mail", null=True, blank=True)
    subject = models.CharField("sujet", max_length=200)
    message = models.TextField("message")
    is_read = models.BooleanField("lu", default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "message de contact"
        verbose_name_plural = "messages de contact"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.full_name} — {self.subject}"