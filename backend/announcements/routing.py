from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(
        r"^ws/ecran/(?P<screen_id>\d+)/$",
        consumers.ScreenConsumer.as_asgi(),
    ),
]