from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser']
        read_only_fields = ['id', 'is_staff', 'is_superuser']

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid username or password.')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled.')
            attrs['user'] = user
            return attrs
        raise serializers.ValidationError('Both username and password are required.')

class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=False, allow_blank=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, min_length=8)
    confirm_password = serializers.CharField(required=True, write_only=True)

    def validate_new_password(self, value):
        request = self.context.get('request')
        user = request.user if request else None
        try:
            validate_password(value, user)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(list(exc.messages))
        return value

    def validate(self, attrs):
        new_password = attrs.get('new_password')
        confirm_password = attrs.get('confirm_password')
        current_password = attrs.get('current_password')
        request = self.context.get('request')
        user = request.user if request else None

        if not user or not user.is_authenticated:
            raise serializers.ValidationError('Authentication is required to reset password.')

        if new_password != confirm_password:
            raise serializers.ValidationError({'confirm_password': 'New password and confirm password do not match.'})

        # If current_password is provided, verify it.
        # If omitted, allowed only if user is superuser or staff. Otherwise require it.
        if current_password:
            if not user.check_password(current_password):
                raise serializers.ValidationError({'current_password': 'Current password is incorrect.'})
        elif not (user.is_superuser or user.is_staff):
            raise serializers.ValidationError({'current_password': 'Current password is required.'})

        return attrs
