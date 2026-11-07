
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    login_view,
    logout_view,
    me,
    register,
    UserViewSet,
)

router = DefaultRouter()
router.register("users", UserViewSet, basename="users")

urlpatterns = [
    path("", include(router.urls)),

    path("auth/register/", register, name="register"),
    path("auth/login/", login_view, name="login"),
    path("auth/logout/", logout_view, name="logout"),
    path("auth/me/", me, name="me"),
]