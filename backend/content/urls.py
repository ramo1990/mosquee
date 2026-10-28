from django.urls import path
from rest_framework.routers import SimpleRouter

from .views import (
    ContactMessageAdminViewSet,
    ContactMessageView,
    GalleryAlbumViewSet,
    MosqueAlbumsListView,
    MosqueContactMessageView,
    MosqueNewsListView,
    MosqueProfileDetailView,
    MosqueProfileListView,
    MosqueProfileView,
    NewsArticleViewSet,
    QuranVerseViewSet,
)


router = SimpleRouter()

router.register(
    r"actualites",
    NewsArticleViewSet,
    basename="news-article",
)

router.register(
    r"albums",
    GalleryAlbumViewSet,
    basename="gallery-album",
)

router.register(
    r"versets",
    QuranVerseViewSet,
    basename="quran-verse",
)

router.register(
    r"messages-contact",
    ContactMessageAdminViewSet,
    basename="contact-message-admin",
)


urlpatterns = [
    *router.urls,
    path(
        "mosquees/",
        MosqueProfileListView.as_view(),
        name="mosque-list",
    ),

    path(
        "mosquees/<slug:slug>/",
        MosqueProfileDetailView.as_view(),
        name="mosque-detail",
    ),
    path("profil/", MosqueProfileView.as_view(), name="mosque-profile-default"),
    path("contacts/", ContactMessageView.as_view(), name="contact-create"),
    path(
        "mosquees/<slug:slug>/actualites/",
        MosqueNewsListView.as_view(),
        name="mosque-news",
    ),

    path(
        "mosquees/<slug:slug>/albums/",
        MosqueAlbumsListView.as_view(),
        name="mosque-albums",
    ),
    path(
        "mosquees/<slug:slug>/contacts/",
        MosqueContactMessageView.as_view(),
        name="mosque-contact-create",
    ),
]