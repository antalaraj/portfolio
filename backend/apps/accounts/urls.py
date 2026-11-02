from django.urls import path
from .views import CSRFTokenView, LoginView, LogoutView, CurrentUserView, ChangePasswordView

urlpatterns = [
    path('csrf/', CSRFTokenView.as_view(), name='auth_csrf'),
    path('csrf', CSRFTokenView.as_view()),
    path('login/', LoginView.as_view(), name='auth_login'),
    path('login', LoginView.as_view()),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('logout', LogoutView.as_view()),
    path('me/', CurrentUserView.as_view(), name='auth_me'),
    path('me', CurrentUserView.as_view()),
    path('change-password/', ChangePasswordView.as_view(), name='auth_change_password'),
    path('change-password', ChangePasswordView.as_view()),
]
