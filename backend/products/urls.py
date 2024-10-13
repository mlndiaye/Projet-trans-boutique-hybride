from django.urls import path
from .api import *



urlpatterns = [

    path('', ProductAPIView.as_view()),  # Pour la liste des produits
    path('<int:pk>/', ProductAPIView.as_view()),  # Pour un produit spécifique
    path('dashboard/stats/<str:period>/', get_dashboard_stats, name='dashboard-stats'),
    path('dashboard/low-stock-products/', LowStockProductsView.as_view(), name='low_stock_products'),
    path('dashboard/sales', SalesDetailsView.as_view(), name='sales-details'),

]