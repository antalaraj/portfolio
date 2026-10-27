from django.contrib.auth import login, logout
from django.middleware.csrf import get_token
from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import LoginSerializer, UserSerializer

class CSRFTokenView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        csrf_token = get_token(request)
        return Response({
            'success': True,
            'csrfToken': csrf_token
        })

class LoginView(views.APIView):
    permission_classes = [AllowAny]
    throttle_scope = 'login'

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return Response({
            'success': True,
            'message': 'Logged in successfully.',
            'data': {
                'user': UserSerializer(user).data
            }
        }, status=status.HTTP_200_OK)

class LogoutView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({
            'success': True,
            'message': 'Logged out successfully.'
        }, status=status.HTTP_200_OK)

class CurrentUserView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'success': True,
            'data': {
                'user': UserSerializer(request.user).data
            }
        })
