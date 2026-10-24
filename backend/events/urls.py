# events/urls.py
from rest_framework.routers import SimpleRouter

from .views import (
    EventCategoryViewSet,
    EventRegistrationViewSet,
    EventViewSet,
)

router = SimpleRouter()
router.register(r"evenements", EventViewSet, basename="event")
router.register(
    r"categories-evenements",
    EventCategoryViewSet,
    basename="event-category",
)
router.register(
    r"inscriptions-evenements",
    EventRegistrationViewSet,
    basename="event-registration",
)

urlpatterns = router.urls