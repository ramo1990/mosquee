# donations/urls.py
from rest_framework.routers import SimpleRouter
from django.urls import path

from .views import DonationCampaignViewSet, DonationViewSet, MosqueDonationCreateView

router = SimpleRouter()

router.register(
    r"campagnes-dons",
    DonationCampaignViewSet,
    basename="donation-campaign",
)
router.register(r"dons", DonationViewSet, basename="donation")

urlpatterns = [
    *router.urls,

    path(
        "mosquees/<slug:mosque_slug>/dons/",
        MosqueDonationCreateView.as_view(),
        name="mosque-donation-create",
    ),
]