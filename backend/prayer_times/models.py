# prayer_times/models.py
# Gère les horaires quotidiens, l’Iqama, la Jumu‘a et le calendrier du Ramadan.

from django.db import models


class DailyPrayerTime(models.Model):
    date = models.DateField("date", unique=True)

    fajr = models.TimeField("Fajr")
    sunrise = models.TimeField("lever du soleil", null=True, blank=True)
    dhuhr = models.TimeField("Dhuhr")
    asr = models.TimeField("Asr")
    maghrib = models.TimeField("Maghrib")
    isha = models.TimeField("Isha")

    fajr_iqama = models.TimeField("Iqama Fajr", null=True, blank=True)
    dhuhr_iqama = models.TimeField("Iqama Dhuhr", null=True, blank=True)
    asr_iqama = models.TimeField("Iqama Asr", null=True, blank=True)
    maghrib_iqama = models.TimeField("Iqama Maghrib", null=True, blank=True)
    isha_iqama = models.TimeField("Iqama Isha", null=True, blank=True)

    jumuah_time = models.TimeField("heure Jumu‘a", null=True, blank=True)
    jumuah_khateeb = models.CharField(
        "prédicateur du vendredi",
        max_length=150,
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "horaire de prière"
        verbose_name_plural = "horaires de prière"
        ordering = ["-date"]

    def __str__(self):
        return f"Horaires du {self.date:%d/%m/%Y}"


class RamadanSchedule(models.Model):
    date = models.DateField("date", unique=True)

    suhoor_end = models.TimeField("fin du Suhoor", null=True, blank=True)
    iftar = models.TimeField("Iftar")
    tarawih = models.TimeField("Tarawih", null=True, blank=True)
    note = models.TextField("note", null=True, blank=True)

    class Meta:
        verbose_name = "programme Ramadan"
        verbose_name_plural = "programmes Ramadan"
        ordering = ["date"]

    def __str__(self):
        return f"Ramadan — {self.date:%d/%m/%Y}"