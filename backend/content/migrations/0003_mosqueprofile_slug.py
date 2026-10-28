
from django.db import migrations, models
from django.utils.text import slugify


def populate_slugs(apps, schema_editor):
    MosqueProfile = apps.get_model("content", "MosqueProfile")
    db_alias = schema_editor.connection.alias

    profiles = MosqueProfile.objects.using(db_alias).order_by("pk")

    used_slugs = set()

    for profile in profiles:
        # Utilise le nom du profil comme base du slug.
        base = slugify(getattr(profile, "name", "") or "")
        if not base:
            base = "mosquee"

        candidate = base
        suffix = 2

        while candidate in used_slugs:
            candidate = f"{base}-{suffix}"
            suffix += 1

        profile.slug = candidate
        profile.save(using=db_alias, update_fields=["slug"])
        used_slugs.add(candidate)


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0002_quranverse_target_screens_quranverse_target_type"),
    ]

    operations = [
        migrations.AddField(
            model_name="mosqueprofile",
            name="slug",
            field=models.SlugField(
                blank=True,
                max_length=220,
                null=True,
                verbose_name="identifiant URL",
            ),
        ),
        migrations.RunPython(
            populate_slugs,
            reverse_code=migrations.RunPython.noop,
        ),
        migrations.AlterField(
            model_name="mosqueprofile",
            name="slug",
            field=models.SlugField(
                max_length=220,
                unique=True,
                verbose_name="identifiant URL",
            ),
        ),
    ]
