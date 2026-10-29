# announcements/urls.py
from rest_framework.routers import SimpleRouter

from .views import AnnouncementViewSet

router = SimpleRouter()

router.register(r"annonces", AnnouncementViewSet, basename="announcement")

urlpatterns = router.urls