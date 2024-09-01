from django.urls import path
from .api import RegisterView, MyObtainTokenPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('inscription/', RegisterView.as_view(), name='auth_inscription'),
    path('login/', MyObtainTokenPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
