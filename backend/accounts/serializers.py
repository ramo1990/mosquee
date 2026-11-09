# accounts/serializers.py
from django.contrib.auth import get_user_model
from rest_framework import serializers


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    committee_role_label = serializers.CharField(
        source="get_committee_role_display",
        read_only=True,
    )
    password = serializers.CharField(
        write_only=True,
        required=False,
        min_length=8,
        style={"input_type": "password"},
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=False,
        style={"input_type": "password"},
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "phone",
            "role",
            "committee_role",
            "committee_role_label",
            "photo",
            "mosque",
            "is_active",
            "date_joined",
            "password",
            "password_confirm",
        ]
        read_only_fields = ["date_joined", "role", "mosque", "committee_role_label"]

    def get_full_name(self, obj):
        return obj.get_full_name()

    def validate(self, data):
        password = data.get("password")
        password_confirm = data.get("password_confirm")

        if password or password_confirm:
            if password != password_confirm:
                raise serializers.ValidationError(
                    {
                        "password_confirm":
                        "Les mots de passe ne correspondent pas."
                    }
                )

        return data

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        validated_data.pop("password_confirm", None)

        user = User(**validated_data)

        if password:
            user.set_password(password)

        user.save()

        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        validated_data.pop("password_confirm", None)

        for field, value in validated_data.items():
            setattr(instance, field, value)

        if password:
            instance.set_password(password)

        instance.save()

        return instance

    
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={"input_type": "password"},
    )
    password_confirm = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "phone",
            "role",
            "password",
            "password_confirm",
        ]
        read_only_fields = ["role"]

    def validate(self, data):
        if data["password"] != data["password_confirm"]:
            raise serializers.ValidationError(
                {"password_confirm": "Les mots de passe ne correspondent pas."}
            )

        return data

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        password = validated_data.pop("password")

        validated_data["role"] = User.Role.MEMBER

        user = User(**validated_data)
        user.set_password(password)
        user.save()

        return user