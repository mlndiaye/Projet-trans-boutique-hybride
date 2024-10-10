# urls.py
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from products.views import *


urlpatterns = [
    path('admin_tools/', include('admin_tools.urls')),
    path('admin/', admin.site.urls),
    path('auth/', include('users.urls')),
    path('products/<int:product_id>/', product_detail, name='product_detail'),
    path('products/<int:product_id>/qr-code/', product_qr_code, name='product_qr_code'),
    path('api/products/', include('products.urls')),
    path('api/categories/', include('categories.urls')),
    path('', TemplateView.as_view(template_name='index.html')),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)