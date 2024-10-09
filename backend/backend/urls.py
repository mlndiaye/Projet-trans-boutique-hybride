# urls.py
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, include
from rest_framework.routers import DefaultRouter
from products.api import ProductViewSet, CategoryViewSet, get_dashboard_stats, LowStockProductsView
from django.views.generic import TemplateView


router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    path('admin_tools/', include('admin_tools.urls')),
    path('admin/', admin.site.urls),
    path('auth/', include('users.urls')),
    path('api/', include(router.urls)),
    path('api/dashboard/stats/', get_dashboard_stats, name='dashboard-stats'),
    path('api/dashboard/low-stock-products/', LowStockProductsView.as_view(), name='low_stock_products'),

    path('products/', include('products.urls')),
    path('', TemplateView.as_view(template_name='index.html')),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)