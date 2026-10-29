# donations/models.py
# Prépare les dons, campagnes et paiements Mobile Money.

import uuid
from decimal import Decimal
from django.db import models
from django.utils import timezone


class DonationCampaign(models.Model):
    mosque = models.ForeignKey(
        "content.MosqueProfile",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="donation_campaigns",
        verbose_name="mosquée",
    )
    title = models.CharField("titre", max_length=200)
    slug = models.SlugField("slug", max_length=220, unique=True)
    description = models.TextField("description")
    goal_amount = models.DecimalField(
        "objectif",
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
    )
    is_active = models.BooleanField("active", default=True)
    starts_at = models.DateTimeField("début", default=timezone.now)
    ends_at = models.DateTimeField("fin", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "campagne de don"
        verbose_name_plural = "campagnes de don"
        ordering = ["-created_at"]

    def __str__(self):
        return self.title

    @property
    def total_raised(self):
        return self.donations.filter(
            status=DonationStatus.SUCCESS,
        ).aggregate(
            total=models.Sum("amount"),
        )["total"] or Decimal("0.00")


class DonationStatus(models.TextChoices):
    PENDING = "pending", "En attente"
    SUCCESS = "success", "Réussi"
    FAILED = "failed", "Échoué"
    CANCELLED = "cancelled", "Annulé"


class Donation(models.Model):
    class DonationType(models.TextChoices):
        SADAQAH = "sadaqah", "Sadaqa"
        ZAKAT = "zakat", "Zakat"
        CONSTRUCTION = "construction", "Construction"
        MAINTENANCE = "maintenance", "Entretien"
        OTHER = "other", "Autre"

    class PaymentMethod(models.TextChoices):
        ORANGE_MONEY = "orange_money", "Orange Money"
        MTN_MOMO = "mtn_momo", "MTN MoMo"
        MOOV_MONEY = "moov_money", "Moov Money"
        WAVE = "wave", "Wave"
        BANK_TRANSFER = "bank_transfer", "Virement bancaire"
        CASH = "cash", "Espèces"

    mosque = models.ForeignKey(
        "content.MosqueProfile",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="donations",
        verbose_name="mosquée",
    )
    reference = models.UUIDField(
        "référence",
        default=uuid.uuid4,
        unique=True,
        editable=False,
    )
    campaign = models.ForeignKey(
        DonationCampaign,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="donations",
    )
    donor_name = models.CharField("nom du donateur", max_length=150)
    donor_phone = models.CharField("téléphone", max_length=30)
    donor_email = models.EmailField("e-mail", null=True, blank=True)
    amount = models.DecimalField("montant", max_digits=12, decimal_places=2)
    donation_type = models.CharField(
        "type de don",
        max_length=20,
        choices=DonationType.choices,
        default=DonationType.SADAQAH,
    )
    payment_method = models.CharField(
        "moyen de paiement",
        max_length=20,
        choices=PaymentMethod.choices,
    )
    status = models.CharField(
        "statut",
        max_length=15,
        choices=DonationStatus.choices,
        default=DonationStatus.PENDING,
    )
    transaction_id = models.CharField(
        "identifiant transaction",
        max_length=150,
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "don"
        verbose_name_plural = "dons"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.reference} — {self.amount} FCFA"