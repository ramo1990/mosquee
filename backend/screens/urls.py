# screens/urls.py
from django.urls import path

from rest_framework.routers import SimpleRouter

from .views import ScreenContentViewSet, ScreenListView, ScreenViewSet

router = SimpleRouter()

router.register(r"ecrans", ScreenViewSet, basename="screen")

router.register(
    r"contenus-ecran",
    ScreenContentViewSet,
    basename="screen-content",
)

urlpatterns = [
    path(
        "ecrans/liste/",
        ScreenListView.as_view(),
        name="screen-public-list",
    ),
    *router.urls,
]