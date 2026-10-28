from django.urls import re_path

from announcements import consumers

websocket_urlpatterns = [
    re_path(
        r"^ws/ecran/(?P<screen_slug>[-\w]+)/$",
        consumers.ScreenConsumer.as_asgi(),
    ),
]