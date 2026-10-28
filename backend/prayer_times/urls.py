# prayer_times/urls.py
from rest_framework.routers import SimpleRouter

from .views import DailyPrayerTimeViewSet, RamadanScheduleViewSet

router = SimpleRouter()
router.register(
    r"horaires-prieres",
    DailyPrayerTimeViewSet,
    basename="daily-prayer-time",
)
router.register(r"ramadan", RamadanScheduleViewSet, basename="ramadan-schedule")

urlpatterns = router.urls