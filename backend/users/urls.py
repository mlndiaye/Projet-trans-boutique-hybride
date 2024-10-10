from django.urls import path, include
from .api import RegisterView, MyObtainTokenPairView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter
from .api import UserProfileView, ChangePasswordView, UpdateUserProfileView, admin_redirect_to_dashboard


urlpatterns = [
    path('inscription/', RegisterView.as_view(), name='auth_inscription'),
    path('login/', MyObtainTokenPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('update-profile/', UpdateUserProfileView.as_view(), name='update-profile'),

    path('admin/redirect-to-dashboard/', admin_redirect_to_dashboard, name='admin_redirect_to_dashboard'),
]
