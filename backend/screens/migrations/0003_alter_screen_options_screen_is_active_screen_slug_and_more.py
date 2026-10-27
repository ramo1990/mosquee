
import uuid

from django.db import migrations, models
from django.utils.text import slugify


def generate_screen_slugs(apps, schema_editor):
    Screen = apps.get_model("screens", "Screen")
    db_alias = schema_editor.connection.alias

    used_slugs = set()

    screens = Screen.objects.using(db_alias).order_by("pk")

    for screen in screens.iterator():
        base_slug = slugify(screen.name) or f"ecran-{screen.pk}"
        slug = base_slug
        counter = 2

        while slug in used_slugs:
            slug = f"{base_slug}-{counter}"
            counter += 1

        used_slugs.add(slug)

        Screen.objects.using(db_alias).filter(pk=screen.pk).update(
            slug=slug
        )


class Migration(migrations.Migration):

    dependencies = [
        ("screens", "0002_screengroup_screen_group"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="screen",
            options={
                "ordering": ["name"],
                "verbose_name": "écran",
                "verbose_name_plural": "écrans",
            },
        ),
        migrations.AddField(
            model_name="screen",
            name="is_active",
            field=models.BooleanField(default=True, verbose_name="actif"),
        ),
        migrations.AddField(
            model_name="screen",
            name="slug",
            field=models.SlugField(
                max_length=180,
                null=True,
                blank=True,
                verbose_name="identifiant URL",
                help_text="Ex : salle-de-priere-gauche",
            ),
        ),
        migrations.RunPython(
            generate_screen_slugs,
            migrations.RunPython.noop,
        ),
        migrations.AlterField(
            model_name="screen",
            name="slug",
            field=models.SlugField(
                max_length=180,
                unique=True,
                verbose_name="identifiant URL",
                help_text="Ex : salle-de-priere-gauche",
            ),
        ),
        migrations.AlterField(
            model_name="screen",
            name="name",
            field=models.CharField(
                max_length=150,
                unique=True,
                verbose_name="nom de l’écran",
            ),
        ),
    ]
