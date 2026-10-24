# content/urls.py
from rest_framework.routers import SimpleRouter

from .views import (
    ContactMessageViewSet,
    GalleryAlbumViewSet,
    GalleryImageViewSet,
    MosqueProfileViewSet,
    NewsArticleViewSet,
    QuranVerseViewSet,
)

router = SimpleRouter()
router.register(r"mosquee", MosqueProfileViewSet, basename="mosque-profile")
router.register(r"actualites", NewsArticleViewSet, basename="news-article")
router.register(r"albums", GalleryAlbumViewSet, basename="gallery-album")
router.register(r"images", GalleryImageViewSet, basename="gallery-image")
router.register(r"versets", QuranVerseViewSet, basename="quran-verse")
router.register(r"contacts", ContactMessageViewSet, basename="contact-message")

urlpatterns = router.urls