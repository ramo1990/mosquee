from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from .models import Announcement, AnnouncementTarget
from .serializers import AnnouncementSerializer


def broadcast_announcement(event: str, announcement: Announcement):
    channel_layer = get_channel_layer()

    if channel_layer is None:
        return

    serializer = AnnouncementSerializer(announcement)

    payload = {
        "type": "announcement.event",
        "event": event,
        "announcement": serializer.data,
    }

    if announcement.target_type == AnnouncementTarget.ALL:
        groups = ["ecrans_tous"]

    elif announcement.target_type == AnnouncementTarget.GROUP:
        groups = [
            f"ecran_{screen.id}"
            for screen in announcement.target_group.screens.all()
        ]

    else:
        groups = [f"ecran_{announcement.target_screen_id}"]

    for group in groups:
        async_to_sync(channel_layer.group_send)(group, payload)


@receiver(post_save, sender=Announcement)
def announcement_saved(sender, instance, created, **kwargs):
    broadcast_announcement(
        "created" if created else "updated",
        instance,
    )


@receiver(post_delete, sender=Announcement)
def announcement_deleted(sender, instance, **kwargs):
    broadcast_announcement("deleted", instance)