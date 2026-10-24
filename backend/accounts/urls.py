from django.urls import path
from rest_framework.routers import SimpleRouter

from .views import UserViewSet, register

router = SimpleRouter()
router.register(r"users", UserViewSet, basename="user")

urlpatterns = [
    path("auth/register/", register, name="register"),
] + router.urls