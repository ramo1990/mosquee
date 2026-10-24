from django.contrib import admin
from django.urls import include, path

from django.conf import settings
from django.conf.urls.static import static

from rest_framework.routers import DefaultRouter


router = DefaultRouter()

urlpatterns = [
    path('admin/', admin.site.urls),

    # API REST
    path("api/", include("accounts.urls")),
    path("api/", include("announcements.urls")),
    path("api/", include("prayer_times.urls")),
    path("api/", include("events.urls")),
    path("api/", include("screens.urls")),
    path("api/", include("donations.urls")),
    path("api/", include("content.urls")),

    path("api/", include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )