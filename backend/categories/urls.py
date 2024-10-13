from django.urls import path
from .api import *



urlpatterns = [
    path('', CategoryAPIView.as_view()),  # Pour la liste des catégories
    path('<int:pk>/', CategoryAPIView.as_view()),  # Pour une catégorie spécifiqu
]