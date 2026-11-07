
# accounts/views.py

from django.contrib.auth import authenticate, get_user_model, login, logout
from django.db import transaction

from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from .serializers import RegisterSerializer, UserSerializer

User = get_user_model()


# -----------------------------------------
# AUTHENTIFICATION
# -----------------------------------------

@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    user = serializer.save()
    login(request, user)

    return Response(
        UserSerializer(user).data,
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response(
            {"detail": "Nom d’utilisateur et mot de passe requis."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = authenticate(
        request,
        username=username,
        password=password,
    )

    if user is None:
        return Response(
            {"detail": "Identifiants incorrects."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    if not user.is_active:
        return Response(
            {"detail": "Ce compte est désactivé."},
            status=status.HTTP_403_FORBIDDEN,
        )

    login(request, user)

    return Response(UserSerializer(user).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)

    return Response({"detail": "Déconnexion réussie."})


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def me(request):
    if request.method == "PATCH":
        serializer = UserSerializer(
            request.user,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    return Response(UserSerializer(request.user).data)


# -----------------------------------------
# GESTION DES UTILISATEURS
# -----------------------------------------

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "super_admin":
            return User.objects.all()

        if user.role == "mosque_admin":
            return User.objects.filter(mosque=user.mosque)

        return User.objects.none()

    def check_admin_permission(self):
        if self.request.user.role not in [
            "super_admin",
            "mosque_admin",
        ]:
            raise PermissionDenied(
                "Vous n'avez pas les permissions nécessaires."
            )

    def perform_create(self, serializer):
        self.check_admin_permission()

        user = self.request.user

        if user.role == "mosque_admin":
            serializer.save(
                mosque=user.mosque,
                role="member",
            )
        else:
            serializer.save()

    def perform_update(self, serializer):
        self.check_admin_permission()

        user = self.request.user
        target = self.get_object()

        if user.role == "mosque_admin":
            if target.role in ["super_admin", "mosque_admin"]:
                raise PermissionDenied(
                    "Vous ne pouvez pas modifier cet utilisateur."
                )

            serializer.save(
                mosque=user.mosque,
                role="member",
            )
        else:
            serializer.save()

    def perform_destroy(self, instance):
        self.check_admin_permission()

        user = self.request.user

        if instance.pk == user.pk:
            raise PermissionDenied(
                "Vous ne pouvez pas supprimer votre propre compte."
            )

        if user.role == "mosque_admin":
            if instance.role in ["super_admin", "mosque_admin"]:
                raise PermissionDenied(
                    "Vous ne pouvez pas supprimer cet utilisateur."
                )

        instance.delete()
