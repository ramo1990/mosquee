# donations/urls.py
from rest_framework.routers import SimpleRouter

from .views import DonationCampaignViewSet, DonationViewSet

router = SimpleRouter()
router.register(
    r"campagnes-dons",
    DonationCampaignViewSet,
    basename="donation-campaign",
)
router.register(r"dons", DonationViewSet, basename="donation")

urlpatterns = router.urls