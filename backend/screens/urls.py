# screens/urls.py
from rest_framework.routers import SimpleRouter

from .views import ScreenContentViewSet, ScreenViewSet

router = SimpleRouter()
router.register(r"ecrans", ScreenViewSet, basename="screen")
router.register(
    r"contenus-ecran",
    ScreenContentViewSet,
    basename="screen-content",
)

urlpatterns = router.urls